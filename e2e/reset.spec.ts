// Covers app-navigation: Screens start fresh when opened, Start over from the
// top of a longer reading; and tarot-readings: New reading. On the dev server
// it also covers the Lenormand deck reset.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup } from './helpers.ts'

test('screens start fresh', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const page = await open()
    const consoleErrors = []
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    await page.setViewportSize({ width: 1280, height: 900 })

    const settle = (ms = 200) => new Promise((r) => setTimeout(r, ms))
    const go = async (hash = '') => {
      await page.goto(appUrl + hash, { waitUntil: 'networkidle' })
      await settle()
    }
    const clickLink = async (text) => {
      await page.evaluate((t) => [...document.querySelectorAll('a')].find((a) => a.textContent.includes(t)).click(), text)
      await settle()
    }
    // which: 'top' clicks the button in .reading-top-actions, 'bottom' the one in .reading-actions, else the first match.
    const clickButton = async (t, which?) => {
      await page.evaluate(([t, which]) => {
        const scope = which === 'top' ? '.reading-top-actions ' : which === 'bottom' ? '.reading-actions ' : ''
        ;[...document.querySelectorAll<HTMLButtonElement>(scope + 'button')].find((b) => b.textContent.trim() === t).click()
      }, [t, which])
      await settle(300)
    }
    const typeHash = async (hash) => {
      await page.evaluate((h) => { location.hash = h }, hash)
      await settle()
    }
    const state = () => page.evaluate(() => ({
      hash: location.hash,
      spread: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value ?? null,
      deck: document.querySelector<HTMLInputElement>('input[name=deck]:checked')?.value ?? null,
      question: document.querySelector<HTMLTextAreaElement>('#question')?.value ?? null,
      composer: !!document.querySelector('.composer'),
      reading: !!document.querySelector('.reading:not(.oracle-reading)'),
      oracleIntro: !!document.querySelector('.oracle-intro-screen'),
      oracleCard: document.querySelector('.oracle-face')?.getAttribute('aria-label') ?? null,
      heading: document.querySelector('main h2')?.textContent ?? null,
      topButtons: [...document.querySelectorAll<HTMLButtonElement>('.reading-top-actions button')].map((b) => `${b.textContent.trim()}|${b.className}`),
      bottomButtons: [...document.querySelectorAll('.reading-actions button.primary')].map((b) => b.textContent.trim()),
      focus: document.activeElement?.id ?? null,
      cards: [...document.querySelectorAll('.spread-slot .card-face')].map((e) => e.getAttribute('aria-label')).join('|'),
    }))
    const typeQuestion = async (q) => {
      await page.click('#question', { clickCount: 3 })
      await page.keyboard.press('Backspace')
      if (q) await page.type('#question', q)
    }

    // --- Tarot composer resets through Home ---
    await go()
    await clickLink('Tarot reading')
    await page.click('input[value=yes-no]')
    await typeQuestion('Will it rain?')
    await clickLink('Home')
    await clickLink('Tarot reading')
    let s = await state()
    check('tarot composer starts fresh after Home', s.composer && s.spread === null && s.question === '', JSON.stringify(s))

    // --- A drawn tarot reading resets through Home ---
    await page.click('input[value=three-card]')
    await clickButton('Draw')
    s = await state()
    check('tarot reading drawn', s.reading)
    check('top New reading under the heading, secondary', s.topButtons.join(',') === 'New reading|secondary', s.topButtons.join(','))
    check('bottom New reading still primary', s.bottomButtons.includes('New reading'))
    check('focus on the reading heading', s.focus === 'reading-title', s.focus)
    await clickLink('Home')
    await clickLink('Tarot reading')
    s = await state()
    check('tarot reading gone after Home: composer, no spread', s.composer && !s.reading && s.spread === null, JSON.stringify(s))

    // --- Top New reading behaves like the bottom one (keeps the spread) ---
    await page.click('input[value=three-card]')
    await typeQuestion('What next?')
    await clickButton('Draw')
    await clickButton('New reading', 'top')
    const afterTop = await state()
    await clickButton('Draw')
    await clickButton('New reading', 'bottom')
    const afterBottom = await state()
    check('top New reading: composer, spread kept, question empty', afterTop.composer && afterTop.spread === 'three-card' && afterTop.question === '', JSON.stringify(afterTop))
    check('top and bottom New reading give the same result', afterTop.spread === afterBottom.spread && afterTop.question === afterBottom.question && afterTop.composer === afterBottom.composer)

    // --- Oracle resets through Home ---
    await clickLink('Home')
    await clickLink('Animal oracle')
    await clickButton('Draw')
    s = await state()
    const firstCard = s.oracleCard
    check('oracle card drawn', !!firstCard)
    check('oracle card: nothing under the heading', s.topButtons.length === 0, s.topButtons.join(','))
    check('oracle card: exactly one Draw again, after the card', await page.evaluate(() => {
      const b = [...document.querySelectorAll<HTMLButtonElement>('button')].filter((x) => x.textContent.trim() === 'Draw again')
      const face = document.querySelector('.oracle-face')
      return b.length === 1 && !!face && (face.compareDocumentPosition(b[0]) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
    }))
    await clickButton('Draw again')
    s = await state()
    check('Draw again shows a different card', s.oracleCard && s.oracleCard !== firstCard, `${firstCard} -> ${s.oracleCard}`)
    await clickLink('Home')
    await clickLink('Animal oracle')
    s = await state()
    check('oracle starts fresh after Home', s.oracleIntro && !s.oracleCard, JSON.stringify(s))

    // --- Back and Forward ---
    await clickButton('Draw')
    await page.goBack()
    await settle()
    check('Back from the oracle shows home', (await state()).hash === '' || (await state()).hash === '#/')
    await page.goForward()
    await settle()
    s = await state()
    check('Forward to the oracle starts fresh', s.hash === '#/oracle' && s.oracleIntro && !s.oracleCard, JSON.stringify(s))

    // --- Typed address ---
    await clickButton('Draw')
    await typeHash('#/')
    await typeHash('#/oracle')
    s = await state()
    check('typed address #/oracle starts fresh', s.oracleIntro && !s.oracleCard)

    // --- Shared reading: Draw your own at the top ---
    await go('#/r/v1/three-card/swords-03.major-13r.cups-01')
    s = await state()
    check('shared reading: top Draw your own, secondary', s.topButtons.join(',') === 'Draw your own|secondary', s.topButtons.join(','))
    await clickButton('Draw your own', 'top')
    s = await state()
    check('top Draw your own: #/tarot, no spread, empty question', s.hash === '#/tarot' && s.composer && s.spread === null && s.question === '', JSON.stringify(s))

    // --- Reload ---
    await go('#/oracle')
    await clickButton('Draw')
    await page.reload({ waitUntil: 'networkidle' })
    await settle()
    s = await state()
    check('reload starts fresh', s.oracleIntro && !s.oracleCard)

    // --- Lenormand (dev only) ---
    if (!publicBuild) {
      await go('#/tarot')
      await page.click('input[name=deck][value=lenormand]')
      await clickLink('Home')
      await clickLink('Tarot reading')
      s = await state()
      check('Lenormand resets to Tarot after Home', s.deck === 'tarot', JSON.stringify(s))
      await page.click('input[name=deck][value=lenormand]')
      await page.click('input[value=yes-no]')
      await typeQuestion('Will it work?')
      await clickButton('Draw')
      s = await state()
      check('Lenormand reading: top New reading, secondary', s.topButtons.join(',') === 'New reading|secondary', s.topButtons.join(','))
      await page.screenshot({ path: path.join(shotDir, 'reset-lenormand-top.png') })
      await clickButton('New reading', 'top')
      s = await state()
      check('Lenormand top New reading keeps the deck and spread', s.deck === 'lenormand' && s.spread === 'yes-no' && s.question === '', JSON.stringify(s))
    }

    // --- Phone width: the top button fits ---
    await page.setViewportSize({ width: 320, height: 800 })
    await go('#/tarot')
    await page.click('input[value=three-card]')
    await clickButton('Draw')
    check('320px: no horizontal scroll on a reading', await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    await page.screenshot({ path: path.join(shotDir, `reset-reading-320${publicBuild ? '-public' : ''}.png`) })

    check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
  } finally {
    await closeAll()
  }
})
