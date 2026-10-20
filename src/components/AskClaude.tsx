// Dev-only: streams an interpretation from the owner's local Claude Code via
// the private-readings Vite plugin. Never rendered in the production build.
import { useEffect, useRef, useState } from 'react'
import type { Reading } from '../lib/draw.ts'
import { encodeReading } from '../lib/share.ts'
import { MarkdownText } from './MarkdownText.tsx'
import './AskClaude.css'

type ErrorCode = 'not-installed' | 'not-logged-in' | 'timeout' | 'failed' | 'invalid'
type StreamEvent = { type: 'text'; text: string } | { type: 'done' } | { type: 'error'; code: ErrorCode; message: string }
type Status = 'idle' | 'streaming' | 'done' | 'stopped' | 'error'

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  'not-installed': 'Claude Code is not installed. Install it from https://claude.com/claude-code, then try again.',
  'not-logged-in': 'Claude Code is not logged in. Run "claude" in a terminal, use /login, then try again.',
  timeout: 'Claude took longer than 2 minutes, so the request was stopped. Try again.',
  failed: 'Claude Code could not finish this reading.',
  invalid: 'This reading could not be sent to Claude.',
}

export function AskClaude({ reading }: { reading: Reading }) {
  const [status, setStatus] = useState<Status>('idle')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const controllerRef = useRef<AbortController | null>(null)

  // Leaving the reading ends any request in flight (and the Claude process).
  useEffect(() => () => controllerRef.current?.abort(), [])

  async function ask() {
    const controller = new AbortController()
    controllerRef.current = controller
    setAnswer('')
    setError('')
    setStatus('streaming')

    const fail = (code: ErrorCode, detail?: string) => {
      setError(code === 'failed' && detail ? `${ERROR_MESSAGES.failed} ${detail}` : ERROR_MESSAGES[code])
      setStatus('error')
    }

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragment: encodeReading(reading, { includeQuestion: true }) }),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) return fail('invalid')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()!
        for (const line of lines) {
          if (!line.trim()) continue
          const event = JSON.parse(line) as StreamEvent
          if (event.type === 'text') setAnswer((a) => a + event.text)
          else if (event.type === 'done') return setStatus('done')
          else return fail(event.code, event.message)
        }
      }
      fail('failed', 'The connection ended before the reading finished.')
    } catch (err) {
      if (controller.signal.aborted) return
      fail('failed', err instanceof Error ? err.message : undefined)
    }
  }

  function stop() {
    controllerRef.current?.abort()
    setStatus('stopped')
  }

  const statusText =
    status === 'streaming'
      ? 'Claude is writing…'
      : status === 'done'
        ? 'Reading complete.'
        : status === 'stopped'
          ? 'Stopped.'
          : status === 'error'
            ? error
            : ''

  return (
    <>
      {status === 'streaming' ? (
        <button type="button" className="secondary" onClick={stop}>
          Stop
        </button>
      ) : (
        <button type="button" className="secondary" onClick={ask}>
          {status === 'idle' ? 'Ask Claude' : 'Ask again'}
        </button>
      )}
      {status !== 'idle' && (
        <div className="claude-answer">
          {/* Not a live region: announcing every streamed fragment would be noise.
              The status line below announces progress instead. */}
          {answer && <MarkdownText className="claude-answer-text" source={answer} />}
          <p className={status === 'error' ? 'claude-answer-status error' : 'claude-answer-status'} role="status">
            {statusText}
          </p>
        </div>
      )}
    </>
  )
}
