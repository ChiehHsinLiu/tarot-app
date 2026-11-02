// The Dachshund drawings against the drawing format (art-format.ts) and
// tarot-deck-styles: Every Dachshund card has its own drawing, Dachshund number
// cards can be counted.
import { describe, expect, test } from 'vitest'
import { dachshundProblems } from './art-format.ts'
import { DACHSHUND_ART } from './dachshund-art.ts'
import { rawCards } from './deck-ids.ts'

// Each suit symbol is one group drawn by symbol() in scripts/dachshund-art/shapes.ts,
// which always ends its transform this way; nothing else in a drawing does.
const SYMBOL_MARK = /translate\(-12 -12\)">/g

describe('DACHSHUND_ART', () => {
  test('has exactly one drawing per card, all 78, and no others', () => {
    expect(Object.keys(DACHSHUND_ART).sort()).toEqual(rawCards.map((c) => c.id).sort())
  })

  test.each(Object.keys(DACHSHUND_ART).sort())('%s follows the drawing format', (id) => {
    expect(dachshundProblems(DACHSHUND_ART[id])).toEqual([])
  })

  test('no two drawings are the same', () => {
    const drawings = Object.values(DACHSHUND_ART).map((s) => s.trim())
    expect(new Set(drawings).size).toBe(drawings.length)
  })

  test.each(rawCards.filter((c) => c.suit && c.rank <= 10).map((c) => [c.id, c.rank] as const))(
    '%s shows its suit symbol exactly %i times',
    (id, rank) => {
      expect(DACHSHUND_ART[id].match(SYMBOL_MARK)?.length ?? 0).toBe(rank)
    },
  )
})
