import type { ReactNode } from 'react'
import { toRoman } from '../lib/deck.ts'
import type { Card, Suit } from '../lib/deck.ts'

const SYMBOLS: Record<Suit | 'major', ReactNode> = {
  major: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z" />,
  wands: <path d="M7 21L17 3M15 7l3-.5M11.5 13l-3.5.5M13 10l2.5 1.5" />,
  cups: <path d="M6 4h12v3a6 6 0 0 1-12 0zM12 13v5M8 21h8" />,
  swords: <path d="M12 2l2 3v10h-4V5zM7 15h10M12 15v6" />,
  pentacles: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 5l4.11 12.66L5.34 9.84h13.32L7.89 17.66z" />
    </>
  ),
}

// The major arcana star also marks the tarot choice on the home page.
export const TAROT_SYMBOL = SYMBOLS.major

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
