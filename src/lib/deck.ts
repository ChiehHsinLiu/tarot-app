// Deck and spread data joined with their English text. No React imports, so
// Node scripts and Vite plugins can reuse this module.
import cardData from '../../data/cards.json' with { type: 'json' }
import spreadData from '../../data/spreads.json' with { type: 'json' }
import cardTextEn from '../../data/i18n/en/cards.json' with { type: 'json' }
import spreadTextEn from '../../data/i18n/en/spreads.json' with { type: 'json' }

export type Orientation = 'upright' | 'reversed'
export type Verdict = 'yes' | 'no' | 'maybe'
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

export type CardData = {
  id: string
  arcana: 'major' | 'minor'
  suit?: Suit
  rank: number
  yesNo?: Record<Orientation, Verdict>
}

export type CardText = {
  name: string
  keywords: string[]
  upright: string
  reversed: string
  yesNoNote: Record<Orientation, string>
}

export type SpreadData = {
  id: string
  requiresQuestion: boolean
  showsVerdict: boolean
  positions: { id: string }[]
}

export type SpreadText = {
  name: string
  positions: Record<string, string>
}

export type Card = {
  id: string
  arcana: 'major' | 'minor'
  suit?: Suit
  rank: number
  name: string
  keywords: string[]
  meaning: Record<Orientation, string>
  yesNo: Record<Orientation, { verdict: Verdict; note: string }>
}

export type Spread = {
  id: string
  name: string
  requiresQuestion: boolean
  showsVerdict: boolean
  positions: { id: string; label: string }[]
}

export const rawCards = cardData as CardData[]
export const rawSpreads = spreadData as SpreadData[]
export const rawCardText = cardTextEn as Record<string, CardText>
export const rawSpreadText = spreadTextEn as Record<string, SpreadText>

export function buildCards(data: CardData[], text: Record<string, CardText>): Card[] {
  return data.map((card) => {
    const t = text[card.id]
    return {
      id: card.id,
      arcana: card.arcana,
      suit: card.suit,
      rank: card.rank,
      name: t.name,
      keywords: t.keywords,
      meaning: { upright: t.upright, reversed: t.reversed },
      yesNo: {
        upright: { verdict: card.yesNo!.upright, note: t.yesNoNote.upright },
        reversed: { verdict: card.yesNo!.reversed, note: t.yesNoNote.reversed },
      },
    }
  })
}

export function buildSpreads(data: SpreadData[], text: Record<string, SpreadText>): Spread[] {
  return data.map((spread) => ({
    id: spread.id,
    name: text[spread.id].name,
    requiresQuestion: spread.requiresQuestion,
    showsVerdict: spread.showsVerdict,
    positions: spread.positions.map((p) => ({ id: p.id, label: text[spread.id].positions[p.id] })),
  }))
}

const ROMAN: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

// Major arcana run 0–21; The Fool is shown as 0.
export function toRoman(n: number): string {
  if (n === 0) return '0'
  let out = ''
  for (const [value, symbol] of ROMAN) {
    while (n >= value) {
      out += symbol
      n -= value
    }
  }
  return out
}
