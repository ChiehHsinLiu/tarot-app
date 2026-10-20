import { useId, useRef, useState } from 'react'
import type { Reading } from '../lib/draw.ts'
import { encodeReading, shareUrl } from '../lib/share.ts'

type Status = 'idle' | 'copied' | 'manual'

const STATUS_TEXT: Record<Status, string> = {
  idle: '',
  copied: 'Link copied',
  manual: 'Press Ctrl+C (⌘C on Mac) to copy the selected link.',
}

export function SharePanel({ reading }: { reading: Reading }) {
  const panelId = useId()
  const linkRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [includeQuestion, setIncludeQuestion] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const url = shareUrl(encodeReading(reading, { includeQuestion }), window.location)

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
        Share
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
              Include my question
            </label>
          )}
          <div className="share-link-row">
            <input
              ref={linkRef}
              className="share-link"
              type="text"
              readOnly
              value={url}
              aria-label="Share link"
              onFocus={(e) => e.target.select()}
            />
            <button type="button" className="primary" onClick={copy}>
              Copy link
            </button>
          </div>
          <p className="share-status" aria-live="polite">
            {STATUS_TEXT[status]}
          </p>
        </div>
      )}
    </div>
  )
}
