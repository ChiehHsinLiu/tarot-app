// Covers animal-oracle: Animal oracle deck, Oracle entry point on the home
// page, Drawing an oracle card, Oracle reading display, Every oracle card has
// its own illustration, Draw again and going home. On the public build it also
// covers private-readings: Ask Claude is available only in the local dev app.
import fs from 'node:fs'
import path from 'node:path'
import { test } from '@playwright/test'
import { fixRandomness, repo, setup } from './helpers.ts'

test('animal oracle', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const text: Record<string, any> = JSON.parse(fs.readFileSync(path.join(repo, 'data/i18n/en/oracle/animal.json'), 'utf8'))
    const byLabel = new Map<string, any>(Object.entries(text).map(([id, t]) => [`${t.animal}, ${t.theme}`, { id, ...t }]))
    const deckSize = byLabel.size


    const page = await open()
    // Fixed draws, so "reaches all 48 cards" sees the same sequence every run
    // (all 48 by the 320th Draw again) instead of failing now and then by chance.
    await fixRandomness(page)
    const consoleErrors = []
    const badResponses = []
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    page.on('response', (r) => r.status() >= 400 && badResponses.push(`${r.status()} ${r.url()}`))
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(appUrl, { waitUntil: 'networkidle' })

    const clickButton = (t) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
    const buttonTexts = () => page.evaluate(() => [...document.querySelectorAll<HTMLButtonElement>('button')].map((b) => b.textContent.trim()))
    const shownCard = () => page.evaluate(() => document.querySelector('.oracle-face')?.getAttribute('aria-label') ?? null)
    const noHScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)

    // --- Home page and oracle screen ---
    check('home shows the "Animal oracle" choice', await page.evaluate(() =>
      [...document.querySelectorAll('.home-choice-title')].map((e) => e.textContent).includes('Animal oracle')))
    check('one top-level heading "Little Oracle"', await page.evaluate(() =>
      [...document.querySelectorAll('h1')].map((h) => h.textContent).join('|') === 'Little Oracle'))
    await page.screenshot({ path: path.join(shotDir, 'oracle-home-1280.png'), fullPage: true })
    await page.evaluate(() => [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Animal oracle')).click())
    await page.waitForSelector('.oracle-intro-screen', { state: 'attached' })
    const section = await page.evaluate(() => {
      const s = document.querySelector('.oracle-intro-screen')
      const b = [...s.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === 'Draw')
      return { heading: s.querySelector('h2')?.textContent, draw: b ? !b.disabled : false, card: !!document.querySelector('.oracle-face') }
    })
    check('oracle screen shows "Today\'s animal oracle" intro, enabled Draw, no card', section.heading === "Today's animal oracle" && section.draw && !section.card, JSON.stringify(section))
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    check('tarot spread choice still shown with none selected', await page.evaluate(() =>
      document.querySelectorAll('input[name=spread]').length >= 2 && !document.querySelector<HTMLInputElement>('input[name=spread]:checked')))

    // --- Tarot still works ---
    await page.click('input[value="three-card"]')
    await page.click('button[type=submit]')
    await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
    check('tarot draw still works', (await page.$$('.spread-slot')).length === 3)
    await clickButton('New reading')

    // --- Oracle draw, with composer state preserved ---
    await page.click('input[value="yes-no"]')
    await page.type('#question', 'Will it rain?')
    await page.evaluate(() => [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Home')).click())
    await page.waitForSelector('.home-choices', { state: 'attached' })
    await page.evaluate(() => [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Animal oracle')).click())
    await page.waitForSelector('.oracle-intro-screen', { state: 'attached' })
    await page.evaluate(() =>
      [...document.querySelectorAll<HTMLButtonElement>('.oracle-intro-screen button')].find((b) => b.textContent.trim() === 'Draw').click())
    await page.waitForSelector('.oracle-reading', { state: 'attached' })
    const first = await shownCard()
    const card = byLabel.get(first)
    check('draw shows a card from the deck', !!card, first)
    const body = await page.evaluate(() => document.querySelector<HTMLElement>('.oracle-reading').innerText)
    for (const field of ['animal', 'theme', 'message', 'reflection', 'affirmation']) {
      check(`reading shows ${field}`, card && body.includes(card[field]))
    }
    check('reading shows keywords', card && body.includes(card.keywords.join(' · ')))
    check('reading shows "Reflect" label', body.includes('REFLECT') || body.includes('Reflect'))
    check('card is upright (no reversed style)', await page.evaluate(() => !document.querySelector('.oracle-face.reversed, .reversed-label')))
    check('focus moves to the oracle heading', await page.evaluate(() => document.activeElement?.id === 'oracle-title'))
    check('no question asked before the draw', !(await page.$('.oracle-reading .asked')))
    check('no horizontal scroll at 1280px', await noHScroll())
    await page.screenshot({ path: path.join(shotDir, 'oracle-card-1280.png'), fullPage: true })
    await page.setViewportSize({ width: 375, height: 800 })
    check('no horizontal scroll at 375px', await noHScroll())
    await page.screenshot({ path: path.join(shotDir, 'oracle-card-375.png'), fullPage: true })
    await page.setViewportSize({ width: 1280, height: 900 })

    if (publicBuild) {
      const texts = await buttonTexts()
      check('public: no Ask Claude button', !texts.includes('Ask Claude'), texts.join('|'))
      check('public: no oracle question box', !(await page.$('#oracle-question')))
    }

    // --- Draw again always changes the card ---
    let previous = first
    let allDifferent = true
    const seen = new Set([first])
    // Every shown card: its own drawing, no paw, drawing hidden, label unchanged.
    const artProblems = []
    const artByCard = new Map()
    const checkArt = async () => {
      const f = await page.evaluate(() => {
        const face = document.querySelector('.oracle-face')
        const art = face.querySelector('.oracle-art')
        return {
          label: face.getAttribute('aria-label'),
          name: face.querySelector('.card-name').textContent,
          theme: face.querySelector('.oracle-face-theme').textContent,
          art: art?.querySelector('svg')?.outerHTML ?? null,
          artHidden: art?.getAttribute('aria-hidden'),
          paw: !!face.querySelector('svg.card-symbol'),
        }
      })
      if (!f.art) artProblems.push(`${f.label}: no drawing`)
      if (f.paw) artProblems.push(`${f.label}: paw shown`)
      if (f.artHidden !== 'true') artProblems.push(`${f.label}: drawing not hidden`)
      if (f.label !== `${f.name}, ${f.theme}`) artProblems.push(`${f.label}: label changed`)
      artByCard.set(f.label, f.art)
    }
    await checkArt()
    let reachedAt = null
    for (let i = 0; i < 400 && (i < 60 || seen.size < deckSize); i++) {
      await clickButton('Draw again')
      const now = await shownCard()
      if (now === previous || !byLabel.has(now)) allDifferent = false
      seen.add(now)
      if (reachedAt === null && seen.size === deckSize) reachedAt = i + 1
      previous = now
      await checkArt()
    }
    check('"Draw again" always shows a different card', allDifferent)
    check(`"Draw again" reaches all ${deckSize} cards`, seen.size === deckSize, `${seen.size} distinct, all by Draw again ${reachedAt}`)
    check('every card shows its own drawing, no paw, hidden from assistive tech, label unchanged', artProblems.length === 0, artProblems.slice(0, 5).join(' | '))
    check(`all ${deckSize} drawings are different`, new Set(artByCard.values()).size === deckSize, `${new Set(artByCard.values()).size}`)

    // --- Home, then Tarot, starts the composer fresh ---
    check('no "Back" button on the oracle card', !(await buttonTexts()).includes('Back'))
    await page.evaluate(() => [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Home')).click())
    await page.waitForSelector('.home-choices', { state: 'attached' })
    await page.evaluate(() => [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Tarot reading')).click())
    await page.waitForSelector('.composer', { state: 'attached' })
    const restored = await page.evaluate(() => ({
      spread: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value,
      question: document.querySelector<HTMLTextAreaElement>('#question')?.value,
    }))
    check('Home then Tarot starts fresh', !restored.spread && restored.question === '', JSON.stringify(restored))

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
    check('no failed requests', badResponses.length === 0, badResponses.join(' | '))
  } finally {
    await closeAll()
  }
})
