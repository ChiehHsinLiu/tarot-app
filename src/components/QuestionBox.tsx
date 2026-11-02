import { QUESTION_MAX_CHARS, countChars, truncateToLimit } from '../lib/question.ts'

type Props = {
  value: string
  required: boolean
  placeholder: string
  onChange: (value: string) => void
}

export function QuestionBox({ value, required, placeholder, onChange }: Props) {
  return (
    <div className="question-box">
      <label htmlFor="question">
        Your question <span className="question-hint">{required ? '(required)' : '(optional)'}</span>
      </label>
      <textarea
        id="question"
        rows={3}
        value={value}
        required={required}
        aria-describedby="question-count"
        placeholder={placeholder}
        // Typing and pasting both arrive here; trim to whole characters at the limit.
        onChange={(e) => onChange(truncateToLimit(e.target.value))}
      />
      <p id="question-count" className="question-count">
        {countChars(value)} / {QUESTION_MAX_CHARS}
      </p>
    </div>
  )
}
