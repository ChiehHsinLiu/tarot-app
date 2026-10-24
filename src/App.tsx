import { Suspense, use, useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { HomeChoices } from './components/HomeChoices.tsx'
import { SiteHeader } from './components/SiteHeader.tsx'
import { rawCards, rawSpreads } from './lib/deck-ids.ts'
import { ROUTE_HASH, parseRoute } from './lib/route.ts'
import { decodeReading } from './lib/share.ts'
import { EMPTY_COMPOSER } from './screens/tarot-state.ts'
import type { TarotState } from './screens/tarot-state.ts'

// A screen in its own file, fetched on first use or by preload(). Unlike
// React.lazy, a screen whose file has already arrived renders at once instead
// of suspending for a beat: use() reads a fulfilled promise synchronously.
function onDemand<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  let loading: Promise<{ default: ComponentType<P> }> | null = null
  const preload = () => {
    if (!loading) {
      const p = load()
      // The fields use() looks for to read a settled promise without waiting.
      p.then((value) => Object.assign(p, { status: 'fulfilled', value }), () => {})
      loading = p
    }
    return loading
  }
  function Screen(props: P) {
    const { default: Loaded } = use(preload())
    return <Loaded {...props} />
  }
  return { Screen, preload }
}

// The card text and drawings stay out of the first download.
const tarotScreens = onDemand(() => import('./screens/TarotScreens.tsx'))
const oracle = onDemand(() => import('./screens/OracleScreen.tsx'))
const TarotScreens = tarotScreens.Screen
const OracleScreen = oracle.Screen

// Fetches both screen files in the background. Rendered inside the same
// Suspense boundary as the screen, so its effect runs only once something has
// shown: on a direct link, the screen's own file isn't kept waiting.
function PreloadScreens() {
  useEffect(() => {
    const preload = () => {
      void tarotScreens.preload()
      void oracle.preload()
    }
    if ('requestIdleCallback' in window) requestIdleCallback(preload)
    else setTimeout(preload, 200)
  }, [])
  return null
}

// Ids only: enough to tell a valid share link from a broken one.
const deckIdSet = new Set(rawCards.map((c) => c.id))
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
  } else if (route === 'oracle') {
    screen = <OracleScreen cardId={oracleCardId} onDraw={setOracleCardId} />
  } else {
    // The tarot screen, a shared reading, or an invalid share link, which shows
    // the composer with a notice.
    screen = (
      <TarotScreens
        tarot={tarot}
        shared={shared?.kind === 'reading' ? shared.reading : null}
        onChange={setTarot}
        onLeaveShared={() => {
          // Swap the share fragment for the tarot screen without adding a history entry,
          // so Back does not reopen the shared reading. replaceState fires no hashchange.
          history.replaceState(null, '', location.pathname + location.search + ROUTE_HASH.tarot)
          setTarot(EMPTY_COMPOSER)
          setHash(ROUTE_HASH.tarot)
        }}
      />
    )
  }

  return (
    <>
      <SiteHeader home={route === 'home'} focus={route === 'home' && navigated} />
      <main>
        {/* The header shows at once; a screen whose file is still loading shows when it arrives. */}
        <Suspense fallback={null}>
          {screen}
          <PreloadScreens />
        </Suspense>
      </main>
    </>
  )
}

export default App
