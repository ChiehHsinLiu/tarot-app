// Covers reading-share-links: Share link format, Share action on a reading,
// Question excluded by default, Opening a share link shows the same reading,
// Shared readings are read-only, Invalid links are handled gracefully. Also
// reading-prompt: Copy for Claude action, Manual copy fallback, Question
// inclusion follows the reading.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup } from './helpers.ts'

test('share links and Copy for Claude', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)
  const { appUrl, shotDir, check, grant, open, closeAll } = setup(browser, testInfo)
  try {
    grant(['clipboard-read', 'clipboard-write'])

    const consoleErrors = []
    const badResponses = []
    async function newPage(url) {
      const page = await open()
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
      page.on('pageerror', (e) => consoleErrors.push(e.message))
      page.on('response', (r) => r.status() >= 400 && badResponses.push(`${r.status()} ${r.url()}`))
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto((new URL(url).hash ? url : url + '#/tarot'), { waitUntil: 'networkidle' })
      return page
    }

    const setQuestion = (page, value) =>
      page.evaluate((v) => {
        const ta = document.querySelector<HTMLTextAreaElement>('#question')
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, v)
        ta.dispatchEvent(new Event('input', { bubbles: true }))
      }, value)

    async function drawReading(page, spreadId, question) {
      await page.click(`input[name=spread][value="${spreadId}"]`)
      await setQuestion(page, question)
      await page.click('button[type=submit]')
      await page.waitForSelector('.reading', { state: 'attached' })
    }

    const readingSnapshot = (page) =>
      page.evaluate(() => ({
        slots: [...document.querySelectorAll('.spread-slot')].map((s) => ({
          position: s.querySelector('.position-label').textContent,
          label: s.querySelector('[role=img]').getAttribute('aria-label'),
          meaning: s.querySelector('.card-meaning').textContent,
        })),
        verdict: document.querySelector('.verdict')?.textContent ?? null,
        asked: document.querySelector('.asked')?.textContent ?? null,
        heading: document.querySelector('#reading-title').textContent,
      }))

    const clickButton = (page, text) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), text)
    const linkValue = (page) => page.$eval('.share-link', (i) => i.value)
    const status = (page) => page.$eval('.share-status', (p) => p.textContent.trim())
    const hasCheckbox = async (page) => (await page.$('.share-include input')) !== null

    // --- Own three-card draw with a question ---
    const page = await newPage(appUrl)
    const question = 'Should I take the new job offer? 🇹🇼'
    await drawReading(page, 'three-card', question)
    check('2.4 draw does not change the URL', (await page.evaluate(() => location.href)) === appUrl + '#/tarot', await page.evaluate(() => location.href))
    check('own reading heading has no "Shared" label', (await readingSnapshot(page)).heading === 'Three cards')

    await clickButton(page, 'Share')
    check('3.1 Share opens the panel', (await page.$('.share-panel')) !== null)
    check('3.1 Share button reports expanded', (await page.$eval('.share button.secondary', (b) => b.getAttribute('aria-expanded'))) === 'true')
    check('3.2 question checkbox shown when reading has a question', await hasCheckbox(page))
    check('3.2 checkbox unticked by default', !(await page.$eval('.share-include input', (i: HTMLInputElement) => i.checked)))
    const linkNoQ = await linkValue(page)
    check('3.2 default link has no q', !linkNoQ.includes('q='), linkNoQ)
    check('link uses the app URL and v1 format', linkNoQ.startsWith(appUrl + '#/r/v1/three-card/'), linkNoQ)
    await clickButton(page, 'Copy link')
    await page.waitForFunction(() => document.querySelector('.share-status').textContent.trim() !== '')
    check('3.1 "Link copied" confirmation', (await status(page)) === 'Link copied', await status(page))
    check('3.1 clipboard holds the link', (await page.evaluate(() => navigator.clipboard.readText())) === linkNoQ)

    await page.click('.share-include input')
    const linkWithQ = await linkValue(page)
    check('3.2 ticking adds the question', linkWithQ === linkNoQ + '?q=' + encodeURIComponent(question), linkWithQ)
    check('3.2 ticking clears the old confirmation', (await status(page)) === '')
    await clickButton(page, 'Share') // close
    await clickButton(page, 'Share') // reopen
    check('3.2 checkbox unticked again after reopening', !(await page.$eval('.share-include input', (i: HTMLInputElement) => i.checked)))
    const ownSnapshot = await readingSnapshot(page)

    // 3.4 layout with a long question link
    await setQuestion
    await page.click('.share-include input')
    await page.screenshot({ path: path.join(shotDir, 'share-1280.png'), fullPage: true })
    check('3.4 no horizontal scroll at 1280px with panel open', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.setViewportSize({ width: 375, height: 800 })
    await page.screenshot({ path: path.join(shotDir, 'share-375.png'), fullPage: true })
    check('3.4 no horizontal scroll at 375px with panel open', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.setViewportSize({ width: 1280, height: 900 })

    // 3.3 manual-copy fallback
    await page.evaluate(() => {
      navigator.clipboard.writeText = () => Promise.reject(new Error('denied'))
    })
    await clickButton(page, 'Copy link')
    await page.waitForFunction(() => document.querySelector('.share-status').textContent.includes('Ctrl+C'))
    const selection = await page.evaluate(() => {
      const i = document.querySelector<HTMLInputElement>('.share-link')
      return { focused: document.activeElement === i, whole: i.selectionStart === 0 && i.selectionEnd === i.value.length }
    })
    check('3.3 fallback shows copy hint', (await status(page)).includes('Ctrl+C'), await status(page))
    check('3.3 fallback focuses and selects the whole link', selection.focused && selection.whole, JSON.stringify(selection))

    // --- 2.1 open the link (with question) in a fresh tab ---
    const shared = await newPage(linkWithQ)
    const sharedSnapshot = await readingSnapshot(shared)
    check('2.1 shared heading', sharedSnapshot.heading === 'Shared reading · Three cards', sharedSnapshot.heading)
    check('2.1 same cards, orientations and meanings', JSON.stringify(sharedSnapshot.slots) === JSON.stringify(ownSnapshot.slots))
    check('2.1 shared question shown', sharedSnapshot.asked === `“${question}”`, sharedSnapshot.asked)
    check('shared reading is read-only', (await shared.$$('textarea, input[name=spread], button[type=submit]')).length === 0)
    check('2.3 "Draw your own" replaces "New reading"', await shared.evaluate(() => [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent === 'Draw your own') && ![...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent === 'New reading')))
    check('recipient can share again with question unticked', await shared.evaluate(() => !!document.querySelector('.share button')))

    // Yes / No link keeps its verdict; question-less reading has no checkbox
    const yn = await newPage(appUrl)
    await drawReading(yn, 'yes-no', 'Will it work?')
    const ynOwn = await readingSnapshot(yn)
    await clickButton(yn, 'Share')
    const ynLink = await linkValue(yn)
    const ynShared = await newPage(ynLink)
    const ynSharedSnap = await readingSnapshot(ynShared)
    check('2.1 yes-no verdict matches in shared view', ynSharedSnap.verdict === ynOwn.verdict && JSON.stringify(ynSharedSnap.slots) === JSON.stringify(ynOwn.slots), `${ynOwn.verdict} vs ${ynSharedSnap.verdict}`)
    check('default yes-no link omits the question', ynSharedSnap.asked === null)

    const noQ = await newPage(appUrl)
    await drawReading(noQ, 'three-card', '')
    await clickButton(noQ, 'Share')
    check('3.2 no checkbox for a question-less reading', !(await hasCheckbox(noQ)))

    // 2.1 pasting a different link into the same tab
    await shared.evaluate((h) => (location.hash = h), new URL(ynLink).hash)
    await shared.waitForFunction(() => document.querySelector('#reading-title').textContent.includes('Yes / No'))
    check('2.1 changing the link in the same tab switches readings', JSON.stringify((await readingSnapshot(shared)).slots) === JSON.stringify(ynOwn.slots))

    // 2.3 Draw your own
    const historyBefore = await shared.evaluate(() => history.length)
    await clickButton(shared, 'Draw your own')
    await shared.waitForSelector('#question', { state: 'attached' })
    const after = await shared.evaluate(() => ({
      hash: location.hash,
      checked: document.querySelectorAll('input[name=spread]:checked').length,
      question: document.querySelector<HTMLTextAreaElement>('#question').value,
      historyLength: history.length,
    }))
    check('2.3 share fragment replaced by #/tarot', after.hash === '#/tarot', after.hash)
    check('2.3 no spread selected and empty question', after.checked === 0 && after.question === '')
    check('2.3 no history entry added', after.historyLength === historyBefore, `${historyBefore} -> ${after.historyLength}`)

    // 2.2 invalid links
    for (const bad of ['#/r/v1/yes-no/major-99', '#/r/v2/yes-no/major-01']) {
      const p = await newPage(appUrl + bad)
      const state = await p.evaluate(() => ({
        notice: document.querySelector('.notice')?.textContent ?? null,
        reading: !!document.querySelector('.reading'),
        checked: document.querySelectorAll('input[name=spread]:checked').length,
        question: document.querySelector<HTMLTextAreaElement>('#question')?.value,
      }))
      check(`2.2 ${bad} shows the notice over an empty composer`, state.notice === "This reading link isn't valid." && !state.reading && state.checked === 0 && state.question === '', JSON.stringify(state))
    }

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
    check('no failed requests', badResponses.length === 0, badResponses.join(' | '))
  } finally {
    await closeAll()
  }
})
