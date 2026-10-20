import type { Spread } from '../lib/deck.ts'

type Props = {
  spreads: Spread[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function SpreadPicker({ spreads, selectedId, onSelect }: Props) {
  return (
    <fieldset className="spread-picker">
      <legend>Choose a spread</legend>
      {spreads.map((spread) => (
        <label key={spread.id} className="spread-option">
          <input
            type="radio"
            name="spread"
            value={spread.id}
            checked={selectedId === spread.id}
            onChange={() => onSelect(spread.id)}
          />
          <span className="spread-name">{spread.name}</span>
          <span className="spread-detail">
            {spread.positions.length === 1 ? '1 card' : `${spread.positions.length} cards`}
            {spread.requiresQuestion ? ', question required' : ''}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
