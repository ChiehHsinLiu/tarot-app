import { describe, expect, test } from 'vitest'
import { ORACLE_PALETTE_NAMES } from './oracle.ts'
import { CARD_INK, CARD_INK_SOFT, ORACLE_PALETTES, contrastRatio } from './palette.ts'

describe('contrastRatio', () => {
  test('known values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2)
  })
})

describe('ORACLE_PALETTES', () => {
  test('defines every colour family', () => {
    expect(Object.keys(ORACLE_PALETTES).sort()).toEqual([...ORACLE_PALETTE_NAMES].sort())
  })

  test.each(ORACLE_PALETTE_NAMES)('card text is readable on %s', (name) => {
    expect(contrastRatio(CARD_INK, ORACLE_PALETTES[name].face)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(CARD_INK_SOFT, ORACLE_PALETTES[name].face)).toBeGreaterThanOrEqual(4.5)
  })

  test('every family has its own face colour', () => {
    const faces = Object.values(ORACLE_PALETTES).map((p) => p.face)
    expect(new Set(faces).size).toBe(faces.length)
  })
})
