// Covers visual-theme: Light and dark palettes follow the system, Heading font
// is bundled, Storybook card face, Oracle cards have their own colours,
// Decoration stays out of the way, Text stays readable. Also title-page:
// Document title is the site name, and tarot-deck: Reversed cards are visibly
// reversed and readable. Offline drawing is checked on the public build only.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup, axSnapshot } from './helpers.ts'

test('visual theme: palettes, font, decoration, contrast', async ({ browser }, testInfo) => {
  test.setTimeout(300_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const origin = new URL(appUrl).origin

    const page = await open()
    const errors = []
    const foreign = []
    const fontRequests = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('request', (r) => {
      const u = r.url()
      if (u.startsWith('data:')) return
      if (new URL(u).origin !== origin) foreign.push(u)
      if (r.resourceType() === 'font') fontRequests.push(u)
    })
    const settle = (ms = 250) => new Promise((r) => setTimeout(r, ms))
    const clickButton = (t) => page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)

    // Contrast of each matched element's text against its effective background (alpha-blended up the tree).
    const measure = (selectors) => page.evaluate((selectors) => {
      const parse = (c) => {
        let m = c.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
        if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]]
        m = c.match(/^color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.]+))?\)/)
        if (m) return [m[1] * 255, m[2] * 255, m[3] * 255, m[4] === undefined ? 1 : +m[4]]
        return null
      }
      const blend = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3])).concat(1)
      const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1)
      const bgOf = (el) => {
        // Position labels sit on the reading mat, a ::before pseudo-element that is
        // not an ancestor; measure them against the lighter cloth colour (worst case).
        if (el.matches('.spread .position-label, .spread-preview .position-label'))
          return hex(getComputedStyle(document.documentElement).getPropertyValue('--mat-sheen').trim())
        const layers = []
        for (let e = el; e; e = e.parentElement) {
          const c = parse(getComputedStyle(e).backgroundColor)
          if (c && c[3] > 0) { layers.push(c); if (c[3] === 1) break }
        }
        let bg = parse(getComputedStyle(document.documentElement).backgroundColor) || [255, 255, 255, 1]
        for (const l of layers.reverse()) bg = blend(l, bg)
        return bg
      }
      const lum = ([r, g, b]: number[]) => {
        const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
      }
      const out = []
      for (const [sel, min] of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue
          if (el.disabled) continue
          const bg = bgOf(el)
          const fg = blend(parse(getComputedStyle(el).color), bg)
          const [a, b] = [lum(fg), lum(bg)]
          out.push({ sel, min, ratio: +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2), text: el.textContent.trim().slice(0, 30) })
        }
      }
      return out
    }, selectors)

    const TEXT = [
      ['.subtitle', 4.5], ['.home-choice-description', 4.5], ['.home-link', 4.5], ['.spread-detail', 4.5],
      ['.question-box label', 4.5], ['.question-count', 4.5], ['.draw-hint', 4.5], ['.position-label', 4.5],
      ['.card-keywords', 4.5], ['.card-meaning', 4.5], ['.card-title', 4.5], ['.card-title-orientation', 4.5],
      ['.card-name', 4.5], ['.card-numeral', 4.5], ['.oracle-face-theme', 4.5], ['.oracle-intro', 4.5],
      ['.oracle-message', 4.5], ['.oracle-reflect p', 4.5], ['.oracle-affirmation', 4.5], ['.verdict-note', 4.5],
      ['.asked', 4.5], ['button.primary', 4.5], ['button.secondary', 4.5], ['.home-choice-title', 3], ['h1', 3], ['h2', 3],
      ['.verdict-word', 3],
    ]
    const pages = [
      ['home', ''], ['tarot', '#/tarot'], ['three', '#/r/v1/three-card/major-16.cups-03r.pentacles-01?q=Will%20it%20work%3F'],
      ['yesno-no', '#/r/v1/yes-no/wands-05'], ['yesno-yes', '#/r/v1/yes-no/cups-01'], ['yesno-maybe', '#/r/v1/yes-no/major-10r'],
      ['oracle-intro', '#/oracle'],
    ]

    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 900 })
        const worst = []
        for (const [name, hash] of pages) {
          await page.goto(appUrl + hash, { waitUntil: 'networkidle' })
          await settle()
          for (const m of await measure(TEXT)) if (m.ratio < m.min) worst.push(`${name} ${m.sel} "${m.text}" ${m.ratio}`)
          check(`${scheme} ${width} ${name}: no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        }
        // Every oracle family, through Draw again, until all six have been seen.
        await page.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
        await clickButton('Draw'); await settle(100)
        const seen = new Set()
        for (let i = 0; i < 200 && seen.size < 6; i++) {
          const fam = await page.$eval('.oracle-face', (f) => f.dataset.palette)
          if (!seen.has(fam)) {
            seen.add(fam)
            for (const m of await measure(TEXT)) if (m.ratio < m.min) worst.push(`oracle/${fam} ${m.sel} "${m.text}" ${m.ratio}`)
            if (width === 1280) await page.screenshot({ path: path.join(shotDir, `oracle-${fam}-${scheme}.png`), fullPage: true })
          }
          await clickButton('Draw again'); await settle(30)
        }
        check(`${scheme} ${width}: all six oracle families seen`, seen.size === 6, [...seen].join(','))
        check(`${scheme} ${width}: text contrast meets the minimums`, worst.length === 0, worst.join(' | '))
      }
    }

    // Palettes switch without reload.
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(appUrl, { waitUntil: 'networkidle' })
    const lightBg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
    await page.evaluate(() => { window.__marker = 1 })
    await page.emulateMedia({ colorScheme: 'dark' })
    await settle()
    const darkBg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
    check('palette switches without reload', lightBg !== darkBg && (await page.evaluate(() => window.__marker === 1)), `${lightBg} -> ${darkBg}`)
    const darkText = await page.evaluate(() => getComputedStyle(document.body).color)
    check('dark palette: light text', /rgb\((2[0-9]{2}), (2[0-9]{2}), (2[0-9]{2})\)/.test(darkText), darkText)

    // Font: bundled, same origin, loaded.
    await page.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    check('Fraunces loaded', await page.evaluate(() => document.fonts.check('1em "Fraunces Variable"')))
    check('headings use the storybook font', await page.evaluate(() => getComputedStyle(document.querySelector('h1')).fontFamily.includes('Fraunces')))
    check('font requests are same-origin', fontRequests.length > 0 && fontRequests.every((u) => new URL(u).origin === origin), fontRequests.join(' '))
    check('no request to another origin', foreign.length === 0, foreign.join(' '))

    // Offline after load: draw and the font is still used. Public build only: in dev the
    // lazy Ask Claude chunk under the card would need the network.
    if (publicBuild) {
      await page.context().setOffline(true)
      await clickButton('Draw'); await settle()
      check('offline: oracle card name in Fraunces', await page.evaluate(() => document.fonts.check('1em "Fraunces Variable"') && getComputedStyle(document.querySelector('.oracle-face .card-name')).fontFamily.includes('Fraunces')))
      await clickButton('Draw again'); await settle()
      check('offline: drawn card shows its drawing', await page.evaluate(() => !!document.querySelector('.oracle-face .oracle-art svg')))
      await page.context().setOffline(false)
    } else {
      await clickButton('Draw'); await settle()
    }

    // Two different families look different.
    const faces = {}
    const artFills = {}
    for (let i = 0; i < 200 && Object.keys(faces).length < 2; i++) {
      const [fam, bg, art] = await page.$eval('.oracle-face', (f) => [f.dataset.palette, getComputedStyle(f).backgroundColor, getComputedStyle(f.querySelector('.oracle-art .art-line')).stroke])
      faces[fam] = bg
      artFills[fam] = art
      await clickButton('Draw again'); await settle(20)
    }
    const bgs = Object.values(faces)
    check('different families have different face backgrounds', bgs.length === 2 && bgs[0] !== bgs[1], JSON.stringify(faces))
    const fills = Object.values(artFills)
    check('drawings from different families use different colours', fills.length === 2 && fills[0] !== fills[1], JSON.stringify(artFills))

    // Decoration: hidden and not focusable; frame is pseudo-elements.
    await page.goto(appUrl, { waitUntil: 'networkidle' })
    check('flourishes are aria-hidden and not focusable', await page.evaluate(() => {
      const f = [...document.querySelectorAll('.flourish')]
      return f.length === 2 && f.every((s) => s.getAttribute('aria-hidden') === 'true' && s.getAttribute('focusable') === 'false')
    }))
    check('choice drawings are aria-hidden', await page.evaluate(() => { const svgs = [...document.querySelectorAll('.home-choice svg')]; return svgs.length === 2 && svgs.every((s) => s.closest('[aria-hidden="true"]') !== null) }))
    const tabbed = []
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      tabbed.push(await page.evaluate(() => document.activeElement.tagName + (document.activeElement.getAttribute('class') ?? '')))
    }
    check('Tab reaches only the two choices (no decoration)', tabbed.filter((t) => t.startsWith('A')).length >= 2 && !tabbed.some((t) => /svg|flourish/i.test(t)), tabbed.join(','))
    const snapshot = await axSnapshot(page)
    const names = []
    const walk = (n) => { if (n.name) names.push(`${n.role}:${n.name}`); (n.children || []).forEach(walk) }
    walk(snapshot)
    check('accessibility tree: heading, subtitle, two choices, nothing decorative', names.some((n) => n === 'heading:Little Oracle') && names.some((n) => n.includes('tarot & animal cards for today')) && !names.some((n) => /^(img|graphics)/.test(n)), names.join(' | '))
    check('tab title Little Oracle', (await page.title()) === 'Little Oracle')

    await page.goto(appUrl + '#/r/v1/three-card/major-16.cups-03r.pentacles-01', { waitUntil: 'networkidle' })
    check('card frame drawn by pseudo-elements', await page.evaluate(() => {
      const f = document.querySelector('.card-face')
      return getComputedStyle(f, '::before').content === '""' && getComputedStyle(f, '::after').content === '""' && f.children.length === 3
    }))
    check('tower face: XVI, name, drawing', await page.evaluate(() => {
      const f = document.querySelector('.card-face')
      return f.querySelector('.card-numeral').textContent === 'XVI' && f.querySelector('.card-name').textContent === 'The Tower' && !!f.querySelector('.tarot-art svg')
    }))
    check('reversed: face rotated, "(reversed)" upright after the name, label unchanged', await page.evaluate(() => {
      const slot = document.querySelectorAll('.spread-slot')[1]
      const face = slot.querySelector('.card-face')
      return getComputedStyle(face).transform.startsWith('matrix(-1') && slot.querySelector('.card-title-orientation').textContent.trim() === '(reversed)' &&
        getComputedStyle(slot.querySelector('.card-title')).transform === 'none' && face.getAttribute('aria-label') === 'Three of Cups, reversed'
    }))

    check('no console errors', errors.length === 0, errors.join(' | '))
  } finally {
    await closeAll()
  }
})
