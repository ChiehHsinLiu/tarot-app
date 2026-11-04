import { useId, useRef, useState } from 'react'
import type { Reading } from '../lib/draw.ts'
import { encodeReading, shareUrl } from '../lib/share.ts'
import type { TarotStyle } from '../lib/tarot-style.ts'
import type { UiKey } from '../lib/ui-text.ts'
import { useLanguage } from './LanguageContext.tsx'

type Status = 'idle' | 'copied' | 'manual'

const STATUS_TEXT: Record<Exclude<Status, 'idle'>, UiKey> = {
  copied: 'share.copied',
  manual: 'share.manual',
}

export function SharePanel({ reading, style }: { reading: Reading; style: TarotStyle }) {
  const { t } = useLanguage()
  const panelId = useId()
  const linkRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [includeQuestion, setIncludeQuestion] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const url = shareUrl(encodeReading(reading, { includeQuestion, style }), window.location)

  function toggle() {
    // The question is opt-in every time the panel opens.
    setIncludeQuestion(false)
    setStatus('idle')
    setOpen(!open)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      linkRef.current?.focus()
      linkRef.current?.select()
      setStatus('manual')
    }
  }

  return (
    <div className="share">
      <button type="button" className="secondary" aria-expanded={open} aria-controls={panelId} onClick={toggle}>
        {t('share.button')}
      </button>
      {open && (
        <div id={panelId} className="share-panel">
          {reading.question && (
            <label className="share-include">
              <input
                type="checkbox"
                checked={includeQuestion}
                onChange={(e) => {
                  setIncludeQuestion(e.target.checked)
                  setStatus('idle')
                }}
              />
              {t('share.includeQuestion')}
            </label>
          )}
          <div className="share-link-row">
            <input
              ref={linkRef}
              className="share-link"
              type="text"
              readOnly
              value={url}
              aria-label={t('share.linkLabel')}
              onFocus={(e) => e.target.select()}
            />
            <button type="button" className="primary" onClick={copy}>
              {t('share.copy')}
            </button>
          </div>
          <p className="share-status" aria-live="polite">
            {status === 'idle' ? '' : t(STATUS_TEXT[status])}
          </p>
        </div>
      )}
    </div>
  )
}
