// Covers app-language: Switch language from every screen, The language choice
// is remembered (and follows the browser on a first visit), Everything a
// visitor reads follows the language, Card and animal text follows the
// language, Some things stay the same in both languages, Everything for Claude
// stays English, Share links open in the viewer's language, No new downloads
// for Chinese; and title-page: Subtitle in Chinese.
import fs from 'node:fs'
import path from 'node:path'
import { test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { axSnapshot, fixRandomness, repo, setup } from './helpers.ts'
import type { AxNode } from './helpers.ts'

const read = (file: string) => fs.readFileSync(path.join(repo, file), 'utf8')
// English words the Chinese app may show: the app name, spread names, position
// labels and answer words, Copy for Claude, the switch itself, and "app" in the
// guides. Roman numerals are allowed separately.
// Compared in lower case, since some labels are shown in capitals by CSS.
const KEPT_ENGLISH = new Set(['little', 'oracle', 'yes', 'no', 'maybe', 'three', 'cards', 'answer', 'past', 'present', 'future', 'copy', 'for', 'claude', 'english', 'app'])
const ROMAN = /^[IVXL]+$/

test('language switch', async ({ browser }, testInfo) => {
  test.setTimeout(120_000)
  const { appUrl, publicBuild, check, open, closeAll } = setup(browser, testInfo)
  try {
    // The dev app also shows Lenormand and Ask Claude, which stay English.
    const kept = publicBuild ? KEPT_ENGLISH : new Set([...KEPT_ENGLISH, 'lenormand', 'ask'])
    const state = (page: Page) =>
      page.evaluate(() => ({
        lang: document.documentElement.lang,
        switchText: document.querySelector('.language-switch')?.textContent ?? null,
        switchLang: document.querySelector('.language-switch')?.getAttribute('lang') ?? null,
      }))
    const flip = async (page: Page) => {
      await page.click('.language-switch')
      await page.waitForTimeout(100)
    }

    // --- First visit follows the browser ---
    for (const [locale, expected] of [
      ['zh-TW', 'zh-Hant'],
      ['zh-HK', 'zh-Hant'],
      ['fr-FR', 'en'],
      ['zh-CN', 'en'],
    ] as const) {
      const page = await open({ locale })
      await page.goto(appUrl, { waitUntil: 'networkidle' })
      const s = await state(page)
      check(`first visit with ${locale} starts in ${expected}`, s.lang === expected, s.lang)
    }

    // --- The switch, on home and on a screen ---
    const page = await open({ locale: 'en-US' })
    await fixRandomness(page)
    await page.goto(appUrl, { waitUntil: 'networkidle' })
    let s = await state(page)
    check('English home: switch reads 中文 in Chinese', s.lang === 'en' && s.switchText === '中文' && s.switchLang === 'zh-Hant', JSON.stringify(s))
    await flip(page)
    s = await state(page)
    check('after switching: page is zh-Hant and the switch reads English', s.lang === 'zh-Hant' && s.switchText === 'English' && s.switchLang === 'en', JSON.stringify(s))
    check('switching keeps the screen', new URL(page.url()).hash === '' || new URL(page.url()).hash === '#/', page.url())

    // --- Remembered after reload ---
    await page.reload({ waitUntil: 'networkidle' })
    s = await state(page)
    check('reload keeps Chinese', s.lang === 'zh-Hant', s.lang)
    await flip(page)
    await page.reload({ waitUntil: 'networkidle' })
    check('reload keeps English after switching back', (await state(page)).lang === 'en')

    // --- Composer state and a drawn reading survive a switch ---
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    check('the switch is on the tarot screen too', (await state(page)).switchText === '中文')
    await page.click('input[name=deck][value=dachshund]')
    await page.click('input[name=spread][value=three-card]')
    await page.fill('#question', 'Will it rain?')
    await flip(page)
    const composer = await page.evaluate(() => ({
      deck: document.querySelector<HTMLInputElement>('input[name=deck]:checked')?.value,
      spread: document.querySelector<HTMLInputElement>('input[name=spread]:checked')?.value,
      question: document.querySelector<HTMLTextAreaElement>('#question')?.value,
      hash: location.hash,
    }))
    check('switching keeps deck, spread and question', JSON.stringify(composer) === JSON.stringify({ deck: 'dachshund', spread: 'three-card', question: 'Will it rain?', hash: '#/tarot' }), JSON.stringify(composer))

    await page.click('button[type=submit]')
    await page.waitForSelector('.reading')
    const shareLink = async () => {
      await page.click('.share > button')
      const link = await page.$eval('.share-link', (i) => (i as HTMLInputElement).value)
      await page.click('.share > button')
      return link
    }
    const before = await shareLink()
    await flip(page)
    check('still showing the reading', (await page.$$('.reading .spread-slot')).length === 3)
    const after = await shareLink()
    check('switching keeps the same cards, positions and orientations', before === after, `${before} / ${after}`)

    // --- A share link opens in the viewer's language ---
    const viewer = await open({ locale: 'zh-TW' })
    const link = '#/r/v1/three-card/swords-03.major-13r.cups-01?d=dachshund'
    await viewer.goto(appUrl + link, { waitUntil: 'networkidle' })
    await viewer.waitForSelector('.reading .card-face')
    check('share link in the Chinese app: page is zh-Hant', (await state(viewer)).lang === 'zh-Hant')
    await viewer.click('.share > button')
    const reshared = await viewer.$eval('.share-link', (i) => (i as HTMLInputElement).value)
    check('share link in the Chinese app: same cards, orientations and deck', reshared.endsWith(link), reshared)

    // --- No English left on the public screens, beyond the words kept English ---
    const english = async (p: Page) => {
      const words = (await p.evaluate(() => document.body.innerText)).match(/[A-Za-z]+/g) ?? []
      return [...new Set(words.filter((w) => !kept.has(w.toLowerCase()) && !ROMAN.test(w)))]
    }
    const zhPage = await open({ locale: 'zh-TW' })
    await fixRandomness(zhPage)
    await zhPage.setViewportSize({ width: 1280, height: 900 })
    await zhPage.goto(appUrl, { waitUntil: 'networkidle' })
    check('Chinese home: subtitle in Chinese', /\p{Script=Han}/u.test(await zhPage.$eval('.subtitle', (e) => e.textContent!)))
    check('Chinese home: no other English', (await english(zhPage)).length === 0, (await english(zhPage)).join(' '))
    await zhPage.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    await zhPage.click('.guide-toggle')
    check('Chinese composer with its guide open: no other English', (await english(zhPage)).length === 0, (await english(zhPage)).join(' '))
    for (const spread of ['yes-no', 'three-card']) {
      await zhPage.goto('about:blank')
      await zhPage.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
      await zhPage.click(`input[name=spread][value=${spread}]`)
      await zhPage.fill('#question', '我會順利嗎？')
      await zhPage.click('button[type=submit]')
      await zhPage.waitForSelector('.reading .card-face')
      await zhPage.waitForTimeout(1500)
      check(`Chinese ${spread} reading: no other English`, (await english(zhPage)).length === 0, (await english(zhPage)).join(' '))
    }
    await zhPage.goto(appUrl + '#/r/v1/three-card/swords-03.major-13r.cups-01', { waitUntil: 'networkidle' })
    check('Chinese shared reading: no other English', (await english(zhPage)).length === 0, (await english(zhPage)).join(' '))
    await zhPage.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
    await zhPage.click('.guide-toggle')
    check('Chinese oracle intro with its guide open: no other English', (await english(zhPage)).length === 0, (await english(zhPage)).join(' '))
    await zhPage.click('.oracle-intro-screen button.primary')
    await zhPage.waitForSelector('.oracle-face')
    check('Chinese oracle card: no other English', (await english(zhPage)).length === 0, (await english(zhPage)).join(' '))

    // --- The Star upright, in Chinese ---
    await zhPage.goto(appUrl + '#/r/v1/yes-no/major-17', { waitUntil: 'networkidle' })
    const star = await zhPage.evaluate(() => ({
      name: document.querySelector('.card-title')!.textContent,
      numeral: document.querySelector('.card-numeral')!.textContent,
      verdict: document.querySelector('.verdict-word')!.textContent,
      note: document.querySelector('.verdict-note')!.textContent!,
      meaning: document.querySelector('.card-meaning')!.textContent!,
      keywords: document.querySelector('.card-keywords')!.textContent!,
      label: document.querySelector('.spread-slot .position-label')!.textContent,
    }))
    check('The Star in Chinese: name, numeral XVII', star.name === '星星' && star.numeral === 'XVII', JSON.stringify(star))
    check('The Star in Chinese: meaning, keywords and note in Chinese', [star.meaning, star.keywords, star.note].every((t) => /\p{Script=Han}/u.test(t) && !/[A-Za-z]{3}/.test(t)))
    check('The Star in Chinese: answer word and position label stay English', star.verdict === 'Yes' && star.label === 'Answer', `${star.verdict} / ${star.label}`)

    // --- Screen reader names in Chinese ---
    await zhPage.goto(appUrl + '#/r/v1/three-card/cups-13r.major-16.wands-03', { waitUntil: 'networkidle' })
    const images: string[] = []
    const visit = (n: AxNode) => {
      if (n.role === 'image') images.push(n.name)
      n.children.forEach(visit)
    }
    visit(await axSnapshot(zhPage))
    check('screen reader: reversed Queen of Cups in Chinese', images[0] === '聖杯皇后，逆位', images.join(' | '))
    check('screen reader: page language is zh-Hant', (await state(zhPage)).lang === 'zh-Hant')

    // --- Copy for Claude: English, and the same prompt in both languages ---
    const copied = async (locale: string) => {
      const p = await open({ locale, permissions: ['clipboard-read', 'clipboard-write'] })
      await p.goto(appUrl + '#/r/v1/yes-no/major-07r?q=Should%20I%20go%3F', { waitUntil: 'networkidle' })
      const button = (await p.$$eval('.reading-actions button', (bs) => bs.map((b) => b.textContent!.trim()))).find((t) => t.includes('Claude'))
      await p.getByRole('button', { name: 'Copy for Claude' }).click()
      await p.waitForTimeout(200)
      return { button, status: await p.$eval('.claude-status', (e) => e.textContent), prompt: await p.evaluate(() => navigator.clipboard.readText()) }
    }
    const en = await copied('en-US')
    const zh = await copied('zh-TW')
    check('Chinese app: the button reads Copy for Claude and confirms Prompt copied', zh.button === 'Copy for Claude' && zh.status === 'Prompt copied', JSON.stringify([zh.button, zh.status]))
    check('Chinese app copies the same English prompt', zh.prompt.length > 100 && zh.prompt === en.prompt && !/\p{Script=Han}/u.test(zh.prompt))

    // --- Switching while offline, once the tarot screen has shown ---
    const offline = await open({ locale: 'en-US' })
    await offline.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    const requests: string[] = []
    offline.on('request', (r) => requests.push(r.url()))
    await offline.context().setOffline(true)
    await flip(offline)
    await offline.click('input[name=spread][value=three-card]')
    await offline.click('button[type=submit]')
    await offline.waitForSelector('.reading .card-face', { state: 'attached' })
    const titles = await offline.$$eval('.card-title', (ts) => ts.map((t) => t.textContent!))
    check('offline: switched to Chinese and drew, cards in Chinese', titles.length === 3 && titles.every((t) => /\p{Script=Han}/u.test(t)), titles.join(' | '))
    // The dev server fetches each module on first use (Ask Claude's, here), so only the public build is offline-ready.
    if (publicBuild) check('offline: switching and drawing made no request', requests.length === 0, requests.join(' '))
    await offline.context().setOffline(false)

    // --- Chinese card text stays out of the home page's first load (public build) ---
    if (publicBuild) {
      const marker = (text: string) => [...text].slice(0, 12).join('')
      const zhMeaning = marker(Object.values<any>(JSON.parse(read('data/i18n/zh-Hant/cards.json')))[0].upright)
      const zhMessage = marker(Object.values<any>(JSON.parse(read('data/i18n/zh-Hant/oracle/animal.json')))[0].message)
      const html = read('dist/index.html')
      const entryName = html.match(/<script[^>]+src="[^"]*\/assets\/([^"]+\.js)"/)![1]
      const assets = fs.readdirSync(path.join(repo, 'dist/assets'))
      const asset = (name: string) => read(`dist/assets/${name}`)
      const entry = asset(entryName)
      const tarot = asset(assets.find((f) => /^TarotScreens-.*\.js$/.test(f))!)
      const oracleFile = asset(assets.find((f) => /^OracleScreen-.*\.js$/.test(f))!)
      check('entry has no Chinese tarot meaning or animal message', !entry.includes(zhMeaning) && !entry.includes(zhMessage))
      check('tarot file has the Chinese meanings, oracle file the Chinese messages', tarot.includes(zhMeaning) && oracleFile.includes(zhMessage))
      check('no font file is bundled for Chinese', !assets.some((f) => /\.(woff2?|ttf|otf)$/.test(f) && !/fraunces/i.test(f)), assets.filter((f) => /\.(woff2?|ttf|otf)$/.test(f)).join(','))
    }
  } finally {
    await closeAll()
  }
})
