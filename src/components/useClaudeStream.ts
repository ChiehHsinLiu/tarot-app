// Dev-only: streams an answer from the owner's local Claude Code via the
// private-readings Vite plugin. Used only by components that are themselves
// lazy-loaded behind import.meta.env.DEV.
import { useEffect, useRef, useState } from 'react'
import { useDevText } from './dev-text.ts'
import type { DevKey } from './dev-text.ts'

type ErrorCode = 'not-installed' | 'not-logged-in' | 'timeout' | 'failed' | 'invalid'
type StreamEvent = { type: 'text'; text: string } | { type: 'done' } | { type: 'error'; code: ErrorCode; message: string }
export type ClaudeStatus = 'idle' | 'streaming' | 'done' | 'stopped' | 'error'

const ERROR_MESSAGES: Record<ErrorCode, DevKey> = {
  'not-installed': 'ask.error.notInstalled',
  'not-logged-in': 'ask.error.notLoggedIn',
  timeout: 'ask.error.timeout',
  failed: 'ask.error.failed',
  invalid: 'ask.error.invalid',
}

export function useClaudeStream() {
  const t = useDevText()
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
      setError(code === 'failed' && detail ? `${t(ERROR_MESSAGES.failed)} ${detail}` : t(ERROR_MESSAGES[code]))
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
      fail('failed', t('ask.error.connectionEnded'))
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
      ? t('ask.writing')
      : status === 'done'
        ? t('ask.done')
        : status === 'stopped'
          ? t('ask.stopped')
          : status === 'error'
            ? error
            : ''

  return { status, answer, statusText, ask, stop }
}
