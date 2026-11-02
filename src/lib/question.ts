// Question length is counted in user-visible characters (grapheme clusters),
// so an emoji or an accented letter counts once and is never split.
export const QUESTION_MAX_CHARS = 300

type SpreadQuestion = { requiresQuestion: boolean; questionHint?: string; missingQuestion?: string }

// The question box hint: a spread's own, else the yes / no or open default.
export function questionPlaceholder(spread: SpreadQuestion | null): string {
  if (spread?.questionHint) return spread.questionHint
  return spread?.requiresQuestion ? 'Ask a yes or no question' : 'What would you like to know?'
}

// The note under Draw when a spread needs a question and has none.
export function missingQuestionNote(spread: SpreadQuestion): string {
  return spread.missingQuestion ?? 'A yes / no reading needs a question.'
}

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

export function countChars(text: string): number {
  let count = 0
  for (const _ of segmenter.segment(text)) count++
  return count
}

export function truncateToLimit(text: string, limit: number = QUESTION_MAX_CHARS): string {
  let count = 0
  let end = 0
  for (const { segment, index } of segmenter.segment(text)) {
    if (count === limit) return text.slice(0, index)
    count++
    end = index + segment.length
  }
  return text.slice(0, end)
}
