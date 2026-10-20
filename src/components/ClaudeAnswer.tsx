// Dev-only: the streamed answer and its status line.
import { MarkdownText } from './MarkdownText.tsx'
import type { ClaudeStatus } from './useClaudeStream.ts'
import './AskClaude.css'

type Props = { status: ClaudeStatus; answer: string; statusText: string }

export function ClaudeAnswer({ status, answer, statusText }: Props) {
  if (status === 'idle') return null
  return (
    <div className="claude-answer">
      {/* Not a live region: announcing every streamed fragment would be noise.
          The status line below announces progress instead. */}
      {answer && <MarkdownText className="claude-answer-text" source={answer} />}
      <p className={status === 'error' ? 'claude-answer-status error' : 'claude-answer-status'} role="status">
        {statusText}
      </p>
    </div>
  )
}
