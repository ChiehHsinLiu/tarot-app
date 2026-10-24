// Covers the reading layout in both palettes at 1280 and 375 wide: no
// horizontal scroll, faces aligned, meanings centred, the Yes / No verdict as
// wide as its card, the action row order (tarot-spreads: Yes / No spread shows
// a verdict; reading-share-links: Share action; reading-prompt: Copy for
// Claude action), panels opening below the buttons, and the oracle face size.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup } from './helpers.ts'

test('reading layout polish', async ({ browser }, testInfo) => {
  test.setTimeout(240_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const page = await open()
    const consoleErrors = []
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    const settle = () => new Promise((r) => setTimeout(r, 200))
    const noHScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
    const clickButton = async (t) => {
      await page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
      await settle()
    }
    // Top-level action buttons of the reading (not the ones inside opened panels).
    const actionButtons = () => page.evaluate(() =>
      [...document.querySelectorAll<HTMLButtonElement>('.reading > .reading-actions > button, .reading > .reading-actions > .share > button')]
        .map((b) => { const r = b.getBoundingClientRect(); return { t: b.textContent.trim(), top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), primary: b.classList.contains('primary') } })
        .sort((a, b) => a.top - b.top || a.left - b.left))
    const threeLink = '#/r/v1/three-card/swords-03.major-13r.cups-01'

    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 900 })
        const shot = async (name) => {
          check(`${scheme} ${width}: no horizontal scroll on ${name}`, await noHScroll())
          await page.screenshot({ path: path.join(shotDir, `${name}-${scheme}-${width}.png`), fullPage: true })
        }
        await page.goto(appUrl, { waitUntil: 'networkidle' })
        await shot('home')

        await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
        await shot('tarot')

        // Three-card reading with a reversed middle card.
        await page.goto(appUrl + threeLink, { waitUntil: 'networkidle' })
        await settle()
        const faces = await page.evaluate(() => [...document.querySelectorAll('.spread-slot .card-face')].map((f) => ({ top: Math.round(f.getBoundingClientRect().top), label: f.getAttribute('aria-label') })))
        if (width === 1280) check(`${scheme}: three faces share the same top`, faces.length === 3 && new Set(faces.map((f) => f.top)).size === 1, JSON.stringify(faces))
        check(`${scheme} ${width}: reversed still in aria-label, no REVERSED label`, faces[1].label === 'Death, reversed' && !(await page.$('.reversed-label')))
        check(`${scheme} ${width}: meanings centred`, await page.evaluate(() => [...document.querySelectorAll('.card-meaning')].every((m) => getComputedStyle(m).textAlign === 'center')))
        await shot('three-shared')

        // Own reading: yes/no, for the verdict and the action row.
        await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
        await page.click('input[value="yes-no"]')
        await page.type('#question', 'Will it be sunny?')
        await page.click('button[type=submit]')
        await page.waitForSelector('.reading', { state: 'attached' })
        if (!publicBuild) await page.waitForFunction(() => [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent.trim() === 'Ask Claude'), undefined, { timeout: 5000 })
        const verdictW = await page.evaluate(() => Math.round(document.querySelector('.verdict').getBoundingClientRect().width))
        const colW = await page.evaluate(() => Math.round(document.querySelector('.spread-slot').getBoundingClientRect().width))
        check(`${scheme} ${width}: verdict width matches the card column`, Math.abs(verdictW - colW) <= 1, `${verdictW} vs ${colW}`)
        const btns = await actionButtons()
        const expected = publicBuild ? ['New reading', 'Share', 'Copy for Claude'] : ['New reading', 'Share', 'Copy for Claude', 'Ask Claude']
        check(`${scheme} ${width}: action order, primary first`, btns.map((b) => b.t).join('|') === expected.join('|') && btns[0].primary, btns.map((b) => b.t).join('|'))
        if (width === 1280) {
          check(`${scheme}: actions on one row`, new Set(btns.map((b) => b.top)).size === 1, JSON.stringify(btns))
        } else {
          check(`${scheme} 375: actions stacked full width`, new Set(btns.map((b) => b.top)).size === btns.length && new Set(btns.map((b) => b.width)).size === 1, JSON.stringify(btns))
        }
        await shot('yesno')
        // Panels still open below the buttons.
        await clickButton('Share')
        await clickButton('Copy for Claude')
        const lastBtnBottom = await page.evaluate(() => Math.max(...[...document.querySelectorAll<HTMLButtonElement>('.reading > .reading-actions > button, .reading > .reading-actions > .share > button')].map((b) => b.getBoundingClientRect().bottom)))
        const panelTop = await page.evaluate(() => document.querySelector('.share-panel').getBoundingClientRect().top)
        check(`${scheme} ${width}: share panel below the buttons`, panelTop >= lastBtnBottom, `${panelTop} vs ${lastBtnBottom}`)
        await shot('yesno-panels')

        // Own three-card reading.
        await clickButton('New reading')
        await page.click('input[value="three-card"]')
        await page.click('button[type=submit]')
        await page.waitForSelector('.reading', { state: 'attached' })
        await shot('three')

        // Oracle.
        await page.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
        await shot('oracle-intro')
        await clickButton('Draw')
        // Finish the card reveal first, so the size is measured face up, not mid-flip.
        await page.waitForSelector('.oracle-face', { state: 'attached' })
        const sizes = await page.evaluate(() => (document.getAnimations().forEach((a) => a.finish()), Math.round(document.querySelector('.oracle-face').getBoundingClientRect().width)))
        check(`${scheme} ${width}: oracle face is 140px like tarot`, sizes === 140, sizes)
        await shot('oracle-card')
      }
    }

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
