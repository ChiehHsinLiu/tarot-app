// Data-integrity checks for the tarot-deck and tarot-spreads requirements.
import { describe, expect, test } from 'vitest'
import { rawCards, rawCardText, rawSpreads, rawSpreadText } from './deck.ts'
import type { Orientation } from './deck.ts'

const SUITS = ['wands', 'cups', 'swords', 'pentacles'] as const
const ORIENTATIONS: Orientation[] = ['upright', 'reversed']
const VERDICTS = ['yes', 'no', 'maybe']
const MAX_MEANING = 400
const MAX_NOTE = 140

describe('deck structure', () => {
  test('78 unique cards: 22 major, 14 per suit', () => {
    const ids = rawCards.map((c) => c.id)
    expect(ids).toHaveLength(78)
    expect(new Set(ids).size).toBe(78)
    expect(rawCards.filter((c) => c.arcana === 'major').map((c) => c.rank)).toEqual(
      Array.from({ length: 22 }, (_, i) => i),
    )
    for (const suit of SUITS) {
      expect(rawCards.filter((c) => c.suit === suit).map((c) => c.rank)).toEqual(
        Array.from({ length: 14 }, (_, i) => i + 1),
      )
    }
  })

  test('Strength is 8 and Justice is 11', () => {
    expect(rawCardText['major-08']?.name).toBe('Strength')
    expect(rawCardText['major-11']?.name).toBe('Justice')
  })
})

// Returns a list of problems per card so a failure shows exactly what is missing.
function problemsFor(id: string): string[] {
  const problems: string[] = []
  const card = rawCards.find((c) => c.id === id)!
  const text = rawCardText[id]
  if (!text) return ['no English text']
  if (!text.name?.trim()) problems.push('name')
  if (!Array.isArray(text.keywords) || text.keywords.length === 0 || text.keywords.some((k) => !k.trim()))
    problems.push('keywords')
  for (const o of ORIENTATIONS) {
    const meaning = text[o]
    if (!meaning?.trim()) problems.push(`${o} meaning`)
    else if (meaning.length > MAX_MEANING) problems.push(`${o} meaning is ${meaning.length} chars`)
    const note = text.yesNoNote?.[o]
    if (!note?.trim()) problems.push(`${o} yes/no note`)
    else if (note.length > MAX_NOTE) problems.push(`${o} yes/no note is ${note.length} chars`)
    if (!VERDICTS.includes(card.yesNo?.[o] as string)) problems.push(`${o} verdict`)
  }
  return problems
}

describe('card content', () => {
  test.each(['major', ...SUITS])('%s cards are complete', (group) => {
    const ids = rawCards.filter((c) => (group === 'major' ? c.arcana === 'major' : c.suit === group)).map((c) => c.id)
    const incomplete = Object.fromEntries(
      ids.map((id) => [id, problemsFor(id)]).filter(([, problems]) => problems.length > 0),
    )
    expect(incomplete).toEqual({})
  })

  test('no text for unknown card ids', () => {
    const known = new Set(rawCards.map((c) => c.id))
    expect(Object.keys(rawCardText).filter((id) => !known.has(id))).toEqual([])
  })
})

describe('spreads', () => {
  test('every spread and position has English text', () => {
    for (const spread of rawSpreads) {
      expect(rawSpreadText[spread.id]?.name).toBeTruthy()
      for (const p of spread.positions) expect(rawSpreadText[spread.id].positions[p.id]).toBeTruthy()
    }
  })
})
