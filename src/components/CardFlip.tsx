import type { CSSProperties, ReactNode } from 'react'

// A four-point star centred on (x, y), r from the centre to each point.
function sparkle(x: number, y: number, r: number) {
  return `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`
}

// Every star is listed for the left half and mirrored, so the back looks the
// same mid-flip whichever way it turns. [x, y, size] in the 120x200 box.
const SPARKLES: [number, number, number][] = [
  [32, 42, 6],
  [22, 92, 3.5],
  [36, 148, 5],
]
const DOTS: [number, number, number][] = [
  [46, 30, 1.3],
  [20, 62, 1.6],
  [44, 70, 1.1],
  [28, 122, 1.4],
  [48, 132, 1.1],
  [22, 172, 1.6],
  [46, 176, 1.2],
]
const mirror = <T extends [number, number, number]>(list: T[]) =>
  list.flatMap(([x, y, s]) => (x === 60 ? [[x, y, s]] : [[x, y, s], [120 - x, y, s]]))

// The night-sky back shared by every deck: a plum field, a gold inner frame
// with corner dots, a crescent moon lying on its back and scattered stars.
export function CardBack() {
  return (
    <div className="card-back" aria-hidden="true">
      <svg viewBox="0 0 120 200">
        <rect className="back-line" x="7" y="7" width="106" height="186" rx="8" />
        {[
          [7, 7],
          [113, 7],
          [7, 193],
          [113, 193],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} className="back-gold" cx={x} cy={y} r="2.6" />
        ))}
        <path className="back-gold" d="M41 94a19 19 0 0 0 38 0a23 23 0 0 1 -38 0z" />
        <path className="back-gold" d={sparkle(60, 70, 7)} />
        {mirror(SPARKLES).map(([x, y, r]) => (
          <path key={`s${x}-${y}`} className="back-gold" d={sparkle(x, y, r)} />
        ))}
        {mirror(DOTS).map(([x, y, r]) => (
          <circle key={`d${x}-${y}`} className="back-gold" cx={x} cy={y} r={r} />
        ))}
      </svg>
    </div>
  )
}

type Props = { index: number; children: ReactNode }

// Shows the back, then turns the card face up after index * 0.3s. The flip is
// a CSS animation, so it plays whenever a new card mounts, and its resting
// state is the plain face-up card (see .card-flip in styles/flip.css).
export function CardFlip({ index, children }: Props) {
  return (
    <div className="card-flip" style={{ '--flip-index': index } as CSSProperties}>
      <div className="card-flip-inner">
        <CardBack />
        {children}
      </div>
    </div>
  )
}
