// npm run draw:tarot
// Writes the 38 tarot drawings in src/assets/tarot/ from courts.ts and
// majors.ts, one shape per line. It overwrites every file, including any edit
// made by hand, so redraw a card either here or in its file, not both. Run
// npm test afterwards: tarot-art.test.ts checks the format and the 3 KB limit.
import fs from 'node:fs'
import path from 'node:path'
import { COURTS } from './courts.ts'
import { MAJORS } from './majors.ts'
import { ROOT } from './shapes.ts'

const out = path.resolve(import.meta.dirname, '../../src/assets/tarot')

for (const [id, shapes] of Object.entries({ ...MAJORS, ...COURTS })) {
  fs.writeFileSync(path.join(out, `${id}.svg`), `${ROOT}\n  ${shapes.replace(/></g, '>\n  <')}\n</svg>\n`)
}
console.log(`Wrote ${Object.keys(MAJORS).length + Object.keys(COURTS).length} drawings to ${path.relative(process.cwd(), out)}`)
