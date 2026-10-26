// Covers tarot-deck: Illustrated card face (Minor card face, Same number, same
// layout, Ace face, Court card face, Major card face), and visual-theme: Tarot
// suits have their own colours (Suits look different, Both palettes), Tarot
// pictures are original and decorative (Screen reader), Tarot pictures work
// wherever a card is shown (Reversed picture, Phone width, Offline after the
// screen has shown, on the public build). Share links show chosen cards face
// up, so most checks open one instead of drawing.
import { test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { axSnapshot, setup } from './helpers.ts'
import type { AxNode } from './helpers.ts'

const SUITS = ['wands', 'cups', 'swords', 'pentacles']
const NAMES: Record<string, string> = { wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pentacles' }

test('tarot card art', async ({ browser }, testInfo) => {
  test.setTimeout(240_000)
  const { appUrl, publicBuild, check, open, closeAll } = setup(browser, testInfo)
  try {
    async function newPage(scheme: 'light' | 'dark' = 'light', width = 1280) {
      const page = await open()
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      return page
    }
    // Opens a share link of three cards, such as 'wands-01.cups-03r.major-16'.
    async function show(page: Page, cards: string) {
      await page.goto('about:blank')
      await page.goto(appUrl + '#/r/v1/three-card/' + cards, { waitUntil: 'networkidle' })
      await page.waitForSelector('.reading .card-face')
    }
    // What each face shows: its label, numeral, name, pips (where each is placed
    // in the pip box, its width, and whether it stays inside the box), drawing,
    // and colours.
    const faces = (page: Page) =>
      page.evaluate(() =>
        [...document.querySelectorAll('.reading .card-face')].map((f) => {
          const pips = f.querySelector('.card-pips')
          const box = pips?.getBoundingClientRect()
          const art = f.querySelector('.tarot-art')
          const frame = getComputedStyle(f, '::before')
          return {
            label: f.getAttribute('aria-label'),
            numeral: f.querySelector('.card-numeral').textContent,
            name: f.querySelector('.card-name').textContent,
            pips: [...f.querySelectorAll('.card-pip')].map((g) => {
              const r = g.getBoundingClientRect()
              return { at: g.getAttribute('transform'), w: r.width, inBox: r.left >= box.left && r.right <= box.right && r.top >= box.top && r.bottom <= box.bottom }
            }),
            pipStroke: pips ? getComputedStyle(pips).stroke : null,
            pipsHidden: pips?.getAttribute('aria-hidden') ?? null,
            drawing: art?.querySelector('svg')?.outerHTML ?? null,
            artHidden: art?.getAttribute('aria-hidden') ?? null,
            frame: frame.borderTopColor,
            border: getComputedStyle(f).borderTopColor,
            bg: getComputedStyle(f).backgroundColor,
            transform: getComputedStyle(f).transform,
          }
        }),
      )

    // --- Pips: Ace, Three and Ten of every suit ---
    let page = await newPage()
    for (const suit of SUITS) {
      await show(page, `${suit}-01.${suit}-03.${suit}-10`)
      const [ace, three, ten] = await faces(page)
      check(`${suit}: Ace shows one pip`, ace.pips.length === 1 && ace.name === `Ace of ${NAMES[suit]}`, ace.pips.length)
      check(`${suit}: Three shows three pips`, three.pips.length === 3 && three.name === `Three of ${NAMES[suit]}`, three.pips.length)
      check(`${suit}: Ten shows ten pips`, ten.pips.length === 10, ten.pips.length)
      check(`${suit}: Ace pip larger than the Three's`, ace.pips[0].w > 1.5 * Math.max(...three.pips.map((p) => p.w)))
      check(`${suit}: number cards have no drawing`, !ace.drawing && !three.drawing && !ten.drawing)
      check(`${suit}: pips hidden from assistive technology`, [ace, three, ten].every((f) => f.pipsHidden === 'true'))
      check(`${suit}: pips drawn in the frame colour`, ace.pipStroke === ace.frame, `${ace.pipStroke} vs ${ace.frame}`)
      check(`${suit}: Ten's pips inside the pip box`, ten.pips.every((p) => p.inBox))
    }

    // --- Same number, same layout ---
    await show(page, 'wands-07.pentacles-07.cups-07')
    const sevens = await faces(page)
    const layout = (f: (typeof sevens)[number]) => JSON.stringify(f.pips.map((p) => p.at).sort())
    check('Seven of Wands and Seven of Pentacles: seven pips each', sevens[0].pips.length === 7 && sevens[1].pips.length === 7)
    check('Seven of Wands and Seven of Pentacles: same arrangement', layout(sevens[0]) === layout(sevens[1]), `${layout(sevens[0])} vs ${layout(sevens[1])}`)
    check('Seven of Cups: same arrangement too', layout(sevens[2]) === layout(sevens[0]))

    // --- Court and major drawings ---
    await show(page, 'cups-13.major-16.swords-11')
    const [queen, tower, page11] = await faces(page)
    check('Queen of Cups: name and a drawing', queen.name === 'Queen of Cups' && !!queen.drawing && queen.pips.length === 0)
    check('The Tower: XVI, name and a drawing', tower.numeral === 'XVI' && tower.name === 'The Tower' && !!tower.drawing)
    check('court and major drawings differ', new Set([queen.drawing, tower.drawing, page11.drawing]).size === 3)
    check('drawings hidden from assistive technology', [queen, tower, page11].every((f) => f.artHidden === 'true'))
    check('drawings contain no text', [queen, tower, page11].every((f) => !/<text|<title|<desc/.test(f.drawing!)))

    // --- Suit colours, in both palettes ---
    const cream = { light: 'rgb(255, 250, 240)', dark: 'rgb(246, 236, 220)' }
    for (const scheme of ['light', 'dark'] as const) {
      page = await newPage(scheme)
      await show(page, 'wands-05.cups-12.swords-02')
      const three = await faces(page)
      check(`${scheme}: wands, cups and swords frames in three colours`, new Set(three.map((f) => f.frame)).size === 3, three.map((f) => f.frame).join(' / '))
      check(`${scheme}: every face stays cream`, three.every((f) => f.bg === cream[scheme]), three.map((f) => f.bg).join(' / '))
      check(`${scheme}: outer border the same gold on every card`, new Set(three.map((f) => f.border)).size === 1)
      await show(page, 'major-00.pentacles-14.cups-04')
      const more = await faces(page)
      check(`${scheme}: major and pentacles frames differ from the other suits`, new Set([...three, ...more.slice(0, 2)].map((f) => f.frame)).size === 5)
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
    check('reversed: pips turn with the face', reversed[2].transform.startsWith('matrix(-1') && reversed[2].pips.length === 3)
    check('reversed: name below the face upright with "(reversed)"', await page.evaluate(() => {
      const title = document.querySelector('.spread-slot .card-title')
      return getComputedStyle(title).transform === 'none' && title.textContent.includes('Queen of Cups') && title.textContent.includes('(reversed)')
    }))

    // --- Phone width: pictures inside the frame, pips countable ---
    for (const scheme of ['light', 'dark'] as const) {
      page = await newPage(scheme, 320)
      for (const cards of ['wands-10.cups-10.swords-10', 'pentacles-10.major-21.cups-13r']) {
        await show(page, cards)
        const fit = await page.evaluate(() =>
          [...document.querySelectorAll('.reading .card-face')].map((f) => {
            const face = f.getBoundingClientRect()
            // The inner frame sits 6px inside the face.
            const inside = (el: Element) => {
              const r = el.getBoundingClientRect()
              return r.left >= face.left + 6 && r.right <= face.right - 6 && r.top >= face.top + 6 && r.bottom <= face.bottom - 6
            }
            const pic = f.querySelector('.card-pips, .tarot-art')
            return {
              label: f.getAttribute('aria-label'),
              inside: !!pic && inside(pic) && [...f.querySelectorAll('.card-pip')].every(inside),
              pips: [...f.querySelectorAll('.card-pip')].map((g) => g.getBoundingClientRect().width),
            }
          }),
        )
        for (const f of fit) {
          check(`320 ${scheme}: ${f.label}: picture inside the frame`, f.inside)
          if (f.pips.length) check(`320 ${scheme}: ${f.label}: every pip at least 9px wide`, Math.min(...f.pips) >= 9, Math.min(...f.pips).toFixed(1))
        }
        check(`320 ${scheme}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      }
    }

    // --- Offline after the screen has shown ---
    // Public only: the dev server fetches each module as it is first used.
    if (!publicBuild) return
    page = await newPage()
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    await page.context().setOffline(true)
    let shown = 0
    let missing: string[] = []
    for (let i = 0; i < 6; i++) {
      await page.click('input[name=spread][value=three-card]')
      await page.click('button[type=submit]')
      await page.waitForSelector('.reading .card-face', { state: 'attached' })
      const drawn = await faces(page)
      shown += drawn.length
      missing = missing.concat(drawn.filter((f) => !f.drawing && f.pips.length === 0).map((f) => f.label!))
      await page.getByRole('button', { name: 'New reading' }).first().click()
    }
    check('offline: every drawn card shows its picture', shown === 18 && missing.length === 0, missing.join(', '))
    await page.context().setOffline(false)
  } finally {
    await closeAll()
  }
})
