import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { guidesFor } from '../lib/guides.ts'
import type { ScreenGuideText } from '../lib/guides.ts'
import { useLanguage } from './LanguageContext.tsx'

type Props = {
  // The screen's own text; the closing note is shared by every screen.
  guide: ScreenGuideText
  // The screen's heading, shown with the "How it works" link under it.
  children: ReactNode
}

// A screen heading with a "How it works" disclosure link under it that opens
// "How it works" and "About this deck" below. It starts closed each time the screen mounts, and
// new text (another deck) leaves it open or closed as it was.
export function GuidedHeading({ guide, children }: Props) {
  const { lang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  function close() {
    setOpen(false)
    buttonRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      e.preventDefault()
      close()
    }
  }

  return (
    <div className="guided-heading" onKeyDown={onKeyDown}>
      {children}
      <button
        ref={buttonRef}
        type="button"
        className="guide-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t('guide.label')}
        onClick={() => setOpen((o) => !o)}
      >
        {t('guide.toggle')}
        <svg className="guide-chevron" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <section id={panelId} className="guide-panel" aria-label={t('guide.label')}>
          <h3>{t('guide.howItWorks')}</h3>
          <ol className="guide-steps">
            {guide.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <h3>{t('guide.about')}</h3>
          {guide.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="guide-note">{guidesFor(lang).note}</p>
          <button type="button" className="secondary guide-close" onClick={close}>
            {t('guide.close')}
          </button>
        </section>
      )}
    </div>
  )
}
