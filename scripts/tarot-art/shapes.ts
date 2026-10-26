// The shapes the tarot drawings are built from (see draw.ts). Every shape
// uses only the art classes, so its colours come from the card's family.
export { ROOT } from '../../src/lib/art-format.ts'

// Rounds to one decimal place, to keep the files small.
export const r1 = (n: number) => Math.round(n * 10) / 10

// Eyes, cheeks and a smile for a head centred on (x, y).
export const face = (x: number, y: number) =>
  `<circle class="art-ink" cx="${x - 3.5}" cy="${y + 1}" r="1.4"/><circle class="art-ink" cx="${x + 3.5}" cy="${y + 1}" r="1.4"/>` +
  `<ellipse class="art-blush" cx="${x - 6}" cy="${y + 4.5}" rx="2.4" ry="1.5"/><ellipse class="art-blush" cx="${x + 6}" cy="${y + 4.5}" rx="2.4" ry="1.5"/>` +
  `<path class="art-line" d="M${x - 1.6} ${y + 5} q1.6 1.4 3.2 0"/>`
// A round hand.
export const hand = (x: number, y: number) => `<circle class="art-light art-line" cx="${x}" cy="${y}" r="3.2"/>`
// A rounded limb from (x, y), turned a degrees clockwise from pointing down.
export const limb = (cls: string, x: number, y: number, len: number, a: number) =>
  `<rect class="${cls} art-line" x="${x - 3.5}" y="${y}" width="7" height="${len}" rx="3.5" transform="rotate(${a} ${x} ${y})"/>`
// A round head with a face.
export const head = (x: number, y: number, r = 10) => `<circle class="art-light art-line" cx="${x}" cy="${y}" r="${r}"/>` + face(x, y)
// A rounded bell-shaped body or robe, w wide each side at the hem.
export const bell = (cls: string, x: number, t: number, b: number, w: number) =>
  `<path class="${cls} art-line" d="M${x - w} ${b} C${x - w} ${t + 12} ${r1(x - w * 0.55)} ${t} ${x} ${t} C${r1(x + w * 0.55)} ${t} ${x + w} ${t + 12} ${x + w} ${b} Z"/>`
// A limb with a hand at its end; a is degrees clockwise from pointing down.
export const arm = (cls: string, x: number, y: number, len: number, a: number) => {
  const t = (a * Math.PI) / 180
  return limb(cls, x, y, len, a) + hand(r1(x - len * Math.sin(t)), r1(y + len * Math.cos(t)))
}
// A five-point star of radius r.
export const star = (cls: string, x: number, y: number, r: number) =>
  `<polygon class="${cls}" points="${Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? r * 0.45 : r
    return `${r1(x + d * Math.cos(a))},${r1(y + d * Math.sin(a))}`
  }).join(' ')}"/>`
// The infinity loop, centred on (x, y).
export const infinity = (x: number, y: number) =>
  `<path class="art-line" d="M${x} ${y} C${x - 3} ${y - 5} ${x - 9} ${y - 5} ${x - 9} ${y} C${x - 9} ${y + 5} ${x - 3} ${y + 5} ${x} ${y} C${x + 3} ${y - 5} ${x + 9} ${y - 5} ${x + 9} ${y} C${x + 9} ${y + 5} ${x + 3} ${y + 5} ${x} ${y} Z"/>`
// A three-point crown whose band sits on y.
export const crown = (x: number, y: number) =>
  `<path class="art-fill art-line" d="M${x - 9} ${y} L${x - 9} ${y - 9} L${x - 4.5} ${y - 4} L${x} ${y - 11} L${x + 4.5} ${y - 4} L${x + 9} ${y - 9} L${x + 9} ${y} Q${x} ${y + 2.5} ${x - 9} ${y} Z"/>`
