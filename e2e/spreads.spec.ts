// Covers tarot-spreads: Available spreads (four, in order, with their card
// counts), Situation, Action, Outcome spread positions, Choice spread positions,
// Choice spread requires a question (and its hint), and New spreads can be
// shared. Labels and names come from the data files, so a wording change there
// that the spec doesn't allow shows up here.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from '@playwright/test'
import { repo, setup } from './helpers.ts'

const spreadText = JSON.parse(readFileSync(path.join(repo, 'data/i18n/en/spreads.json'), 'utf8'))

test('themed three-card spreads', async ({ browser }, testInfo) => {
  test.setTimeout(120_000)
  const { appUrl, check, open, closeAll } = setup(browser, testInfo)
  try {
    const consoleErrors = []
    const page = await open()
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })

    const setQuestion = (value) =>
      page.evaluate((v) => {
        const ta = document.querySelector<HTMLTextAreaElement>('#question')
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, v)
        ta.dispatchEvent(new Event('input', { bubbles: true }))
      }, value)
    const clickButton = (text) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), text)
    const composer = () =>
      page.evaluate(() => ({
        options: [...document.querySelectorAll('.spread-option')]
          .filter((l) => l.querySelector('input[name=spread]'))
          .map((l) => [l.querySelector('.spread-name').textContent, l.querySelector('.spread-detail').textContent, l.querySelector('.spread-required')?.textContent ?? '']),
        placeholder: document.querySelector<HTMLTextAreaElement>('#question').placeholder,
        required: document.querySelector<HTMLTextAreaElement>('#question').required,
        hint: document.querySelector('#draw-hint').textContent,
        drawDisabled: document.querySelector<HTMLButtonElement>('button[type=submit]').disabled,
        preview: [...document.querySelectorAll('.spread-preview .position-label')].map((l) => l.textContent),
      }))
    const reading = () =>
      page.evaluate(() => ({
        heading: document.querySelector('#reading-title').textContent,
        labels: [...document.querySelectorAll('.spread-slot .position-label')].map((l) => l.textContent),
        cards: [...document.querySelectorAll('.spread-slot [role=img]')].map((c) => c.getAttribute('aria-label')),
        verdict: document.querySelector('.verdict')?.textContent ?? null,
        asked: document.querySelector('.asked')?.textContent ?? null,
      }))
    const labelsOf = (id) => Object.values(spreadText[id].positions)

    // --- The spread choice ---
    let c = await composer()
    check('four spreads in order with their descriptions, no card counts', JSON.stringify(c.options) === JSON.stringify([
      ['Yes / No', 'One card for a clear yes or no', 'Question required'],
      ['Past, Present, Future', 'How things are unfolding', ''],
      ['Situation, Action, Outcome', 'What to do, and where it leads', ''],
      ['Choice', 'Choose between A and B, with advice', 'Question required'],
    ]), JSON.stringify(c.options))

    // --- Situation, Action, Outcome: question optional, no verdict ---
    await page.click('input[name=spread][value="situation-action-outcome"]')
    c = await composer()
    check('S/A/O: question optional, Draw enabled', !c.required && !c.drawDisabled && c.placeholder === 'What would you like to know?', JSON.stringify(c))
    check('S/A/O: preview shows its positions', c.preview.join('|') === 'Situation|Action|Outcome', c.preview.join('|'))
    await clickButton('Draw')
    await page.waitForSelector('.reading', { state: 'attached' })
    let r = await reading()
    check('S/A/O: labels from the spec', r.labels.join('|') === 'Situation|Action|Outcome' && r.labels.join('|') === labelsOf('situation-action-outcome').join('|'), r.labels.join('|'))
    check('S/A/O: three different cards, no verdict', r.cards.length === 3 && new Set(r.cards).size === 3 && r.verdict === null, JSON.stringify(r))
    check('S/A/O: heading names the spread', r.heading === 'Situation, Action, Outcome', r.heading)
    await clickButton('New reading')
    await page.waitForSelector('.composer')

    // --- Choice: question required, own hint ---
    await page.click('input[name=spread][value="choice"]')
    c = await composer()
    check('Choice: the question box is marked required', c.required, JSON.stringify(c))
    check('Choice: Draw disabled without a question', c.drawDisabled && c.hint === 'A choice reading needs a question naming your two options.', JSON.stringify(c))
    check('Choice: hint asks for both options', c.placeholder === 'Name your two options, e.g. Stay or move?', c.placeholder)
    await setQuestion('   ')
    check('Choice: whitespace is not a question', (await composer()).drawDisabled)
    await setQuestion('Stay or move?')
    c = await composer()
    check('Choice: Draw enabled with a question', !c.drawDisabled && c.hint === '', JSON.stringify(c))
    await clickButton('Draw')
    await page.waitForSelector('.reading', { state: 'attached' })
    r = await reading()
    check('Choice: labels from the spec', r.labels.join('|') === 'Option A|Option B|Advice' && r.labels.join('|') === labelsOf('choice').join('|'), r.labels.join('|'))
    check('Choice: three different cards, no verdict, question shown', r.cards.length === 3 && new Set(r.cards).size === 3 && r.verdict === null && r.asked === '“Stay or move?”', JSON.stringify(r))

    // --- Share the Choice reading and open it ---
    await clickButton('Share')
    await page.click('.share-include input')
    const link = await page.$eval('.share-link', (i: HTMLInputElement) => i.value)
    check('Choice link format', link.startsWith(appUrl + '#/r/v1/choice/') && link.endsWith('?q=' + encodeURIComponent('Stay or move?')), link)
    const shared = await open()
    shared.on('pageerror', (e) => consoleErrors.push(e.message))
    await shared.goto(link, { waitUntil: 'networkidle' })
    await shared.waitForSelector('.reading', { state: 'attached' })
    const s = await shared.evaluate(() => ({
      heading: document.querySelector('#reading-title').textContent,
      labels: [...document.querySelectorAll('.spread-slot .position-label')].map((l) => l.textContent),
      cards: [...document.querySelectorAll('.spread-slot [role=img]')].map((c) => c.getAttribute('aria-label')),
    }))
    check('shared Choice shows the same reading', s.heading === 'Shared reading · Choice' && s.labels.join('|') === r.labels.join('|') && s.cards.join('|') === r.cards.join('|'), JSON.stringify({ s, r }))

    // --- Back to Yes / No: default hints return ---
    await clickButton('New reading')
    await page.waitForSelector('.composer')
    await page.click('input[name=spread][value="yes-no"]')
    await setQuestion('')
    c = await composer()
    check('Yes / No keeps its hint and note', c.placeholder === 'Ask a yes or no question' && c.hint === 'A yes / no reading needs a question.', JSON.stringify(c))

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
