// Dev-only: asks the owner's local Claude Code about an oracle card, with an
// optional question. Never rendered in the production build.
import { useState } from 'react'
import { QUESTION_MAX_CHARS, countChars, truncateToLimit } from '../lib/question.ts'
import { AskButtons } from './AskButtons.tsx'
import { ClaudeAnswer } from './ClaudeAnswer.tsx'
import { useClaudeStream } from './useClaudeStream.ts'

export function AskClaudeOracle({ cardId }: { cardId: string }) {
  const claude = useClaudeStream()
  const [question, setQuestion] = useState('')
  const streaming = claude.status === 'streaming'

  return (
    <div className="oracle-ask">
      <div className="question-box">
        <label htmlFor="oracle-question">
          Ask about this card <span className="question-hint">(optional)</span>
        </label>
        <textarea
          id="oracle-question"
          rows={2}
          value={question}
          disabled={streaming}
          aria-describedby="oracle-question-count"
          placeholder="What should I focus on today?"
          onChange={(e) => setQuestion(truncateToLimit(e.target.value))}
        />
        <p id="oracle-question-count" className="question-count">
          {countChars(question)} / {QUESTION_MAX_CHARS}
        </p>
      </div>
      <div className="reading-actions">
        <AskButtons claude={claude} body={{ oracle: { cardId, question } }} />
        <ClaudeAnswer status={claude.status} answer={claude.answer} statusText={claude.statusText} />
      </div>
    </div>
  )
}
