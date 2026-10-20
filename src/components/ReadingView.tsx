import { useEffect, useRef } from 'react'
import type { Card, Spread, Verdict } from '../lib/deck.ts'
import type { Reading } from '../lib/draw.ts'
import { CardFace } from './CardFace.tsx'
import { CopyForClaude } from './CopyForClaude.tsx'
import { SharePanel } from './SharePanel.tsx'

const VERDICT_WORDS: Record<Verdict, string> = { yes: 'Yes', no: 'No', maybe: 'Maybe' }

type Props = {
  reading: Reading
  spread: Spread
  cardsById: Map<string, Card>
  // True when the reading came from a share link rather than the user's own draw.
  shared: boolean
  onNewReading: () => void
}

export function ReadingView({ reading, spread, cardsById, shared, onNewReading }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  const first = reading.cards[0]
  const verdict = spread.showsVerdict
    ? cardsById.get(first.cardId)!.yesNo[first.reversed ? 'reversed' : 'upright']
    : null

  return (
    <section className="reading" aria-labelledby="reading-title">
      <h2 id="reading-title" ref={headingRef} tabIndex={-1}>
        {shared ? `Shared reading · ${spread.name}` : spread.name}
      </h2>
      {reading.question && <p className="asked">“{reading.question}”</p>}

      {verdict && (
        <div className={`verdict verdict-${verdict.verdict}`}>
          <p className="verdict-word">{VERDICT_WORDS[verdict.verdict]}</p>
          <p className="verdict-note">{verdict.note}</p>
        </div>
      )}

      <ol className={`spread spread-${reading.cards.length}`}>
        {reading.cards.map((drawn) => {
          const card = cardsById.get(drawn.cardId)!
          const position = spread.positions.find((p) => p.id === drawn.positionId)!
          return (
            <li key={drawn.positionId} className="spread-slot">
              <p className="position-label">{position.label}</p>
              <CardFace card={card} reversed={drawn.reversed} />
              <h3 className="card-title">
                {card.name}
                {drawn.reversed && <span className="card-title-orientation"> (reversed)</span>}
              </h3>
              <p className="card-keywords">{card.keywords.join(' · ')}</p>
              <p className="card-meaning">{card.meaning[drawn.reversed ? 'reversed' : 'upright']}</p>
            </li>
          )
        })}
      </ol>

      <div className="reading-actions">
        <button type="button" className="primary" onClick={onNewReading}>
          {shared ? 'Draw your own' : 'New reading'}
        </button>
        <SharePanel reading={reading} />
        <CopyForClaude reading={reading} spread={spread} cardsById={cardsById} />
      </div>
    </section>
  )
}
