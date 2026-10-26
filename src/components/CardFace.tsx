import type { CSSProperties, ReactNode } from 'react'
import { toRoman } from '../lib/deck.ts'
import type { Card, Suit } from '../lib/deck.ts'
import { TAROT_PALETTES } from '../lib/palette.ts'
import { PIP_LAYOUTS } from '../lib/pips.ts'
import { TAROT_ART } from '../lib/tarot-art.ts'

// The suit symbols the Ace to Ten repeat: soft line drawings in a 24x24 box,
// with round caps and joins, drawn as strokes.
const SYMBOLS: Record<Suit, ReactNode> = {
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

// The Ace to Ten: the suit's symbol once per pip, each 24x24 symbol scaled
// into its place in the 100x130 pip box. Lines come out about 2px on screen,
// a little bolder on the Ace's one large symbol.
function Pips({ suit, rank }: { suit: Suit; rank: number }) {
  return (
    <svg className="card-pips" viewBox="0 0 100 130" aria-hidden="true">
      {PIP_LAYOUTS[rank].map(({ x, y, size }) => (
        <g
          key={`${x},${y}`}
          className="card-pip"
          transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`}
          strokeWidth={(23 * (1.6 + 0.028 * size)) / size}
        >
          {SYMBOLS[suit]}
        </g>
      ))}
    </svg>
  )
}

type Props = { card: Card; reversed: boolean }

export function CardFace({ card, reversed }: Props) {
  const label = reversed ? `${card.name}, reversed` : card.name
  // The frame, corner dots and picture take the suit's colour; the outer border stays gold.
  const edge = { '--face-edge': TAROT_PALETTES[card.suit ?? 'major'].edge } as CSSProperties
  return (
    <div className="card">
      <div role="img" aria-label={label} className={reversed ? 'card-face reversed' : 'card-face'} style={edge}>
        <span className="card-numeral" aria-hidden="true">
          {card.arcana === 'major' ? toRoman(card.rank) : ''}
        </span>
        {card.suit && card.rank <= 10 ? (
          <Pips suit={card.suit} rank={card.rank} />
        ) : (
          // The major and court cards' drawings: trusted build-time files;
          // art-format.ts limits what they may contain.
          <span className="tarot-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: TAROT_ART[card.id] }} />
        )}
        <span className="card-name" aria-hidden="true">
          {card.name}
        </span>
      </div>
    </div>
  )
}
