import { createContext, use, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { initialLanguage, saveLanguage } from '../lib/language.ts'
import type { Language } from '../lib/language.ts'
import { translator, uiTables } from '../lib/ui-text.ts'
import type { Translate, UiKey } from '../lib/ui-text.ts'

type LanguageValue = { lang: Language; setLang: (lang: Language) => void; t: Translate<UiKey> }

const LanguageContext = createContext<LanguageValue | null>(null)

// localStorage can throw on access in some privacy modes; language.ts guards
// each call, and this guards reaching for it at all.
function storage(): Storage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

// Holds the app's language, keeps <html lang> in step and remembers the choice.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => initialLanguage(storage(), navigator.languages ?? [navigator.language]))

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      setLang: (next) => {
        saveLanguage(storage(), next)
        setLangState(next)
      },
      t: translator(uiTables, lang),
    }),
    [lang],
  )
  return <LanguageContext value={value}>{children}</LanguageContext>
}

export function useLanguage(): LanguageValue {
  const value = use(LanguageContext)
  if (!value) throw new Error('useLanguage needs a LanguageProvider')
  return value
}
