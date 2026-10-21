import type { LenormandCard } from '../lib/lenormand.ts'

// Placeholder face until the drawings arrive: the card's number in the frame.
export function LenormandCardFace({ card }: { card: LenormandCard }) {
  return (
    <div className="card">
      <div role="img" aria-label={`${card.number}, ${card.name}`} className="card-face lenormand-face">
        <span className="card-numeral" aria-hidden="true" />
        <span className="lenormand-number" aria-hidden="true">
          {card.number}
        </span>
        <span className="card-name" aria-hidden="true">
          {card.name}
        </span>
      </div>
    </div>
  )
}
