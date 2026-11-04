// The animal oracle screen, loaded on demand so its card text and drawings stay
// out of the first download. App keeps the drawn id; this screen draws.
import { OracleCardView } from '../components/OracleCardView.tsx'
import { OracleIntro } from '../components/OracleIntro.tsx'
import { drawOracle } from '../lib/oracle.ts'
import { oracleByIdFor, oracleIds } from '../lib/oracle-deck.ts'
import { useLanguage } from '../components/LanguageContext.tsx'
import { cryptoRandomInt } from '../lib/random.ts'

type Props = {
  cardId: string | null
  onDraw: (cardId: string) => void
}

export default function OracleScreen({ cardId, onDraw }: Props) {
  const { lang } = useLanguage()
  return cardId ? (
    <OracleCardView
      // Remount on every new card so focus and any Ask Claude state reset.
      key={cardId}
      card={oracleByIdFor[lang].get(cardId)!}
      onDrawAgain={() => onDraw(drawOracle(oracleIds, cryptoRandomInt, cardId))}
    />
  ) : (
    <OracleIntro onDraw={() => onDraw(drawOracle(oracleIds, cryptoRandomInt))} />
  )
}
