import { useState } from 'react'
import type { FormEvent } from 'react'
import { QuestionBox } from './components/QuestionBox.tsx'
import { ReadingView } from './components/ReadingView.tsx'
import { SpreadPicker } from './components/SpreadPicker.tsx'
import { buildCards, buildSpreads, rawCardText, rawCards, rawSpreadText, rawSpreads } from './lib/deck.ts'
import { draw } from './lib/draw.ts'
import type { Reading } from './lib/draw.ts'
import { cryptoRandomInt } from './lib/random.ts'

const cards = buildCards(rawCards, rawCardText)
const cardsById = new Map(cards.map((c) => [c.id, c]))
const deckIds = cards.map((c) => c.id)
const spreads = buildSpreads(rawSpreads, rawSpreadText)

type State =
  | { kind: 'composing'; spreadId: string | null; question: string }
  | { kind: 'revealed'; reading: Reading }

function App() {
  const [state, setState] = useState<State>({ kind: 'composing', spreadId: null, question: '' })

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
            onChange={(spreadId, question) => setState({ kind: 'composing', spreadId, question })}
            onDraw={(reading) => setState({ kind: 'revealed', reading })}
          />
        ) : (
          <ReadingView
            reading={state.reading}
            spread={spreads.find((s) => s.id === state.reading.spreadId)!}
            cardsById={cardsById}
            onNewReading={() =>
              setState({ kind: 'composing', spreadId: state.reading.spreadId, question: '' })
            }
          />
        )}
      </main>
    </>
  )
}

type ComposerProps = {
  spreadId: string | null
  question: string
  onChange: (spreadId: string | null, question: string) => void
  onDraw: (reading: Reading) => void
}

function Composer({ spreadId, question, onChange, onDraw }: ComposerProps) {
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
