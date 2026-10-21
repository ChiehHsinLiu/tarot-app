import { guides } from '../lib/guides.ts'
import type { GuideScreen } from '../lib/guides.ts'

type Props = { screen: GuideScreen }

// Native <details> handle keyboard toggling and announce expanded or collapsed.
// They are uncontrolled, so they start closed each time the screen mounts.
export function ScreenGuide({ screen }: Props) {
  const { howItWorks, about } = guides.screens[screen]
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
