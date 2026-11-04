import type { CSSProperties } from 'react'
import { HOME_ART } from '../lib/home-art.ts'
import { ORACLE_PALETTES } from '../lib/palette.ts'
import { ROUTE_HASH } from '../lib/route.ts'
import type { UiKey } from '../lib/ui-text.ts'
import { useLanguage } from './LanguageContext.tsx'

// Each choice is an arched window (see home-art.ts) above its title and
// description. The drawings borrow the oracle art colours: rose card backs for
// tarot, a butter cat for the oracle.
const CHOICES: { href: string; title: UiKey; description: UiKey; art: string; palette: { face: string; edge: string } }[] = [
  {
    href: ROUTE_HASH.tarot,
    title: 'home.tarotTitle',
    description: 'home.tarotDescription',
    art: HOME_ART['window-tarot'],
    palette: ORACLE_PALETTES.rose,
  },
  {
    href: ROUTE_HASH.oracle,
    title: 'home.oracleTitle',
    description: 'home.oracleDescription',
    art: HOME_ART['window-oracle'],
    palette: ORACLE_PALETTES.butter,
  },
]

export function HomeChoices() {
  const { t } = useLanguage()
  return (
    <nav className="home-choices" aria-label={t('home.nav')}>
      {CHOICES.map((choice) => (
        <a key={choice.href} className="home-choice" href={choice.href}>
          <span
            className="oracle-art home-window"
            style={{ '--family-face': choice.palette.face, '--family-edge': choice.palette.edge } as CSSProperties}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: choice.art }}
          />
          <span className="home-choice-title">{t(choice.title)}</span>
          <span className="home-choice-description">{t(choice.description)}</span>
        </a>
      ))}
    </nav>
  )
}
