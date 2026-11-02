// Covers tarot-deck-styles: Every Dachshund card has its own drawing (Major
// card face), Dachshund number cards can be counted (Counting cups), and
// Dachshund pictures follow the tarot picture rules (Colourful, suit still
// clear; Screen reader; Reversed picture; Offline after the screen has shown,
// on the public build; Same back). Share links with d=dachshund show chosen
// cards face up, so most checks open one instead of drawing.
import { test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { axSnapshot, setup } from './helpers.ts'
import type { AxNode } from './helpers.ts'

test('dachshund card art', async ({ browser }, testInfo) => {
  test.setTimeout(240_000)
  const { appUrl, publicBuild, check, open, closeAll } = setup(browser, testInfo)
  try {
    async function newPage(scheme: 'light' | 'dark' = 'light', width = 1280, reducedMotion: 'reduce' | 'no-preference' = 'reduce') {
      const page = await open()
      await page.emulateMedia({ colorScheme: scheme, reducedMotion })
      await page.setViewportSize({ width, height: 900 })
      return page
    }
    // Opens a share link of three cards, such as 'wands-01.cups-03r.major-16'.
    async function show(page: Page, cards: string, deck = '?d=dachshund') {
      await page.goto('about:blank')
      await page.goto(appUrl + '#/r/v1/three-card/' + cards + deck, { waitUntil: 'networkidle' })
      await page.waitForSelector('.reading .card-face')
    }
    // Suit symbols in a drawing are the groups symbol() draws (see dachshund-art.test.ts).
    const faces = (page: Page) =>
      page.evaluate(() =>
        [...document.querySelectorAll('.reading .card-face')].map((f) => {
          const art = f.querySelector('.tarot-art')
          return {
            label: f.getAttribute('aria-label'),
            numeral: f.querySelector('.card-numeral')!.textContent,
            name: f.querySelector('.card-name')!.textContent,
            deck: f.closest('.card')!.getAttribute('data-deck'),
            drawing: art?.querySelector('svg')?.outerHTML ?? null,
            pips: f.querySelectorAll('.card-pips').length,
            symbols: [...f.querySelectorAll('.tarot-art g[transform$="translate(-12 -12)"]')].map((g) => g.getBoundingClientRect().width),
            frame: getComputedStyle(f, '::before').borderTopColor,
            coat: art?.querySelector('.art-coat') ? getComputedStyle(art.querySelector('.art-coat')!).fill : null,
            transform: getComputedStyle(f).transform,
          }
        }),
      )

    // --- Own drawing for every kind of card, different from Classic ---
    let page = await newPage()
    await show(page, 'major-18.cups-03.cups-13')
    const dogs = await faces(page)
    check('The Moon: name, numeral and a drawing', dogs[0].name === 'The Moon' && dogs[0].numeral === 'XVIII' && !!dogs[0].drawing, dogs[0].numeral)
    check('every card marked dachshund, number card drawn not pipped', dogs.every((f) => f.deck === 'dachshund' && !!f.drawing && f.pips === 0))
    check('Three of Cups: exactly three cups', dogs[1].symbols.length === 3, dogs[1].symbols.length)
    await show(page, 'major-18.cups-03.cups-13', '')
    const classic = await faces(page)
    check('Dachshund drawings differ from Classic', dogs.every((f, i) => f.drawing !== classic[i].drawing))
    check('Classic number card still uses pips', classic[1].pips === 1 && classic[1].deck === 'classic')

    // --- Colourful, suit still clear, both palettes ---
    for (const scheme of ['light', 'dark'] as const) {
      page = await newPage(scheme)
      await show(page, 'cups-03.wands-03.major-00')
      const [cups, wands] = await faces(page)
      check(`${scheme}: cups and wands frames in different suit colours`, cups.frame !== wands.frame, `${cups.frame} / ${wands.frame}`)
      check(`${scheme}: the dogs are the same brown on both`, !!cups.coat && cups.coat === wands.coat, `${cups.coat} / ${wands.coat}`)
    }

    // --- Screen reader: just the name and orientation ---
    page = await newPage()
    await show(page, 'cups-13r.major-16.wands-03r')
    const images: string[] = []
    const visit = (n: AxNode) => {
      if (n.role === 'image') images.push(n.name)
      n.children.forEach(visit)
    }
    visit(await axSnapshot(page))
    check('screen reader: one image per card, named by card', JSON.stringify(images) === JSON.stringify(['Queen of Cups, reversed', 'The Tower', 'Three of Wands, reversed']), images.join(' | '))

    // --- Reversed picture ---
    const reversed = await faces(page)
    check('reversed: whole face, drawing included, turned', reversed[0].transform.startsWith('matrix(-1') && !!reversed[0].drawing)
    check('upright: not turned', reversed[1].transform === 'none')
    check('reversed: name below the face upright with "(reversed)"', await page.evaluate(() => {
      const title = document.querySelector('.spread-slot .card-title')!
      return getComputedStyle(title).transform === 'none' && title.textContent!.includes('Queen of Cups') && title.textContent!.includes('(reversed)')
    }))

    // --- Phone width: pictures inside the frame, symbols countable ---
    for (const scheme of ['light', 'dark'] as const) {
      page = await newPage(scheme, 320)
      // Every number card, three at a time, plus a major and a reversed card.
      const numbers = ['wands', 'cups', 'swords', 'pentacles'].flatMap((suit) => Array.from({ length: 10 }, (_, i) => `${suit}-${String(i + 1).padStart(2, '0')}`))
      const groups = [...Array.from({ length: 13 }, (_, i) => numbers.slice(i * 3, i * 3 + 3).join('.')), 'pentacles-10.major-21.cups-09r']
      for (const cards of groups) {
        await show(page, cards)
        const fit = await page.evaluate(() =>
          [...document.querySelectorAll('.reading .card-face')].map((f) => {
            const face = f.getBoundingClientRect()
            const r = f.querySelector('.tarot-art')!.getBoundingClientRect()
            return {
              label: f.getAttribute('aria-label'),
              inside: r.left >= face.left + 6 && r.right <= face.right - 6 && r.top >= face.top + 6 && r.bottom <= face.bottom - 6,
            }
          }),
        )
        for (const f of fit) check(`320 ${scheme}: ${f.label}: picture inside the frame`, f.inside)
        const counted = await faces(page)
        for (const f of counted.filter((c) => c.symbols.length)) {
          check(`320 ${scheme}: ${f.label}: every symbol at least 9px wide`, Math.min(...f.symbols) >= 9, Math.min(...f.symbols).toFixed(1))
        }
        check(`320 ${scheme}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      }
    }

    // --- Same night-sky back before the flip ---
    page = await newPage('light', 1280, 'no-preference')
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    await page.click('input[name=deck][value=dachshund]')
    await page.click('input[name=spread][value=three-card]')
    await page.click('button[type=submit]')
    await page.waitForSelector('.reading .card-face', { state: 'attached' })
    const backs = await page.$$eval('.spread-slot .card-back', (b) => b.length)
    check('a drawn Dachshund reading shows the shared back on every card', backs === 3, backs)

    // --- Offline after the screen has shown ---
    // Public only: the dev server fetches each module as it is first used.
    if (!publicBuild) return
    page = await newPage()
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    await page.context().setOffline(true)
    let shown = 0
    let missing: string[] = []
    for (let i = 0; i < 6; i++) {
      await page.click('input[name=deck][value=dachshund]')
      await page.click('input[name=spread][value=three-card]')
      await page.click('button[type=submit]')
      await page.waitForSelector('.reading .card-face', { state: 'attached' })
      const drawn = await faces(page)
      shown += drawn.length
      missing = missing.concat(drawn.filter((f) => !f.drawing || f.deck !== 'dachshund').map((f) => f.label!))
      await page.getByRole('button', { name: 'New reading' }).first().click()
    }
    check('offline: every drawn card shows its dachshund drawing', shown === 18 && missing.length === 0, missing.join(', '))
    await page.context().setOffline(false)
  } finally {
    await closeAll()
  }
})
