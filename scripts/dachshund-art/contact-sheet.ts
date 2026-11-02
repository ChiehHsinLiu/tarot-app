// node scripts/dachshund-art/contact-sheet.ts <out.html> <card-id>...
// Writes a review page for a batch of Dachshund drawings: each card in the
// batch at its real size on a light and a dark page, upright and reversed,
// then a 2x view, then every drawing already approved for comparing the look.
// It uses the app's own card styles, so a card looks as it does in a reading.
// Dev-only; the page goes to the given path (the scratchpad), never the repo.
import fs from 'node:fs'
import path from 'node:path'
import { buildCards, rawCardText, toRoman } from '../../src/lib/deck.ts'
import { rawCards } from '../../src/lib/deck-ids.ts'
import { TAROT_PALETTES } from '../../src/lib/palette.ts'

const repo = path.resolve(import.meta.dirname, '../..')
const [out, ...batch] = process.argv.slice(2)
if (!out) throw new Error('usage: contact-sheet.ts <out.html> <card-id>...')

const artDir = path.join(repo, 'src/assets/dachshund')
const art = (id: string) => {
  const file = path.join(artDir, `${id}.svg`)
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
}
const cards = buildCards(rawCards, rawCardText)

function face(id: string, reversed = false) {
  const card = cards.find((c) => c.id === id)
  if (!card) throw new Error(`unknown card ${id}`)
  const edge = TAROT_PALETTES[card.suit ?? 'major'].edge
  const svg = art(id) ?? '<svg viewBox="0 0 100 100"><text x="50" y="55" text-anchor="middle" font-size="10">not drawn</text></svg>'
  return `<div class="card"><div class="card-face${reversed ? ' reversed' : ''}" style="--face-edge:${edge}">` +
    `<span class="card-numeral">${card.arcana === 'major' ? toRoman(card.rank) : ''}</span>` +
    `<span class="tarot-art">${svg}</span><span class="card-name">${card.name}</span></div>` +
    `<span class="caption">${reversed ? 'reversed' : id}</span></div>`
}

const css = ['theme.css', 'card.css'].map((f) => fs.readFileSync(path.join(repo, 'src/styles', f), 'utf8')).join('\n')
const approved = fs.existsSync(artDir)
  ? fs.readdirSync(artDir).map((f) => f.replace(/\.svg$/, '')).filter((id) => !batch.includes(id)).sort()
  : []

const row = (ids: string[], both: boolean) => `<div class="row">${ids.map((id) => face(id) + (both ? face(id, true) : '')).join('')}</div>`
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dachshund batch</title><style>${css}
body { margin: 0; font-family: system-ui, sans-serif; }
section { padding: 16px 24px; }
h2 { font-size: 16px; margin: 8px 0 12px; }
.row { display: flex; flex-wrap: wrap; gap: 18px; }
.caption { font-size: 12px; opacity: 0.7; }
.light { background: #f7f0e3; color: #2f2630; }
.dark { background: #241c2a; color: #efe4d4; --card-bg: #f6ecdc; --shadow: rgb(0 0 0 / 0.35); }
.zoom .card-face { width: 280px; padding: 30px 26px; }
.zoom .tarot-art { width: 224px; height: 224px; }
</style></head><body>
<section class="light"><h2>This batch: light page (upright, then reversed)</h2>${row(batch, true)}</section>
<section class="dark"><h2>This batch: dark page</h2>${row(batch, false)}</section>
<section class="light zoom"><h2>This batch at 2x</h2>${row(batch, false)}</section>
${approved.length ? `<section class="light"><h2>Already approved (${approved.length})</h2>${row(approved, false)}</section>` : ''}
</body></html>`
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true })
fs.writeFileSync(out, html)
console.log(`Wrote ${batch.length} new and ${approved.length} approved cards to ${out}`)
