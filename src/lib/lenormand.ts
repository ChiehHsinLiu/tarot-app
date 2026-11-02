// The dev-only Lenormand deck: data joined with English text, its spreads and
// its Ask Claude prompt. No React imports, so the Vite plugin can reuse it.
// Nothing here runs at module level: the app builds the deck only inside an
// import.meta.env.DEV expression, so the production build drops this module.
import deckData from '../../data/lenormand/deck.json' with { type: 'json' }
import spreadData from '../../data/lenormand/spreads.json' with { type: 'json' }
import cardTextEn from '../../data/i18n/en/lenormand/cards.json' with { type: 'json' }
import guideEn from '../../data/i18n/en/lenormand/guide.json' with { type: 'json' }
import spreadTextEn from '../../data/i18n/en/lenormand/spreads.json' with { type: 'json' }
import type { Spread } from './deck.ts'
import type { Reading } from './draw.ts'
import type { ScreenGuideText } from './guides.ts'
import type { OraclePalette } from './oracle.ts'
import { escapeQuestion } from './prompt.ts'

// palette: one of the animal oracle's six pastel colour families, chosen per picture.
export type LenormandCardData = { id: string; number: number; palette: OraclePalette }
export type LenormandCardText = { name: string; keywords: string[]; meaning: string }
export type LenormandCard = LenormandCardData & LenormandCardText

// Lenormand uses the tarot spreads (same ids, names and question rules) with its
// own positions, keyed by spread id.
export type LenormandSpreadData = Record<string, { positions: { id: string }[] }>
export type LenormandSpreadText = Record<string, { positions: Record<string, string> }>

export const rawLenormandDeck = deckData as LenormandCardData[]
export const rawLenormandText = cardTextEn as Record<string, LenormandCardText>
export const rawLenormandSpreads = spreadData as LenormandSpreadData
export const rawLenormandSpreadText = spreadTextEn as LenormandSpreadText
// The tarot screen's "How it works" and "About this deck" while Lenormand is chosen.
export const lenormandGuide = guideEn as ScreenGuideText

export function buildLenormandCards(
  data: LenormandCardData[],
  text: Record<string, LenormandCardText>,
): LenormandCard[] {
  return data.map((card) => ({ ...text[card.id], id: card.id, number: card.number, palette: card.palette }))
}

// A Lenormand reading never shows a written verdict: Claude gives the Yes / No.
export function buildLenormandSpreads(
  tarotSpreads: Spread[],
  data: LenormandSpreadData,
  text: LenormandSpreadText,
): Spread[] {
  return tarotSpreads.map((spread) => ({
    id: spread.id,
    name: spread.name,
    requiresQuestion: spread.requiresQuestion,
    showsVerdict: false,
    positions: data[spread.id].positions.map((p) => ({ id: p.id, label: text[spread.id].positions[p.id] })),
  }))
}

const PLACEHOLDER = /\{\{(spread|question|guidance|cards)\}\}(\n*)/g
const REQUIRED = ['spread', 'question', 'guidance', 'cards'] as const

const GUIDANCE: Record<string, string> = {
  'yes-no':
    'Begin with a single line: **Yes**, **No**, or **Maybe**, decided by how the two cards combine ' +
    '(the first card is the subject, the second describes it). Then explain why in two or three short paragraphs.',
  'three-card':
    'Read the three cards as one line and as Past, Present, and Future, with the middle card as the heart of the matter.',
}

// Builds the "Copy for Claude" and "Ask Claude" prompt for a Lenormand reading.
export function buildLenormandPrompt(
  template: string,
  reading: Reading,
  spread: Spread,
  cardsById: Map<string, LenormandCard>,
): string {
  for (const name of REQUIRED) {
    if (!template.includes(`{{${name}}}`)) throw new Error(`Lenormand prompt template is missing {{${name}}}`)
  }

  const question = reading.question.trim()
    ? `<question>\n${escapeQuestion(reading.question)}\n</question>`
    : 'No question was asked; give a general reading.'

  const cards = reading.cards
    .map((drawn) => {
      const card = cardsById.get(drawn.cardId)!
      const position = spread.positions.find((p) => p.id === drawn.positionId)!
      return [
        `${position.label}: ${card.number} ${card.name}`,
        `Keywords: ${card.keywords.join(', ')}`,
        `Meaning: ${card.meaning}`,
      ].join('\n')
    })
    .join('\n\n')

  const values = { spread: `Lenormand · ${spread.name}`, question, guidance: GUIDANCE[spread.id] ?? '', cards }
  // Single pass, so text inside the values is never treated as a placeholder.
  return template.replace(PLACEHOLDER, (_, name: keyof typeof values, newlines: string) =>
    values[name] ? values[name] + newlines : '',
  )
}

// Everything the tarot screen needs to offer the deck. The app calls this only
// inside an import.meta.env.DEV expression.
export function buildLenormandDeck(tarotSpreads: Spread[]) {
  const cards = buildLenormandCards(rawLenormandDeck, rawLenormandText)
  return {
    cardsById: new Map(cards.map((c) => [c.id, c])),
    ids: cards.map((c) => c.id),
    spreads: buildLenormandSpreads(tarotSpreads, rawLenormandSpreads, rawLenormandSpreadText),
    guide: lenormandGuide,
  }
}
