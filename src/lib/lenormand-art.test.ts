// The Lenormand drawings against the shared drawing format.
import { describe, expect, test } from 'vitest'
import { formatProblems } from './art-format.ts'
import { LENORMAND_ART } from './lenormand-art.ts'
import { rawLenormandDeck } from './lenormand.ts'

const deckIds = rawLenormandDeck.map((c) => c.id)

describe('LENORMAND_ART', () => {
  test('has exactly one drawing per card in the deck', () => {
    expect(Object.keys(LENORMAND_ART).sort()).toEqual([...deckIds].sort())
  })

  test.each(Object.keys(LENORMAND_ART).sort())('%s follows the drawing format', (id) => {
    expect(formatProblems(LENORMAND_ART[id])).toEqual([])
  })

  test('no two drawings are the same', () => {
    const drawings = Object.values(LENORMAND_ART).map((s) => s.trim())
    expect(new Set(drawings).size).toBe(drawings.length)
  })
})
