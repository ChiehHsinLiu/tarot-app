import type { ReactNode } from 'react'
import { toRoman } from '../lib/deck.ts'
import type { Card, Suit } from '../lib/deck.ts'

// Soft line drawings in a 24x24 box: round caps and joins, drawn as strokes.
const SYMBOLS: Record<Suit | 'major', ReactNode> = {
  // A four-point sparkle with two small companions.
  major: (
    <>
      <path d="M12 3.5c.7 4.6 2.9 6.8 7.5 7.5-4.6.7-6.8 2.9-7.5 7.5-.7-4.6-2.9-6.8-7.5-7.5 4.6-.7 6.8-2.9 7.5-7.5z" />
      <path d="M19 3.5v3M17.5 5h3M5 17.5v3M3.5 19h3" />
    </>
  ),
  // A budding branch.
  wands: (
    <>
      <path d="M7 21.5L16.5 3" />
      <path d="M12.6 10.5c1.8-.4 3.3.1 4.4 1.5-1.8.5-3.3 0-4.4-1.5zM10 15.5c-1.8-.2-3.2.5-4 2 1.8.2 3.2-.5 4-2zM15.2 5.5c.9-1.1 2.2-1.6 3.6-1.3-.6 1.4-1.9 2-3.6 1.3z" />
    </>
  ),
  // A rounded goblet.
  cups: (
    <>
      <path d="M6 4.5h12c0 4.8-2.4 8-6 8s-6-3.2-6-8z" />
      <path d="M12 12.5v5M8.5 20.5c0-1.7 1.6-3 3.5-3s3.5 1.3 3.5 3z" />
    </>
  ),
  // A rounded blade with a curled crossguard.
  swords: (
    <>
      <path d="M12 2.5c1.3 1.6 2 3.2 2 5v7.5h-4V7.5c0-1.8.7-3.4 2-5z" />
      <path d="M6.5 15c1.5.9 3.3 1.3 5.5 1.3s4-.4 5.5-1.3M12 16.3v3.2" />
      <circle cx="12" cy="20.8" r="1.3" />
    </>
  ),
  // A circle around a five-point star.
  pentacles: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 5.8l1.7 4.4 4.6.2-3.6 2.9 1.3 4.5L12 15.2l-3.9 2.6 1.2-4.5-3.6-2.9 4.6-.2z" />
    </>
  ),
}

type Props = { card: Card; reversed: boolean }

export function CardFace({ card, reversed }: Props) {
  const label = reversed ? `${card.name}, reversed` : card.name
  return (
    <div className="card">
      <div role="img" aria-label={label} className={reversed ? 'card-face reversed' : 'card-face'}>
        <span className="card-numeral" aria-hidden="true">
          {card.arcana === 'major' ? toRoman(card.rank) : ''}
        </span>
        <svg className="card-symbol" viewBox="0 0 24 24" aria-hidden="true">
          {SYMBOLS[card.suit ?? 'major']}
        </svg>
        <span className="card-name" aria-hidden="true">
          {card.name}
        </span>
      </div>
    </div>
  )
}
