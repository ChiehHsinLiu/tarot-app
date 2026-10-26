// Where the suit symbols sit on the Ace to Ten, in a 100x130 box: one fixed
// arrangement per number, the same in every suit. Two columns with any odd pip
// centred between them, after the Marseille decks. x and y are a pip's centre
// and size its width and height (see pips.test.ts).

export type Pip = { x: number; y: number; size: number }

const column = (x: number, ys: number[], size: number): Pip[] => ys.map((y) => ({ x, y, size }))
const pair = (ys: number[], size: number, dx = 22): Pip[] => [...column(50 - dx, ys, size), ...column(50 + dx, ys, size)]

export const PIP_LAYOUTS: Record<number, Pip[]> = {
  1: [{ x: 50, y: 65, size: 80 }],
  2: column(50, [32, 98], 42),
  3: column(50, [22, 65, 108], 36),
  4: pair([36, 94], 36),
  5: [...pair([28, 102], 33, 26), { x: 50, y: 65, size: 33 }],
  6: pair([24, 65, 106], 31, 24),
  7: [...pair([22, 72, 110], 28, 28), { x: 50, y: 47, size: 28 }],
  8: pair([18, 49, 81, 112], 28, 24),
  9: [...pair([18, 49, 81, 112], 28, 28), { x: 50, y: 65, size: 28 }],
  10: [...pair([18, 49, 81, 112], 28, 28), { x: 50, y: 33, size: 28 }, { x: 50, y: 97, size: 28 }],
}
