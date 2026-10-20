// Statistical checks for the fair-draw and 50/50-reversal requirements, using
// the real crypto source.
import { expect, test } from 'vitest'
import { rawCards, rawSpreads } from './deck.ts'
import { draw } from './draw.ts'
import { cryptoRandomInt } from './random.ts'

const deckIds = rawCards.map((c) => c.id)
const yesNo = rawSpreads.find((s) => s.id === 'yes-no')!
const threeCard = rawSpreads.find((s) => s.id === 'three-card')!

// Chi-square critical value for 77 degrees of freedom at p = 0.001.
const CHI_SQUARE_CRITICAL_77_DF = 121.1

test('single-card draws are uniform across all 78 cards', () => {
  const draws = 78_000
  const counts = new Map(deckIds.map((id) => [id, 0]))
  for (let i = 0; i < draws; i++) {
    const { cardId } = draw(yesNo, deckIds, '', cryptoRandomInt).cards[0]
    counts.set(cardId, counts.get(cardId)! + 1)
  }
  const expected = draws / deckIds.length
  let chiSquare = 0
  for (const observed of counts.values()) chiSquare += (observed - expected) ** 2 / expected
  expect(chiSquare).toBeLessThan(CHI_SQUARE_CRITICAL_77_DF)
})

test('about half of drawn cards are reversed', () => {
  let reversed = 0
  let total = 0
  while (total < 10_000) {
    for (const card of draw(threeCard, deckIds, '', cryptoRandomInt).cards) {
      if (card.reversed) reversed++
      total++
    }
  }
  const share = reversed / total
  expect(share).toBeGreaterThan(0.47)
  expect(share).toBeLessThan(0.53)
})
