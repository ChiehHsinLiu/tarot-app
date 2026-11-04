// The app's two languages, the first-visit guess and the remembered choice.
// No React imports, so Node tests and scripts can use it.

export type Language = 'en' | 'zh-Hant'

export const LANGUAGES: readonly Language[] = ['en', 'zh-Hant']
export const STORAGE_KEY = 'little-oracle.lang'

// Traditional Chinese: Taiwan, Hong Kong and Macau, or any zh-Hant tag.
// Other zh tags (zh, zh-CN, zh-SG, zh-Hans) are Simplified or unknown.
function isTraditionalChinese(tag: string): boolean {
  const parts = tag.toLowerCase().split(/[-_]/)
  if (parts[0] !== 'zh') return false
  if (parts.includes('hant')) return true
  if (parts.includes('hans')) return false
  return parts.some((p) => p === 'tw' || p === 'hk' || p === 'mo')
}

// The browser's first preferred language decides; Chinese only if that is Traditional Chinese.
export function detectLanguage(languages: readonly string[]): Language {
  const first = languages.find((l) => l.trim() !== '')
  return first && isTraditionalChinese(first) ? 'zh-Hant' : 'en'
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}

type Store = Pick<Storage, 'getItem' | 'setItem'>

// Storage can be missing or throw (private windows, blocked site data):
// then the choice lasts for this visit only.
export function readSavedLanguage(store: Store | undefined): Language | null {
  try {
    const value = store?.getItem(STORAGE_KEY)
    return isLanguage(value) ? value : null
  } catch {
    return null
  }
}

export function saveLanguage(store: Store | undefined, lang: Language): void {
  try {
    store?.setItem(STORAGE_KEY, lang)
  } catch {
    // Not remembered; the switch still works for this visit.
  }
}

export function initialLanguage(store: Store | undefined, languages: readonly string[]): Language {
  return readSavedLanguage(store) ?? detectLanguage(languages)
}
