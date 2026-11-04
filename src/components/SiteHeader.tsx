import { useEffect, useRef } from 'react'
import { ROUTE_HASH } from '../lib/route.ts'
import { Flourish } from './Flourish.tsx'
import { useLanguage } from './LanguageContext.tsx'

// Names the other language in that language, so readers of either can find it.
function LanguageSwitch() {
  const { lang, setLang } = useLanguage()
  const other = lang === 'en' ? 'zh-Hant' : 'en'
  return (
    <button type="button" className="language-switch" lang={other} onClick={() => setLang(other)}>
      {other === 'en' ? 'English' : '中文'}
    </button>
  )
}

// The full title on home; elsewhere a Home link beside a small title. Both carry
// the language switch.
export function SiteHeader({ home, focus }: { home: boolean; focus: boolean }) {
  const { t } = useLanguage()
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (focus) headingRef.current?.focus()
  }, [focus])

  if (!home) {
    return (
      <header className="site-header compact">
        <a className="home-link" href={ROUTE_HASH.home}>
          <span aria-hidden="true">← </span>
          {t('header.home')}
        </a>
        <h1>Little Oracle</h1>
        <LanguageSwitch />
      </header>
    )
  }
  return (
    <header className="site-header">
      <LanguageSwitch />
      <div className="site-title">
        <Flourish />
        <h1 ref={headingRef} tabIndex={-1}>
          Little Oracle
        </h1>
        <Flourish mirrored />
      </div>
      <p className="subtitle">{t('header.subtitle')}</p>
    </header>
  )
}
