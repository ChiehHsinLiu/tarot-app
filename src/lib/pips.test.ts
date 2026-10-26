import { describe, expect, test } from 'vitest'
import { PIP_LAYOUTS } from './pips.ts'

const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const MARGIN = 4

describe('PIP_LAYOUTS', () => {
  test('has a layout for every number from Ace to Ten, and no others', () => {
    expect(Object.keys(PIP_LAYOUTS).map(Number).sort((a, b) => a - b)).toEqual(RANKS)
  })

  test.each(RANKS)('%i has as many pips as its number', (rank) => {
    expect(PIP_LAYOUTS[rank]).toHaveLength(rank)
  })

  test.each(RANKS)('%i keeps every pip inside the box', (rank) => {
    for (const { x, y, size } of PIP_LAYOUTS[rank]) {
      expect(x - size / 2).toBeGreaterThanOrEqual(MARGIN)
      expect(x + size / 2).toBeLessThanOrEqual(100 - MARGIN)
      expect(y - size / 2).toBeGreaterThanOrEqual(MARGIN)
      expect(y + size / 2).toBeLessThanOrEqual(130 - MARGIN)
    }
  })

  test.each(RANKS)('%i has no two pips overlapping', (rank) => {
    const pips = PIP_LAYOUTS[rank]
    for (const [i, a] of pips.entries()) {
      for (const b of pips.slice(i + 1)) {
        const apart = Math.abs(a.x - b.x) >= (a.size + b.size) / 2 || Math.abs(a.y - b.y) >= (a.size + b.size) / 2
        expect(apart, JSON.stringify([a, b])).toBe(true)
      }
    }
  })

  test.each(RANKS)('%i is the same mirrored left to right', (rank) => {
    const key = ({ x, y, size }: { x: number; y: number; size: number }) => `${x},${y},${size}`
    const pips = PIP_LAYOUTS[rank].map(key).sort()
    const mirrored = PIP_LAYOUTS[rank].map((p) => key({ ...p, x: 100 - p.x })).sort()
    expect(mirrored).toEqual(pips)
  })
})
