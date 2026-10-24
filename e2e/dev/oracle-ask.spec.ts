// Covers private-readings for the oracle (ASK_CLAUDE=1 only, uses the owner's
// Claude plan): Oracle cards are interpreted by the owner's Claude Code, The
// oracle question stays editable, Stop and ask again, Private journal.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { test } from '@playwright/test'
import { journalFile, setup } from '../helpers.ts'

test('Ask Claude on the oracle (dev only)', async ({ browser }, testInfo) => {
  test.setTimeout(400_000)
  const { appUrl, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const claudeRunning = () => Number(execSync("pgrep -f 'claude -p' | wc -l").toString().trim())
    const journalLines = () => (fs.existsSync(journalFile()) ? fs.readFileSync(journalFile(), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [])
    const journalBefore = journalLines().length

    const page = await open()
    const consoleErrors = []
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })

    const clickButton = (t) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
    const hasButton = (t) => page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent.trim() === t), t)
    const status = () => page.evaluate(() => document.querySelector('.claude-answer-status')?.textContent ?? '')
    const answer = () => page.evaluate(() => document.querySelector('.claude-answer-text')?.textContent ?? '')
    const box = () => page.evaluate(() => {
      const t = document.querySelector<HTMLTextAreaElement>('#oracle-question')
      return t && { value: t.value, disabled: t.disabled, count: document.querySelector('#oracle-question-count').textContent.trim() }
    })
    const cardLabel = () => page.evaluate(() => document.querySelector('.oracle-face').getAttribute('aria-label'))
    const waitEnded = () =>
      page.waitForFunction(() => ['Reading complete.', 'Stopped.'].includes(document.querySelector('.claude-answer-status')?.textContent) || document.querySelector('.claude-answer-status.error'), undefined, { timeout: 150_000 })

    await page.evaluate(() => [...document.querySelectorAll<HTMLButtonElement>('.oracle-intro-screen button')].find((b) => b.textContent.trim() === 'Draw').click())
    await page.waitForSelector('.oracle-reading', { state: 'attached' })
    await page.waitForSelector('#oracle-question', { state: 'attached' })
    const card = await cardLabel()
    const b0 = await box()
    check('question box shown, empty, optional, 0 / 300', b0 && b0.value === '' && b0.count === '0 / 300' && !b0.disabled, JSON.stringify(b0))
    check('placeholder suggests a focus question', (await page.$eval('#oracle-question', (t: HTMLTextAreaElement) => t.placeholder)) === 'What should I focus on today?')
    check('Ask Claude button shown', await hasButton('Ask Claude'))

    // --- Empty box: general explanation ---
    await clickButton('Ask Claude')
    await page.waitForFunction(() => document.querySelector('.claude-answer-status')?.textContent === 'Claude is writing…')
    check('box disabled while streaming', (await box()).disabled)
    check('Stop replaces Ask Claude while streaming', (await hasButton('Stop')) && !(await hasButton('Ask Claude')))
    await page.waitForFunction(() => (document.querySelector('.claude-answer-text')?.textContent.length ?? 0) > 0, undefined, { timeout: 90_000 })
    const early = (await answer()).length
    await waitEnded()
    const general = await answer()
    check('empty-box answer streams and completes', (await status()) === 'Reading complete.' && general.length > early && early > 0, `${early} -> ${general.length}, ${await status()}`)
    check('box editable again after the answer', !(await box()).disabled)
    check('Ask again offered', await hasButton('Ask again'))

    // --- Question: focus for today ---
    await page.type('#oracle-question', 'What should I focus on today?')
    check('live count updates', (await box()).count === '29 / 300', (await box()).count)
    await clickButton('Ask again')
    await page.waitForFunction(() => document.querySelector('.claude-answer-status')?.textContent === 'Claude is writing…')
    await waitEnded()
    const focused = await answer()
    check('question answer completes and differs', (await status()) === 'Reading complete.' && focused !== general && focused.length > 200, await status())
    check('card unchanged after asking twice', (await cardLabel()) === card)
    await page.screenshot({ path: path.join(shotDir, 'oracle-ask-done-1280.png'), fullPage: true })
    check('no horizontal scroll at 1280px', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.setViewportSize({ width: 375, height: 800 })
    check('no horizontal scroll at 375px', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.screenshot({ path: path.join(shotDir, 'oracle-ask-done-375.png'), fullPage: true })
    await page.setViewportSize({ width: 1280, height: 900 })

    // --- Edited question, then Stop mid-stream ---
    await page.click('#oracle-question', { clickCount: 3 })
    await page.keyboard.press('Backspace')
    await page.type('#oracle-question', 'How can I rest better tonight?')
    await clickButton('Ask again')
    await page.waitForFunction(() => (document.querySelector('.claude-answer-text')?.textContent.length ?? 0) > 40, undefined, { timeout: 90_000 })
    const runningBeforeStop = claudeRunning()
    await clickButton('Stop')
    const partial = await answer()
    await new Promise((r) => setTimeout(r, 2000))
    check('Stop keeps the partial answer, labeled Stopped.', (await status()) === 'Stopped.' && partial.length > 0 && (await answer()) === partial)
    check('Stop ends the Claude process', runningBeforeStop >= 1 && claudeRunning() === 0, `${runningBeforeStop} -> ${claudeRunning()}`)
    check('edited question kept after Stop', (await box()).value === 'How can I rest better tonight?')

    // --- Draw again clears the box and answer ---
    await clickButton('Draw again')
    await page.waitForSelector('#oracle-question', { state: 'attached' })
    const b1 = await box()
    check('Draw again: new card', (await cardLabel()) !== card)
    check('Draw again: empty box and no answer', b1.value === '' && !(await page.$('.claude-answer')) && (await hasButton('Ask Claude')), JSON.stringify(b1))

    // --- Journal ---
    await new Promise((r) => setTimeout(r, 500))
    const added = journalLines().slice(journalBefore)
    check('journal: 3 oracle entries (completed, completed, stopped)',
      added.length === 3 && added.every((e) => e.deck === 'animal') && added.map((e) => e.status).join() === 'completed,completed,stopped',
      JSON.stringify(added.map((e) => [e.deck, e.status])))
    check('journal: questions recorded', added.map((e) => e.question).join('|') === '|What should I focus on today?|How can I rest better tonight?')

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
