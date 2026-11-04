// Dev-only: the Ask Claude text. Like everything for Claude, it stays English
// in both app languages, except the oracle's question box (label, hint and
// placeholder), which follows the language. Imported only by components that
// are themselves lazy-loaded behind import.meta.env.DEV, so none of it ships.
import devEn from '../../data/i18n/en/ui-dev.json' with { type: 'json' }
import devZh from '../../data/i18n/zh-Hant/ui-dev.json' with { type: 'json' }
import { format } from '../lib/ui-text.ts'
import type { TextTable, Translate } from '../lib/ui-text.ts'
import { useLanguage } from './LanguageContext.tsx'

export type DevKey = keyof typeof devEn

// The keys that follow the language. Typed as complete, so the build fails if
// the Chinese file misses one.
export type TranslatedDevKey = 'ask.oracleLabel' | 'ask.optional' | 'ask.oraclePlaceholder'
const ZH: TextTable<TranslatedDevKey> = devZh

const english: Translate<DevKey> = (key, vars) => format(devEn[key], vars)
const chinese: Translate<DevKey> = (key, vars) =>
  format(key in ZH ? ZH[key as TranslatedDevKey] : devEn[key], vars)

export function useDevText(): Translate<DevKey> {
  return useLanguage().lang === 'zh-Hant' ? chinese : english
}
