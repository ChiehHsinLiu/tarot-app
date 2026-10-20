// Dev-server-only bridge from the app to the owner's local Claude Code.
// Loaded by `vite` (serve) only; `vite build` never includes it.
import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import fs from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import os from 'node:os'
import path from 'node:path'
import readline from 'node:readline'
import type { Plugin } from 'vite'
import { buildCards, buildSpreads, rawCardText, rawCards, rawSpreadText, rawSpreads } from '../src/lib/deck.ts'
import { buildPrompt } from '../src/lib/prompt.ts'
import { decodeReading, encodeReading } from '../src/lib/share.ts'
import type { StreamLine } from './claude-stream.ts'
import { classifyFailure, parseLine } from './claude-stream.ts'
import { appendJournal } from './journal.ts'

const MAX_BODY_BYTES = 8 * 1024
const DEFAULT_TIMEOUT_MS = 2 * 60 * 1000
// No tools, so the prompt can only ever produce text; no saved session.
const CLAUDE_ARGS = [
  '-p',
  '--tools',
  '',
  '--output-format',
  'stream-json',
  '--verbose',
  '--include-partial-messages',
  '--no-session-persistence',
]

const cardsById = new Map(buildCards(rawCards, rawCardText).map((c) => [c.id, c]))
const spreads = buildSpreads(rawSpreads, rawSpreadText)
const cardIds = new Set(rawCards.map((c) => c.id))

export type ErrorCode = 'not-installed' | 'not-logged-in' | 'timeout' | 'failed' | 'invalid'
type StreamEvent = { type: 'text'; text: string } | { type: 'done' } | { type: 'error'; code: ErrorCode; message: string }

export function privateReadings(): Plugin {
  return {
    name: 'tarot-private-readings',
    apply: 'serve',
    configureServer(server) {
      const route = `${server.config.base}api/reading`
      const templatePath = path.join(server.config.root, 'prompts', 'reading.md')
      server.middlewares.use(route, (req, res) => {
        const port = (server.httpServer?.address() as AddressInfo | null)?.port
        void handle(req, res, port, templatePath)
      })
    },
  }
}

function reject(res: ServerResponse, status: number, message: string) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ type: 'error', code: 'invalid', message }))
}

// Only this machine's dev server may call the endpoint: the Host must be
// loopback on our port (blocks DNS rebinding) and the Origin must match it
// (blocks other websites).
export function isAllowedRequest(headers: IncomingMessage['headers'], port: number | undefined): boolean {
  const host = headers.host
  if (!host || port === undefined) return false
  let url: URL
  try {
    url = new URL(`http://${host}`)
  } catch {
    return false
  }
  if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') return false
  if (url.port !== String(port)) return false
  return headers.origin === `http://${host}`
}

function readBody(req: IncomingMessage): Promise<string | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    let size = 0
    // Oversized bodies are read to the end but not kept, so a 413 can be sent.
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size <= MAX_BODY_BYTES) chunks.push(chunk)
    })
    req.on('end', () => resolve(size > MAX_BODY_BYTES ? null : Buffer.concat(chunks).toString('utf8')))
    req.on('error', () => resolve(null))
  })
}

async function handle(req: IncomingMessage, res: ServerResponse, port: number | undefined, templatePath: string) {
  if (req.url !== '/' && req.url !== '') return reject(res, 404, 'Not found.')
  if (req.method !== 'POST') return reject(res, 405, 'Use POST.')
  if (!isAllowedRequest(req.headers, port)) return reject(res, 403, 'Only the local app may use this endpoint.')

  const body = await readBody(req)
  if (body === null) return reject(res, 413, 'Request too large.')
  let fragment: unknown
  try {
    fragment = JSON.parse(body)?.fragment
  } catch {
    return reject(res, 400, 'Request is not valid JSON.')
  }
  if (typeof fragment !== 'string') return reject(res, 400, 'Missing reading.')
  const decoded = decodeReading(fragment, rawSpreads, cardIds)
  if (decoded.kind !== 'reading') return reject(res, 400, 'That reading is not valid.')

  const reading = decoded.reading
  const spread = spreads.find((s) => s.id === reading.spreadId)!
  const prompt = buildPrompt(fs.readFileSync(templatePath, 'utf8'), reading, spread, cardsById)
  streamClaude(res, prompt, (answer, status) =>
    appendJournal({ link: encodeReading(reading, { includeQuestion: true }), reading, answer, status }),
  )
}

function stop(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return
  child.kill('SIGTERM')
  setTimeout(() => {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL')
  }, 3000).unref()
}

function streamClaude(
  res: ServerResponse,
  prompt: string,
  journal: (answer: string, status: 'completed' | 'stopped') => void,
) {
  res.writeHead(200, {
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  const send = (event: StreamEvent) => res.write(JSON.stringify(event) + '\n')

  const child = spawn('claude', CLAUDE_ARGS, { cwd: os.tmpdir(), stdio: ['pipe', 'pipe', 'pipe'] })
  let answer = ''
  let result: Extract<StreamLine, { kind: 'result' }> | null = null
  let stderr = ''
  let exitCode: number | null | undefined
  let stdoutClosed = false
  let finished = false

  // Sends exactly one terminal event, then ends the response.
  const finish = (event: StreamEvent | null, journalStatus?: 'completed' | 'stopped') => {
    if (finished) return
    finished = true
    clearTimeout(timer)
    if (event && !res.writableEnded) send(event)
    if (!res.writableEnded) res.end()
    if (journalStatus) {
      try {
        journal(answer, journalStatus)
      } catch (err) {
        console.error('[private-readings] could not write journal:', err)
      }
    }
  }

  const timeoutMs = Number(process.env.TAROT_CLAUDE_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS
  const timer = setTimeout(() => {
    stop(child)
    finish({ type: 'error', code: 'timeout', message: 'Claude took longer than expected and was stopped.' })
  }, timeoutMs)

  // The browser stopped or navigated away: end Claude and keep what we have.
  res.on('close', () => {
    if (finished) return
    stop(child)
    finish(null, 'stopped')
  })

  child.on('error', (err: NodeJS.ErrnoException) => {
    const code = classifyFailure({ spawnErrorCode: err.code })
    finish({ type: 'error', code, message: err.message })
  })
  child.stderr!.on('data', (chunk: Buffer) => {
    stderr = (stderr + chunk.toString('utf8')).slice(-2000)
  })

  const maybeDone = () => {
    if (exitCode === undefined || !stdoutClosed) return
    if (result && !result.isError && exitCode === 0) return finish({ type: 'done' }, 'completed')
    const code = classifyFailure({ stderr, resultText: result?.text })
    const message = (result?.text || stderr.trim() || `Claude Code exited with code ${exitCode}.`).slice(0, 300)
    finish({ type: 'error', code, message })
  }

  readline.createInterface({ input: child.stdout! })
    .on('line', (line) => {
      const parsed = parseLine(line)
      if (parsed.kind === 'text' && !finished) {
        answer += parsed.text
        send({ type: 'text', text: parsed.text })
      } else if (parsed.kind === 'result') {
        result = parsed
      }
    })
    .on('close', () => {
      stdoutClosed = true
      maybeDone()
    })
  child.on('close', (code) => {
    exitCode = code
    maybeDone()
  })

  child.stdin!.on('error', () => {})
  child.stdin!.end(prompt)
}
