import { describe, expect, test } from 'vitest'
import { buildCards, buildSpreads, rawSpreads, rawSpreadText, toRoman } from './deck.ts'

describe('toRoman', () => {
  test.each([
    [0, '0'],
    [8, 'VIII'],
    [11, 'XI'],
    [16, 'XVI'],
    [19, 'XIX'],
    [21, 'XXI'],
  ])('%i -> %s', (n, roman) => {
    expect(toRoman(n)).toBe(roman)
  })
})

describe('buildCards', () => {
  test('joins neutral data with text', () => {
    const [card] = buildCards(
      [{ id: 'major-16', arcana: 'major', rank: 16, yesNo: { upright: 'no', reversed: 'maybe' } }],
      {
        'major-16': {
          name: 'The Tower',
          keywords: ['upheaval'],
          upright: 'Up text',
          reversed: 'Rev text',
          yesNoNote: { upright: 'Up note', reversed: 'Rev note' },
        },
      },
    )
    expect(card).toEqual({
      id: 'major-16',
      arcana: 'major',
      suit: undefined,
      rank: 16,
      name: 'The Tower',
      keywords: ['upheaval'],
      meaning: { upright: 'Up text', reversed: 'Rev text' },
      yesNo: {
        upright: { verdict: 'no', note: 'Up note' },
        reversed: { verdict: 'maybe', note: 'Rev note' },
      },
    })
  })
})

describe('buildSpreads', () => {
  test('labels positions in order', () => {
    const spreads = buildSpreads(rawSpreads, rawSpreadText)
    expect(spreads.map((s) => s.name)).toEqual(['Yes / No', 'Three cards'])
    expect(spreads[1].positions.map((p) => p.label)).toEqual(['Past', 'Present', 'Future'])
  })
})
