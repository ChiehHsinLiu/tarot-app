// Storybook colours that components set as CSS variables. No React imports, so
// contrast can be unit-tested in Node.
import type { OraclePalette } from './oracle.ts'

// Text on every card face, in both light and dark mode: cards stay cream or pastel.
export const CARD_INK = '#2f2630'
// Smaller secondary text on a card face, such as an oracle card's theme.
export const CARD_INK_SOFT = '#55474f'

// face: the card's background; edge: its inner frame and symbol lines.
export const ORACLE_PALETTES: Record<OraclePalette, { face: string; edge: string }> = {
  peach: { face: '#fbe1cf', edge: '#d98c63' },
  sage: { face: '#dfead3', edge: '#7f9d6b' },
  sky: { face: '#d8e8f3', edge: '#6c97b8' },
  lavender: { face: '#e6dcf2', edge: '#9b84c2' },
  butter: { face: '#f7ecc2', edge: '#c4a13f' },
  rose: { face: '#f6d9e1', edge: '#c97a8f' },
}

// WCAG 2 contrast ratio between two #rrggbb colours.
export function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)]
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
