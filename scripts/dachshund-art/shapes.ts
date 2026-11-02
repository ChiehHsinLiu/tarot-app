// The shapes the Dachshund drawings are built from (see draw.ts). Every shape
// uses only the art classes, so its colours come from the card's family; the
// dog is the same helper on every card so all 78 look like one breed.
export { ROOT } from '../../src/lib/art-format.ts'

// Rounds to one decimal place, to keep the files small.
export const r1 = (n: number) => Math.round(n * 10) / 10

export type Pose = 'stand' | 'sit' | 'beg' | 'run' | 'sleep'

export type DogOptions = {
  // Where the dog's hind feet meet the ground.
  x: number
  y: number
  // 1 is about 70 units nose to tail; the card is 100 wide.
  size?: number
  // 1 faces right, -1 faces left.
  facing?: 1 | -1
  pose?: Pose
  // Extra shapes in the dog's own coordinates (facing right, hind feet at 0,0,
  // standing body from y -22 to -7, head centred on 24,-24 before posing),
  // drawn on top: a hat, something in the mouth, a cape.
  wear?: string
}

const leg = (x: number, top: number, len: number, a = 0, cls = 'art-coat') =>
  `<rect class="${cls} art-line" x="${r1(x - 3)}" y="${r1(top)}" width="6" height="${r1(len)}" rx="3"${a ? ` transform="rotate(${a} ${r1(x)} ${r1(top)})"` : ''}/>`

// The long body, tail, head, floppy ear and long snout, standing and facing right.
function upper(pose: Pose, wear: string) {
  const ear = pose === 'run' ? 'M21 -29 C14 -34 6 -32 3 -29 C8 -27 15 -25 21 -25 Z' : 'M20 -30 C14 -29 13 -18 17 -14 C21 -16 23 -22 20 -30 Z'
  const tail = pose === 'run' ? 'M-21 -16 Q-30 -17 -35 -14' : 'M-21 -16 Q-28 -19 -30 -27'
  return (
    `<path class="art-line" d="${tail}"/>` +
    `<rect class="art-coat art-line" x="-24" y="-22" width="46" height="15" rx="7.5"/>` +
    `<path class="art-light" d="M8 -9.5 Q15 -8.5 20 -12 L20 -16 Q14 -12 8 -12.5 Z"/>` +
    `<circle class="art-coat art-line" cx="24" cy="-24" r="9"/>` +
    `<ellipse class="art-coat art-line" cx="32" cy="-19.5" rx="5.8" ry="4.4"/>` +
    `<circle class="art-ink" cx="37" cy="-21" r="2.1"/>` +
    `<path class="art-line" d="M31 -16.5q2 1.8 4 0"/>` +
    `<circle class="art-ink" cx="26.8" cy="-26.3" r="2.4"/><circle class="art-light" cx="27.6" cy="-27.2" r="0.9"/>` +
    `<ellipse class="art-blush" cx="25.5" cy="-20.5" rx="2.6" ry="1.6"/>` +
    `<path class="art-ear art-line" d="${ear}"/>` +
    wear
  )
}

// A whole dachshund. Poses tip the body up from the hips: sit and beg show the
// front legs, run spreads the legs and flies the ear back, sleep curls up.
export function dog({ x, y, size = 1, facing = 1, pose = 'stand', wear = '' }: DogOptions) {
  let body: string
  if (pose === 'sleep') {
    body =
      `<path class="art-line" d="M-20 -6 Q-28 -4 -26 2"/>` +
      `<ellipse class="art-coat art-line" cx="0" cy="-8" rx="24" ry="8.5"/>` +
      `<ellipse class="art-coat art-line" cx="22" cy="-6" rx="9" ry="6"/>` +
      `<circle class="art-ink" cx="31" cy="-6" r="1.7"/>` +
      `<path class="art-line" d="M19 -8 q2.5 1.6 5 0"/>` +
      `<path class="art-ear art-line" d="M17 -11 C12 -11 10 -4 13 -1 C17 -3 19 -7 17 -11 Z"/>` +
      `<path class="art-line" d="M30 -18 h4 l-4 4 h4 M37 -24 h3 l-3 3 h3"/>` +
      wear
  } else {
    // Hips at (-16, -10); the upper body turns about them.
    const tilt = pose === 'sit' ? -22 : pose === 'beg' ? -62 : 0
    const t = (tilt * Math.PI) / 180
    const turn = (px: number, py: number) => [
      -16 + (px + 16) * Math.cos(t) - (py + 10) * Math.sin(t),
      -10 + (px + 16) * Math.sin(t) + (py + 10) * Math.cos(t),
    ]
    const [cx, cy] = turn(13, -10)
    let hind: string, front: string
    if (pose === 'stand') {
      hind = leg(-12, -10, 10) + leg(-19, -10, 10)
      front = leg(17, -10, 10) + leg(10, -10, 10)
    } else if (pose === 'run') {
      hind = leg(-12, -11, 11, 40) + leg(-19, -11, 11, 60)
      front = leg(16, -11, 11, -45) + leg(9, -11, 11, -65)
    } else {
      // A round haunch on the ground, and front legs from the chest.
      hind = `<ellipse class="art-coat art-line" cx="-13" cy="-5" rx="9" ry="5.5"/>`
      front =
        pose === 'sit'
          ? leg(cx + 2, cy, -cy) + leg(cx - 2, cy, -cy)
          : leg(cx + 1, cy, 9, -70) + leg(cx - 2, cy + 2, 9, -60)
    }
    const up = upper(pose, wear)
    body = hind + (tilt ? `<g transform="rotate(${tilt} -16 -10)">${up}</g>` : up) + front
  }
  const scale = r1(size) === 1 && facing === 1 ? '' : ` scale(${facing === -1 ? -r1(size) : r1(size)} ${r1(size)})`
  return `<g transform="translate(${r1(x)} ${r1(y)})${scale}">${body}</g>`
}

// The four suit symbols, as on the Classic pips, in a 24x24 box centred on (x, y).
const SYMBOL: Record<string, string> = {
  wands: `<path class="art-line" d="M7 21.5L16.5 3"/><path class="art-fill art-line" d="M12.6 10.5c1.8-.4 3.3.1 4.4 1.5-1.8.5-3.3 0-4.4-1.5zM10 15.5c-1.8-.2-3.2.5-4 2 1.8.2 3.2-.5 4-2z"/>`,
  cups: `<path class="art-fill art-line" d="M6 4.5h12c0 4.8-2.4 8-6 8s-6-3.2-6-8zM12 12.5v5M8.5 20.5c0-1.7 1.6-3 3.5-3s3.5 1.3 3.5 3z"/>`,
  swords: `<path class="art-light art-line" d="M12 2.5c1.3 1.6 2 3.2 2 5v7.5h-4V7.5c0-1.8.7-3.4 2-5z"/><path class="art-line" d="M6.5 15c1.5.9 3.3 1.3 5.5 1.3s4-.4 5.5-1.3M12 16.3v3.2"/><circle class="art-fill art-line" cx="12" cy="20.8" r="1.3"/>`,
  pentacles: `<circle class="art-light art-line" cx="12" cy="12" r="8.5"/><path class="art-fill art-line" d="M12 5.8l1.7 4.4 4.6.2-3.6 2.9 1.3 4.5L12 15.2l-3.9 2.6 1.2-4.5-3.6-2.9 4.6-.2z"/>`,
}
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export const symbol = (suit: Suit, x: number, y: number, size = 16, a = 0) =>
  `<g transform="translate(${r1(x)} ${r1(y)})${a ? ` rotate(${a})` : ''} scale(${r1(size / 24)}) translate(-12 -12)">${SYMBOL[suit]}</g>`

// Ground and sky bits shared by many scenes.
export const ground = (y = 88, cls = 'art-leaf') => `<path class="${cls} art-line" d="M2 98V${y}Q50 ${y - 4} 98 ${y}V98Z"/>`
// A crescent moon opening to the right, r the outer radius.
export const moon = (cls: string, x: number, y: number, r: number) =>
  `<path class="${cls} art-line" d="M${x} ${r1(y - r)}A${r} ${r} 0 1 0 ${x} ${r1(y + r)}A${r1(r * 0.2)} ${r} 0 1 1 ${x} ${r1(y - r)}Z"/>`
// The infinity loop, centred on (x, y).
export const infinity = (x: number, y: number) =>
  `<path class="art-line" d="M${x} ${y}C${x - 3} ${y - 5} ${x - 9} ${y - 5} ${x - 9} ${y}C${x - 9} ${y + 5} ${x - 3} ${y + 5} ${x} ${y}C${x + 3} ${y - 5} ${x + 9} ${y - 5} ${x + 9} ${y}C${x + 9} ${y + 5} ${x + 3} ${y + 5} ${x} ${y}Z"/>`
// A heart centred on (x, y), r about half its width.
export const heart = (cls: string, x: number, y: number, r: number) =>
  `<path class="${cls} art-line" d="M${x} ${r1(y + r)}C${r1(x - r * 1.6)} ${r1(y - r * 0.2)} ${r1(x - r * 0.7)} ${r1(y - r * 1.3)} ${x} ${r1(y - r * 0.4)}C${r1(x + r * 0.7)} ${r1(y - r * 1.3)} ${r1(x + r * 1.6)} ${r1(y - r * 0.2)} ${x} ${r1(y + r)}Z"/>`
// A puffy cloud centred on (x, y).
export const cloud = (cls: string, x: number, y: number) =>
  `<path class="${cls} art-line" d="M${x - 12} ${y + 4}q-4-6 3-8q1-6 8-5q4-5 10 0q7 0 6 6q4 4-1 7Z"/>`
export const star = (cls: string, x: number, y: number, r: number) =>
  `<polygon class="${cls}" points="${Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? r * 0.45 : r
    return `${r1(x + d * Math.cos(a))},${r1(y + d * Math.sin(a))}`
  }).join(' ')}"/>`
