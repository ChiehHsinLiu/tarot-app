import { describe, expect, test } from 'vitest'
import { QUESTION_MAX_CHARS, countChars, truncateToLimit } from './question.ts'

describe('countChars', () => {
  test.each([
    ['', 0],
    ['Should I take the new job offer?', 32],
    ['🙂', 1],
    ['🇹🇼', 1], // flag: two regional-indicator code points
    ['👩‍👩‍👧', 1], // family: joined with zero-width joiners
    ['👍🏽', 1], // emoji with skin-tone modifier
    ['café', 4], // precomposed é
    ['café', 4], // e + combining acute accent
    ['塔羅牌', 3],
  ])('%j has %i characters', (text, expected) => {
    expect(countChars(text)).toBe(expected)
  })
})

describe('truncateToLimit', () => {
  test('defaults to 300 characters', () => {
    expect(QUESTION_MAX_CHARS).toBe(300)
    expect(countChars(truncateToLimit('a'.repeat(400)))).toBe(300)
  })

  test('leaves text within the limit unchanged', () => {
    expect(truncateToLimit('hello', 300)).toBe('hello')
    expect(truncateToLimit('a'.repeat(300))).toBe('a'.repeat(300))
  })

  test.each([
    ['🇹🇼', '🇹🇼🇹🇼🇹🇼'],
    ['👩‍👩‍👧', '👩‍👩‍👧👩‍👩‍👧👩‍👩‍👧'],
    ['é', 'ééé'],
  ])('never splits %j at the limit', (unit, text) => {
    expect(truncateToLimit(text, 2)).toBe(unit + unit)
  })

  test('a 300-character limit keeps whole emoji', () => {
    const text = 'a'.repeat(299) + '🇹🇼' + 'b'
    const out = truncateToLimit(text)
    expect(out).toBe('a'.repeat(299) + '🇹🇼')
    expect(countChars(out)).toBe(300)
  })
})
