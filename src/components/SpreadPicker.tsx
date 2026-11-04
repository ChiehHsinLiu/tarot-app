import type { Spread } from '../lib/deck.ts'
import { useLanguage } from './LanguageContext.tsx'

type Props = {
  spreads: Spread[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function SpreadPicker({ spreads, selectedId, onSelect }: Props) {
  const { t } = useLanguage()
  return (
    <fieldset className="spread-picker">
      <legend>{t('spread.legend')}</legend>
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
            {spread.positions.length === 1 ? t('spread.oneCard') : t('spread.cards', { count: spread.positions.length })}
            {spread.requiresQuestion ? t('spread.questionRequired') : ''}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
