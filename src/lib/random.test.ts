import { describe, expect, test } from 'vitest'
import { cryptoRandomInt, seededRandomInt } from './random.ts'

describe('cryptoRandomInt', () => {
  test.each([1, 2, 3, 78, 1000])('stays in [0, %i)', (max) => {
    for (let i = 0; i < 2000; i++) {
      const n = cryptoRandomInt(max)
      expect(Number.isInteger(n)).toBe(true)
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(max)
    }
  })

  test.each([0, -1, 1.5, NaN])('rejects invalid max %s', (max) => {
    expect(() => cryptoRandomInt(max)).toThrow(RangeError)
  })
})

describe('seededRandomInt', () => {
  test('same seed gives the same sequence', () => {
    const a = seededRandomInt(42)
    const b = seededRandomInt(42)
    const seqA = Array.from({ length: 20 }, () => a(78))
    const seqB = Array.from({ length: 20 }, () => b(78))
    expect(seqA).toEqual(seqB)
  })

  test('different seeds give different sequences', () => {
    const a = seededRandomInt(1)
    const b = seededRandomInt(2)
    expect(Array.from({ length: 20 }, () => a(78))).not.toEqual(Array.from({ length: 20 }, () => b(78)))
  })

  test('stays in range', () => {
    const rng = seededRandomInt(7)
    for (let i = 0; i < 2000; i++) {
      const n = rng(78)
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(78)
    }
  })
})
