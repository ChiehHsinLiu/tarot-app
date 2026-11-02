// Which picture a card shows for each style (tarot-deck-styles: Every Dachshund
// card has its own drawing).
import { describe, expect, test } from 'vitest'
import { cardPicture } from './card-picture.ts'

const art = {
  classic: { 'major-00': '<svg>classic fool</svg>', 'cups-12': '<svg>classic queen</svg>' },
  dachshund: { 'major-00': '<svg>dog fool</svg>', 'cups-03': '<svg>dog three</svg>', 'cups-12': '<svg>dog queen</svg>' },
}
const fool = { id: 'major-00', rank: 0 }
const three = { id: 'cups-03', suit: 'cups' as const, rank: 3 }
const queen = { id: 'cups-12', suit: 'cups' as const, rank: 12 }

describe('cardPicture', () => {
  test('Classic: drawings for majors and courts, pips for Ace to Ten', () => {
    expect(cardPicture(fool, 'classic', art)).toEqual({ kind: 'drawing', svg: '<svg>classic fool</svg>' })
    expect(cardPicture(queen, 'classic', art)).toEqual({ kind: 'drawing', svg: '<svg>classic queen</svg>' })
    expect(cardPicture(three, 'classic', art)).toEqual({ kind: 'pips' })
  })

  test('Dachshund: the dachshund drawing for every kind of card, number cards included', () => {
    expect(cardPicture(fool, 'dachshund', art)).toEqual({ kind: 'drawing', svg: '<svg>dog fool</svg>' })
    expect(cardPicture(three, 'dachshund', art)).toEqual({ kind: 'drawing', svg: '<svg>dog three</svg>' })
    expect(cardPicture(queen, 'dachshund', art)).toEqual({ kind: 'drawing', svg: '<svg>dog queen</svg>' })
  })

})
