// The tarot deck and its spreads with their text, built once from data/. Kept
// apart from the oracle so each screen's file holds only its own deck.
import { buildCards, buildSpreads, rawCardText, rawCards, rawSpreadText, rawSpreads } from './deck.ts'

export const cards = buildCards(rawCards, rawCardText)
export const cardsById = new Map(cards.map((c) => [c.id, c]))
export const deckIds = cards.map((c) => c.id)
export const deckIdSet = new Set(deckIds)
export const spreads = buildSpreads(rawSpreads, rawSpreadText)
