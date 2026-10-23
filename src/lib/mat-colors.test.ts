/// <reference types="node" />
// The reading mat's colours live in styles/theme.css; read them from there so the
// test checks what ships. (Vitest stubs CSS imports, so the file is read directly.)
import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
import { contrastRatio } from './palette.ts'

const css = readFileSync(new URL('../styles/theme.css', import.meta.url), 'utf8')

function token(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6});`, 'i'))
  if (!match) throw new Error(`--${name} not found in styles/theme.css`)
  return match[1]
}

test.each(['mat-bg', 'mat-sheen'])('position labels are readable on %s', (cloth) => {
  expect(contrastRatio(token('mat-label'), token(cloth))).toBeGreaterThanOrEqual(4.5)
})
