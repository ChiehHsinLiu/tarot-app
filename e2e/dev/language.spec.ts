// Covers app-language: Lenormand stays English, and the oracle question box
// follows the language while Ask Claude stays English (dev server only).
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

    // The oracle's question box follows the language; the button stays English.
    await page.goto(appUrl + '#/oracle', { waitUntil: 'networkidle' })
    await page.evaluate(() => [...document.querySelectorAll<HTMLButtonElement>('.oracle-intro-screen button')].find((b) => b.textContent!.trim() === '抽牌')!.click())
    await page.waitForSelector('#oracle-question', { state: 'attached' })
    const box = await page.evaluate(() => ({
      label: document.querySelector('label[for=oracle-question]')!.textContent!,
      placeholder: document.querySelector<HTMLTextAreaElement>('#oracle-question')!.placeholder,
      button: [...document.querySelectorAll('.oracle-ask button')].map((b) => b.textContent!.trim()).join('|'),
    }))
    check('oracle question box in Chinese', box.label === '問問這張牌 （選填）' && box.placeholder === '今天我該專注在什麼？', JSON.stringify(box))
    check('Ask Claude button stays English', box.button.includes('Ask Claude'), box.button)
  } finally {
    await closeAll()
  }
})
