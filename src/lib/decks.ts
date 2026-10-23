// The tarot deck, its spreads and the animal oracle, built once from data/ for
// both the app and the dev-only Ask Claude endpoint. No React imports, so Node
// can load it too. Lenormand is not here on purpose: App.tsx builds it behind
// import.meta.env.DEV, which keeps it out of the public bundle.
import { buildCards, buildSpreads, rawCardText, rawCards, rawSpreadText, rawSpreads } from './deck.ts'
import { buildOracleCards, rawAnimalDeck, rawAnimalText } from './oracle.ts'

export const cards = buildCards(rawCards, rawCardText)
export const cardsById = new Map(cards.map((c) => [c.id, c]))
export const deckIds = cards.map((c) => c.id)
export const deckIdSet = new Set(deckIds)
export const spreads = buildSpreads(rawSpreads, rawSpreadText)

export const oracleCards = buildOracleCards(rawAnimalDeck, rawAnimalText)
export const oracleById = new Map(oracleCards.map((c) => [c.id, c]))
export const oracleIds = oracleCards.map((c) => c.id)
