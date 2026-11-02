import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { deckIds, spreads } from '../lib/tarot-deck.ts'
import { draw } from '../lib/draw.ts'
import { guides } from '../lib/guides.ts'
import { buildLenormandDeck } from '../lib/lenormand.ts'
import { cryptoRandomInt } from '../lib/random.ts'
import { DeckPicker } from './DeckPicker.tsx'
import type { DeckId } from './DeckPicker.tsx'
import { GuidedHeading } from './GuidedHeading.tsx'
import { QuestionBox } from './QuestionBox.tsx'
import { SpreadPicker } from './SpreadPicker.tsx'
import { SpreadPreview } from './SpreadPreview.tsx'
import type { TarotState } from '../screens/tarot-state.ts'

// Dev-only. Vite replaces DEV with false in production builds, so this folds to
// null and the deck picker and every Lenormand text drop out of the bundle. It
// must stay inline here (as in App.tsx): a null imported from another module is
// not folded.
const lenormand = import.meta.env.DEV ? buildLenormandDeck(spreads) : null

type ComposerChoice = { deck: DeckId; spreadId: string | null; question: string }

type ComposerProps = ComposerChoice & {
  invalidLink: boolean
  onChange: (next: ComposerChoice) => void
  onDraw: (next: TarotState) => void
}

export function Composer({ deck, spreadId, question, invalidLink, onChange, onDraw }: ComposerProps) {
  // Lenormand exists only in the dev build; everywhere else the deck is tarot.
  // The null check comes first so the production build folds this to false.
  const useLenormand = lenormand !== null && deck === 'lenormand'
  const deckSpreads = useLenormand ? lenormand.spreads : spreads
  const spread = deckSpreads.find((s) => s.id === spreadId) ?? null
  const blocker = !spread
    ? 'Choose a spread to begin.'
    : spread.requiresQuestion && !question.trim()
      ? 'A yes / no reading needs a question.'
      : null

  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!spread || blocker) return
    if (useLenormand) {
      const reading = draw(spread, lenormand.ids, question.trim(), cryptoRandomInt, { reversals: false })
      onDraw({ kind: 'lenormand-revealed', reading })
    } else {
      onDraw({ kind: 'revealed', reading: draw(spread, deckIds, question.trim(), cryptoRandomInt) })
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit} aria-labelledby="tarot-title">
      <GuidedHeading guide={useLenormand ? lenormand.guide : guides.screens.tarot}>
        <h2 id="tarot-title" ref={headingRef} tabIndex={-1}>
          Tarot reading
        </h2>
      </GuidedHeading>
      {invalidLink && (
        <p className="notice" role="alert">
          This reading link isn't valid.
        </p>
      )}
      {lenormand && <DeckPicker selected={deck} onSelect={(d) => onChange({ deck: d, spreadId, question })} />}
      <SpreadPicker
        spreads={deckSpreads}
        selectedId={spreadId}
        onSelect={(id) => onChange({ deck, spreadId: id, question })}
      />
      <QuestionBox
        value={question}
        required={spread?.requiresQuestion ?? false}
        onChange={(q) => onChange({ deck, spreadId, question: q })}
      />
      <SpreadPreview spread={spread} />
      <div className="draw-row">
        <button type="submit" className="primary" disabled={blocker !== null} aria-describedby="draw-hint">
          Draw
        </button>
        <p id="draw-hint" className="draw-hint" aria-live="polite">
          {blocker}
        </p>
      </div>
    </form>
  )
}
