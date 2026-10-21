// Data-integrity checks for the Lenormand deck requirement.
import { describe, expect, test } from 'vitest'
import { buildSpreads, rawSpreads, rawSpreadText } from './deck.ts'
import { ORACLE_PALETTE_NAMES } from './oracle.ts'
import {
  buildLenormandSpreads,
  rawLenormandDeck,
  rawLenormandSpreads,
  rawLenormandSpreadText,
  rawLenormandText,
} from './lenormand.ts'

const NAMES = [
  'Rider', 'Clover', 'Ship', 'House', 'Tree', 'Clouds', 'Snake', 'Coffin', 'Bouquet', 'Scythe', 'Whip', 'Birds',
  'Child', 'Fox', 'Bear', 'Stars', 'Stork', 'Dog', 'Tower', 'Garden', 'Mountain', 'Crossroads', 'Mice', 'Heart',
  'Ring', 'Book', 'Letter', 'Gentleman', 'Lady', 'Lily', 'Sun', 'Moon', 'Key', 'Fish', 'Anchor', 'Cross',
]
const MAX_MEANING = 400

test('36 cards with distinct ids, numbered 1 to 36 in the traditional order', () => {
  const ids = rawLenormandDeck.map((c) => c.id)
  expect(ids).toEqual(Array.from({ length: 36 }, (_, i) => `lenormand-${String(i + 1).padStart(2, '0')}`))
  expect(rawLenormandDeck.map((c) => c.number)).toEqual(Array.from({ length: 36 }, (_, i) => i + 1))
  expect(Object.keys(rawLenormandText).sort()).toEqual(ids)
  expect(ids.map((id) => rawLenormandText[id].name)).toEqual(NAMES)
})

test('every card has one of the six pastel colour families', () => {
  for (const card of rawLenormandDeck) expect(ORACLE_PALETTE_NAMES, card.id).toContain(card.palette)
  // Clover is a plant (sage) and the Ship is at sea (sky), as the spec's scenario expects.
  expect(rawLenormandDeck.find((c) => c.number === 2)!.palette).toBe('sage')
  expect(rawLenormandDeck.find((c) => c.number === 3)!.palette).toBe('sky')
})

test.each(rawLenormandDeck.map((c) => c.id))('%s has complete text', (id) => {
  const t = rawLenormandText[id]
  expect(t.name.trim()).toBeTruthy()
  expect(t.keywords.length).toBeGreaterThan(0)
  expect(t.keywords.every((k) => k.trim())).toBe(true)
  expect(t.meaning.trim()).toBeTruthy()
  expect(t.meaning.length).toBeLessThanOrEqual(MAX_MEANING)
})

describe('Lenormand spreads', () => {
  const tarot = buildSpreads(rawSpreads, rawSpreadText)
  const spreads = buildLenormandSpreads(tarot, rawLenormandSpreads, rawLenormandSpreadText)

  test('use exactly the tarot spread ids', () => {
    expect(Object.keys(rawLenormandSpreads).sort()).toEqual(rawSpreads.map((s) => s.id).sort())
    expect(Object.keys(rawLenormandSpreadText).sort()).toEqual(rawSpreads.map((s) => s.id).sort())
  })

  test('Yes / No draws a first and a second card; Three cards draws Past, Present and Future', () => {
    const labels = (id: string) => spreads.find((s) => s.id === id)!.positions.map((p) => p.label)
    expect(labels('yes-no')).toEqual(['First card', 'Second card'])
    expect(labels('three-card')).toEqual(['Past', 'Present', 'Future'])
  })

  test('names and question rules come from tarot, and no spread shows a verdict', () => {
    for (const spread of spreads) {
      const t = tarot.find((s) => s.id === spread.id)!
      expect(spread.name).toBe(t.name)
      expect(spread.requiresQuestion).toBe(t.requiresQuestion)
      expect(spread.showsVerdict).toBe(false)
    }
  })
})
