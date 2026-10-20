import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { QuestionBox } from './components/QuestionBox.tsx'
import { ReadingView } from './components/ReadingView.tsx'
import { SpreadPicker } from './components/SpreadPicker.tsx'
import { buildCards, buildSpreads, rawCardText, rawCards, rawSpreadText, rawSpreads } from './lib/deck.ts'
import { draw } from './lib/draw.ts'
import type { Reading } from './lib/draw.ts'
import { cryptoRandomInt } from './lib/random.ts'
import { decodeReading } from './lib/share.ts'

const cards = buildCards(rawCards, rawCardText)
const cardsById = new Map(cards.map((c) => [c.id, c]))
const deckIds = cards.map((c) => c.id)
const spreads = buildSpreads(rawSpreads, rawSpreadText)

type ComposingState = { kind: 'composing'; spreadId: string | null; question: string; invalidLink?: boolean }
type State = ComposingState | { kind: 'revealed'; reading: Reading; shared: boolean }

const EMPTY_COMPOSER: ComposingState = { kind: 'composing', spreadId: null, question: '' }

// Maps the current URL fragment to a state, or null when it is not a reading link.
function stateFromHash(): State | null {
  const result = decodeReading(window.location.hash, rawSpreads, new Set(deckIds))
  if (result.kind === 'reading') return { kind: 'revealed', reading: result.reading, shared: true }
  if (result.kind === 'invalid') return { ...EMPTY_COMPOSER, invalidLink: true }
  return null
}

function App() {
  const [state, setState] = useState<State>(() => stateFromHash() ?? EMPTY_COMPOSER)

  useEffect(() => {
    const onHashChange = () => {
      const next = stateFromHash()
      if (next) setState(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      <header className="site-header">
        <h1>Tarot</h1>
      </header>
      <main>
        {state.kind === 'composing' ? (
          <Composer
            spreadId={state.spreadId}
            question={state.question}
            invalidLink={state.invalidLink ?? false}
            onChange={(spreadId, question) => setState({ kind: 'composing', spreadId, question })}
            onDraw={(reading) => setState({ kind: 'revealed', reading, shared: false })}
          />
        ) : (
          <ReadingView
            // Remount when a different link is opened so focus and the share panel reset.
            key={JSON.stringify(state.reading)}
            reading={state.reading}
            spread={spreads.find((s) => s.id === state.reading.spreadId)!}
            cardsById={cardsById}
            shared={state.shared}
            onNewReading={() => {
              if (state.shared) {
                // Drop the share fragment without adding a history entry.
                history.replaceState(null, '', location.pathname + location.search)
                setState(EMPTY_COMPOSER)
              } else {
                setState({ kind: 'composing', spreadId: state.reading.spreadId, question: '' })
              }
            }}
          />
        )}
      </main>
    </>
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!spread || blocker) return
    onDraw(draw(spread, deckIds, question.trim(), cryptoRandomInt))
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
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
