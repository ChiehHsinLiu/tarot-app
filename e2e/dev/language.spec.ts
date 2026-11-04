// Covers app-language: Lenormand stays English (dev server only).
import { test } from '@playwright/test'
import { setup } from '../helpers.ts'

test('Lenormand stays English in the Chinese app (dev only)', async ({ browser }, testInfo) => {
  test.setTimeout(60_000)
  const { appUrl, check, open, closeAll } = setup(browser, testInfo)
  try {
    const page = await open({ locale: 'zh-TW' })
    await page.goto(appUrl + '#/tarot', { waitUntil: 'networkidle' })
    check('the app is in Chinese', (await page.evaluate(() => document.documentElement.lang)) === 'zh-Hant')
    const decks = await page.$$eval('input[name=deck]', (i) => i.map((x) => x.closest('label')!.textContent!.trim()))
    check('deck choice: Chinese tarot decks and Lenormand', decks.join('|') === '經典|臘腸狗|Lenormand', decks.join('|'))
    await page.click('input[name=deck][value=lenormand]')
    await page.click('input[name=spread][value=three-card]')
    await page.click('button[type=submit]')
    await page.waitForSelector('.reading')
    await page.waitForTimeout(1500)
    const text = await page.evaluate(() => ({
      heading: document.querySelector('#reading-title')!.textContent!,
      labels: [...document.querySelectorAll('.spread-slot .position-label')].map((e) => e.textContent!),
      meanings: [...document.querySelectorAll('.spread-slot .card-meaning, .spread-slot p')].map((e) => e.textContent!).join(' '),
    }))
    check('Lenormand reading: heading in English', text.heading.startsWith('Lenormand'), text.heading)
    check('Lenormand reading: card text in English, no Chinese', /[A-Za-z]{4}/.test(text.meanings) && !/\p{Script=Han}/u.test(text.meanings + text.labels.join('')), text.meanings.slice(0, 120))
  } finally {
    await closeAll()
  }
})
