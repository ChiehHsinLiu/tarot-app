// The tarot screen's state, apart from the screen itself so App can hold it
// without loading the composer or any card text.
import type { DeckId } from '../components/DeckPicker.tsx'
import type { Reading } from '../lib/draw.ts'

export type ComposingState = {
  kind: 'composing'
  deck: DeckId
  spreadId: string | null
  question: string
  invalidLink?: boolean
}
// What the tarot screen shows. It lives apart from the route so drawing and New reading
// can swap views; entering the screen from elsewhere resets it (see onHashChange in App.tsx).
export type TarotState =
  | ComposingState
  | { kind: 'revealed'; reading: Reading }
  | { kind: 'lenormand-revealed'; reading: Reading }

export const EMPTY_COMPOSER: ComposingState = { kind: 'composing', deck: 'tarot', spreadId: null, question: '' }
