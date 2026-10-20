type Props = { onDraw: () => void }

export function OracleSection({ onDraw }: Props) {
  return (
    <section className="oracle-section" aria-labelledby="oracle-section-title">
      <h2 id="oracle-section-title">Today's animal oracle</h2>
      <p className="oracle-intro">Draw one animal card for a little guidance today. No question needed.</p>
      <button type="button" className="primary" onClick={onDraw}>
        Draw
      </button>
    </section>
  )
}
