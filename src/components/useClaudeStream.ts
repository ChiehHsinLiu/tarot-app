// Dev-only: streams an answer from the owner's local Claude Code via the
// private-readings Vite plugin. Used only by components that are themselves
// lazy-loaded behind import.meta.env.DEV.
import { useEffect, useRef, useState } from 'react'

type ErrorCode = 'not-installed' | 'not-logged-in' | 'timeout' | 'failed' | 'invalid'
type StreamEvent = { type: 'text'; text: string } | { type: 'done' } | { type: 'error'; code: ErrorCode; message: string }
export type ClaudeStatus = 'idle' | 'streaming' | 'done' | 'stopped' | 'error'

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  'not-installed': 'Claude Code is not installed. Install it from https://claude.com/claude-code, then try again.',
  'not-logged-in': 'Claude Code is not logged in. Run "claude" in a terminal, use /login, then try again.',
  timeout: 'Claude took longer than 2 minutes, so the request was stopped. Try again.',
  failed: 'Claude Code could not finish this reading.',
  invalid: 'This reading could not be sent to Claude.',
}

export function useClaudeStream() {
  const [status, setStatus] = useState<ClaudeStatus>('idle')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const controllerRef = useRef<AbortController | null>(null)

  // Leaving the reading ends any request in flight (and the Claude process).
  useEffect(() => () => controllerRef.current?.abort(), [])

  // body is the JSON the endpoint expects: { fragment } or { oracle }.
  async function ask(body: unknown) {
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
        body: JSON.stringify(body),
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

  return { status, answer, statusText, ask, stop }
}
