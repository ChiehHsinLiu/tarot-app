import { describe, expect, test } from 'vitest'
import { buildOracleCards, drawOracle, rawAnimalDeck, rawAnimalText } from './oracle.ts'
import { cryptoRandomInt, seededRandomInt } from './random.ts'

const ids = rawAnimalDeck.map((c) => c.id)

describe('buildOracleCards', () => {
  test('joins ids with their text in deck order', () => {
    const cards = buildOracleCards(rawAnimalDeck, rawAnimalText)
    expect(cards.map((c) => c.id)).toEqual(ids)
    expect(cards[0]).toEqual({ id: 'animal-01', ...rawAnimalText['animal-01'] })
    expect(cards[0].animal).toBe('Dachshund')
  })
})

describe('drawOracle', () => {
  test('returns a card from the deck', () => {
    for (let i = 0; i < 500; i++) expect(ids).toContain(drawOracle(ids, cryptoRandomInt))
  })

  test('never returns the excluded card', () => {
    const rng = seededRandomInt(7)
    for (const excluded of ids) {
      for (let i = 0; i < 100; i++) expect(drawOracle(ids, rng, excluded)).not.toBe(excluded)
    }
  })

  test('is deterministic for a fixed seed', () => {
    const sequence = (seed: number) => {
      const rng = seededRandomInt(seed)
      return Array.from({ length: 20 }, () => drawOracle(ids, rng))
    }
    expect(sequence(42)).toEqual(sequence(42))
  })

  test('does not mutate the deck', () => {
    const copy = [...ids]
    drawOracle(copy, cryptoRandomInt, copy[0])
    expect(copy).toEqual(ids)
  })

  test('throws when nothing is left to draw', () => {
    expect(() => drawOracle(['animal-01'], cryptoRandomInt, 'animal-01')).toThrow(RangeError)
  })
})

// Chi-square critical values at p = 0.001.
const CHI_SQUARE_CRITICAL = { 35: 66.6, 34: 65.2 }

function chiSquare(draws: string[], pool: string[]): number {
  const counts = new Map(pool.map((id) => [id, 0]))
  for (const id of draws) counts.set(id, counts.get(id)! + 1)
  const expected = draws.length / pool.length
  let total = 0
  for (const observed of counts.values()) total += (observed - expected) ** 2 / expected
  return total
}

describe('drawOracle fairness', () => {
  test('uniform across all 36 cards', () => {
    const draws = Array.from({ length: 36_000 }, () => drawOracle(ids, cryptoRandomInt))
    expect(chiSquare(draws, ids)).toBeLessThan(CHI_SQUARE_CRITICAL[35])
  })

  test('uniform across the other 35 when one is excluded', () => {
    const excluded = 'animal-18'
    const draws = Array.from({ length: 35_000 }, () => drawOracle(ids, cryptoRandomInt, excluded))
    expect(draws).not.toContain(excluded)
    expect(chiSquare(draws, ids.filter((id) => id !== excluded))).toBeLessThan(CHI_SQUARE_CRITICAL[34])
  })
})
