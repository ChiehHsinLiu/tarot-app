// Oracle decks: data joined with English text, the one-card draw, and the
// Ask Claude prompt. No React imports, so Node scripts and Vite plugins can
// reuse this module; the prompt template is passed in.
import animalDeckData from '../../data/oracle/animal.json' with { type: 'json' }
import animalTextEn from '../../data/i18n/en/oracle/animal.json' with { type: 'json' }
import { escapeQuestion } from './prompt.ts'
import type { RandomInt } from './random.ts'

// The six pastel colour families; each holds six cards of the animal deck.
export const ORACLE_PALETTE_NAMES = ['peach', 'sage', 'sky', 'lavender', 'butter', 'rose'] as const
export type OraclePalette = (typeof ORACLE_PALETTE_NAMES)[number]

export type OracleCardData = { id: string; palette: OraclePalette }

export type OracleCardText = {
  animal: string
  theme: string
  keywords: string[]
  message: string
  reflection: string
  affirmation: string
}

export type OracleCard = OracleCardData & OracleCardText

export const rawAnimalDeck = animalDeckData as OracleCardData[]
export const rawAnimalText = animalTextEn as Record<string, OracleCardText>

export function buildOracleCards(data: OracleCardData[], text: Record<string, OracleCardText>): OracleCard[] {
  return data.map((card) => ({ ...text[card.id], id: card.id, palette: card.palette }))
}

// One card, uniformly from the deck. "Draw again" passes the card on screen as
// excludeId so the new card is always a different one.
export function drawOracle(ids: string[], rng: RandomInt, excludeId?: string): string {
  const pool = excludeId === undefined ? ids : ids.filter((id) => id !== excludeId)
  if (pool.length === 0) throw new RangeError('no oracle card left to draw')
  return pool[rng(pool.length)]
}

const PLACEHOLDER = /\{\{(card|question)\}\}(\n*)/g
const REQUIRED = ['card', 'question'] as const

export function buildOraclePrompt(template: string, card: OracleCard, question: string): string {
  for (const name of REQUIRED) {
    if (!template.includes(`{{${name}}}`)) throw new Error(`oracle prompt template is missing {{${name}}}`)
  }

  const values = {
    card: [
      `Card: ${card.animal} · ${card.theme}`,
      `Keywords: ${card.keywords.join(', ')}`,
      `Message: ${card.message}`,
      `Reflection: ${card.reflection}`,
      `Affirmation: ${card.affirmation}`,
    ].join('\n'),
    question: question.trim()
      ? `<question>\n${escapeQuestion(question)}\n</question>`
      : 'No question was asked; explain what this card offers for today.',
  }
  // Single pass, so text inside the values is never treated as a placeholder.
  return template.replace(PLACEHOLDER, (_, name: keyof typeof values, newlines: string) => values[name] + newlines)
}
