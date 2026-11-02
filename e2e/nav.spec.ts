// Covers app-navigation: Home page offers two equal choices, Each screen has
// its own address, Home link on every screen, Screens start fresh when opened,
// Focus moves to the new screen. Also reading-share-links: Opening a share link,
// Invalid links are handled gracefully, Drawing does not change the address;
// animal-oracle: Oracle entry point, Draw again and going home; title-page.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup } from './helpers.ts'

test('navigation', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const page = await open()
    const consoleErrors = []
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(e.message))
    await page.setViewportSize({ width: 1280, height: 900 })

    const go = async (hash = '') => {
      await page.goto(appUrl + hash, { waitUntil: 'networkidle' })
    }
    const settle = () => new Promise((r) => setTimeout(r, 150))
    const hashNow = () => page.evaluate(() => location.hash)
    const h1s = () => page.evaluate(() => [...document.querySelectorAll('h1')].map((h) => h.textContent))
    const active = () => page.evaluate(() => {
      const a = document.activeElement
      return a ? `${a.tagName}:${a.textContent.trim()}` : null
    })
    const clickLink = async (text) => {
      await page.evaluate((t) => [...document.querySelectorAll('a')].find((a) => a.textContent.includes(t)).click(), text)
      await settle()
    }
    const clickButton = async (t) => {
      await page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
      await settle()
    }
    const screen = () => page.evaluate(() => ({
      choices: [...document.querySelectorAll('.home-choice-title')].map((e) => e.textContent),
      composer: !!document.querySelector('.composer'),
      question: !!document.querySelector<HTMLTextAreaElement>('#question'),
      draw: [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent.trim() === 'Draw'),
      card: !!document.querySelector('.card-face'),
      oracleIntro: !!document.querySelector('.oracle-intro-screen'),
      oracleCard: document.querySelector('.oracle-face')?.getAttribute('aria-label') ?? null,
      reading: !!document.querySelector('.reading'),
      shared: document.querySelector('#reading-title')?.textContent.startsWith('Shared reading') ?? false,
      notice: document.querySelector('.notice')?.textContent ?? null,
      checked: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value ?? null,
      questionValue: document.querySelector<HTMLTextAreaElement>('#question')?.value ?? null,
      homeLink: [...document.querySelectorAll('a')].some((a) => a.textContent.trim().endsWith('Home')),
    }))

    // --- Home ---
    await go()
    let s = await screen()
    check('home: two choices', s.choices.join('|') === 'Tarot reading|Animal oracle', s.choices.join('|'))
    check('home: no spread choice, question, draw or card', !s.composer && !s.question && !s.draw && !s.card)
    check('home: single h1 Little Oracle', (await h1s()).join('|') === 'Little Oracle')
    check('home: document title Little Oracle', (await page.title()) === 'Little Oracle')
    check('home: first load does not focus a heading', !(await active()).startsWith('H'), await active())
    await page.screenshot({ path: path.join(shotDir, 'home-1280.png'), fullPage: true })
    for (const h of ['#', '#/', '#/nowhere', '#/tarotx']) {
      await go(h)
      check(`"${h}" shows home`, (await screen()).choices.length === 2)
    }

    // --- Choosing and Back ---
    await go()
    await clickLink('Tarot reading')
    s = await screen()
    check('choose tarot: address #/tarot', (await hashNow()) === '#/tarot')
    check('tarot screen: composer, nothing selected, empty question', s.composer && s.checked === null && s.questionValue === '')
    check('tarot screen: Home link and one h1', s.homeLink && (await h1s()).join('|') === 'Little Oracle')
    check('tarot screen: focus on its heading', (await active()) === 'H2:Tarot reading', await active())
    await page.goBack(); await settle()
    check('browser Back returns home', (await screen()).choices.length === 2 && ['', '#/'].includes(await hashNow()))
    check('home: focus on h1 after navigating back', (await active()) === 'H1:Little Oracle', await active())

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter'); await settle()
    check('keyboard: choose oracle opens #/oracle', (await hashNow()) === '#/oracle')
    s = await screen()
    check('oracle screen: intro with Draw and no card', s.oracleIntro && s.draw && !s.oracleCard)
    check('oracle screen: focus on heading', (await active()) === "H2:Today's animal oracle", await active())

    // --- Direct addresses ---
    await go('#/tarot')
    s = await screen()
    check('direct #/tarot: composer, nothing selected', s.composer && s.checked === null && s.questionValue === '')
    await go('#/oracle')
    check('direct #/oracle: intro', (await screen()).oracleIntro)

    // --- Oracle: draw, fresh after Home, reset on reload, no Back ---
    await clickButton('Draw')
    const card1 = (await screen()).oracleCard
    check('oracle Draw shows a card', !!card1)
    check('oracle card view has no Back button', !(await page.evaluate(() => [...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent.trim() === 'Back'))))
    if (publicBuild) check('public: no Ask Claude box under the card', !(await page.$('#oracle-question')))
    else check('dev: Ask Claude box under the card', !!(await page.waitForSelector('#oracle-question', { state: 'attached', timeout: 5000 }).catch(() => null)))
    let allDiff = true
    let prev = card1
    for (let i = 0; i < 20; i++) {
      await clickButton('Draw again')
      const now = (await screen()).oracleCard
      if (now === prev) allDiff = false
      prev = now
    }
    check('Draw again always different (20 tries)', allDiff)
    await clickLink('Home')
    check('Home from oracle: home shown, address not #/oracle', (await screen()).choices.length === 2 && (await hashNow()) !== '#/oracle')
    await clickLink('Animal oracle')
    s = await screen()
    check('oracle starts fresh after Home', s.oracleIntro && !s.oracleCard, JSON.stringify(s))
    await clickButton('Draw')
    await page.reload({ waitUntil: 'networkidle' })
    s = await screen()
    check('reload #/oracle: intro, no card', s.oracleIntro && !s.oracleCard)

    // --- Tarot screen starts fresh when entered ---
    await go('#/tarot')
    await page.click('input[value="yes-no"]')
    await page.type('#question', 'Will it rain?')
    await clickLink('Home')
    await clickLink('Animal oracle')
    await clickButton('Draw')
    await clickLink('Home')
    await clickLink('Tarot reading')
    s = await screen()
    check('composer fresh after Home -> Oracle -> Home -> Tarot', s.checked === null && s.questionValue === '', JSON.stringify(s))
    await page.click('input[value="three-card"]')
    await page.click('button[type=submit]'); await settle()
    check('drawing keeps address #/tarot', (await hashNow()) === '#/tarot')
    const readingCards = await page.evaluate(() => [...document.querySelectorAll('.spread-slot .card-face')].map((e) => e.getAttribute('aria-label')).join('|'))
    check('focus on reading heading after draw', (await active()) === 'H2:Three cards', await active())
    await clickLink('Home')
    await clickLink('Tarot reading')
    s = await screen()
    check('drawn reading gone after Home', s.composer && !s.reading && s.checked === null && readingCards.length > 0, JSON.stringify(s))
    await page.click('input[value="three-card"]')
    await page.click('button[type=submit]'); await settle()
    await clickButton('New reading')
    s = await screen()
    check('New reading keeps spread, empties question', s.checked === 'three-card' && s.questionValue === '')

    // --- Shared reading ---
    const link = '#/r/v1/three-card/swords-03.major-13r.cups-01?q=Will%20it%20work%3F'
    await go('#/tarot')
    await go(link)
    s = await screen()
    check('share link shows shared reading', s.shared)
    check('shared reading has Home link and one h1', s.homeLink && (await h1s()).join('|') === 'Little Oracle')
    await clickLink('Home')
    check('Home from shared reading: home, no share fragment', (await screen()).choices.length === 2 && !(await hashNow()).includes('/r/'))

    await go('#/')
    await go(link)
    await page.click('input[value]').catch(() => {})
    await clickButton('Draw your own')
    s = await screen()
    check('Draw your own: #/tarot, empty composer', (await hashNow()) === '#/tarot' && s.composer && s.checked === null && s.questionValue === '', `${await hashNow()} ${JSON.stringify(s)}`)
    await page.goBack(); await settle()
    s = await screen()
    check('Back after Draw your own does not reopen the shared reading', !s.shared, await hashNow())

    // Pasting a link into an open tab
    await go('#/oracle')
    await page.evaluate((l) => { location.hash = l }, link); await settle()
    check('pasted share link in open tab shows it', (await screen()).shared)

    // --- Invalid link ---
    await go('#/r/v1/yes-no/major-99')
    s = await screen()
    check('invalid link: notice above empty composer', s.notice === "This reading link isn't valid." && s.composer && s.checked === null && !s.reading)
    check('invalid link: Home link shown', s.homeLink)
    await clickLink('Home')
    await clickLink('Tarot reading')
    check('notice gone after moving on', (await screen()).notice === null)

    // --- Phone width ---
    await page.setViewportSize({ width: 375, height: 800 })
    await go()
    check('no horizontal scroll at 375 (home)', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.screenshot({ path: path.join(shotDir, 'home-375.png'), fullPage: true })

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
