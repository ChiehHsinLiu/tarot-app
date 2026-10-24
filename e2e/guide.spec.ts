// Covers screen-instructions: Guides on each reading screen, Tarot
// instructions, Tarot deck explanation, Animal oracle guide content, Reflection
// note, Accessible and offline guides; and app-navigation: Start over from the
// top of a longer reading.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup, axSnapshot } from './helpers.ts'

test('How it works guides', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const page = await open()
    const consoleErrors = []
    const otherOrigins = []
    const appOrigin = new URL(appUrl).origin
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    page.on('request', (r) => {
      const u = r.url()
      if (/^https?:/.test(u) && new URL(u).origin !== appOrigin) otherOrigins.push(u)
    })
    await page.setViewportSize({ width: 1280, height: 900 })

    const LABEL = 'How it works and about this deck'
    const NOTE = 'Readings are for reflection and fun, not professional advice.'
    const TAROT_PHRASES = ['Yes / No', 'Three cards', 'reversed', 'upside down', 'Share', '78', '22 Major Arcana', '56 Minor Arcana', 'Wands', 'Cups', 'Swords', 'Pentacles', 'written for this app']
    const ORACLE_PHRASES = ['no question', 'message', 'reflection question', 'affirmation', 'Draw again', '36', 'six colour families']

    const settle = (ms = 150) => new Promise((r) => setTimeout(r, ms))
    const go = async (hash = '') => {
      await page.goto(appUrl + hash, { waitUntil: 'networkidle' })
      await settle()
    }
    const clickLink = async (text) => {
      await page.evaluate((t) => [...document.querySelectorAll('a')].find((a) => a.textContent.includes(t)).click(), text)
      await settle()
    }
    const clickButton = async (t) => {
      await page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
      await settle()
    }
    const guide = () => page.evaluate(() => {
      const btn = document.querySelector('.guide-toggle')
      const panel = document.querySelector('.guide-panel')
      return {
        button: !!btn,
        label: btn?.getAttribute('aria-label') ?? null,
        expanded: btn?.getAttribute('aria-expanded') ?? null,
        controls: btn ? btn.getAttribute('aria-controls') === panel?.id || !panel : false,
        // The link sits in the heading block, below the heading, with nothing beside the title.
        underHeading: (() => {
          const h = btn?.parentElement?.querySelector('h2')
          return !!h && btn.getBoundingClientRect().top >= h.getBoundingClientRect().bottom && btn.textContent.trim() === 'How it works'
        })(),
        panel: !!panel,
        h3s: panel ? [...panel.querySelectorAll('h3')].map((h) => h.textContent) : [],
        text: (panel as HTMLElement)?.innerText ?? '',
        // Guide text outside the toggle's own "How it works" label.
        bodyHasGuideText: (() => {
          const t = document.body.innerText.replace((btn as HTMLElement)?.innerText ?? '', '')
          return t.includes('How it works') || t.includes('About this deck')
        })(),
        focusIsToggle: document.activeElement === btn,
      }
    })
    const expandedFor = async () => {
      const snap = await axSnapshot(page)
      const find = (n) => (n.name === LABEL && n.role === 'button' ? n : (n.children ?? []).map(find).find(Boolean))
      const node = find(snap)
      return node ? { found: true, expanded: !!node.expanded } : { found: false }
    }
    const composerState = () => page.evaluate(() => ({
      spread: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value ?? null,
      question: document.querySelector<HTMLTextAreaElement>('#question')?.value ?? null,
      reading: !!document.querySelector('.reading'),
      hash: location.hash,
    }))
    // The heading block comes first, and the next thing after it is the given element.
    const followsHeading = (selector) => page.evaluate((sel) => {
      const h = document.querySelector('.guided-heading')
      const next = sel === 'draw' ? [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === 'Draw') : document.querySelector(sel)
      return !!(h && next && h.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING)
    }, selector)

    // --- Tarot screen ---
    await go('#/tarot')
    let g = await guide()
    check('tarot: "How it works" link under the heading', g.button && g.underHeading)
    check('tarot: "How it works" named "How it works and about this deck"', g.label === LABEL, g.label)
    check('tarot: panel closed, no guide text on the page', !g.panel && g.expanded === 'false' && !g.bodyHasGuideText)
    check('tarot: spread choice follows the heading', await followsHeading('.spread-picker:not(.deck-picker)'))
    check('tarot: focus on heading', await page.evaluate(() => document.activeElement?.id === 'tarot-title'))
    let a = await expandedFor()
    check('tarot: assistive tech sees a collapsed button', a.found && a.expanded === false, JSON.stringify(a))

    await page.click('input[value=three-card]')
    await page.type('#question', 'What should I know?')
    await page.click('.guide-toggle')
    await settle()
    g = await guide()
    const after = await composerState()
    check('tarot: "How it works" opens the panel', g.panel && g.expanded === 'true' && g.controls)
    check('tarot: panel has How it works and About this deck', g.h3s.join('|') === 'How it works|About this deck', g.h3s.join('|'))
    for (const p of TAROT_PHRASES) check(`tarot: panel shows "${p}"`, g.text.includes(p))
    check('tarot: panel ends with the note, then Close', g.text.trim().replace(/\s*Close$/, '').endsWith(NOTE))
    check('tarot: no "Claude" in the public guide', !/claude/i.test(g.text))
    check('tarot: spread and question unchanged, form not submitted', after.spread === 'three-card' && after.question === 'What should I know?' && !after.reading && after.hash === '#/tarot', JSON.stringify(after))
    a = await expandedFor()
    check('tarot: assistive tech sees it expanded', a.found && a.expanded === true, JSON.stringify(a))

    // Close button returns focus to "How it works".
    await page.click('.guide-close')
    await settle()
    g = await guide()
    check('Close: panel closed, focus on "How it works"', !g.panel && g.expanded === 'false' && g.focusIsToggle)

    // Keyboard: Enter opens, Escape closes and focuses "How it works", Space opens.
    await page.focus('.guide-toggle')
    await page.keyboard.press('Enter')
    await settle()
    check('keyboard: Enter opens the panel', (await guide()).panel)
    await page.focus('.guide-close')
    await page.keyboard.press('Escape')
    await settle()
    g = await guide()
    check('keyboard: Escape closes it and focuses "How it works"', !g.panel && g.focusIsToggle)
    await page.keyboard.press('Space')
    await settle()
    check('keyboard: Space opens the panel', (await guide()).panel)
    await page.keyboard.press('Space')
    await settle()
    check('keyboard: Space again closes it', !(await guide()).panel)

    // Closed again when the screen is shown again.
    await page.click('.guide-toggle')
    await clickLink('Home')
    check('home: no "How it works" and no panel', !(await guide()).button && !(await guide()).panel)
    await clickLink('Tarot reading')
    g = await guide()
    check('tarot again: panel closed', g.button && !g.panel)
    await page.click('.guide-toggle')
    await page.click('input[value=three-card]')
    await clickButton('Draw')
    g = await guide()
    check('tarot reading: no "How it works" and no panel', !g.button && !g.panel)
    await clickButton('New reading')
    g = await guide()
    check('after New reading: panel closed', g.button && !g.panel)

    // --- Oracle screen ---
    await go('#/oracle')
    g = await guide()
    check('oracle: "How it works" link under the heading, panel closed', g.button && g.underHeading && !g.panel && !g.bodyHasGuideText)
    check('oracle: the intro and Draw follow the heading', await followsHeading('draw'))
    check('oracle: focus on heading', await page.evaluate(() => document.activeElement?.id === 'oracle-intro-title'))
    await page.click('.guide-toggle')
    await settle()
    g = await guide()
    for (const p of ORACLE_PHRASES) check(`oracle: panel shows "${p}"`, g.text.includes(p))
    check('oracle: panel ends with the note, then Close', g.text.trim().replace(/\s*Close$/, '').endsWith(NOTE))
    check('oracle: panel left-aligned', await page.evaluate(() => getComputedStyle(document.querySelector('.guide-panel')).textAlign === 'left'))
    await clickButton('Draw')
    g = await guide()
    check('oracle card: no "How it works" and no panel', !g.button && !g.panel)

    // --- Share link ---
    await go('#/r/v1/three-card/swords-03.major-13r.cups-01')
    g = await guide()
    check('share link: no "How it works" and no panel', (await page.$('.reading')) && !g.button && !g.panel)

    // --- Phone width, panel open, light and dark ---
    await page.setViewportSize({ width: 320, height: 800 })
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      for (const [hash, name] of [['#/tarot', 'tarot'], ['#/oracle', 'oracle']]) {
        await go(hash)
        await page.click('.guide-toggle')
        await settle()
        check(`320px ${scheme} ${name}: no horizontal scroll with the panel open`, await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
        const colours = await page.evaluate(() => {
          const p = getComputedStyle(document.querySelector('.guide-panel'))
          return { bg: p.backgroundColor, text: p.color }
        })
        check(`320px ${scheme} ${name}: text differs from background`, colours.bg !== colours.text, JSON.stringify(colours))
        await page.screenshot({ path: path.join(shotDir, `guide-${name}-320-${scheme}${publicBuild ? '-public' : ''}.png`), fullPage: true })
      }
    }

    check('no requests to another origin', otherOrigins.length === 0, otherOrigins.slice(0, 3).join(' '))
    check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
  } finally {
    await closeAll()
  }
})
