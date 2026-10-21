import type { CSSProperties } from 'react'
import { LENORMAND_ART } from '../lib/lenormand-art.ts'
import type { LenormandCard } from '../lib/lenormand.ts'
import { ORACLE_PALETTES } from '../lib/palette.ts'

// The number at the top, the card's drawing, then its name, on the card's
// pastel colour family.
export function LenormandCardFace({ card }: { card: LenormandCard }) {
  const { face, edge } = ORACLE_PALETTES[card.palette]
  const family = { '--family-face': face, '--family-edge': edge } as CSSProperties
  return (
    <div className="card">
      <div role="img" aria-label={`${card.number}, ${card.name}`} className="card-face lenormand-face" style={family}>
        <span className="card-numeral" aria-hidden="true">
          {card.number}
        </span>
        {/* Trusted build-time files; art-format.ts limits what they may contain.
            oracle-art supplies the shared art-class colours. */}
        <span
          className="oracle-art lenormand-art"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: LENORMAND_ART[card.id] }}
        />
        <span className="card-name" aria-hidden="true">
          {card.name}
        </span>
      </div>
    </div>
  )
}
