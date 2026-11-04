// Dev-only: the Ask Claude text. Like everything for Claude, it stays English
// in both app languages. Imported only by components that are themselves
// lazy-loaded behind import.meta.env.DEV, so none of it ships.
import devEn from '../../data/i18n/en/ui-dev.json' with { type: 'json' }
import { format } from '../lib/ui-text.ts'
import type { Translate } from '../lib/ui-text.ts'

export type DevKey = keyof typeof devEn

const t: Translate<DevKey> = (key, vars) => format(devEn[key], vars)

export function useDevText(): Translate<DevKey> {
  return t
}
