// Data-integrity checks for the animal oracle deck requirement.
import { expect, test } from 'vitest'
import { ORACLE_PALETTE_NAMES, rawAnimalDeck, rawAnimalText } from './oracle.ts'

// Lower-case names that would break the "no insects or spiders" rule.
const BUGS = [
  'ant', 'bee', 'beetle', 'butterfly', 'cricket', 'dragonfly', 'firefly', 'fly', 'grasshopper',
  'ladybug', 'mantis', 'mosquito', 'moth', 'scorpion', 'spider', 'tarantula', 'termite', 'wasp',
]

test('78 cards with distinct ids and animals, in order', () => {
  const ids = rawAnimalDeck.map((c) => c.id)
  expect(ids).toEqual(Array.from({ length: 78 }, (_, i) => `animal-${String(i + 1).padStart(2, '0')}`))
  expect(Object.keys(rawAnimalText).sort()).toEqual(ids)
  expect(new Set(ids.map((id) => rawAnimalText[id].animal)).size).toBe(78)
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

test('includes the added animals with their themes', () => {
  const cards = Object.values(rawAnimalText).map((t) => `${t.animal} · ${t.theme}`)
  expect(cards).toEqual(
    expect.arrayContaining([
      'Quokka · Look on the Bright Side', 'Hamster · Prepare', 'Pangolin · Soft Inside', 'Chameleon · See Both Sides',
      'Puffin · Belonging', 'Narwhal · Be Unusual', 'Octopus · Curiosity', 'Hippo · Take Up Space',
      'Lion · Lead with Heart', 'Giraffe · Look Ahead', 'Flamingo · Balance', 'Axolotl · Healing',
    ]),
  )
})

test('includes the third set of animals with their themes', () => {
  const cards = Object.values(rawAnimalText).map((t) => `${t.animal} · ${t.theme}`)
  expect(cards).toEqual(
    expect.arrayContaining([
      'Lemur · Soak Up the Sun', 'Pika · Small Comforts', 'Wombat · Solid Ground', 'Okapi · Quiet Gifts',
      'Manta Ray · Go with the Flow', 'Snow Leopard · Quiet Courage', 'Manatee · Be Gentle', 'Kiwi · Find Your Way',
      'Camel · Pace Yourself', 'Platypus · All of You', 'Pufferfish · Let It Pass', 'Shoebill · Stillness',
    ]),
  )
})

test('includes the fourth set of animals with their themes', () => {
  const cards = Object.values(rawAnimalText).map((t) => `${t.animal} · ${t.theme}`)
  expect(cards).toEqual(
    expect.arrayContaining([
      'Binturong · Your Own Charm', 'Orangutan · Find Shelter', 'Yak · Weather the Storm', 'Tapir · Follow Your Nose',
      'Tree Kangaroo · Try Something New', 'Jellyfish · Your Own Glow', 'Harp Seal · Let Others Care',
      'Kookaburra · Laugh Out Loud', 'Crane · Keep Hoping', 'Bat · Trust the Dark', 'Raccoon · Clean Slate',
    ]),
  )
})

test('includes the legendary animals with their themes', () => {
  const cards = Object.values(rawAnimalText).map((t) => `${t.animal} · ${t.theme}`)
  expect(cards).toEqual(
    expect.arrayContaining([
      'Phoenix · Rise Again', 'Griffin · Guard What Matters', 'Tanuki · Lighten Up', 'Tsuchinoko · Happy Surprises',
      'Komainu · You Are Safe', 'Unicorn · Let It Come to You', 'Kitsune · See Beyond',
    ]),
  )
})

test('no insects or spiders', () => {
  for (const { animal } of Object.values(rawAnimalText)) {
    const words = animal.toLowerCase().split(/\s+/)
    expect(words.filter((w) => BUGS.includes(w)), animal).toEqual([])
  }
})

test('every card has a colour family, 13 cards each', () => {
  for (const card of rawAnimalDeck) expect(ORACLE_PALETTE_NAMES, card.id).toContain(card.palette)
  for (const name of ORACLE_PALETTE_NAMES) {
    expect(rawAnimalDeck.filter((c) => c.palette === name).length, name).toBe(13)
  }
})
