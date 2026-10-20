import { useState } from 'react'
import template from '../../prompts/reading.md?raw'
import type { Card, Spread } from '../lib/deck.ts'
import type { Reading } from '../lib/draw.ts'
import { buildPrompt } from '../lib/prompt.ts'

type Props = {
  reading: Reading
  spread: Spread
  cardsById: Map<string, Card>
}

type Status = 'idle' | 'copied' | 'manual'

export function CopyForClaude({ reading, spread, cardsById }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const prompt = buildPrompt(template, reading, spread, cardsById)

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setStatus('copied')
    } catch {
      setStatus('manual')
    }
  }

  return (
    <>
      <button type="button" className="secondary" onClick={copy}>
        Copy for Claude
      </button>
      <div className="claude-copy" aria-live="polite">
        {status === 'copied' && <p className="claude-status">Prompt copied</p>}
        {status === 'manual' && (
          <>
            <p className="claude-status">Press Ctrl+C (⌘C on Mac) to copy the selected prompt.</p>
            <textarea
              // Focus and select on appearance so the prompt is ready to copy.
              ref={(el) => {
                el?.focus()
                el?.select()
              }}
              className="claude-fallback"
              readOnly
              rows={10}
              value={prompt}
              aria-label="Prompt for Claude"
              onFocus={(e) => e.target.select()}
            />
          </>
        )}
      </div>
    </>
  )
}
