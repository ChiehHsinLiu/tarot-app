import type { Spread } from '../lib/deck.ts'
import { CardBack } from './CardFlip.tsx'

// The chosen spread laid face down on the reading mat, just above Draw: one back
// per position, with its label, or an empty mat before a spread is chosen.
// Decorative, since the spread choice already says the same thing.
export function SpreadPreview({ spread }: { spread: Spread | null }) {
  return (
    <div className="spread-preview" aria-hidden="true">
      {spread?.positions.map((position) => (
        <div key={position.id} className="preview-slot">
          <span className="position-label">{position.label}</span>
          <CardBack />
        </div>
      ))}
    </div>
  )
}
