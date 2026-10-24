// The tarot screens (composer, reading, shared reading and the dev-only
// Lenormand reading), loaded on demand so the card text stays out of the first
// download. App keeps the state; this module turns ids into cards.
import { Suspense, lazy } from 'react'
import { Composer } from '../components/Composer.tsx'
import { ReadingView } from '../components/ReadingView.tsx'
import type { Reading } from '../lib/draw.ts'
import { buildLenormandDeck } from '../lib/lenormand.ts'
import { cardsById, spreads } from '../lib/tarot-deck.ts'
import type { TarotState } from './tarot-state.ts'

// Dev-only. Vite replaces DEV with false in production builds, so this folds to
// null and every Lenormand module, component and text drops out of the bundle.
// Composer.tsx builds its own the same way; a null imported from another module
// is not folded.
const lenormand = import.meta.env.DEV ? buildLenormandDeck(spreads) : null
// Lazy as well, so its stylesheet lands in a dev-only chunk: Vite keeps the CSS of
// statically imported modules even when their code is dropped.
const LenormandReadingView = import.meta.env.DEV
  ? lazy(() => import('../components/LenormandReadingView.tsx').then((m) => ({ default: m.LenormandReadingView })))
  : null

type Props = {
  tarot: TarotState
  // A reading opened from a share link, shown instead of the tarot screen.
  shared: Reading | null
  onChange: (next: TarotState) => void
  onLeaveShared: () => void
}

export default function TarotScreens({ tarot, shared, onChange, onLeaveShared }: Props) {
  if (shared) {
    return (
      <ReadingView
        // Remount when a different link is opened so focus and the share panel reset.
        key={JSON.stringify(shared)}
        reading={shared}
        spread={spreads.find((s) => s.id === shared.spreadId)!}
        cardsById={cardsById}
        shared
        onNewReading={onLeaveShared}
      />
    )
  }
  if (tarot.kind === 'revealed') {
    return (
      <ReadingView
        key={JSON.stringify(tarot.reading)}
        reading={tarot.reading}
        spread={spreads.find((s) => s.id === tarot.reading.spreadId)!}
        cardsById={cardsById}
        shared={false}
        onNewReading={() => onChange({ kind: 'composing', deck: 'tarot', spreadId: tarot.reading.spreadId, question: '' })}
      />
    )
  }
  if (lenormand && LenormandReadingView && tarot.kind === 'lenormand-revealed') {
    return (
      <Suspense fallback={null}>
        <LenormandReadingView
          key={JSON.stringify(tarot.reading)}
          reading={tarot.reading}
          spread={lenormand.spreads.find((s) => s.id === tarot.reading.spreadId)!}
          cardsById={lenormand.cardsById}
          onNewReading={() =>
            onChange({ kind: 'composing', deck: 'lenormand', spreadId: tarot.reading.spreadId, question: '' })
          }
        />
      </Suspense>
    )
  }
  if (tarot.kind === 'composing') {
    return (
      <Composer
        deck={tarot.deck}
        spreadId={tarot.spreadId}
        question={tarot.question}
        invalidLink={tarot.invalidLink ?? false}
        onChange={(next) => onChange({ kind: 'composing', ...next })}
        onDraw={onChange}
      />
    )
  }
  return null
}
