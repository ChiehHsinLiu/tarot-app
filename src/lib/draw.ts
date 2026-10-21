// Pure draw logic. No React imports, so Node scripts can reuse it.
import type { RandomInt } from './random.ts'

export type DrawnCard = { cardId: string; positionId: string; reversed: boolean }
export type Reading = { spreadId: string; question: string; cards: DrawnCard[] }

type SpreadShape = { id: string; positions: { id: string }[] }

// Partial Fisher-Yates: shuffle only as many cards as there are positions, so
// every ordered selection of distinct cards is equally likely. Decks without
// reversals (Lenormand) pass { reversals: false } and skip the reversal roll.
export function draw(
  spread: SpreadShape,
  deckIds: string[],
  question: string,
  rng: RandomInt,
  { reversals = true }: { reversals?: boolean } = {},
): Reading {
  const count = spread.positions.length
  if (count > deckIds.length) {
    throw new RangeError(`spread ${spread.id} needs ${count} cards but the deck has ${deckIds.length}`)
  }
  const deck = [...deckIds]
  const cards: DrawnCard[] = spread.positions.map((position, i) => {
    const j = i + rng(deck.length - i)
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
    return { cardId: deck[i], positionId: position.id, reversed: reversals && rng(2) === 1 }
  })
  return { spreadId: spread.id, question, cards }
}
