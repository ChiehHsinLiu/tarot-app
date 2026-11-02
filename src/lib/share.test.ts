import { describe, expect, test } from 'vitest'
import { rawCards, rawSpreads } from './deck.ts'
import { draw } from './draw.ts'
import type { Reading } from './draw.ts'
import { cryptoRandomInt } from './random.ts'
import { decodeReading, encodeReading, shareUrl } from './share.ts'

const deckIds = rawCards.map((c) => c.id)
const cardIds = new Set(deckIds)
const decode = (fragment: string) => decodeReading(fragment, rawSpreads, cardIds)

const threeCard: Reading = {
  spreadId: 'three-card',
  question: '',
  cards: [
    { cardId: 'swords-03', positionId: 'past', reversed: false },
    { cardId: 'major-13', positionId: 'present', reversed: true },
    { cardId: 'cups-01', positionId: 'future', reversed: false },
  ],
}

describe('encodeReading', () => {
  test('spec example: three-card link', () => {
    expect(encodeReading(threeCard, { includeQuestion: false })).toBe(
      '#/r/v1/three-card/swords-03.major-13r.cups-01',
    )
  })

  test('spec example: question is percent-encoded', () => {
    const reading: Reading = { ...threeCard, question: 'Will it work?' }
    expect(encodeReading(reading, { includeQuestion: true })).toMatch(/\?q=Will%20it%20work%3F$/)
  })

  test('never emits q when includeQuestion is false', () => {
    const reading: Reading = { ...threeCard, question: 'Private question' }
    expect(encodeReading(reading, { includeQuestion: false })).not.toContain('q=')
  })

  test('omits q for an empty question even when included', () => {
    expect(encodeReading(threeCard, { includeQuestion: true })).not.toContain('?')
  })

  test('a Classic reading has no deck marker', () => {
    expect(encodeReading(threeCard, { includeQuestion: false, style: 'classic' })).toBe(
      '#/r/v1/three-card/swords-03.major-13r.cups-01',
    )
  })

  test('a Dachshund reading adds d=dachshund before the question', () => {
    const reading = { ...threeCard, question: 'Will it work?' }
    expect(encodeReading(reading, { includeQuestion: true, style: 'dachshund' })).toBe(
      '#/r/v1/three-card/swords-03.major-13r.cups-01?d=dachshund&q=Will%20it%20work%3F',
    )
    expect(encodeReading(reading, { includeQuestion: false, style: 'dachshund' })).toBe(
      '#/r/v1/three-card/swords-03.major-13r.cups-01?d=dachshund',
    )
  })
})

describe('deck marker', () => {
  test('d=dachshund decodes as the Dachshund style', () => {
    expect(decode('#/r/v1/three-card/swords-03.major-13r.cups-01?d=dachshund&q=Will%20it%20work%3F')).toEqual({
      kind: 'reading',
      reading: { ...threeCard, question: 'Will it work?' },
      style: 'dachshund',
    })
  })

  test('a link without d is Classic', () => {
    expect(decode('#/r/v1/three-card/swords-03.major-13r.cups-01')).toMatchObject({ style: 'classic' })
  })
})

describe('round trip', () => {
  const questions = ['', 'Should I take the new job offer?', 'Will it work? 🇹🇼 👩‍👩‍👧', '我應該接受這份工作嗎？', 'a+b & c=d #1 /path?x']

  test.each(rawSpreads.map((s) => s.id))('%s readings decode to the same reading', (spreadId) => {
    const spread = rawSpreads.find((s) => s.id === spreadId)!
    for (const question of questions) {
      for (let i = 0; i < 50; i++) {
        const reading = draw(spread, deckIds, question, cryptoRandomInt)
        for (const style of ['classic', 'dachshund'] as const) {
          expect(decode(encodeReading(reading, { includeQuestion: true, style }))).toEqual({ kind: 'reading', reading, style })
          expect(decode(encodeReading(reading, { includeQuestion: false, style }))).toEqual({
            kind: 'reading',
            reading: { ...reading, question: '' },
            style,
          })
        }
      }
    }
  })
})

describe('shareUrl', () => {
  test('joins origin, path and fragment', () => {
    expect(
      shareUrl('#/r/v1/yes-no/major-01', { origin: 'https://chiehhsinliu.github.io', pathname: '/tarot-app/' }),
    ).toBe('https://chiehhsinliu.github.io/tarot-app/#/r/v1/yes-no/major-01')
  })
})

describe('decodeReading rejections', () => {
  test.each([
    ['', 'empty'],
    ['#', 'bare hash'],
    ['#/about', 'other route'],
    ['#r/v1/yes-no/major-01', 'missing leading slash'],
  ])('%j is not a reading link (%s)', (fragment) => {
    expect(decode(fragment)).toEqual({ kind: 'none' })
  })

  test.each([
    ['#/r/v2/yes-no/major-01', 'unsupported version'],
    ['#/r/V1/yes-no/major-01', 'version is case-sensitive'],
    ['#/r/v1/celtic-cross/major-01', 'unknown spread'],
    ['#/r/v1/yes-no/major-99', 'unknown card'],
    ['#/r/v1/yes-no/Major-01', 'card ids are case-sensitive'],
    ['#/r/v1/yes-no/major-01.major-02', 'too many cards'],
    ['#/r/v1/three-card/major-01.major-02', 'too few cards'],
    ['#/r/v1/three-card/major-01.major-02.major-01r', 'repeated card'],
    ['#/r/v1/yes-no/major-01x', 'malformed suffix'],
    ['#/r/v1/yes-no/major-01rr', 'double reversal suffix'],
    ['#/r/v1/yes-no/major-1', 'one-digit rank'],
    ['#/r/v1/yes-no/', 'no cards'],
    ['#/r/v1/yes-no', 'missing card segment'],
    ['#/r/v1/yes-no/major-01/extra', 'extra path segment'],
    ['#/r/v1/yes-no/major-01?q=' + 'a'.repeat(301), 'question over 300 characters'],
    ['#/r/v1/yes-no/major-01?q=' + encodeURIComponent('🇹🇼'.repeat(301)), 'question over 300 emoji'],
    ['#/r/v1/yes-no/major-01?d=poodle', 'unknown deck'],
    ['#/r/v1/yes-no/major-01?d=', 'empty deck'],
    ['#/r/v1/yes-no/major-01?d=Dachshund', 'deck is case-sensitive'],
    ['#/r/v1/yes-no/major-01?d=classic', 'Classic is never written as d'],
  ])('%j is invalid (%s)', (fragment) => {
    expect(decode(fragment)).toEqual({ kind: 'invalid' })
  })

  test('a question of exactly 300 characters is accepted', () => {
    const result = decode('#/r/v1/yes-no/major-01?q=' + encodeURIComponent('🇹🇼'.repeat(300)))
    expect(result.kind).toBe('reading')
  })
})

// v1 links are a public contract: once shared they must keep decoding to the
// same reading. If this fails after a data change, introduce a new version.
describe('pinned v1 links', () => {
  test.each<[string, Reading]>([
    [
      '#/r/v1/yes-no/major-00',
      { spreadId: 'yes-no', question: '', cards: [{ cardId: 'major-00', positionId: 'answer', reversed: false }] },
    ],
    [
      '#/r/v1/yes-no/pentacles-14r?q=Will%20it%20work%3F',
      {
        spreadId: 'yes-no',
        question: 'Will it work?',
        cards: [{ cardId: 'pentacles-14', positionId: 'answer', reversed: true }],
      },
    ],
    ['#/r/v1/three-card/swords-03.major-13r.cups-01', threeCard],
    [
      '#/r/v1/three-card/wands-01r.major-21.swords-11r',
      {
        spreadId: 'three-card',
        question: '',
        cards: [
          { cardId: 'wands-01', positionId: 'past', reversed: true },
          { cardId: 'major-21', positionId: 'present', reversed: false },
          { cardId: 'swords-11', positionId: 'future', reversed: true },
        ],
      },
    ],
  ])('%s', (fragment, reading) => {
    expect(decode(fragment)).toEqual({ kind: 'reading', reading, style: 'classic' })
  })
})
