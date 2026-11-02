// Builds the "Copy for Claude" prompt from prompts/reading.md. No React or
// Vite-only imports: the template is passed in so Node can reuse this module.
import type { Card, Spread, Verdict } from './deck.ts'
import type { Reading } from './draw.ts'

const PLACEHOLDER = /\{\{(spread|question|answer|cards)\}\}(\n*)/g
const REQUIRED = ['spread', 'question', 'answer', 'cards'] as const
const VERDICT_WORDS: Record<Verdict, string> = { yes: 'Yes', no: 'No', maybe: 'Maybe' }

// Angle brackets in the question become look-alike quotes so typed text such
// as "</question>" can never close the question block early.
export function escapeQuestion(question: string): string {
  return question.replaceAll('<', '‹').replaceAll('>', '›')
}

export function buildPrompt(
  template: string,
  reading: Reading,
  spread: Spread,
  cardsById: Map<string, Card>,
): string {
  for (const name of REQUIRED) {
    if (!template.includes(`{{${name}}}`)) throw new Error(`prompt template is missing {{${name}}}`)
  }

  const question = reading.question.trim()
    ? `<question>\n${escapeQuestion(reading.question)}\n</question>`
    : 'No question was asked; give a general reading.'

  let answer = ''
  if (spread.showsVerdict) {
    const drawn = reading.cards[0]
    const { verdict, note } = cardsById.get(drawn.cardId)!.yesNo[drawn.reversed ? 'reversed' : 'upright']
    answer =
      `The written answer for this reading is **${VERDICT_WORDS[verdict]}**. ` +
      `The card's note: ${note} Explain how the card supports this answer; do not contradict it.`
  }

  const cards = reading.cards
    .map((drawn) => {
      const card = cardsById.get(drawn.cardId)!
      const position = spread.positions.find((p) => p.id === drawn.positionId)!
      const orientation = drawn.reversed ? 'reversed' : 'upright'
      return [
        `${position.label}: ${card.name} (${orientation})`,
        `Keywords: ${card.keywords.join(', ')}`,
        `Meaning: ${card.meaning[orientation]}`,
      ].join('\n')
    })
    .join('\n\n')

  const values = { spread: spread.name, question, answer, cards }
  // Single pass, so text inside the values is never treated as a placeholder.
  // An empty value also drops the blank lines after it.
  return template.replace(PLACEHOLDER, (_, name: keyof typeof values, newlines: string) =>
    values[name] ? values[name] + newlines : '',
  )
}
