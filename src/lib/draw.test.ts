import { describe, expect, test } from 'vitest'
import { rawCards, rawSpreads } from './deck.ts'
import { draw } from './draw.ts'
import { cryptoRandomInt, seededRandomInt } from './random.ts'

const deckIds = rawCards.map((c) => c.id)
const yesNo = rawSpreads.find((s) => s.id === 'yes-no')!
const threeCard = rawSpreads.find((s) => s.id === 'three-card')!

describe('draw', () => {
  test('yes-no draws one card into the answer position', () => {
    const reading = draw(yesNo, deckIds, 'Will it work?', cryptoRandomInt)
    expect(reading.spreadId).toBe('yes-no')
    expect(reading.question).toBe('Will it work?')
    expect(reading.cards.map((c) => c.positionId)).toEqual(['answer'])
  })

  test('three-card draws past, present, future in order', () => {
    const reading = draw(threeCard, deckIds, '', cryptoRandomInt)
    expect(reading.cards.map((c) => c.positionId)).toEqual(['past', 'present', 'future'])
  })

  test('never repeats a card within a reading', () => {
    for (let i = 0; i < 2000; i++) {
      const ids = draw(threeCard, deckIds, '', cryptoRandomInt).cards.map((c) => c.cardId)
      expect(new Set(ids).size).toBe(3)
      for (const id of ids) expect(deckIds).toContain(id)
    }
  })

  test('does not mutate the deck', () => {
    const copy = [...deckIds]
    draw(threeCard, copy, '', cryptoRandomInt)
    expect(copy).toEqual(deckIds)
  })

  test('is deterministic for a fixed seed', () => {
    const a = draw(threeCard, deckIds, 'q', seededRandomInt(123))
    const b = draw(threeCard, deckIds, 'q', seededRandomInt(123))
    expect(a).toEqual(b)
    expect(a).toMatchInlineSnapshot(`
      {
        "cards": [
          {
            "cardId": "swords-12",
            "positionId": "past",
            "reversed": false,
          },
          {
            "cardId": "cups-04",
            "positionId": "present",
            "reversed": false,
          },
          {
            "cardId": "wands-09",
            "positionId": "future",
            "reversed": true,
          },
        ],
        "question": "q",
        "spreadId": "three-card",
      }
    `)
  })

  test('rejects a spread larger than the deck', () => {
    expect(() => draw(threeCard, ['a', 'b'], '', cryptoRandomInt)).toThrow(RangeError)
  })
})
