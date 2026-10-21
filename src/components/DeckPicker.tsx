// Dev-only: the tarot screen's deck choice. The app renders it only when the
// Lenormand deck was built under import.meta.env.DEV, so the public build drops it.
export type DeckId = 'tarot' | 'lenormand'

// Add an entry here (and its data) to offer another deck.
export const DECK_OPTIONS: { id: DeckId; name: string }[] = [
  { id: 'tarot', name: 'Tarot' },
  { id: 'lenormand', name: 'Lenormand' },
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
