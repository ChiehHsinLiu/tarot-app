import type { TarotStyle } from '../lib/tarot-style.ts'
import type { UiKey } from '../lib/ui-text.ts'
import { useLanguage } from './LanguageContext.tsx'

// The tarot screen's deck choice: the two tarot styles everywhere, and the
// dev-only Lenormand deck in the local dev app.
export type DeckId = TarotStyle | 'lenormand'

// Add an entry here (and its data) to offer another deck. The DEV check stays
// inline so the production build folds it away, Lenormand name and all.
// Lenormand stays English in every language, so its name is written here.
export const DECK_OPTIONS: { id: DeckId; name: UiKey | { text: string } }[] = [
  { id: 'classic', name: 'deck.classic' },
  { id: 'dachshund', name: 'deck.dachshund' },
  ...(import.meta.env.DEV ? [{ id: 'lenormand' as const, name: { text: 'Lenormand' } }] : []),
]

type Props = { selected: DeckId; onSelect: (deck: DeckId) => void }

export function DeckPicker({ selected, onSelect }: Props) {
  const { t } = useLanguage()
  return (
    <fieldset className="spread-picker deck-picker">
      <legend>{t('deck.legend')}</legend>
      {DECK_OPTIONS.map((deck) => (
        <label key={deck.id} className="spread-option">
          <input
            type="radio"
            name="deck"
            value={deck.id}
            checked={selected === deck.id}
            onChange={() => onSelect(deck.id)}
          />
          <span className="spread-name">{typeof deck.name === 'string' ? t(deck.name) : deck.name.text}</span>
        </label>
      ))}
    </fieldset>
  )
}
