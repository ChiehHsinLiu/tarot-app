import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Flourish } from './components/Flourish.tsx'
import { HomeChoices } from './components/HomeChoices.tsx'
import { OracleCardView } from './components/OracleCardView.tsx'
import { OracleIntro } from './components/OracleIntro.tsx'
import { QuestionBox } from './components/QuestionBox.tsx'
import { ReadingView } from './components/ReadingView.tsx'
import { SpreadPicker } from './components/SpreadPicker.tsx'
import { buildCards, buildSpreads, rawCardText, rawCards, rawSpreadText, rawSpreads } from './lib/deck.ts'
import { draw } from './lib/draw.ts'
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

type ComposingState = { kind: 'composing'; spreadId: string | null; question: string; invalidLink?: boolean }
// What the tarot screen shows. It lives apart from the route, so going Home keeps it.
type TarotState = ComposingState | { kind: 'revealed'; reading: Reading }

const EMPTY_COMPOSER: ComposingState = { kind: 'composing', spreadId: null, question: '' }

const decodeHash = (hash: string) => decodeReading(hash, rawSpreads, deckIdSet)

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const [tarot, setTarot] = useState<TarotState>(() =>
    decodeHash(window.location.hash).kind === 'invalid' ? { ...EMPTY_COMPOSER, invalidLink: true } : EMPTY_COMPOSER,
  )
  const [oracleCardId, setOracleCardId] = useState<string | null>(null)
  // Home focuses its heading only when reached from another screen, not on first load.
  const [navigated, setNavigated] = useState(false)

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash
      setHash(next)
      setNavigated(true)
      if (decodeHash(next).kind === 'invalid') setTarot({ ...EMPTY_COMPOSER, invalidLink: true })
      // The invalid-link notice belongs to the link; drop it once the user moves on.
      else setTarot((t) => (t.kind === 'composing' && t.invalidLink ? { ...t, invalidLink: false } : t))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const route = parseRoute(hash)
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
        onNewReading={() => setTarot({ kind: 'composing', spreadId: tarot.reading.spreadId, question: '' })}
      />
    )
  } else {
    screen = (
      <Composer
        spreadId={tarot.spreadId}
        question={tarot.question}
        invalidLink={tarot.invalidLink ?? false}
        onChange={(spreadId, question) => setTarot({ kind: 'composing', spreadId, question })}
        onDraw={(reading) => setTarot({ kind: 'revealed', reading })}
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

type ComposerProps = {
  spreadId: string | null
  question: string
  invalidLink: boolean
  onChange: (spreadId: string | null, question: string) => void
  onDraw: (reading: Reading) => void
}

function Composer({ spreadId, question, invalidLink, onChange, onDraw }: ComposerProps) {
  const spread = spreads.find((s) => s.id === spreadId) ?? null
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
    onDraw(draw(spread, deckIds, question.trim(), cryptoRandomInt))
  }

  return (
    <form className="composer" onSubmit={handleSubmit} aria-labelledby="tarot-title">
      <h2 id="tarot-title" ref={headingRef} tabIndex={-1}>
        Tarot reading
      </h2>
      {invalidLink && (
        <p className="notice" role="alert">
          This reading link isn't valid.
        </p>
      )}
      <SpreadPicker spreads={spreads} selectedId={spreadId} onSelect={(id) => onChange(id, question)} />
      <QuestionBox
        value={question}
        required={spread?.requiresQuestion ?? false}
        onChange={(q) => onChange(spreadId, q)}
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
