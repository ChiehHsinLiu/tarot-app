// npm run draw:dachshund
// Writes the Dachshund drawings in src/assets/dachshund/ from majors.ts,
// courts.ts and numbers.ts. It overwrites every file it writes, including any
// edit made by hand, so redraw a card here, not in its file. Run npm test
// afterwards: dachshund-art.test.ts checks the format and the 5 KB limit.
import fs from 'node:fs'
import path from 'node:path'
import { COURTS } from './courts.ts'
import { MAJORS } from './majors.ts'
import { NUMBERS } from './numbers.ts'
import { ROOT } from './shapes.ts'

const out = path.resolve(import.meta.dirname, '../../src/assets/dachshund')
fs.mkdirSync(out, { recursive: true })

const all = { ...MAJORS, ...COURTS, ...NUMBERS }
for (const [id, shapes] of Object.entries(all)) {
  fs.writeFileSync(path.join(out, `${id}.svg`), `${ROOT}\n  ${shapes.replace(/></g, '>\n  <')}\n</svg>\n`)
}
console.log(`Wrote ${Object.keys(all).length} drawings to ${path.relative(process.cwd(), out)}`)
