import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { guides } from '../lib/guides.ts'
import type { ScreenGuideText } from '../lib/guides.ts'

type Props = {
  // The screen's own text; the closing note is shared by every screen.
  guide: ScreenGuideText
  // The screen's heading, shown with the "How it works" link under it.
  children: ReactNode
}

const LABEL = 'How it works and about this deck'

// A screen heading with a "How it works" disclosure link under it that opens
// "How it works" and "About this deck" below. It starts closed each time the screen mounts, and
// new text (another deck) leaves it open or closed as it was.
export function GuidedHeading({ guide, children }: Props) {
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
        aria-label={LABEL}
        onClick={() => setOpen((o) => !o)}
      >
        How it works
        <svg className="guide-chevron" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <section id={panelId} className="guide-panel" aria-label={LABEL}>
          <h3>How it works</h3>
          <ol className="guide-steps">
            {guide.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <h3>About this deck</h3>
          {guide.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="guide-note">{guides.note}</p>
          <button type="button" className="secondary guide-close" onClick={close}>
            Close
          </button>
        </section>
      )}
    </div>
  )
}
