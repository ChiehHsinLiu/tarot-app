import type { CSSProperties } from 'react'
import { HOME_ART } from '../lib/home-art.ts'
import { ORACLE_PALETTES } from '../lib/palette.ts'
import { ROUTE_HASH } from '../lib/route.ts'

// Each choice is an arched window (see home-art.ts) above its title and
// description. The drawings borrow the oracle art colours: rose card backs for
// tarot, a butter cat for the oracle.
const CHOICES = [
  {
    href: ROUTE_HASH.tarot,
    title: 'Tarot reading',
    description: 'Ask a question and draw one or three cards.',
    art: HOME_ART['window-tarot'],
    palette: ORACLE_PALETTES.rose,
  },
  {
    href: ROUTE_HASH.oracle,
    title: 'Animal oracle',
    description: 'Draw one animal card for a little guidance today.',
    art: HOME_ART['window-oracle'],
    palette: ORACLE_PALETTES.butter,
  },
]

export function HomeChoices() {
  return (
    <nav className="home-choices" aria-label="Choose a reading">
      {CHOICES.map((choice) => (
        <a key={choice.href} className="home-choice" href={choice.href}>
          <span
            className="oracle-art home-window"
            style={{ '--family-face': choice.palette.face, '--family-edge': choice.palette.edge } as CSSProperties}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: choice.art }}
          />
          <span className="home-choice-title">{choice.title}</span>
          <span className="home-choice-description">{choice.description}</span>
        </a>
      ))}
    </nav>
  )
}
