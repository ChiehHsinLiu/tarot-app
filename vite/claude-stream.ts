// Parsing for `claude -p --output-format stream-json --include-partial-messages`
// output, and mapping failures to the error codes the page understands.
// Pure functions, no I/O.

export type StreamLine =
  | { kind: 'text'; text: string }
  | { kind: 'result'; isError: boolean; text: string }
  | { kind: 'ignore' }

export type FailureCode = 'not-installed' | 'not-logged-in' | 'failed'

// Text is taken only from partial-message deltas; the full `assistant` message
// that follows repeats it, so it is ignored to avoid doubling the answer.
export function parseLine(line: string): StreamLine {
  let event: unknown
  try {
    event = JSON.parse(line)
  } catch {
    return { kind: 'ignore' }
  }
  if (typeof event !== 'object' || event === null) return { kind: 'ignore' }
  const e = event as Record<string, any>

  if (e.type === 'stream_event' && e.event?.type === 'content_block_delta' && e.event.delta?.type === 'text_delta') {
    return typeof e.event.delta.text === 'string' ? { kind: 'text', text: e.event.delta.text } : { kind: 'ignore' }
  }
  if (e.type === 'result') {
    return { kind: 'result', isError: e.is_error === true, text: typeof e.result === 'string' ? e.result : '' }
  }
  return { kind: 'ignore' }
}

const NOT_LOGGED_IN = /not logged in|please run \/login|authentication|invalid api key|oauth token/i

export function classifyFailure(failure: { spawnErrorCode?: string; stderr?: string; resultText?: string }): FailureCode {
  if (failure.spawnErrorCode === 'ENOENT') return 'not-installed'
  if (NOT_LOGGED_IN.test(failure.resultText ?? '') || NOT_LOGGED_IN.test(failure.stderr ?? '')) return 'not-logged-in'
  return 'failed'
}
