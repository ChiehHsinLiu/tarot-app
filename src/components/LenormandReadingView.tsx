// Dev-only: a Lenormand reading. App.tsx lazy-loads it behind import.meta.env.DEV,
// so neither its code nor Lenormand.css reaches the public build.
import { Suspense, lazy, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import template from '../../prompts/lenormand.md?raw'
import type { Spread } from '../lib/deck.ts'
import type { Reading } from '../lib/draw.ts'
import { buildLenormandPrompt } from '../lib/lenormand.ts'
import type { LenormandCard } from '../lib/lenormand.ts'
import { CardFlip } from './CardFlip.tsx'
import { CopyForClaude } from './CopyForClaude.tsx'
import { LenormandCardFace } from './LenormandCardFace.tsx'
import './Lenormand.css'

// Guarded like ReadingView's: an unguarded lazy() call counts as a side effect,
// which would keep the dev-only Ask Claude chunk in the production build.
const AskClaude = import.meta.env.DEV
  ? lazy(() => import('./AskClaude.tsx').then((m) => ({ default: m.AskClaude })))
  : null

type Props = {
  reading: Reading
  spread: Spread
  cardsById: Map<string, LenormandCard>
  onNewReading: () => void
}

export function LenormandReadingView({ reading, spread, cardsById, onNewReading }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  const request = {
    lenormand: { spreadId: reading.spreadId, cards: reading.cards.map((c) => c.cardId), question: reading.question },
  }

  return (
    <section className="reading" aria-labelledby="reading-title">
      <h2 id="reading-title" ref={headingRef} tabIndex={-1}>
        Lenormand · {spread.name}
      </h2>
      <div className="reading-top-actions">
        <button type="button" className="secondary" onClick={onNewReading}>
          New reading
        </button>
      </div>
      {reading.question && <p className="asked">“{reading.question}”</p>}

      {spread.id === 'yes-no' && (
        <p className="lenormand-note">
          In Lenormand, the answer comes from how your two cards combine. Ask Claude for a yes or no.
        </p>
      )}

      <ol className={`spread spread-${reading.cards.length}`}>
        {reading.cards.map((drawn, index) => {
          const card = cardsById.get(drawn.cardId)!
          const position = spread.positions.find((p) => p.id === drawn.positionId)!
          return (
            // Turns over in order like a tarot reading, its text fading in as it lands.
            <li
              key={drawn.positionId}
              className="spread-slot reveal"
              style={{ '--flip-index': index } as CSSProperties}
            >
              <p className="position-label">{position.label}</p>
              <CardFlip index={index}>
                <LenormandCardFace card={card} />
              </CardFlip>
              <h3 className="card-title">
                {card.number} · {card.name}
              </h3>
              <p className="card-keywords">{card.keywords.join(' · ')}</p>
              <p className="card-meaning">{card.meaning}</p>
            </li>
          )
        })}
      </ol>

      <div className="reading-actions">
        <button type="button" className="primary" onClick={onNewReading}>
          New reading
        </button>
        <CopyForClaude prompt={buildLenormandPrompt(template, reading, spread, cardsById)} />
        {AskClaude && (
          <Suspense fallback={null}>
            <AskClaude body={request} />
          </Suspense>
        )}
      </div>
    </section>
  )
}
