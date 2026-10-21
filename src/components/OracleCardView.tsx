import { Suspense, lazy, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { OracleCard } from '../lib/oracle.ts'
import { ORACLE_PALETTES } from '../lib/palette.ts'

// Dev-only, like Ask Claude on tarot readings: Vite replaces DEV with false in
// production builds, so this import() and its code and styles never ship.
const AskClaudeOracle = import.meta.env.DEV
  ? lazy(() => import('./AskClaudeOracle.tsx').then((m) => ({ default: m.AskClaudeOracle })))
  : null

// A simple paw print stands in for card art on every oracle card, and marks the
// oracle choice on the home page.
export const PAW = (
  <>
    <path d="M12 12.5c-2.6 0-5.5 3.3-5.5 5.6 0 1.6 1.3 2.4 2.8 2.4 1.1 0 1.8-.5 2.7-.5s1.6.5 2.7.5c1.5 0 2.8-.8 2.8-2.4 0-2.3-2.9-5.6-5.5-5.6z" />
    <ellipse cx="8.6" cy="7.2" rx="1.7" ry="2.3" />
    <ellipse cx="15.4" cy="7.2" rx="1.7" ry="2.3" />
    <ellipse cx="4.9" cy="11.4" rx="1.6" ry="2.1" />
    <ellipse cx="19.1" cy="11.4" rx="1.6" ry="2.1" />
  </>
)

// The card's colour family as CSS variables, read by the face and the reading.
function familyStyle(card: OracleCard): CSSProperties {
  const { face, edge } = ORACLE_PALETTES[card.palette]
  return { '--family-face': face, '--family-edge': edge } as CSSProperties
}

export function OracleCardFace({ card }: { card: OracleCard }) {
  return (
    <div className="card">
      <div
        role="img"
        aria-label={`${card.animal}, ${card.theme}`}
        className="card-face oracle-face"
        data-palette={card.palette}
        style={familyStyle(card)}
      >
        <span className="oracle-face-theme" aria-hidden="true">
          {card.theme}
        </span>
        <svg className="card-symbol" viewBox="0 0 24 24" aria-hidden="true">
          {PAW}
        </svg>
        <span className="card-name" aria-hidden="true">
          {card.animal}
        </span>
      </div>
    </div>
  )
}

type Props = {
  card: OracleCard
  onDrawAgain: () => void
}

export function OracleCardView({ card, onDrawAgain }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  return (
    <section className="reading oracle-reading" aria-labelledby="oracle-title" style={familyStyle(card)}>
      <h2 id="oracle-title" ref={headingRef} tabIndex={-1}>
        Today's animal oracle
      </h2>

      <div className="oracle-slot">
        <OracleCardFace card={card} />
        <h3 className="card-title">
          {card.animal}
          <span className="card-title-orientation"> · {card.theme}</span>
        </h3>
        <p className="card-keywords">{card.keywords.join(' · ')}</p>
        <p className="oracle-message">{card.message}</p>
        <div className="oracle-reflect">
          <p className="position-label">Reflect</p>
          <p>{card.reflection}</p>
        </div>
        <p className="oracle-affirmation">“{card.affirmation}”</p>
      </div>

      <div className="reading-actions">
        <button type="button" className="primary" onClick={onDrawAgain}>
          Draw again
        </button>
      </div>

      {AskClaudeOracle && (
        <Suspense fallback={null}>
          <AskClaudeOracle cardId={card.id} />
        </Suspense>
      )}
    </section>
  )
}
