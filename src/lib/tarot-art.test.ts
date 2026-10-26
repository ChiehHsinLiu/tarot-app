// The tarot drawings against the shared drawing format (art-format.ts).
import { describe, expect, test } from 'vitest'
import { formatProblems } from './art-format.ts'
import { rawCards } from './deck-ids.ts'
import { TAROT_ART } from './tarot-art.ts'

// The major arcana and the Page, Knight, Queen and King of each suit.
const drawnIds = rawCards.filter((c) => c.arcana === 'major' || c.rank > 10).map((c) => c.id)

describe('TAROT_ART', () => {
  test('has exactly one drawing per major arcana and court card, and no others', () => {
    expect(Object.keys(TAROT_ART).sort()).toEqual([...drawnIds].sort())
  })

  test.each(Object.keys(TAROT_ART).sort())('%s follows the drawing format', (id) => {
    expect(formatProblems(TAROT_ART[id])).toEqual([])
  })

  test('no two drawings are the same', () => {
    const drawings = Object.values(TAROT_ART).map((s) => s.trim())
    expect(new Set(drawings).size).toBe(drawings.length)
  })
})
