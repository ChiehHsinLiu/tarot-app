// The animal oracle with its text, built once from data/. Kept apart from the
// tarot so each screen's file holds only its own deck.
import { buildOracleCards, rawAnimalDeck, rawAnimalText } from './oracle.ts'

export const oracleCards = buildOracleCards(rawAnimalDeck, rawAnimalText)
export const oracleById = new Map(oracleCards.map((c) => [c.id, c]))
export const oracleIds = oracleCards.map((c) => c.id)
