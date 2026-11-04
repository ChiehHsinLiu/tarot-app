// Interface text (buttons, headings, notices) by language. No React imports,
// so Node tests can use it. Card, spread, guide and animal text live with their
// decks; dev-only text is in ui-dev.json, loaded only by dev-only components.
import uiEn from '../../data/i18n/en/ui.json' with { type: 'json' }
import uiZh from '../../data/i18n/zh-Hant/ui.json' with { type: 'json' }
import type { Language } from './language.ts'

export type UiKey = keyof typeof uiEn
export type Vars = Record<string, string | number>
export type TextTable<K extends string> = Record<K, string>
export type Translate<K extends string> = (key: K, vars?: Vars) => string

// Typed as complete: the build fails if the Chinese table misses a key.
const UI: Record<Language, TextTable<UiKey>> = { en: uiEn, 'zh-Hant': uiZh }

// Fills {name} placeholders. Unknown placeholders are left as they are.
export function format(text: string, vars?: Vars): string {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole))
}

// A lookup for one language.
export function translator<K extends string>(tables: Record<Language, TextTable<K>>, lang: Language): Translate<K> {
  const own = tables[lang]
  return (key, vars) => format(own[key], vars)
}

export const uiTables = UI
