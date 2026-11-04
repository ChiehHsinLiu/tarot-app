// The animal oracle with its text, built once from data/ for each language.
// Kept apart from the tarot so each screen's file holds only its own deck. The
// plain exports are English, for the dev endpoint.
import { LANGUAGES } from './language.ts'
import type { Language } from './language.ts'
import { animalTextFor, buildOracleCards, rawAnimalDeck } from './oracle.ts'
import type { OracleCard } from './oracle.ts'

function byId(lang: Language): Map<string, OracleCard> {
  return new Map(buildOracleCards(rawAnimalDeck, animalTextFor(lang)).map((c) => [c.id, c]))
}

export const oracleByIdFor = Object.fromEntries(LANGUAGES.map((l) => [l, byId(l)])) as Record<Language, Map<string, OracleCard>>
export const oracleById = oracleByIdFor.en
export const oracleCards = [...oracleById.values()]
export const oracleIds = oracleCards.map((c) => c.id)
