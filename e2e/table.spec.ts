// Covers visual-theme: Drawn cards lie on a reading mat, Each stacked card has
// its own mat on a phone, Position labels are readable on the mat, The mat
// stays out of the way, Face-down spread preview on the tarot screen, The
// preview is decorative. The Lenormand part runs on the dev server only.
// The mat is a ::before pseudo-element, so its box is worked out from the grid's
// computed rows: it covers the first two rows (position label and card), or the
// oracle card's single row.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup, axSnapshot } from './helpers.ts'

test('reading mat and spread preview', async ({ browser }, testInfo) => {
  test.setTimeout(240_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const origin = new URL(appUrl).origin

    const consoleErrors = []
    const outside = []
    async function newPage(scheme: 'light' | 'dark' = 'light', width = 1280) {
      const page = await open()
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
      page.on('pageerror', (e) => consoleErrors.push(e.message))
      page.on('request', (r) => !r.url().startsWith(origin) && !r.url().startsWith('data:') && outside.push(r.url()))
      await page.emulateMedia({ colorScheme: scheme })
      await page.setViewportSize({ width, height: 900 })
      return page
    }
    const clickButton = (page, t) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
    const finish = (page) => page.evaluate(() => document.getAnimations().forEach((a) => a.finish()))
    async function drawTarot(page, spread, { deck, question }: { deck?: string; question?: string } = {}) {
      await page.goto('about:blank')
      await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
      if (deck) await page.click(`input[name=deck][value=${deck}]`)
      await page.click(`input[name=spread][value=${spread}]`)
      if (question) await page.type('#question', question)
      await page.click('button[type=submit]')
      await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
      await finish(page)
    }
    const noHScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)

    // Where the mats are: one per grid that draws a ::before, with its box (from the
    // grid's first two rows), the labels and cards inside it and the text below it.
    const mats = (page) => page.evaluate(() => {
      const matBox = (grid) => {
        const r = grid.getBoundingClientRect()
        const cs = getComputedStyle(grid)
        const rows = cs.gridTemplateRows.split(' ').map(parseFloat)
        const gap = parseFloat(cs.rowGap) || 0
        // The oracle mat covers only the card's row; reading mats cover label and card.
        const height = grid.classList.contains('oracle-slot') ? rows[0] : rows[0] + gap + rows[1]
        return { left: r.left, right: r.right, top: r.top, bottom: r.top + height }
      }
      const has = (el) => getComputedStyle(el, '::before').content !== 'none'
      const grids = [...document.querySelectorAll('.spread, .spread-slot, .oracle-slot')].filter(has)
      return grids.map((g) => {
        const box = matBox(g)
        const inside = (el) => { const r = el.getBoundingClientRect(); return r.top >= box.top - 1 && r.bottom <= box.bottom + 1 && r.left >= box.left - 1 && r.right <= box.right + 1 }
        const below = (el) => el.getBoundingClientRect().top >= box.bottom - 1
        // Only slot labels belong on the mat (the oracle's "Reflect" label is below it).
        const labels = [...g.querySelectorAll('.spread-slot > .position-label')]
        const cards = [...g.querySelectorAll('.card-face')]
        const text = [...g.querySelectorAll('.card-title, .card-keywords, .card-meaning, .oracle-message, .oracle-reflect, .oracle-affirmation')]
        return {
          kind: g.classList.contains('spread') ? 'row' : g.classList.contains('oracle-slot') ? 'oracle' : 'slot',
          cards: cards.length,
          ok: labels.every(inside) && cards.length > 0 && cards.every(inside) && text.length > 0 && text.every(below),
          cloth: getComputedStyle(g, '::before').backgroundColor,
        }
      })
    })

    // --- Wide: one mat across the row ---
    const wide = await newPage('light', 1280)
    await drawTarot(wide, 'three-card')
    let m = await mats(wide)
    check('1280 three cards: one mat spans all three cards and labels, text below it', m.length === 1 && m[0].kind === 'row' && m[0].cards === 3 && m[0].ok, JSON.stringify(m))
    check('the mat is the teal cloth', m[0]?.cloth === 'rgb(31, 74, 76)', m[0]?.cloth)
    await wide.screenshot({ path: path.join(shotDir, 'table-wide.png'), fullPage: true })

    // Accessibility: the mat adds nothing, and the reading reads in order.
    const snap = await axSnapshot(wide)
    const names = []
    const walk = (n) => { if (n.name) names.push(n.name); (n.children ?? []).forEach(walk) }
    walk(snap)
    const expected = await wide.evaluate(() => [...document.querySelectorAll('.spread-slot')].flatMap((s) => [
      s.querySelector('.position-label').textContent, s.querySelector('.card-face').getAttribute('aria-label'), s.querySelector('.card-meaning').textContent]))
    let at = -1
    // Labels are uppercased by CSS, which Chrome passes on to the accessibility tree.
    const inOrder = expected.every((t) => { const i = names.findIndex((n, k) => k > at && n.toLowerCase().includes(t.toLowerCase())); if (i < 0) return false; at = i; return true })
    check('screen readers get each position, card and meaning in order', inOrder, expected.join(' / '))
    check('the mat adds nothing focusable', await wide.evaluate(() => [...document.querySelectorAll<HTMLElement>('.spread *')].every((e) => e.tabIndex < 0)))

    // Label contrast on the cloth.
    const contrast = await wide.evaluate(() => {
      const hex = (h) => [1, 3, 5].map((i) => parseInt(h.trim().slice(i, i + 2), 16))
      const rgb = (c) => c.match(/\d+/g).slice(0, 3).map(Number)
      const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
      const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2) }
      const root = getComputedStyle(document.documentElement)
      const label = rgb(getComputedStyle(document.querySelector('.spread .position-label')).color)
      return ['--mat-bg', '--mat-sheen'].map((v) => ratio(label, hex(root.getPropertyValue(v))))
    })
    check('position labels are at least 4.5:1 on both cloth colours', contrast.every((r) => r >= 4.5), JSON.stringify(contrast))

    // Shared reading.
    await clickButton(wide, 'Share')
    await wide.waitForSelector('input[readonly]', { state: 'attached' })
    const link = await wide.evaluate(() => document.querySelector<HTMLInputElement>('input[readonly]').value)
    await wide.goto('about:blank')
    await wide.goto(link, { waitUntil: 'networkidle' })
    await wide.waitForSelector('.reading', { state: 'attached' })
    m = await mats(wide)
    check('a shared reading lies on the mat too', m.length === 1 && m[0].kind === 'row' && m[0].cards === 3 && m[0].ok, JSON.stringify(m))

    // Oracle.
    await wide.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
    await clickButton(wide, 'Draw')
    await wide.waitForSelector('.oracle-face', { state: 'attached' })
    await finish(wide)
    m = await mats(wide)
    check('the oracle card lies on a mat, its reading below', m.length === 1 && m[0].kind === 'oracle' && m[0].ok, JSON.stringify(m))

    // Lenormand (dev only).
    if (!publicBuild) {
      await drawTarot(wide, 'yes-no', { deck: 'lenormand', question: 'Will it work out?' })
      m = await mats(wide)
      check('Lenormand Yes / No at 1280: one mat across both cards', m.length === 1 && m[0].kind === 'row' && m[0].cards === 2 && m[0].ok, JSON.stringify(m))
    }
    await wide.close()

    // --- Phone: a mat per card ---
    for (const scheme of ['light', 'dark'] as const) {
      const phone = await newPage(scheme, 375)
      await drawTarot(phone, 'three-card')
      m = await mats(phone)
      check(`${scheme} 375 three cards: each card on its own mat, text below`, m.length === 3 && m.every((x) => x.kind === 'slot' && x.cards === 1 && x.ok), JSON.stringify(m))
      await phone.screenshot({ path: path.join(shotDir, `table-phone-${scheme}.png`), fullPage: true })
      await phone.setViewportSize({ width: 320, height: 900 })
      check(`${scheme} 320 reading: no horizontal scroll`, await noHScroll(phone))
      await drawTarot(phone, 'yes-no', { question: 'Sunny?' })
      check(`${scheme} 320 Yes / No: no horizontal scroll`, await noHScroll(phone))
      await phone.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
      await clickButton(phone, 'Draw')
      await phone.waitForSelector('.oracle-face', { state: 'attached' })
      check(`${scheme} 320 oracle: no horizontal scroll`, await noHScroll(phone))
      await phone.close()
    }

    // --- The preview on the tarot screen ---
    const pv = await newPage('light', 1280)
    await pv.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    const preview = () => pv.evaluate(() => {
      const p = document.querySelector('.spread-preview')
      const draw = document.querySelector('.draw-row')
      return p && {
        backs: p.querySelectorAll('.card-back').length,
        labels: [...p.querySelectorAll('.position-label')].map((l) => l.textContent),
        hidden: p.getAttribute('aria-hidden') === 'true',
        beforeDraw: p.nextElementSibling === draw,
        focusable: [...p.querySelectorAll<HTMLElement>('*')].some((e) => e.tabIndex >= 0),
        anims: document.getAnimations().length,
        cloth: getComputedStyle(p).backgroundColor,
      }
    })
    let s = await preview()
    check('fresh tarot screen: an empty mat just above Draw', s && s.backs === 0 && s.beforeDraw && s.cloth === 'rgb(31, 74, 76)', JSON.stringify(s))
    await pv.click('input[name=spread][value=three-card]')
    s = await preview()
    check('Three cards: three backs labelled Past, Present, Future', s.backs === 3 && s.labels.join() === 'Past,Present,Future', JSON.stringify(s))
    await pv.screenshot({ path: path.join(shotDir, 'table-preview.png'), fullPage: true })
    const pvSnap = await axSnapshot(pv)
    const pvNames = []
    const walkPv = (n) => { pvNames.push(`${n.role}:${n.name ?? ''}`); (n.children ?? []).forEach(walkPv) }
    walkPv(pvSnap)
    check('the preview is hidden from assistive technology and not focusable', s.hidden && !s.focusable && !pvNames.some((n) => /Past|Present|Future/.test(n) || /^(img|image)/.test(n)), pvNames.join(' | '))
    await pv.click('input[name=spread][value=yes-no]')
    s = await preview()
    check('switching to Yes / No: one back, and nothing moves', s.backs === 1 && s.labels.length === 1 && s.anims === 0, JSON.stringify(s))
    if (!publicBuild) {
      await pv.click('input[name=deck][value=lenormand]')
      await pv.click('input[name=spread][value=yes-no]')
      s = await preview()
      check('Lenormand Yes / No: two backs with its two positions', s.backs === 2 && s.labels.length === 2, JSON.stringify(s))
    }
    for (const scheme of ['light', 'dark'] as const) {
      const small = await newPage(scheme, 320)
      await small.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
      await small.click('input[name=spread][value=three-card]')
      const row = await small.evaluate(() => {
        const tops = [...document.querySelectorAll('.spread-preview .card-back')].map((b) => Math.round(b.getBoundingClientRect().top))
        return { sideBySide: tops.length === 3 && new Set(tops).size === 1, inside: [...document.querySelectorAll('.spread-preview .card-back')].every((b) => b.getBoundingClientRect().right <= innerWidth) }
      })
      check(`${scheme} 320 preview: three backs side by side, no horizontal scroll`, row.sideBySide && row.inside && (await noHScroll(small)), JSON.stringify(row))
      await small.close()
    }
    await pv.close()

    // Draw centred under the mat, its hint on its own centred line under it
    // (Yes / No with no question, so the hint shows).
    for (const width of [1280, 320]) {
      const page = await newPage('light', width)
      await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
      await page.click('input[name=spread][value=yes-no]')
      const c = await page.evaluate(() => {
        const box = (s) => document.querySelector(s).getBoundingClientRect()
        const mat = box('.spread-preview'), btn = box('.draw-row button'), hint = box('.draw-hint')
        const mid = (r) => r.left + r.width / 2
        const text = document.querySelector('.draw-hint')
        return {
          drawOff: Math.abs(mid(btn) - mid(mat)),
          hintBelow: hint.top >= btn.bottom,
          hintOff: Math.abs(mid(hint) - mid(mat)),
          hintAlign: getComputedStyle(text).textAlign,
          hint: text.textContent,
        }
      })
      check(`${width}: Draw centred under the mat, hint below and centred`, c.drawOff <= 2 && c.hintBelow && c.hintOff <= 2 && c.hintAlign === 'center' && /question/.test(c.hint), JSON.stringify(c))
      await page.close()
    }

    check('no request to another origin', outside.length === 0, outside.join(' | '))
    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
