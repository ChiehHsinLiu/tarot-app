// The drawing format every animal oracle SVG must follow. The drawings are
// inlined into the page, so this allow-list is what keeps them safe and
// lets their colours come only from the card's family.
import { describe, expect, test } from 'vitest'
import { ORACLE_ART } from './oracle-art.ts'
import { rawAnimalDeck } from './oracle.ts'

const ROOT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" focusable="false">'
const ELEMENTS = new Set(['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon'])
const ATTRIBUTES = new Set([
  'xmlns', 'viewBox', 'focusable', 'class', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y',
  'width', 'height', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
])
const CLASSES = new Set(['art-fill', 'art-deep', 'art-light', 'art-ink', 'art-blush', 'art-line'])
const MAX_BYTES = 3072

// Returns every way the drawing breaks the format; empty when it is valid.
function formatProblems(svg: string): string[] {
  const problems: string[] = []
  const text = svg.trim()
  if (!text.startsWith(ROOT)) problems.push('root <svg> is not the standard one')
  if (!text.endsWith('</svg>')) problems.push('does not end with </svg>')
  if (new TextEncoder().encode(svg).length > MAX_BYTES) problems.push(`larger than ${MAX_BYTES} bytes`)
  // Anything between tags must be whitespace: no text content, comments, or CDATA.
  if (/>[^<]*[^\s<][^<]*</.test(text) || /<!/.test(text)) problems.push('has text, a comment, or CDATA')
  let hasInk = false
  for (const [, name, attrs] of text.matchAll(/<([A-Za-z][\w:-]*)([^>]*)>/g)) {
    if (!ELEMENTS.has(name)) problems.push(`element <${name}>`)
    const leftover = attrs.replace(/\s*\/?$/, '').replace(/\s+([\w:-]+)="([^"]*)"/g, (_, attr: string, value: string) => {
      if (!ATTRIBUTES.has(attr)) problems.push(`attribute ${attr}`)
      if (attr === 'class') {
        for (const c of value.split(/\s+/)) {
          if (!CLASSES.has(c)) problems.push(`class ${c}`)
          if (c === 'art-ink') hasInk = true
        }
      }
      return ''
    })
    if (leftover.trim()) problems.push(`unparsed attributes on <${name}>: ${leftover.trim()}`)
  }
  if (!hasInk) problems.push('no art-ink shape (eyes)')
  return problems
}

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
