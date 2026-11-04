// The tarot deck and its spreads with their text, built once from data/ for each
// language. Kept apart from the oracle so each screen's file holds only its own
// deck. The plain exports are English, for Node scripts, the dev endpoint and
// Lenormand, which stays English.
import { buildCards, buildSpreads, cardTextFor, rawCards, rawSpreads, spreadTextFor } from './deck.ts'
import type { Card, Spread } from './deck.ts'
import { LANGUAGES } from './language.ts'
import type { Language } from './language.ts'

export type TarotDeck = { cards: Card[]; cardsById: Map<string, Card>; spreads: Spread[] }

function buildDeck(lang: Language): TarotDeck {
  const cards = buildCards(rawCards, cardTextFor(lang))
  return { cards, cardsById: new Map(cards.map((c) => [c.id, c])), spreads: buildSpreads(rawSpreads, spreadTextFor(lang)) }
}

export const tarotDecks = Object.fromEntries(LANGUAGES.map((l) => [l, buildDeck(l)])) as Record<Language, TarotDeck>

export const { cards, cardsById, spreads } = tarotDecks.en
export const deckIds = cards.map((c) => c.id)
export const deckIdSet = new Set(deckIds)
