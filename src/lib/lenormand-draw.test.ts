// Fair Lenormand draw: distinct cards, never reversed, uniform over the 36.
import { expect, test } from 'vitest'
import { buildSpreads, rawSpreads, rawSpreadText } from './deck.ts'
import { draw } from './draw.ts'
import { buildLenormandSpreads, rawLenormandDeck, rawLenormandSpreads, rawLenormandSpreadText } from './lenormand.ts'
import { cryptoRandomInt, seededRandomInt } from './random.ts'

const ids = rawLenormandDeck.map((c) => c.id)
const spreads = buildLenormandSpreads(buildSpreads(rawSpreads, rawSpreadText), rawLenormandSpreads, rawLenormandSpreadText)
const yesNo = spreads.find((s) => s.id === 'yes-no')!
const threeCard = spreads.find((s) => s.id === 'three-card')!
const single = { id: 'single', positions: [{ id: 'only' }] }

// Chi-square critical value for 35 degrees of freedom at p = 0.001.
const CHI_SQUARE_CRITICAL_35_DF = 66.62

test('Yes / No draws two Lenormand cards into first and second', () => {
  const reading = draw(yesNo, ids, 'Will it work?', cryptoRandomInt, { reversals: false })
  expect(reading.cards.map((c) => c.positionId)).toEqual(['first', 'second'])
})

test('Lenormand cards are never reversed or repeated', () => {
  for (let i = 0; i < 2000; i++) {
    const cards = draw(threeCard, ids, '', cryptoRandomInt, { reversals: false }).cards
    expect(cards.every((c) => !c.reversed)).toBe(true)
    expect(new Set(cards.map((c) => c.cardId)).size).toBe(3)
    for (const c of cards) expect(ids).toContain(c.cardId)
  }
})

test('without reversals, no random number is spent on orientation', () => {
  const calls: number[] = []
  const rng = (n: number) => {
    calls.push(n)
    return 0
  }
  draw(threeCard, ids, '', rng, { reversals: false })
  expect(calls).toEqual([36, 35, 34])
})

test('single-card Lenormand draws are uniform across the 36 cards', () => {
  const rng = seededRandomInt(36)
  const draws = 36_000
  const counts = new Map(ids.map((id) => [id, 0]))
  for (let i = 0; i < draws; i++) {
    const { cardId } = draw(single, ids, '', rng, { reversals: false }).cards[0]
    counts.set(cardId, counts.get(cardId)! + 1)
  }
  const expected = draws / ids.length
  let chiSquare = 0
  for (const observed of counts.values()) chiSquare += (observed - expected) ** 2 / expected
  expect(chiSquare).toBeLessThan(CHI_SQUARE_CRITICAL_35_DF)
})
