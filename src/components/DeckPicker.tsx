import type { TarotStyle } from '../lib/tarot-style.ts'

// The tarot screen's deck choice: the two tarot styles everywhere, and the
// dev-only Lenormand deck in the local dev app.
export type DeckId = TarotStyle | 'lenormand'

// Add an entry here (and its data) to offer another deck. The DEV check stays
// inline so the production build folds it away, Lenormand name and all.
export const DECK_OPTIONS: { id: DeckId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'dachshund', name: 'Dachshund' },
  ...(import.meta.env.DEV ? [{ id: 'lenormand' as const, name: 'Lenormand' }] : []),
]

type Props = { selected: DeckId; onSelect: (deck: DeckId) => void }

export function DeckPicker({ selected, onSelect }: Props) {
  return (
    <fieldset className="spread-picker deck-picker">
      <legend>Choose a deck</legend>
      {DECK_OPTIONS.map((deck) => (
        <label key={deck.id} className="spread-option">
          <input
            type="radio"
            name="deck"
            value={deck.id}
            checked={selected === deck.id}
            onChange={() => onSelect(deck.id)}
          />
          <span className="spread-name">{deck.name}</span>
        </label>
      ))}
    </fieldset>
  )
}
