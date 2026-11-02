import { describe, expect, test } from 'vitest'
import { buildSpreads, rawSpreadText, rawSpreads } from './deck.ts'
import { QUESTION_MAX_CHARS, countChars, missingQuestionNote, questionPlaceholder, truncateToLimit } from './question.ts'

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

describe('spread question texts', () => {
  const spreads = buildSpreads(rawSpreads, rawSpreadText)
  const byId = (id: string) => spreads.find((s) => s.id === id)!

  test('Choice has its own hint and missing-question note', () => {
    expect(questionPlaceholder(byId('choice'))).toBe('Name your two options, e.g. Stay or move?')
    expect(missingQuestionNote(byId('choice'))).toBe('A choice reading needs a question naming your two options.')
  })

  test('the other spreads keep the default hints', () => {
    expect(questionPlaceholder(null)).toBe('What would you like to know?')
    expect(questionPlaceholder(byId('yes-no'))).toBe('Ask a yes or no question')
    expect(missingQuestionNote(byId('yes-no'))).toBe('A yes / no reading needs a question.')
    for (const id of ['three-card', 'situation-action-outcome']) {
      expect(questionPlaceholder(byId(id))).toBe('What would you like to know?')
    }
  })
})
