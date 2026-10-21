import { ROUTE_HASH } from '../lib/route.ts'
import { TAROT_SYMBOL } from './CardFace.tsx'
import { PAW } from './OracleCardView.tsx'

const CHOICES = [
  {
    href: ROUTE_HASH.tarot,
    title: 'Tarot reading',
    description: 'Ask a question and draw one or three cards.',
    symbol: TAROT_SYMBOL,
  },
  {
    href: ROUTE_HASH.oracle,
    title: 'Animal oracle',
    description: 'Draw one animal card for a little guidance today.',
    symbol: PAW,
  },
]

export function HomeChoices() {
  return (
    <nav className="home-choices" aria-label="Choose a reading">
      {CHOICES.map((choice) => (
        <a key={choice.href} className="home-choice" href={choice.href}>
          <svg className="card-symbol" viewBox="0 0 24 24" aria-hidden="true">
            {choice.symbol}
          </svg>
          <span className="home-choice-title">{choice.title}</span>
          <span className="home-choice-description">{choice.description}</span>
        </a>
      ))}
    </nav>
  )
}
