// Data-integrity checks for the animal oracle deck requirement.
import { expect, test } from 'vitest'
import { ORACLE_PALETTE_NAMES, rawAnimalDeck, rawAnimalText } from './oracle.ts'

// Lower-case names that would break the "no insects or spiders" rule.
const BUGS = [
  'ant', 'bee', 'beetle', 'butterfly', 'cricket', 'dragonfly', 'firefly', 'fly', 'grasshopper',
  'ladybug', 'mantis', 'mosquito', 'moth', 'scorpion', 'spider', 'tarantula', 'termite', 'wasp',
]

test('36 cards with distinct ids and animals, in order', () => {
  const ids = rawAnimalDeck.map((c) => c.id)
  expect(ids).toEqual(Array.from({ length: 36 }, (_, i) => `animal-${String(i + 1).padStart(2, '0')}`))
  expect(Object.keys(rawAnimalText).sort()).toEqual(ids)
  expect(new Set(ids.map((id) => rawAnimalText[id].animal)).size).toBe(36)
})

test.each(rawAnimalDeck.map((c) => c.id))('%s has complete text', (id) => {
  const t = rawAnimalText[id]
  for (const field of ['animal', 'theme', 'message', 'reflection', 'affirmation'] as const) {
    expect(t[field]?.trim(), field).toBeTruthy()
  }
  expect(t.keywords.length).toBeGreaterThan(0)
  expect(t.keywords.every((k) => k.trim())).toBe(true)
})

test('includes the requested animals', () => {
  const animals = Object.values(rawAnimalText).map((t) => t.animal)
  expect(animals).toEqual(expect.arrayContaining(['Dachshund', 'Alpaca', 'Honey Badger', 'Flying Squirrel', 'Magpie']))
})

test('no insects or spiders', () => {
  for (const { animal } of Object.values(rawAnimalText)) {
    const words = animal.toLowerCase().split(/\s+/)
    expect(words.filter((w) => BUGS.includes(w)), animal).toEqual([])
  }
})

test('every card has a colour family, six cards each', () => {
  for (const card of rawAnimalDeck) expect(ORACLE_PALETTE_NAMES, card.id).toContain(card.palette)
  for (const name of ORACLE_PALETTE_NAMES) {
    expect(rawAnimalDeck.filter((c) => c.palette === name).length, name).toBe(6)
  }
})
