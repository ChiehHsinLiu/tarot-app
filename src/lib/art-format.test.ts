// The Dachshund deck's drawing format: the shared allow-list with a 5 KB cap.
import { describe, expect, test } from 'vitest'
import { DACHSHUND_MAX_BYTES, MAX_BYTES, ROOT, dachshundProblems, formatProblems } from './art-format.ts'

const eye = '<circle class="art-ink" cx="50" cy="50" r="1.4"/>'
const svgOf = (body: string) => `${ROOT}\n  ${body}\n</svg>\n`
// Pads a drawing with harmless shapes until it is exactly n bytes.
function sized(n: number) {
  const base = svgOf(eye)
  const pad = '<circle class="art-fill" cx="1" cy="1" r="1"/>'
  let body = eye
  while (new TextEncoder().encode(svgOf(body + pad)).length <= n) body += pad
  const short = n - new TextEncoder().encode(svgOf(body)).length
  // Spaces between tags are allowed, so they make up the last few bytes.
  const svg = svgOf(body + ' '.repeat(short))
  expect(new TextEncoder().encode(svg).length).toBe(n)
  expect(base.length).toBeLessThan(n)
  return svg
}

describe('dachshundProblems', () => {
  test('a small valid drawing passes', () => {
    expect(dachshundProblems(svgOf(eye + '<path class="art-fill art-line" d="M10 10 H90"/>'))).toEqual([])
  })

  test('allows up to 5 KB, more than the 3 KB the other drawings get', () => {
    const svg = sized(DACHSHUND_MAX_BYTES)
    expect(dachshundProblems(svg)).toEqual([])
    expect(formatProblems(svg)).toContain(`larger than ${MAX_BYTES} bytes`)
  })

  test('allows the scene colours, which the other drawings may not use', () => {
    const svg = svgOf(eye + '<rect class="art-coat art-line" x="1" y="1" width="9" height="9"/><circle class="art-sun" cx="5" cy="5" r="3"/>')
    expect(dachshundProblems(svg)).toEqual([])
    expect(formatProblems(svg)).toEqual(expect.arrayContaining(['class art-coat', 'class art-sun']))
  })

  test('rejects anything over 5 KB', () => {
    expect(dachshundProblems(sized(DACHSHUND_MAX_BYTES + 1))).toContain(`larger than ${DACHSHUND_MAX_BYTES} bytes`)
  })

  test('keeps the allow-list: no text, no other elements, classes or colours, and eyes required', () => {
    expect(dachshundProblems(svgOf(eye + '<text>Dog</text>'))).toEqual(
      expect.arrayContaining(['element <text>', 'has text, a comment, or CDATA']),
    )
    expect(dachshundProblems(svgOf(eye + '<circle class="dog" cx="1" cy="1" r="1"/>'))).toContain('class dog')
    expect(dachshundProblems(svgOf(eye + '<circle fill="red" cx="1" cy="1" r="1"/>'))).toContain('attribute fill')
    expect(dachshundProblems(svgOf('<circle class="art-fill" cx="1" cy="1" r="1"/>'))).toContain('no art-ink shape (eyes)')
  })
})
