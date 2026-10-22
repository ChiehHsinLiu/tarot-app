import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { DeckPicker } from './components/DeckPicker.tsx'
import type { DeckId } from './components/DeckPicker.tsx'
import { Flourish } from './components/Flourish.tsx'
import { GuidedHeading } from './components/GuidedHeading.tsx'
import { HomeChoices } from './components/HomeChoices.tsx'
import { OracleCardView } from './components/OracleCardView.tsx'
import { OracleIntro } from './components/OracleIntro.tsx'
import { QuestionBox } from './components/QuestionBox.tsx'
import { ReadingView } from './components/ReadingView.tsx'
import { SpreadPicker } from './components/SpreadPicker.tsx'
import { buildCards, buildSpreads, rawCardText, rawCards, rawSpreadText, rawSpreads } from './lib/deck.ts'
import { draw } from './lib/draw.ts'
import { guides } from './lib/guides.ts'
import { buildLenormandDeck } from './lib/lenormand.ts'
import type { Reading } from './lib/draw.ts'
import { buildOracleCards, drawOracle, rawAnimalDeck, rawAnimalText } from './lib/oracle.ts'
import { cryptoRandomInt } from './lib/random.ts'
import { ROUTE_HASH, parseRoute } from './lib/route.ts'
import { decodeReading } from './lib/share.ts'

const cards = buildCards(rawCards, rawCardText)
const cardsById = new Map(cards.map((c) => [c.id, c]))
const deckIds = cards.map((c) => c.id)
const deckIdSet = new Set(deckIds)
const spreads = buildSpreads(rawSpreads, rawSpreadText)
const oracleCards = buildOracleCards(rawAnimalDeck, rawAnimalText)
const oracleById = new Map(oracleCards.map((c) => [c.id, c]))
const oracleIds = oracleCards.map((c) => c.id)
// Dev-only. Vite replaces DEV with false in production builds, so this folds to
// null and every Lenormand module, component and text drops out of the bundle.
const lenormand = import.meta.env.DEV ? buildLenormandDeck(spreads) : null
// Lazy as well, so its stylesheet lands in a dev-only chunk: Vite keeps the CSS of
// statically imported modules even when their code is dropped.
const LenormandReadingView = import.meta.env.DEV
  ? lazy(() => import('./components/LenormandReadingView.tsx').then((m) => ({ default: m.LenormandReadingView })))
  : null

type ComposingState = {
  kind: 'composing'
  deck: DeckId
  spreadId: string | null
  question: string
  invalidLink?: boolean
}
// What the tarot screen shows. It lives apart from the route so drawing and New reading
// can swap views; entering the screen from elsewhere resets it (see onHashChange).
type TarotState =
  | ComposingState
  | { kind: 'revealed'; reading: Reading }
  | { kind: 'lenormand-revealed'; reading: Reading }

const EMPTY_COMPOSER: ComposingState = { kind: 'composing', deck: 'tarot', spreadId: null, question: '' }

const decodeHash = (hash: string) => decodeReading(hash, rawSpreads, deckIdSet)

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const [tarot, setTarot] = useState<TarotState>(() =>
    decodeHash(window.location.hash).kind === 'invalid' ? { ...EMPTY_COMPOSER, invalidLink: true } : EMPTY_COMPOSER,
  )
  const [oracleCardId, setOracleCardId] = useState<string | null>(null)
  // Home focuses its heading only when reached from another screen, not on first load.
  const [navigated, setNavigated] = useState(false)
  const route = parseRoute(hash)
  // The route last rendered, so a hashchange can tell entering a screen from staying on it.
  const routeRef = useRef(route)
  useEffect(() => {
    routeRef.current = route
  }, [route])

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash
      const nextRoute = parseRoute(next)
      // Home link, home choice, Back/Forward or a typed address: the screen starts fresh.
      const entered = nextRoute !== routeRef.current
      setHash(next)
      setNavigated(true)
      if (decodeHash(next).kind === 'invalid') setTarot({ ...EMPTY_COMPOSER, invalidLink: true })
      else if (entered && nextRoute === 'tarot') setTarot(EMPTY_COMPOSER)
      // The invalid-link notice belongs to the link; drop it once the user moves on.
      else setTarot((t) => (t.kind === 'composing' && t.invalidLink ? { ...t, invalidLink: false } : t))
      if (entered && nextRoute === 'oracle') setOracleCardId(null)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const shared = route === 'share' ? decodeHash(hash) : null

  let screen
  if (route === 'home') {
    screen = <HomeChoices />
  } else if (shared?.kind === 'reading') {
    screen = (
      <ReadingView
        // Remount when a different link is opened so focus and the share panel reset.
        key={JSON.stringify(shared.reading)}
        reading={shared.reading}
        spread={spreads.find((s) => s.id === shared.reading.spreadId)!}
        cardsById={cardsById}
        shared
        onNewReading={() => {
          // Swap the share fragment for the tarot screen without adding a history entry,
          // so Back does not reopen the shared reading. replaceState fires no hashchange.
          history.replaceState(null, '', location.pathname + location.search + ROUTE_HASH.tarot)
          setTarot(EMPTY_COMPOSER)
          setHash(ROUTE_HASH.tarot)
        }}
      />
    )
  } else if (route === 'oracle') {
    screen = oracleCardId ? (
      <OracleCardView
        // Remount on every new card so focus and any Ask Claude state reset.
        key={oracleCardId}
        card={oracleById.get(oracleCardId)!}
        onDrawAgain={() => setOracleCardId(drawOracle(oracleIds, cryptoRandomInt, oracleCardId))}
      />
    ) : (
      <OracleIntro onDraw={() => setOracleCardId(drawOracle(oracleIds, cryptoRandomInt))} />
    )
  } else if (tarot.kind === 'revealed') {
    // The tarot screen, or an invalid share link, which shows the composer with a notice.
    screen = (
      <ReadingView
        key={JSON.stringify(tarot.reading)}
        reading={tarot.reading}
        spread={spreads.find((s) => s.id === tarot.reading.spreadId)!}
        cardsById={cardsById}
        shared={false}
        onNewReading={() => setTarot({ kind: 'composing', deck: 'tarot', spreadId: tarot.reading.spreadId, question: '' })}
      />
    )
  } else if (lenormand && LenormandReadingView && tarot.kind === 'lenormand-revealed') {
    screen = (
      <Suspense fallback={null}>
        <LenormandReadingView
          key={JSON.stringify(tarot.reading)}
          reading={tarot.reading}
          spread={lenormand.spreads.find((s) => s.id === tarot.reading.spreadId)!}
          cardsById={lenormand.cardsById}
          onNewReading={() =>
            setTarot({ kind: 'composing', deck: 'lenormand', spreadId: tarot.reading.spreadId, question: '' })
          }
        />
      </Suspense>
    )
  } else if (tarot.kind === 'composing') {
    screen = (
      <Composer
        deck={tarot.deck}
        spreadId={tarot.spreadId}
        question={tarot.question}
        invalidLink={tarot.invalidLink ?? false}
        onChange={(next) => setTarot({ kind: 'composing', ...next })}
        onDraw={setTarot}
      />
    )
  }

  return (
    <>
      <SiteHeader home={route === 'home'} focus={route === 'home' && navigated} />
      <main>{screen}</main>
    </>
  )
}

function SiteHeader({ home, focus }: { home: boolean; focus: boolean }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (focus) headingRef.current?.focus()
  }, [focus])

  if (!home) {
    return (
      <header className="site-header compact">
        <a className="home-link" href={ROUTE_HASH.home}>
          <span aria-hidden="true">← </span>Home
        </a>
        <h1>Little Oracle</h1>
      </header>
    )
  }
  return (
    <header className="site-header">
      <div className="site-title">
        <Flourish />
        <h1 ref={headingRef} tabIndex={-1}>
          Little Oracle
        </h1>
        <Flourish mirrored />
      </div>
      <p className="subtitle">tarot &amp; animal cards for today</p>
    </header>
  )
}

type ComposerChoice = { deck: DeckId; spreadId: string | null; question: string }

type ComposerProps = ComposerChoice & {
  invalidLink: boolean
  onChange: (next: ComposerChoice) => void
  onDraw: (next: TarotState) => void
}

function Composer({ deck, spreadId, question, invalidLink, onChange, onDraw }: ComposerProps) {
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

export default App
