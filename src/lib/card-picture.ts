// Which picture a face-up tarot card shows for a style: a drawing (inlined
// SVG) or the Classic suit pips laid out by pips.ts.
import type { Card } from './deck.ts'
import type { TarotStyle } from './tarot-style.ts'

export type CardPicture = { kind: 'drawing'; svg: string } | { kind: 'pips' }

type Drawings = Record<string, string>

export function cardPicture(
  card: Pick<Card, 'id' | 'suit' | 'rank'>,
  style: TarotStyle,
  art: { classic: Drawings; dachshund: Drawings },
): CardPicture {
  // Every Dachshund card, the Ace to Ten included, has its own drawing.
  if (style === 'dachshund') return { kind: 'drawing', svg: art.dachshund[card.id] }
  if (card.suit && card.rank <= 10) return { kind: 'pips' }
  return { kind: 'drawing', svg: art.classic[card.id] }
}
