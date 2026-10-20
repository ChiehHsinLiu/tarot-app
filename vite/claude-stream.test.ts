import { describe, expect, test } from 'vitest'
import { classifyFailure, parseLine } from './claude-stream.ts'

// Trimmed lines captured from Claude Code 2.1.304 (session ids, paths and
// usage details removed).
const FIXTURES = {
  init: '{"type":"system","subtype":"init","tools":[],"model":"claude-opus-5-5"}',
  status: '{"type":"system","subtype":"status","status":"requesting"}',
  messageStart: '{"type":"stream_event","event":{"type":"message_start","message":{"role":"assistant"}}}',
  blockStart: '{"type":"stream_event","event":{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}}',
  textDelta: '{"type":"stream_event","event":{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"the cards are drawn"}}}',
  assistant: '{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"the cards are drawn"}]}}',
  blockStop: '{"type":"stream_event","event":{"type":"content_block_stop","index":0}}',
  rateLimit: '{"type":"rate_limit_event"}',
  success: '{"type":"result","subtype":"success","is_error":false,"result":"the cards are drawn"}',
  // Output with an empty CLAUDE_CONFIG_DIR: no deltas, a synthetic assistant
  // message, then an error result. Exit code 1.
  notLoggedInAssistant:
    '{"type":"assistant","message":{"model":"<synthetic>","role":"assistant","content":[{"type":"text","text":"Not logged in · Please run /login"}]},"error":"authentication_failed"}',
  notLoggedInResult: '{"type":"result","subtype":"success","is_error":true,"result":"Not logged in · Please run /login"}',
}

describe('parseLine', () => {
  test('text deltas become text', () => {
    expect(parseLine(FIXTURES.textDelta)).toEqual({ kind: 'text', text: 'the cards are drawn' })
  })

  test.each(['init', 'status', 'messageStart', 'blockStart', 'blockStop', 'rateLimit', 'assistant', 'notLoggedInAssistant'] as const)(
    '%s is ignored',
    (name) => {
      expect(parseLine(FIXTURES[name])).toEqual({ kind: 'ignore' })
    },
  )

  test('a full success stream yields the text exactly once', () => {
    const text = Object.values(FIXTURES)
      .slice(0, 9)
      .map(parseLine)
      .filter((l) => l.kind === 'text')
      .map((l) => (l as { text: string }).text)
      .join('')
    expect(text).toBe('the cards are drawn')
  })

  test('success result', () => {
    expect(parseLine(FIXTURES.success)).toEqual({ kind: 'result', isError: false, text: 'the cards are drawn' })
  })

  test('error result', () => {
    expect(parseLine(FIXTURES.notLoggedInResult)).toEqual({
      kind: 'result',
      isError: true,
      text: 'Not logged in · Please run /login',
    })
  })

  test.each(['', 'not json', '{"type":', 'null', '42', '"text"'])('malformed line %j is ignored', (line) => {
    expect(parseLine(line)).toEqual({ kind: 'ignore' })
  })

  test('non-string delta text is ignored', () => {
    expect(
      parseLine('{"type":"stream_event","event":{"type":"content_block_delta","delta":{"type":"text_delta","text":5}}}'),
    ).toEqual({ kind: 'ignore' })
  })
})

describe('classifyFailure', () => {
  test('missing claude command', () => {
    expect(classifyFailure({ spawnErrorCode: 'ENOENT' })).toBe('not-installed')
  })

  test('real not-logged-in result', () => {
    const result = parseLine(FIXTURES.notLoggedInResult) as { text: string }
    expect(classifyFailure({ resultText: result.text })).toBe('not-logged-in')
  })

  test.each(['Invalid API key · Please run /login', 'OAuth token has expired', 'Authentication failed'])(
    'auth wording %j',
    (text) => {
      expect(classifyFailure({ stderr: text })).toBe('not-logged-in')
    },
  )

  test('other failures', () => {
    expect(classifyFailure({ resultText: 'API Error: 529 Overloaded', stderr: '' })).toBe('failed')
    expect(classifyFailure({ spawnErrorCode: 'EACCES' })).toBe('failed')
    expect(classifyFailure({})).toBe('failed')
  })
})
