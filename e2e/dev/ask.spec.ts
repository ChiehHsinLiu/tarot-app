// Covers private-readings for tarot (ASK_CLAUDE=1 only, uses the owner's
// Claude plan): Readings are interpreted by the owner's Claude Code, The answer
// streams into the page, Stop and ask again, on an own and a shared reading.
import { execSync } from 'node:child_process'
import path from 'node:path'
import { test } from '@playwright/test'
import { setup } from '../helpers.ts'

test('Ask Claude on tarot readings (dev only)', async ({ browser }, testInfo) => {
  test.setTimeout(400_000)
  const { appUrl, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const claudeRunning = () => Number(execSync("pgrep -f 'claude -p' | wc -l").toString().trim())

    const consoleErrors = []
    async function newPage(url) {
      const page = await open()
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
      page.on('pageerror', (e) => consoleErrors.push(e.message))
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto((new URL(url).hash ? url : url + '#/tarot'), { waitUntil: 'networkidle' })
      return page
    }
    const clickButton = (page, text) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), text)
    const buttons = (page) => page.evaluate(() => [...document.querySelectorAll<HTMLButtonElement>('.reading-actions button')].map((b) => b.textContent.trim()))
    const status = (page) => page.evaluate(() => document.querySelector('.claude-answer-status')?.textContent ?? '')
    const answer = (page) => page.evaluate(() => document.querySelector('.claude-answer-text')?.textContent ?? '')
    const cards = (page) => page.evaluate(() => [...document.querySelectorAll('.spread-slot [role=img]')].map((c) => c.getAttribute('aria-label')))

    // --- Own Yes / No reading: full answer ---
    const own = await newPage(appUrl)
    await own.click('input[value="yes-no"]')
    await own.type('#question', 'Should I take the new job offer?')
    await own.click('button[type=submit]')
    await own.waitForSelector('.reading', { state: 'attached' })
    await own.waitForFunction(() => [...document.querySelectorAll<HTMLButtonElement>('.reading-actions button')].some((b) => b.textContent.trim() === 'Ask Claude'))
    check('Ask Claude button shown in dev', (await buttons(own)).includes('Ask Claude'), (await buttons(own)).join('|'))
    const cardsBefore = await cards(own)
    await clickButton(own, 'Ask Claude')
    await own.waitForFunction(() => document.querySelector('.claude-answer-status')?.textContent === 'Claude is writing…')
    check('status shows "Claude is writing…"', true)
    check('Stop button replaces Ask Claude while streaming', (await buttons(own)).includes('Stop') && !(await buttons(own)).includes('Ask Claude'))
    await own.waitForFunction(() => (document.querySelector('.claude-answer-text')?.textContent.length ?? 0) > 0, undefined, { timeout: 90_000 })
    const early = (await answer(own)).length
    await own.screenshot({ path: path.join(shotDir, 'ask-streaming-1280.png'), fullPage: true })
    await own.waitForFunction(() => document.querySelector('.claude-answer-status')?.textContent !== 'Claude is writing…', undefined, { timeout: 120_000 })
    const full = await answer(own)
    check('3.1 own reading: answer streams in before completion', early > 0 && full.length > early, `${early} -> ${full.length} chars`)
    check('3.1 own reading: completes with "Reading complete."', (await status(own)) === 'Reading complete.', await status(own))
    check('Ask again offered after completion', (await buttons(own)).includes('Ask again'))
    await own.screenshot({ path: path.join(shotDir, 'ask-done-1280.png'), fullPage: true })
    check('3.3 no horizontal scroll at 1280px after completion', await own.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await own.setViewportSize({ width: 375, height: 800 })
    await own.screenshot({ path: path.join(shotDir, 'ask-done-375.png'), fullPage: true })
    check('3.3 no horizontal scroll at 375px after completion', await own.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await own.setViewportSize({ width: 1280, height: 900 })

    // --- Ask again, then Stop mid-stream ---
    await clickButton(own, 'Ask again')
    await own.waitForFunction(() => (document.querySelector('.claude-answer-text')?.textContent.length ?? 0) > 40, undefined, { timeout: 90_000 })
    check('Ask again starts a fresh answer', !(await answer(own)).startsWith(full.slice(0, 200)) || (await answer(own)).length < full.length)
    await own.setViewportSize({ width: 375, height: 800 })
    check('3.3 no horizontal scroll at 375px while streaming', await own.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await own.setViewportSize({ width: 1280, height: 900 })
    const runningBeforeStop = claudeRunning()
    await clickButton(own, 'Stop')
    const partial = await answer(own)
    await new Promise((r) => setTimeout(r, 2000))
    check('Stop shows "Stopped." and keeps the partial answer', (await status(own)) === 'Stopped.' && partial.length > 0 && (await answer(own)) === partial)
    check('Stop ends the Claude process', runningBeforeStop >= 1 && claudeRunning() === 0, `${runningBeforeStop} -> ${claudeRunning()}`)
    check('cards unchanged after asking twice', JSON.stringify(await cards(own)) === JSON.stringify(cardsBefore))
    check('Ask again offered after stopping', (await buttons(own)).includes('Ask again'))

    // --- Shared link ---
    const shared = await newPage(appUrl + '#/r/v1/three-card/swords-03.major-13r.cups-01?q=What%20do%20I%20need%20to%20know%3F')
    await shared.waitForFunction(() => [...document.querySelectorAll<HTMLButtonElement>('.reading-actions button')].some((b) => b.textContent.trim() === 'Ask Claude'))
    check('Ask Claude shown on a shared reading', (await buttons(shared)).includes('Ask Claude'))
    await clickButton(shared, 'Ask Claude')
    await shared.waitForFunction(() => ['Reading complete.', 'Stopped.'].includes(document.querySelector('.claude-answer-status')?.textContent) || document.querySelector('.claude-answer-status.error'), undefined, { timeout: 120_000 })
    check('3.1 shared reading: answer completes', (await status(shared)) === 'Reading complete.' && (await answer(shared)).length > 200, await status(shared))

    // --- Leaving the page mid-stream ends Claude ---
    await clickButton(shared, 'Ask again')
    await shared.waitForFunction(() => (document.querySelector('.claude-answer-text')?.textContent.length ?? 0) > 0, undefined, { timeout: 90_000 })
    await clickButton(shared, 'Draw your own')
    await new Promise((r) => setTimeout(r, 2000))
    check('leaving the reading mid-stream ends the Claude process', claudeRunning() === 0)

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
