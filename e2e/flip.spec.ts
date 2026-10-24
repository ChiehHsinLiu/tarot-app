// Covers visual-theme: Shared card back, Drawn cards turn over on their own,
// Card text appears with its card, The reveal never blocks the reading, Reduced
// motion skips the reveal; and reading-share-links: shared links open face up.
// Animations are paused and their clock set by hand, so timings are exact.
// The Lenormand part runs on the dev server only.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup, axSnapshot } from './helpers.ts'

test('card flip', async ({ browser }, testInfo) => {
  test.setTimeout(240_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const origin = new URL(appUrl).origin

    const consoleErrors = []
    const outside = []
    async function newPage(reducedMotion = false) {
      const page = await open()
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
      page.on('pageerror', (e) => consoleErrors.push(e.message))
      page.on('request', (r) => !r.url().startsWith(origin) && !r.url().startsWith('data:') && outside.push(r.url()))
      if (reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width: 1280, height: 900 })
      return page
    }
    const clickButton = (page, t) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
    const setClock = (page, ms) =>
      page.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms }), ms)
    // rotateY angle of each card's 3D box, from its computed matrix (0 = face up, 180 = back up).
    const angles = (page) => page.evaluate(() => [...document.querySelectorAll('.card-flip-inner')].map((e) => {
      const t = getComputedStyle(e).transform
      if (t === 'none') return 0
      const m = new DOMMatrix(t)
      return Math.round((Math.atan2(-m.m13, m.m11) * 180) / Math.PI + 360) % 360
    }))
    const opacity = (page, sel) => page.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => +getComputedStyle(e).opacity), sel)
    const backMarkup = (page) => page.evaluate(() => document.querySelector('.card-back')?.outerHTML ?? null)

    async function drawTarot(page, spread, question = '') {
      await page.goto('about:blank')
      await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
      await page.click(`input[name=spread][value=${spread}]`)
      if (question) await page.type('#question', question)
      await page.click('button[type=submit]')
      await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
    }

    // --- Three-card tarot reading ---
    const page = await newPage()
    let reversedSeen = false
    let backs: Record<string, any> = {}
    for (let attempt = 0; attempt < 12 && !reversedSeen; attempt++) {
      await drawTarot(page, 'three-card')
      if (attempt === 0) {
        const s = await page.evaluate(() => ({
          focus: document.activeElement?.id,
          flips: document.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'card-flip').map((a) => [a.effect.getTiming().delay, a.effect.getTiming().duration as number]),
        }))
        check('focus is on the reading heading', s.focus === 'reading-title', s.focus)
        check('three flips start 0.3s apart and last 0.6s', JSON.stringify(s.flips) === '[[0,600],[300,600],[600,600]]', JSON.stringify(s.flips))
        const ends = s.flips.map(([d, t]) => d + t)
        check('all three face up within about 1.5s', Math.max(...ends) <= 1500, String(Math.max(...ends)))

        await setClock(page, 0)
        check('at the start all three show their backs', (await angles(page)).every((a) => a === 180), JSON.stringify(await angles(page)))
        await page.screenshot({ path: path.join(shotDir, 'flip-three-0.png') })
        const snap = await axSnapshot(page)
        const names = []
        const walk = (n) => { if (n.name) names.push(n.name); (n.children ?? []).forEach(walk) }
        walk(snap)
        const all = names.join(' | ')
        const expect = await page.evaluate(() => [...document.querySelectorAll('.card-face')].map((f) => f.getAttribute('aria-label'))
          .concat([...document.querySelectorAll('.card-meaning')].map((m) => m.textContent)))
        check('during the flip every card and meaning is in the accessibility tree', expect.every((t) => all.includes(t)), expect.filter((t) => !all.includes(t)).join(' / '))
        check('the back is hidden from assistive technology', await page.evaluate(() =>
          [...document.querySelectorAll('.card-back')].every((b) => b.getAttribute('aria-hidden') === 'true')))
        const imgs = await page.evaluate(() => document.querySelectorAll('[role=img]').length)
        const imgNames = []
        const walkImg = (n) => { if (n.role === 'img' || n.role === 'image') imgNames.push(n.name); (n.children ?? []).forEach(walkImg) }
        walkImg(snap)
        check('only the three faces are announced as images', imgNames.length === 3 && imgs === 3, JSON.stringify(imgNames))

        const order = []
        for (const ms of [250, 650, 950]) { await setClock(page, ms); order.push(await angles(page)) }
        const [x, y, z] = order
        check('cards turn in order: only the first moving at 0.25s, the second at 0.65s, the third last',
          x[0] > 0 && x[0] < 180 && x[1] === 180 && x[2] === 180 &&
          y[0] === 0 && y[1] > 0 && y[1] < 180 &&
          z[1] === 0 && z[2] > 0 && z[2] < 180, JSON.stringify(order))
        await setClock(page, 800)
        const m800 = await opacity(page, '.card-meaning')
        check('the first meaning is shown and the third hidden at 0.8s', m800[0] === 1 && m800[2] === 0, JSON.stringify(m800))
        const fades = await page.evaluate(() => document.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'reveal-fade').map((a) => a.effect.getTiming().delay))
        check('each card\'s text fades after its card starts turning', JSON.stringify(fades) === '[450,450,450,750,750,750,1050,1050,1050]', JSON.stringify(fades))
        await setClock(page, 2000)
        check('after the reveal all cards are face up', (await angles(page)).every((a) => a === 0))
        check('after the reveal all text is fully shown', (await opacity(page, '.card-title, .card-keywords, .card-meaning')).every((o) => o === 1))
        await page.screenshot({ path: path.join(shotDir, 'flip-three-done.png') })
        backs.tarot = await backMarkup(page)
      }
      const rev = await page.evaluate(() => [...document.querySelectorAll('.card-face')].findIndex((f) => f.classList.contains('reversed')))
      if (rev >= 0) {
        reversedSeen = true
        await setClock(page, 0)
        const atStart = await angles(page)
        await setClock(page, 2000)
        const [t, upsideDown] = await page.evaluate((i) => {
          const t = getComputedStyle(document.querySelectorAll('.card-face')[i]).transform
          const m = new DOMMatrix(t === 'none' ? undefined : t)
          return [t, Math.round(m.a) === -1 && Math.round(m.d) === -1]
        }, rev)
        check('a reversed card turns over and lands upside down', atStart[rev] === 180 && (await angles(page))[rev] === 0 && upsideDown, `${atStart[rev]} ${t}`)
        await page.screenshot({ path: path.join(shotDir, 'flip-reversed.png') })
      }
    }
    check('found a reversed card to check', reversedSeen)

    // New reading mid-flip
    await drawTarot(page, 'three-card')
    await setClock(page, 100)
    await clickButton(page, 'New reading')
    check('New reading works mid-flip', await page.evaluate(() => !document.querySelector('.reading') && !!document.querySelector('button[type=submit]')))

    // --- Yes / No verdict ---
    await drawTarot(page, 'yes-no', 'Will it be sunny?')
    await setClock(page, 0)
    const v0 = (await opacity(page, '.verdict'))[0]
    await setClock(page, 300)
    const v300 = (await opacity(page, '.verdict'))[0]
    await setClock(page, 800)
    const v800 = (await opacity(page, '.verdict'))[0]
    check('the verdict is hidden until the card lands, then shown', v0 === 0 && v300 === 0 && v800 === 1, `${v0} ${v300} ${v800}`)

    // --- Share link opens face up ---
    await setClock(page, 2000)
    await clickButton(page, 'Share')
    await page.waitForSelector('input[readonly]', { state: 'attached' })
    const link = await page.evaluate(() => document.querySelector<HTMLInputElement>('input[readonly]').value)
    const shared = await newPage()
    await shared.goto(link, { waitUntil: 'networkidle' })
    await shared.waitForSelector('.reading', { state: 'attached' })
    const sh = await shared.evaluate(() => ({
      heading: document.querySelector('h2')?.textContent,
      backs: document.querySelectorAll('.card-back').length,
      anims: document.getAnimations().length,
      opacities: [...document.querySelectorAll('.verdict, .card-title, .card-keywords, .card-meaning')].map((e) => +getComputedStyle(e).opacity),
    }))
    check('a share link opens face up, with no back and no animation', sh.heading.startsWith('Shared reading') && sh.backs === 0 && sh.anims === 0 && sh.opacities.every((o) => o === 1), JSON.stringify(sh))
    await shared.screenshot({ path: path.join(shotDir, 'flip-shared.png') })
    await shared.close()

    // --- Oracle: draw and Draw again ---
    await page.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
    await clickButton(page, 'Draw')
    await page.waitForSelector('.oracle-face', { state: 'attached' })
    await setClock(page, 0)
    const o0 = await page.evaluate(() => ({
      card: document.querySelector('.oracle-face').getAttribute('aria-label'),
      focus: document.activeElement?.id,
    }))
    check('an oracle card starts with its back up', JSON.stringify(await angles(page)) === '[180]')
    check('focus is on the oracle heading', o0.focus === 'oracle-title', o0.focus)
    check('the oracle reading is hidden until the card lands', (await opacity(page, '.oracle-message, .oracle-reflect, .oracle-affirmation')).every((o) => o === 0))
    backs.oracle = await backMarkup(page)
    await setClock(page, 2000)
    check('the oracle reading is shown after the card lands', (await opacity(page, '.card-title, .card-keywords, .oracle-message, .oracle-reflect, .oracle-affirmation')).every((o) => o === 1))
    await clickButton(page, 'Draw again')
    await page.waitForFunction((c) => document.querySelector('.oracle-face')?.getAttribute('aria-label') !== c, o0.card)
    const again = await page.evaluate(() => document.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'card-flip').map((a) => a.currentTime as number))
    await setClock(page, 0)
    check('Draw again turns the new card over from its back', again.length === 1 && again[0] < 300 && JSON.stringify(await angles(page)) === '[180]', JSON.stringify(again))

    // --- Lenormand (dev only) ---
    if (!publicBuild) {
      for (const [spread, n] of [['yes-no', 2], ['three-card', 3]] as const) {
        await page.goto('about:blank')
        await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
        await page.click('input[name=deck][value=lenormand]')
        await page.click(`input[name=spread][value=${spread}]`)
        if (spread === 'yes-no') await page.type('#question', 'Will it work out?')
        await page.click('button[type=submit]')
        await page.waitForSelector('.lenormand-face', { state: 'attached' })
        const delays = await page.evaluate(() => document.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'card-flip').map((a) => a.effect.getTiming().delay))
        await setClock(page, 0)
        check(`Lenormand ${spread}: ${n} cards turn in order from their backs`, JSON.stringify(delays) === JSON.stringify([0, 300, 600].slice(0, n)) && (await angles(page)).every((a) => a === 180), JSON.stringify(delays))
        backs.lenormand = await backMarkup(page)
      }
    }
    check('every deck shows the same back', backs.tarot && Object.values(backs).every((b) => b === backs.tarot), Object.keys(backs).join(','))

    // --- Reduced motion ---
    const calm = await newPage(true)
    await calm.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    await calm.click('input[name=spread][value=yes-no]')
    await calm.type('#question', 'Sunny?')
    await calm.click('button[type=submit]')
    await calm.waitForSelector('.reading', { state: 'attached' })
    const rm = await calm.evaluate(() => ({
      anims: document.getAnimations().length,
      opacities: [...document.querySelectorAll('.verdict, .card-title, .card-keywords, .card-meaning')].map((e) => +getComputedStyle(e).opacity),
    }))
    check('reduced motion: face up and fully shown at once', rm.anims === 0 && (await angles(calm)).every((a) => a === 0) && rm.opacities.every((o) => o === 1), JSON.stringify(rm))
    await calm.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
    await clickButton(calm, 'Draw')
    await calm.waitForSelector('.oracle-face', { state: 'attached' })
    check('reduced motion: the oracle card too', (await calm.evaluate(() => document.getAnimations().length)) === 0 && JSON.stringify(await angles(calm)) === '[0]')
    await calm.close()

    check('no request to another origin', outside.length === 0, outside.join(' | '))
    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
