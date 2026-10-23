import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Composer, EMPTY_COMPOSER } from './components/Composer.tsx'
import type { TarotState } from './components/Composer.tsx'
import { HomeChoices } from './components/HomeChoices.tsx'
import { OracleCardView } from './components/OracleCardView.tsx'
import { OracleIntro } from './components/OracleIntro.tsx'
import { ReadingView } from './components/ReadingView.tsx'
import { SiteHeader } from './components/SiteHeader.tsx'
import { rawSpreads } from './lib/deck.ts'
import { cardsById, deckIdSet, oracleById, oracleIds, spreads } from './lib/decks.ts'
import { buildLenormandDeck } from './lib/lenormand.ts'
import { drawOracle } from './lib/oracle.ts'
import { cryptoRandomInt } from './lib/random.ts'
import { ROUTE_HASH, parseRoute } from './lib/route.ts'
import { decodeReading } from './lib/share.ts'

// Dev-only. Vite replaces DEV with false in production builds, so this folds to
// null and every Lenormand module, component and text drops out of the bundle.
// Composer.tsx builds its own the same way; a null imported from another module
// is not folded.
const lenormand = import.meta.env.DEV ? buildLenormandDeck(spreads) : null
// Lazy as well, so its stylesheet lands in a dev-only chunk: Vite keeps the CSS of
// statically imported modules even when their code is dropped.
const LenormandReadingView = import.meta.env.DEV
  ? lazy(() => import('./components/LenormandReadingView.tsx').then((m) => ({ default: m.LenormandReadingView })))
  : null

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

export default App
