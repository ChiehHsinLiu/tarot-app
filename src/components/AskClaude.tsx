// Dev-only: streams an interpretation from the owner's local Claude Code via
// the private-readings Vite plugin. Never rendered in the production build.
import { AskButtons } from './AskButtons.tsx'
import { ClaudeAnswer } from './ClaudeAnswer.tsx'
import { useClaudeStream } from './useClaudeStream.ts'

// body is what the endpoint accepts: { fragment } for tarot, { lenormand } for Lenormand.
export function AskClaude({ body }: { body: object }) {
  const claude = useClaudeStream()

  return (
    <>
      <AskButtons claude={claude} body={body} />
      <ClaudeAnswer status={claude.status} answer={claude.answer} statusText={claude.statusText} />
    </>
  )
}
