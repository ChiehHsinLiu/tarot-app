// Covers tarot-deck-styles: Choose a deck on the tarot screen, Both decks share
// the cards and their meanings, Share links keep the deck. Also
// lenormand-readings: the public deck choice has only Classic and Dachshund.
import { test } from '@playwright/test'
import { fixRandomness, setup } from './helpers.ts'

test('dachshund deck choice', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)
  const { appUrl, publicBuild, check, grant, open, closeAll } = setup(browser, testInfo)
  try {
    grant(['clipboard-read', 'clipboard-write'])
    const consoleErrors: string[] = []

    async function newPage(hash: string) {
      const page = await open()
      await fixRandomness(page)
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
      page.on('pageerror', (e) => consoleErrors.push(e.message))
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto(appUrl + hash, { waitUntil: 'networkidle' })
      return page
    }
    const settle = (ms = 200) => new Promise((r) => setTimeout(r, ms))

    for (const startHash of ['#/tarot']) {
      const page = await newPage(startHash)
      const clickLink = async (text: string) => {
        await page.evaluate((t) => [...document.querySelectorAll('a')].find((a) => a.textContent!.includes(t))!.click(), text)
        await settle()
      }
      const clickButton = async (text: string, scope = '') => {
        await page.evaluate(
          ([t, s]) => [...document.querySelectorAll<HTMLButtonElement>(s + 'button')].find((b) => b.textContent!.trim() === t)!.click(),
          [text, scope],
        )
        await settle(300)
      }
      const composer = () =>
        page.evaluate(() => ({
          decks: [...document.querySelectorAll('input[name=deck]')].map((i) => i.closest('label')!.textContent!.trim()),
          deck: document.querySelector<HTMLInputElement>('input[name=deck]:checked')?.value ?? null,
          spread: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value ?? null,
        }))
      const reading = () =>
        page.evaluate(() => ({
          decks: [...document.querySelectorAll('.spread-slot .card')].map((c) => c.getAttribute('data-deck')),
          labels: [...document.querySelectorAll('.spread-slot [role=img]')].map((e) => e.getAttribute('aria-label')),
          meanings: [...document.querySelectorAll('.spread-slot .card-meaning')].map((e) => e.textContent),
        }))

      // --- The choice ---
      let c = await composer()
      const expected = publicBuild ? 'Classic|Dachshund' : 'Classic|Dachshund|Lenormand'
      check('deck choice lists the decks', c.decks.join('|') === expected, c.decks.join('|'))
      check('Classic selected on entry', c.deck === 'classic', c.deck)

      // --- Draw with Dachshund, New reading keeps it ---
      await page.click('input[name=deck][value=dachshund]')
      await page.click('input[name=spread][value=three-card]')
      await clickButton('Draw')
      await page.waitForSelector('.reading')
      let r = await reading()
      check('Dachshund reading marks every card as dachshund', r.decks.length === 3 && r.decks.every((d) => d === 'dachshund'), r.decks.join())
      await clickButton('New reading', '.reading-top-actions ')
      c = await composer()
      check('New reading keeps Dachshund', c.deck === 'dachshund' && c.spread === 'three-card', JSON.stringify(c))

      // --- Home and back resets to Classic ---
      await clickLink('Home')
      await clickLink('Tarot reading')
      c = await composer()
      check('entering again resets to Classic', c.deck === 'classic' && c.spread === null, JSON.stringify(c))
      await page.click('input[name=spread][value=three-card]')
      await clickButton('Draw')
      await page.waitForSelector('.reading')
      r = await reading()
      check('Classic reading marks every card as classic', r.decks.every((d) => d === 'classic'), r.decks.join())
    }

    // --- Same cards, same text, same prompt in both decks ---
    async function drawAndCopy(deck: string) {
      const page = await newPage('#/tarot')
      await page.click(`input[name=deck][value=${deck}]`)
      await page.click('input[name=spread][value=three-card]')
      await page.click('button[type=submit]')
      await page.waitForSelector('.reading')
      await page.evaluate(() =>
        [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === 'Copy for Claude')!.click(),
      )
      await settle(300)
      const prompt = await page.evaluate(() => navigator.clipboard.readText())
      const text = await page.evaluate(() => ({
        labels: [...document.querySelectorAll('.spread-slot [role=img]')].map((e) => e.getAttribute('aria-label')).join('|'),
        meanings: [...document.querySelectorAll('.spread-slot .card-meaning')].map((e) => e.textContent).join('|'),
      }))
      return { page, prompt, text }
    }
    const classic = await drawAndCopy('classic')
    const dachshund = await drawAndCopy('dachshund')
    check('same draw: same cards and meanings in both decks', classic.text.labels === dachshund.text.labels && classic.text.meanings === dachshund.text.meanings, `${classic.text.labels} / ${dachshund.text.labels}`)
    check('copied prompt is identical for both decks', classic.prompt.length > 100 && classic.prompt === dachshund.prompt)

    // --- Share link keeps the deck ---
    const page = dachshund.page
    await page.evaluate(() =>
      [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === 'Share')!.click(),
    )
    await settle()
    const link = await page.$eval('.share-link', (i) => (i as HTMLInputElement).value)
    check('Dachshund link carries d=dachshund', /#\/r\/v1\/three-card\/[^?]+\?d=dachshund$/.test(link), link)
    const classicLink = await (async () => {
      await classic.page.evaluate(() =>
        [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === 'Share')!.click(),
      )
      await settle()
      return classic.page.$eval('.share-link', (i) => (i as HTMLInputElement).value)
    })()
    check('Classic link has no deck marker', !classicLink.includes('d='), classicLink)

    const shared = await newPage(new URL(link).hash)
    await shared.waitForSelector('.reading')
    const s = await shared.evaluate(() => ({
      heading: document.querySelector('#reading-title')!.textContent,
      decks: [...document.querySelectorAll('.spread-slot .card')].map((c) => c.getAttribute('data-deck')),
      labels: [...document.querySelectorAll('.spread-slot [role=img]')].map((e) => e.getAttribute('aria-label')).join('|'),
      backs: document.querySelectorAll('.spread-slot .card-back').length,
    }))
    check('Dachshund link opens a shared reading', s.heading!.startsWith('Shared reading'), s.heading)
    check('shared reading shows the dachshund deck', s.decks.length === 3 && s.decks.every((d) => d === 'dachshund'), s.decks.join())
    check('shared reading has the same cards', s.labels === dachshund.text.labels, s.labels)
    check('shared reading opens face up', s.backs === 0, s.backs)

    await shared.evaluate(() =>
      [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === 'Draw your own')!.click(),
    )
    await settle()
    const after = await shared.evaluate(() => ({
      hash: location.hash,
      deck: document.querySelector<HTMLInputElement>('input[name=deck]:checked')?.value ?? null,
      spread: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value ?? null,
      question: document.querySelector<HTMLTextAreaElement>('#question')?.value ?? null,
    }))
    check('Draw your own: Classic, no spread, empty question', after.hash === '#/tarot' && after.deck === 'classic' && after.spread === null && after.question === '', JSON.stringify(after))

    // --- Older link and unknown deck ---
    const older = await newPage('#/r/v1/three-card/swords-03.major-13r.cups-01')
    await older.waitForSelector('.reading')
    const olderDecks = await older.$$eval('.spread-slot .card', (cs) => cs.map((c) => c.getAttribute('data-deck')))
    check('older link opens in Classic', olderDecks.length === 3 && olderDecks.every((d) => d === 'classic'), olderDecks.join())
    const poodle = await newPage('#/r/v1/yes-no/major-01?d=poodle')
    await settle()
    const notice = await poodle.evaluate(() => document.querySelector('.notice')?.textContent ?? null)
    check('unknown deck shows the invalid-link notice', notice === "This reading link isn't valid.", notice)

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
