// Dev-only: streams an interpretation from the owner's local Claude Code via
// the private-readings Vite plugin. Never rendered in the production build.
import type { Reading } from '../lib/draw.ts'
import { encodeReading } from '../lib/share.ts'
import { ClaudeAnswer } from './ClaudeAnswer.tsx'
import { useClaudeStream } from './useClaudeStream.ts'

export function AskClaude({ reading }: { reading: Reading }) {
  const claude = useClaudeStream()

  return (
    <>
      {claude.status === 'streaming' ? (
        <button type="button" className="secondary" onClick={claude.stop}>
          Stop
        </button>
      ) : (
        <button
          type="button"
          className="secondary"
          onClick={() => claude.ask({ fragment: encodeReading(reading, { includeQuestion: true }) })}
        >
          {claude.status === 'idle' ? 'Ask Claude' : 'Ask again'}
        </button>
      )}
      <ClaudeAnswer status={claude.status} answer={claude.answer} statusText={claude.statusText} />
    </>
  )
}
