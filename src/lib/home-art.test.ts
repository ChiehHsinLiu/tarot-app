// The home windows against the window drawing format (art-format.ts), plus the
// rules that only windows have.
import { describe, expect, test } from 'vitest'
import { WINDOW_MAX_BYTES, WINDOW_ROOT, windowProblems } from './art-format.ts'
import { HOME_ART } from './home-art.ts'

const GOOD = `${WINDOW_ROOT}<path class="win-sky" d="M20 168 V80 A60 60 0 0 1 140 80 V168 Z"/><g class="win-day"><circle class="win-glow" cx="110" cy="50" r="10"/></g><g class="win-night"><circle class="win-glow" cx="110" cy="50" r="8"/></g></svg>`

describe('windowProblems', () => {
  test('accepts a minimal valid window', () => {
    expect(windowProblems(GOOD)).toEqual([])
  })

  test.each([
    ['no day sky', GOOD.replace('<g class="win-day">', '<g>'), 'no <g class="win-day"> group'],
    ['no night sky', GOOD.replace('<g class="win-night">', '<g>'), 'no <g class="win-night"> group'],
    ['the card viewBox', GOOD.replace('viewBox="0 0 160 180"', 'viewBox="0 0 100 100"'), 'root <svg> is not the standard one'],
    ['an unknown class', GOOD.replace('win-sky', 'win-neon'), 'class win-neon'],
    ['a script', GOOD.replace('</svg>', '<script>alert(1)</script></svg>'), 'element <script>'],
    ['a hard-coded colour', GOOD.replace('r="10"', 'r="10" fill="#ff0"'), 'attribute fill'],
    ['an oversized file', GOOD.replace('</svg>', '<g>' + ' '.repeat(WINDOW_MAX_BYTES) + '</g></svg>'), `larger than ${WINDOW_MAX_BYTES} bytes`],
  ])('rejects %s', (_, svg, problem) => {
    expect(windowProblems(svg)).toContain(problem)
  })
})

describe('HOME_ART', () => {
  test('has one window per home choice', () => {
    expect(Object.keys(HOME_ART).sort()).toEqual(['window-oracle', 'window-tarot'])
  })

  test.each(Object.keys(HOME_ART).sort())('%s follows the window format', (id) => {
    expect(windowProblems(HOME_ART[id])).toEqual([])
  })
})
