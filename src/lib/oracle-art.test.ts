// The animal oracle drawings against the shared drawing format (art-format.ts),
// plus the bad samples that prove the checker rejects unsafe SVG.
import { describe, expect, test } from 'vitest'
import { MAX_BYTES, ROOT, formatProblems } from './art-format.ts'
import { ORACLE_ART } from './oracle-art.ts'
import { rawAnimalDeck } from './oracle.ts'

const deckIds = rawAnimalDeck.map((c) => c.id)
const GOOD = `${ROOT}<circle class="art-fill art-line" cx="50" cy="50" r="30"/><circle class="art-ink" cx="45" cy="45" r="2"/></svg>`

describe('formatProblems', () => {
  test('accepts a minimal valid drawing', () => {
    expect(formatProblems(GOOD)).toEqual([])
  })

  test.each([
    ['a script', GOOD.replace('</svg>', '<script>alert(1)</script></svg>'), 'element <script>'],
    ['an event handler', GOOD.replace('r="30"', 'r="30" onload="alert(1)"'), 'attribute onload'],
    ['a hard-coded colour', GOOD.replace('r="30"', 'r="30" fill="#f00"'), 'attribute fill'],
    ['text', GOOD.replace('</svg>', '<text x="1" y="1">Fox</text></svg>'), 'element <text>'],
    ['an unknown class', GOOD.replace('art-fill', 'art-neon'), 'class art-neon'],
    ['a link', GOOD.replace('</svg>', '<use href="#a"/></svg>'), 'element <use>'],
    ['an inline style', GOOD.replace('r="30"', 'r="30" style="fill:red"'), 'attribute style'],
    ['an oversized file', GOOD.replace('</svg>', '<g>' + ' '.repeat(MAX_BYTES) + '</g></svg>'), `larger than ${MAX_BYTES} bytes`],
    ['no eyes', GOOD.replace(/<circle class="art-ink"[^>]*>/, ''), 'no art-ink shape (eyes)'],
    ['a different root', GOOD.replace('viewBox="0 0 100 100"', 'viewBox="0 0 24 24"'), 'root <svg> is not the standard one'],
    ['loose text', GOOD.replace('</svg>', 'Fox</svg>'), 'has text, a comment, or CDATA'],
    ['a comment', GOOD.replace('</svg>', '<!-- hi --></svg>'), 'has text, a comment, or CDATA'],
  ])('rejects %s', (_, svg, problem) => {
    expect(formatProblems(svg)).toContain(problem)
  })
})

describe('ORACLE_ART', () => {
  test('has exactly one drawing per card in the deck', () => {
    expect(Object.keys(ORACLE_ART).sort()).toEqual([...deckIds].sort())
  })

  test.each(Object.keys(ORACLE_ART).sort())('%s follows the drawing format', (id) => {
    expect(formatProblems(ORACLE_ART[id])).toEqual([])
  })

  test('no two drawings are the same', () => {
    const drawings = Object.values(ORACLE_ART).map((s) => s.trim())
    expect(new Set(drawings).size).toBe(drawings.length)
  })
})
