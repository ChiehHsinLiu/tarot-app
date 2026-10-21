// Dev-only: streams an interpretation from the owner's local Claude Code via
// the private-readings Vite plugin. Never rendered in the production build.
import { ClaudeAnswer } from './ClaudeAnswer.tsx'
import { useClaudeStream } from './useClaudeStream.ts'

// body is what the endpoint accepts: { fragment } for tarot, { lenormand } for Lenormand.
export function AskClaude({ body }: { body: object }) {
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
          onClick={() => claude.ask(body)}
        >
          {claude.status === 'idle' ? 'Ask Claude' : 'Ask again'}
        </button>
      )}
      <ClaudeAnswer status={claude.status} answer={claude.answer} statusText={claude.statusText} />
    </>
  )
}
