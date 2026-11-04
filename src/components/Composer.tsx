import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { deckIds, spreads, tarotDecks } from '../lib/tarot-deck.ts'
import { draw } from '../lib/draw.ts'
import { guidesFor } from '../lib/guides.ts'
import { buildLenormandDeck } from '../lib/lenormand.ts'
import { cryptoRandomInt } from '../lib/random.ts'
import { DeckPicker } from './DeckPicker.tsx'
import type { DeckId } from './DeckPicker.tsx'
import { GuidedHeading } from './GuidedHeading.tsx'
import { QuestionBox } from './QuestionBox.tsx'
import { SpreadPicker } from './SpreadPicker.tsx'
import { SpreadPreview } from './SpreadPreview.tsx'
import type { TarotState } from '../screens/tarot-state.ts'
import { useLanguage } from './LanguageContext.tsx'

// Dev-only. Vite replaces DEV with false in production builds, so this folds to
// null and the deck picker and every Lenormand text drop out of the bundle. It
// must stay inline here (as in App.tsx): a null imported from another module is
// not folded. Lenormand stays English, so it is built from the English spreads.
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
  const { lang, t } = useLanguage()
  const useLenormand = lenormand !== null && deck === 'lenormand'
  const deckSpreads = useLenormand ? lenormand.spreads : tarotDecks[lang].spreads
  const spread = deckSpreads.find((s) => s.id === spreadId) ?? null
  const blocker = !spread
    ? t('composer.chooseSpread')
    : spread.requiresQuestion && !question.trim()
      ? t('composer.needsQuestion')
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
      const style = deck === 'dachshund' ? 'dachshund' : 'classic'
      onDraw({ kind: 'revealed', reading: draw(spread, deckIds, question.trim(), cryptoRandomInt), style })
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit} aria-labelledby="tarot-title">
      <GuidedHeading guide={useLenormand ? lenormand.guide : guidesFor(lang).screens.tarot}>
        <h2 id="tarot-title" ref={headingRef} tabIndex={-1}>
          {t('composer.title')}
        </h2>
      </GuidedHeading>
      {invalidLink && (
        <p className="notice" role="alert">
          {t('composer.invalidLink')}
        </p>
      )}
      <DeckPicker selected={deck} onSelect={(d) => onChange({ deck: d, spreadId, question })} />
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
          {t('composer.draw')}
        </button>
        <p id="draw-hint" className="draw-hint" aria-live="polite">
          {blocker}
        </p>
      </div>
    </form>
  )
}
