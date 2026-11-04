import { useEffect, useRef } from 'react'
import { guidesFor } from '../lib/guides.ts'
import { GuidedHeading } from './GuidedHeading.tsx'
import { useLanguage } from './LanguageContext.tsx'

type Props = { onDraw: () => void }

export function OracleIntro({ onDraw }: Props) {
  const { lang, t } = useLanguage()
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  return (
    <section className="oracle-intro-screen" aria-labelledby="oracle-intro-title">
      <GuidedHeading guide={guidesFor(lang).screens.oracle}>
        <h2 id="oracle-intro-title" ref={headingRef} tabIndex={-1}>
          {t('oracle.title')}
        </h2>
      </GuidedHeading>
      <p className="oracle-intro">{t('oracle.intro')}</p>
      <button type="button" className="primary" onClick={onDraw}>
        {t('oracle.draw')}
      </button>
    </section>
  )
}
