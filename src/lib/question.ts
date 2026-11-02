// Question length is counted in user-visible characters (grapheme clusters),
// so an emoji or an accented letter counts once and is never split.
export const QUESTION_MAX_CHARS = 300

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
