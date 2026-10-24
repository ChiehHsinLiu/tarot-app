// Covers lenormand-readings (dev server only): the deck picker, spreads, draw,
// reading display, prompt, instructions, deck explanation, illustrations and
// colour families, and screen-instructions: Guides follow the selected deck.
// With ASK_CLAUDE=1, also runs a real Ask Claude Yes / No and checks the journal entry.
import fs from 'node:fs'
import path from 'node:path'
import { test } from '@playwright/test'
import { journalFile, repo, setup } from '../helpers.ts'

test('Lenormand (dev only)', async ({ browser }, testInfo) => {
  test.setTimeout(300_000)
  const { appUrl, shotDir, check, grant, open, closeAll } = setup(browser, testInfo)
  try {
    const ask = !!process.env.ASK_CLAUDE
    const deck = await import(path.join(repo, 'src/lib/deck.ts'))
    const len = await import(path.join(repo, 'src/lib/lenormand.ts'))
    const template = fs.readFileSync(path.join(repo, 'prompts/lenormand.md'), 'utf8')
    const L = len.buildLenormandDeck(deck.buildSpreads(deck.rawSpreads, deck.rawSpreadText))
    const NOTE = 'In Lenormand, the answer comes from how your two cards combine. Ask Claude for a yes or no.'

    grant(['clipboard-read', 'clipboard-write'])
    const page = await open()
    const consoleErrors = []
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    await page.setViewportSize({ width: 1280, height: 900 })

    const settle = (ms = 150) => new Promise((r) => setTimeout(r, ms))
    const go = async (hash = '') => {
      await page.goto(appUrl + hash, { waitUntil: 'networkidle' })
      await settle()
    }
    const clickLink = async (text) => {
      await page.evaluate((t) => [...document.querySelectorAll('a')].find((a) => a.textContent.includes(t)).click(), text)
      await settle()
    }
    const clickButton = async (t) => {
      await page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
      await settle(300)
    }
    const hasButton = (t) => page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent.trim() === t), t)
    const composer = () => page.evaluate(() => ({
      decks: [...document.querySelectorAll('input[name=deck]')].map((i) => i.closest('label').textContent.trim()),
      deck: document.querySelector<HTMLInputElement>('input[name=deck]:checked')?.value ?? null,
      spread: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value ?? null,
      question: document.querySelector<HTMLTextAreaElement>('#question')?.value ?? null,
      details: Object.fromEntries([...document.querySelectorAll('.spread-option')].filter((l) => l.querySelector('input[name=spread]'))
        .map((l) => [l.querySelector('input').value, l.querySelector('.spread-detail')?.textContent ?? ''])),
      hint: document.querySelector('#draw-hint')?.textContent ?? '',
      drawDisabled: [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === 'Draw')?.disabled,
      pickerUnderHeading: (() => {
        const h = document.querySelector('.guided-heading'), p = document.querySelector('.deck-picker'), s = document.querySelector('.spread-picker:not(.deck-picker)')
        return !!(h && p && s && h.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING && p.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING)
      })(),
      guide: { open: !!document.querySelector('.guide-panel'), text: document.querySelector('.guide-panel')?.textContent ?? '' },
    }))
    const pick = async (name, value) => {
      await page.click(`input[name=${name}][value=${value}]`)
      await settle()
    }
    const typeQuestion = async (q) => {
      await page.click('#question', { clickCount: 3 })
      await page.keyboard.press('Backspace')
      if (q) await page.type('#question', q)
    }
    // Finish the card reveal first, so sizes are measured face up, not mid-flip.
    const reading = () => page.evaluate(() => (document.getAnimations().forEach((a) => a.finish()), {
      heading: document.querySelector('#reading-title')?.textContent ?? null,
      asked: document.querySelector('.asked')?.textContent ?? null,
      note: document.querySelector('.lenormand-note')?.textContent ?? null,
      verdict: !!document.querySelector('.verdict'),
      labels: [...document.querySelectorAll('.position-label')].map((e) => e.textContent),
      faces: [...document.querySelectorAll('.lenormand-face')].map((e) => e.getAttribute('aria-label')),
      numbers: [...document.querySelectorAll('.lenormand-face .card-numeral')].map((e) => e.textContent),
      placeholders: document.querySelectorAll('.lenormand-number').length,
      art: [...document.querySelectorAll('.lenormand-face')].map((f) => {
        const a = f.querySelector('.lenormand-art')
        const svg = a?.querySelector('svg')
        return { hidden: a?.getAttribute('aria-hidden') === 'true', svg: !!svg && svg.getBoundingClientRect().width > 50, shapes: svg?.querySelectorAll('*').length ?? 0 }
      }),
      familyFills: [...document.querySelectorAll('.lenormand-face')].map((f) => {
        const el = f.querySelector('.art-fill, .art-deep')
        return el ? getComputedStyle(el).fill : null
      }),
      faceBgs: [...document.querySelectorAll('.lenormand-face')].map((f) => getComputedStyle(f).backgroundColor),
      titles: [...document.querySelectorAll('.card-title')].map((e) => e.textContent),
      reversed: document.querySelectorAll('.card-face.reversed, .card-title-orientation').length,
      meanings: [...document.querySelectorAll('.card-meaning')].map((e) => e.textContent),
      share: [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent.trim() === 'Share'),
      focus: document.activeElement?.id ?? null,
      scrollOk: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    }))
    const idFromFace = (label) => `lenormand-${label.split(',')[0].padStart(2, '0')}`

    // --- Deck choice on the tarot screen ---
    await go('#/tarot')
    let c = await composer()
    check('picker: "Tarot" and "Lenormand"', c.decks.join('|') === 'Tarot|Lenormand', c.decks.join('|'))
    check('picker: Tarot selected by default', c.deck === 'tarot')
    check('picker: under the heading, before the spreads', c.pickerUnderHeading)
    check('tarot counts unchanged', c.details['yes-no'] === '1 card, question required' && c.details['three-card'] === '3 cards', JSON.stringify(c.details))

    await pick('spread', 'three-card')
    await typeQuestion('What should I know?')
    // Open the guide panel before switching: it must stay open with the new text.
    await page.click('.guide-toggle')
    await settle()
    await pick('deck', 'lenormand')
    c = await composer()
    check('switching to Lenormand keeps the spread and question', c.deck === 'lenormand' && c.spread === 'three-card' && c.question === 'What should I know?', JSON.stringify(c))
    check('Lenormand counts', c.details['yes-no'] === '2 cards, question required' && c.details['three-card'] === '3 cards', JSON.stringify(c.details))
    check('open guide panel stays open and switches to Lenormand', c.guide.open && c.guide.text.includes('Marie Anne Lenormand') && !c.guide.text.includes('78-card'))
    check('About this deck ends with the reflection note', c.guide.text.includes('Readings are for reflection and fun, not professional advice.'))
    check('How it works switched to Lenormand', c.guide.text.includes('Yes / No draws two cards') && c.guide.text.includes("can't be shared"))
    check('focus stays on the deck choice after switching', await page.evaluate(() => (document.activeElement as HTMLInputElement)?.name === 'deck'))
    await page.click('.guide-close')
    await settle()

    // Question rule.
    await pick('spread', 'yes-no')
    await typeQuestion('')
    c = await composer()
    check('Lenormand Yes / No needs a question', c.drawDisabled && c.hint === 'A yes / no reading needs a question.', JSON.stringify({ d: c.drawDisabled, h: c.hint }))

    // Deck resets to Tarot after Home; choose Lenormand and Yes / No again.
    await clickLink('Home')
    await clickLink('Tarot reading')
    c = await composer()
    check('deck resets to Tarot after Home', c.deck === 'tarot' && c.spread === null && !c.guide.open, JSON.stringify({ deck: c.deck, spread: c.spread }))
    await pick('deck', 'lenormand')
    await pick('spread', 'yes-no')

    // --- Yes / No reading ---
    await typeQuestion('Will the trip go well?')
    await clickButton('Draw')
    let r = await reading()
    check('Yes / No heading', r.heading === 'Lenormand · Yes / No', r.heading)
    check('Yes / No question shown', r.asked === '“Will the trip go well?”', r.asked)
    check('Yes / No labels First card, Second card', r.labels.join('|') === 'First card|Second card', r.labels.join('|'))
    check('two distinct Lenormand cards', r.faces.length === 2 && new Set(r.faces).size === 2, r.faces.join('|'))
    check('faces named "number, name"', r.faces.every((f) => /^\d{1,2}, [A-Z][a-z]+$/.test(f) && L.cardsById.get(idFromFace(f))?.name === f.split(', ')[1]), r.faces.join('|'))
    check('faces show the number at the top', r.numbers.join('|') === r.faces.map((f) => f.split(',')[0]).join('|'))
    check('every face shows its drawing, hidden from assistive tech', r.art.length === 2 && r.art.every((a) => a.svg && a.hidden && a.shapes > 3), JSON.stringify(r.art))
    check('no number placeholder left', r.placeholders === 0)
    const famOf = (f) => L.cardsById.get(idFromFace(f)).palette
    check('face colours follow each card family', r.faces.every((f, i) => r.faceBgs[i] === r.faceBgs[r.faces.findIndex((g) => famOf(g) === famOf(f))]) &&
      (famOf(r.faces[0]) === famOf(r.faces[1]) ? r.faceBgs[0] === r.faceBgs[1] : r.faceBgs[0] !== r.faceBgs[1]), JSON.stringify({ fams: r.faces.map(famOf), bgs: r.faceBgs }))
    check('meanings match the deck', r.meanings.join('|') === r.faces.map((f) => L.cardsById.get(idFromFace(f)).meaning).join('|'))
    check('none reversed', r.reversed === 0)
    check('note instead of a verdict', r.note === NOTE && !r.verdict, r.note)
    // Ask Claude is a lazy dev-only chunk; give it time to arrive.
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'Ask Claude'), undefined, { timeout: 10_000 }).catch(() => {})
    check('actions: New reading, Copy for Claude, Ask Claude', (await hasButton('New reading')) && (await hasButton('Copy for Claude')) && (await hasButton('Ask Claude')))
    check('no Share', !r.share)
    check('focus on the reading heading', r.focus === 'reading-title')
    await page.screenshot({ path: path.join(shotDir, 'lenormand-yes-no-1280.png'), fullPage: true })

    // Copy for Claude copies the Lenormand prompt.
    const yesNoReading = {
      spreadId: 'yes-no',
      question: 'Will the trip go well?',
      cards: r.faces.map((f, i) => ({ cardId: idFromFace(f), positionId: ['first', 'second'][i], reversed: false })),
    }
    await clickButton('Copy for Claude')
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    const expected = len.buildLenormandPrompt(template, yesNoReading, L.spreads.find((s) => s.id === 'yes-no'), L.cardsById)
    check('Copy for Claude copies the Lenormand prompt', copied === expected, copied.slice(0, 80))

    // --- Ask Claude (real), optional ---
    if (ask) {
      const before = fs.existsSync(journalFile()) ? fs.readFileSync(journalFile(), 'utf8').trim().split('\n').filter(Boolean).length : 0
      await clickButton('Ask Claude')
      await page.waitForFunction(() => ['Reading complete.', 'Stopped.'].includes(document.querySelector('.claude-answer-status')?.textContent) || document.querySelector('.claude-answer-status.error'), undefined, { timeout: 150_000 })
      const answer = await page.evaluate(() => ({ status: document.querySelector('.claude-answer-status')?.textContent, text: document.querySelector('.claude-answer-text')?.textContent ?? '', first: document.querySelector('.claude-answer-text')?.firstElementChild?.textContent ?? '' }))
      check('Ask Claude completes', answer.status === 'Reading complete.', answer.status)
      check('answer starts with Yes, No or Maybe', /^\s*(Yes|No|Maybe)\b/.test(answer.first), answer.first.slice(0, 60))
      await settle(500)
      const lines = fs.readFileSync(journalFile(), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
      const entry = lines[lines.length - 1]
      check('journal: one new Lenormand entry', lines.length === before + 1 && entry.deck === 'lenormand' && entry.status === 'completed', JSON.stringify(entry).slice(0, 120))
      check('journal: spread, cards and question recorded', entry.spreadId === 'yes-no' && JSON.stringify(entry.cards) === JSON.stringify(yesNoReading.cards.map((x) => x.cardId)) && entry.question === 'Will the trip go well?')
      await page.screenshot({ path: path.join(shotDir, 'lenormand-ask-1280.png'), fullPage: true })
    }

    // New reading keeps the deck and spread, with an empty question.
    await clickButton('New reading')
    c = await composer()
    check('New reading: Lenormand and Yes / No kept, question empty', c.deck === 'lenormand' && c.spread === 'yes-no' && c.question === '', JSON.stringify(c))

    // --- Three cards ---
    await pick('spread', 'three-card')
    await clickButton('Draw')
    r = await reading()
    check('Three cards heading', r.heading === 'Lenormand · Three cards', r.heading)
    check('Three cards labels Past, Present, Future', r.labels.join('|') === 'Past|Present|Future')
    check('three distinct cards, none reversed', new Set(r.faces).size === 3 && r.reversed === 0)
    check('no Yes / No note on Three cards', r.note === null && !r.verdict)

    // Two families give different drawing colours: draw until a sage and a sky card are both on screen.
    const seen: Record<string, any> = {}
    for (let i = 0; i < 40 && !(seen.sage && seen.sky); i++) {
      const x = await reading()
      x.faces.forEach((f, j) => { const fam = famOf(f); if ((fam === 'sage' || fam === 'sky') && x.familyFills[j]) seen[fam] = x.familyFills[j] })
      if (!(seen.sage && seen.sky)) { await clickButton('New reading'); await clickButton('Draw') }
    }
    check('sage and sky drawings use different colours', seen.sage && seen.sky && seen.sage !== seen.sky, JSON.stringify(seen))

    // Offline after a reading: drawing again still shows drawings.
    await page.context().setOffline(true)
    await clickButton('New reading')
    await clickButton('Draw')
    const off = await reading()
    check('offline: new cards still show their drawings', off.art.length === 3 && off.art.every((a) => a.svg), JSON.stringify(off.art))
    await page.context().setOffline(false)

    // Many draws: always distinct and upright.
    let allGood = true
    for (let i = 0; i < 15; i++) {
      await clickButton('New reading')
      await clickButton('Draw')
      const x = await reading()
      if (new Set(x.faces).size !== 3 || x.reversed !== 0 || !x.art.every((a) => a.svg)) allGood = false
    }
    check('15 more draws: always distinct, upright and drawn', allGood)

    // Back to Tarot: tarot readings unchanged.
    await clickButton('New reading')
    await pick('deck', 'tarot')
    await pick('spread', 'yes-no')
    await typeQuestion('Is it a good day?')
    await clickButton('Draw')
    const t = await page.evaluate(() => ({
      heading: document.querySelector('#reading-title')?.textContent,
      verdict: !!document.querySelector('.verdict'),
      share: [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent.trim() === 'Share'),
      faces: document.querySelectorAll('.card-face').length,
      lenormand: document.querySelectorAll('.lenormand-face, .lenormand-note').length,
    }))
    check('tarot Yes / No unchanged: one card, verdict, Share', t.heading === 'Yes / No' && t.verdict && t.share && t.faces === 1 && t.lenormand === 0, JSON.stringify(t))

    // --- Phone width, light and dark ---
    await page.setViewportSize({ width: 320, height: 800 })
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await go('#/tarot')
      await clickButton('New reading').catch(() => {})
      await pick('deck', 'lenormand')
      await pick('spread', 'yes-no')
      await typeQuestion('Will it work out?')
      await clickButton('Draw')
      r = await reading()
      check(`320px ${scheme}: no horizontal scroll`, r.scrollOk)
      await page.screenshot({ path: path.join(shotDir, `lenormand-320-${scheme}.png`), fullPage: true })
    }

    check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
  } finally {
    await closeAll()
  }
})
