import { QUESTION_MAX_CHARS, countChars, truncateToLimit } from '../lib/question.ts'
import { useLanguage } from './LanguageContext.tsx'

type Props = {
  value: string
  required: boolean
  onChange: (value: string) => void
}

export function QuestionBox({ value, required, onChange }: Props) {
  const { t } = useLanguage()
  return (
    <div className="question-box">
      <label htmlFor="question">
        {t('question.label')} <span className="question-hint">{required ? t('question.required') : t('question.optional')}</span>
      </label>
      <textarea
        id="question"
        rows={3}
        value={value}
        required={required}
        aria-describedby="question-count"
        placeholder={required ? t('question.placeholderYesNo') : t('question.placeholderOpen')}
        // Typing and pasting both arrive here; trim to whole characters at the limit.
        onChange={(e) => onChange(truncateToLimit(e.target.value))}
      />
      <p id="question-count" className="question-count">
        {countChars(value)} / {QUESTION_MAX_CHARS}
      </p>
    </div>
  )
}
