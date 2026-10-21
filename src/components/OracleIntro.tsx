import { useEffect, useRef } from 'react'

type Props = { onDraw: () => void }

export function OracleIntro({ onDraw }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  return (
    <section className="oracle-intro-screen" aria-labelledby="oracle-intro-title">
      <h2 id="oracle-intro-title" ref={headingRef} tabIndex={-1}>
        Today's animal oracle
      </h2>
      <p className="oracle-intro">Draw one animal card for a little guidance today. No question needed.</p>
      <button type="button" className="primary" onClick={onDraw}>
        Draw
      </button>
    </section>
  )
}
