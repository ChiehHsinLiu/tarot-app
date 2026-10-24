// Covers site-deployment: Each screen loads its own content. On the public
// build: the entry script holds no tarot meanings, oracle messages or oracle
// drawings and each screen's file holds its own; home shows before any screen
// file is fetched (Home loads alone); both screen files start loading once home
// has shown (Screens are ready by the time they're chosen); #/tarot, #/oracle
// and a share link open straight from an empty cache (Opening a screen
// directly); and drawing works offline once a screen shows (Drawing needs no
// network). The dev server serves modules unbundled, so this is public only.
import fs from 'node:fs'
import path from 'node:path'
import { test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { repo, setup } from './helpers.ts'

const read = (file: string) => fs.readFileSync(path.join(repo, file), 'utf8')
// A plain stretch of text, so JSON or JS escaping can't hide it in the bundle.
const marker = (text: string) => text.split(' ').slice(0, 6).join(' ')

test('each screen loads its own content', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'public', 'checks the built bundle')
  test.setTimeout(180_000)
  const { appUrl, check, open, closeAll } = setup(browser, testInfo)
  try {
    // --- What each file holds ---
    const tarotText = marker(Object.values<any>(JSON.parse(read('data/i18n/en/cards.json')))[0].upright)
    const oracleText = marker(Object.values<any>(JSON.parse(read('data/i18n/en/oracle/animal.json')))[0].message)
    const homeArt = fs.readdirSync(path.join(repo, 'src/assets/home')).map((f) => read(`src/assets/home/${f}`)).join('')
    const oracleArt = [...read('src/assets/oracle/animal/animal-01.svg').matchAll(/ d="([^"]{12,})"/g)]
      .map((m) => m[1])
      .find((d) => !homeArt.includes(d))
    check('oracle drawing marker found', !!oracleArt)

    const html = read('dist/index.html')
    const entryName = html.match(/<script[^>]+src="[^"]*\/assets\/([^"]+\.js)"/)?.[1]
    const assets = fs.readdirSync(path.join(repo, 'dist/assets'))
    const tarotName = assets.find((f) => /^TarotScreens-.*\.js$/.test(f))
    const oracleName = assets.find((f) => /^OracleScreen-.*\.js$/.test(f))
    check('index.html names one entry script', !!entryName && (html.match(/<script/g) ?? []).length === 1, entryName)
    check('index.html preloads no screen file', !/TarotScreens|OracleScreen/.test(html))
    check('the build has a tarot and an oracle file', !!tarotName && !!oracleName, assets.join(','))
    const asset = (name: string) => read(`dist/assets/${name}`)
    const entry = asset(entryName!)
    const tarot = asset(tarotName!)
    const oracle = asset(oracleName!)
    check('entry has no tarot meaning', !entry.includes(tarotText), tarotText)
    check('entry has no oracle message', !entry.includes(oracleText), oracleText)
    check('entry has no oracle drawing', !entry.includes(oracleArt!), oracleArt)
    check('tarot file has the tarot meanings', tarot.includes(tarotText))
    check('tarot file has no oracle message', !tarot.includes(oracleText))
    check('oracle file has the oracle messages', oracle.includes(oracleText))
    check('oracle file has the oracle drawings', oracle.includes(oracleArt!))
    check('oracle file has no tarot meaning', !oracle.includes(tarotText))

    // Notes, in the page's own clock, when main first has content and every
    // script request, so "before it showed" doesn't depend on Playwright's timing.
    async function freshPage() {
      const page = await open()
      await page.addInitScript(() => {
        new MutationObserver((_, o) => {
          if (document.querySelector('main')?.firstElementChild) {
            ;(window as any).__shownAt = performance.now()
            o.disconnect()
          }
        }).observe(document, { childList: true, subtree: true })
      })
      return page
    }
    const timings = (page: Page) =>
      page.evaluate(() => ({
        shownAt: (window as any).__shownAt as number | undefined,
        scripts: performance
          .getEntriesByType('resource')
          .filter((e) => e.name.endsWith('.js'))
          .map((e) => ({ name: e.name.slice(e.name.lastIndexOf('/') + 1), start: e.startTime })),
      }))
    const isScreenFile = (name: string) => name === tarotName || name === oracleName

    // --- Home loads alone, then the screens load in the background ---
    let page = await freshPage()
    await page.goto(appUrl, { waitUntil: 'networkidle' })
    let t = await timings(page)
    const before = t.scripts.filter((s) => s.start < t.shownAt!).map((s) => s.name)
    check('home shows with its two windows', (await page.locator('main a').count()) === 2)
    check('before home shows, only the entry script is fetched', before.length === 1 && before[0] === entryName, before.join(','))
    const after = t.scripts.filter((s) => s.start >= t.shownAt!).map((s) => s.name)
    check('after home shows, both screen files are fetched', after.includes(tarotName!) && after.includes(oracleName!), after.join(','))

    for (const [link, ready] of [
      ['Tarot reading', 'form.composer'],
      ['Animal oracle', '.oracle-intro-screen'],
    ]) {
      await page.goto(appUrl, { waitUntil: 'networkidle' })
      await page.getByRole('link', { name: link }).click()
      // Already loaded, so the screen is there as soon as the hashchange has
      // rendered, well inside the 300 ms React holds back a suspended screen.
      const shown = await page.locator(ready).waitFor({ state: 'attached', timeout: 150 }).then(() => true, () => false)
      check(`${link}: shows straight after the click`, shown)
      check(`${link}: focus on the screen heading`, await page.evaluate(() => document.activeElement?.tagName === 'H2'))
    }

    // --- Opening a screen directly ---
    for (const [hash, ready, file] of [
      ['#/tarot', 'form.composer', tarotName],
      ['#/oracle', '.oracle-intro-screen', oracleName],
      ['#/r/v1/three-card/major-00.major-01r.major-02', '.reading', tarotName],
    ]) {
      page = await freshPage()
      await page.goto(appUrl + hash)
      await page.getByRole('heading', { name: 'Little Oracle' }).waitFor()
      await page.locator(ready).waitFor({ state: 'attached' })
      t = await timings(page)
      const first = t.scripts.filter((s) => s.start <= t.shownAt!).map((s) => s.name)
      check(`${hash}: shows its screen`, (await page.locator(ready).count()) === 1)
      check(`${hash}: fetches its own file to show`, first.includes(file!), first.join(','))
      check(`${hash}: needs no other screen's file to show`, first.filter(isScreenFile).length === 1, first.join(','))
    }

    // --- Drawing needs no network ---
    page = await freshPage()
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    await page.context().setOffline(true)
    const tarotCards = async () =>
      page.evaluate(() => [...document.querySelectorAll('.reading .card-meaning')].filter((m) => m.textContent.trim()).length)
    await page.click('input[name=spread][value=three-card]')
    await page.click('button[type=submit]')
    await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
    check('offline: Draw shows three cards with their meanings', (await tarotCards()) === 3)
    await page.getByRole('button', { name: 'New reading' }).first().click()
    await page.click('button[type=submit]')
    await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
    check('offline: New reading then Draw shows cards again', (await tarotCards()) === 3)
    await page.context().setOffline(false)

    page = await freshPage()
    await page.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
    await page.context().setOffline(true)
    const oracleCard = () =>
      page.evaluate(() => ({
        label: document.querySelector('.oracle-face')?.getAttribute('aria-label') ?? null,
        drawing: !!document.querySelector('.oracle-face .oracle-art svg'),
        message: document.querySelector('.oracle-message')?.textContent.trim() ?? '',
      }))
    await page.getByRole('button', { name: 'Draw', exact: true }).click()
    await page.waitForSelector('.oracle-face', { state: 'attached' })
    const firstCard = await oracleCard()
    check('offline: oracle Draw shows a card, drawing and message', !!firstCard.label && firstCard.drawing && firstCard.message !== '', JSON.stringify(firstCard))
    await page.getByRole('button', { name: 'Draw again' }).click()
    const second = await oracleCard()
    check('offline: Draw again shows another card with its drawing', second.label !== firstCard.label && second.drawing && second.message !== '', JSON.stringify(second))
    await page.context().setOffline(false)
  } finally {
    await closeAll()
  }
})
