import { guides } from '../lib/guides.ts'
import type { ScreenGuideText } from '../lib/guides.ts'

// The screen's own text; the closing note is shared by every screen.
type Props = { guide: ScreenGuideText }

// Native <details> handle keyboard toggling and announce expanded or collapsed.
// They are uncontrolled, so they start closed each time the screen mounts, and
// new text (another deck) keeps them as they are.
export function ScreenGuide({ guide }: Props) {
  const { howItWorks, about } = guide
  return (
    <div className="screen-guides">
      <details className="screen-guide">
        <summary>How it works</summary>
        <ol className="guide-steps">
          {howItWorks.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>
      <details className="screen-guide">
        <summary>About this deck</summary>
        {about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="guide-note">{guides.note}</p>
      </details>
    </div>
  )
}
