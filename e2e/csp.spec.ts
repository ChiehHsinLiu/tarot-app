// Covers site-deployment: Published page restricts what it may load. On the
// public build the policy is present, every screen in both palettes works with
// no violation, and injected scripts are blocked. On the dev server there is no
// policy and an inline script still runs.
import path from 'node:path'
import { test } from '@playwright/test'
import { setup } from './helpers.ts'

test('Content Security Policy', async ({ browser }, testInfo) => {
  test.setTimeout(240_000)
  const { appUrl, publicBuild, shotDir, check, open, closeAll } = setup(browser, testInfo)
  try {
    const consoleErrors = []
    const violations = []
    async function newPage(scheme, width = 1280) {
      const page = await open()
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
      page.on('pageerror', (e) => consoleErrors.push(e.message))
      await page.exposeFunction('__violation', (v) => violations.push(v))
      await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (e) =>
          window.__violation(`${e.effectiveDirective} ${e.blockedURI || '(inline)'}`))
      })
      await page.emulateMedia({ colorScheme: scheme })
      await page.setViewportSize({ width, height: 900 })
      return page
    }
    const clickButton = (page, t) =>
      page.evaluate((t) => [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent.trim() === t).click(), t)
    const finish = (page) => page.evaluate(() => document.getAnimations().forEach((a) => a.finish()))
    const go = async (page, hash) => {
      await page.goto('about:blank')
      await page.goto(appUrl + hash, { waitUntil: 'networkidle' })
    }
    const fontsReady = (page) => page.evaluate(async () => {
      await document.fonts.ready
      return [...document.fonts].some((f) => f.family.includes('Fraunces') && f.status === 'loaded')
    })

    // The policy itself.
    const probe = await newPage('light')
    await go(probe, '')
    const meta = await probe.evaluate(() => document.querySelector<HTMLMetaElement>('meta[http-equiv=\"Content-Security-Policy\"]')?.content ?? null)
    const ran = await probe.evaluate(() => {
      const s = document.createElement('script')
      s.textContent = 'window.__inlineRan = true'
      document.head.append(s)
      return window.__inlineRan === true
    })
    if (publicBuild) {
      check('the page carries the policy', meta === "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'", meta)
      await new Promise((r) => setTimeout(r, 200))
      check('an injected inline script does not run and is reported', !ran && violations.some((v) => v.startsWith('script-src')), violations.join(' | '))
      const before = violations.length
      await probe.evaluate(() => {
        const s = document.createElement('script')
        s.src = 'https://example.com/evil.js'
        document.head.append(s)
      })
      await new Promise((r) => setTimeout(r, 300))
      check('a script from another origin is blocked and reported', violations.slice(before).some((v) => v.includes('example.com')), violations.slice(before).join(' | '))
      // The probe's own violations are expected; the screens below must add none.
      violations.length = 0
      consoleErrors.length = 0
    } else {
      check('dev: no policy, and inline scripts (hot reload) still run', meta === null && ran, String(meta))
    }
    await probe.close()

    // Every screen, both palettes, at 1280 and 320.
    for (const scheme of ['light', 'dark'] as const) {
      for (const width of [1280, 320]) {
        const tag = `${scheme} ${width}`
        const page = await newPage(scheme, width)
        const start = violations.length
        await go(page, '')
        check(`${tag} home: Fraunces loads and the windows draw`, (await fontsReady(page)) && (await page.$$('.home-choice svg')).length >= 2)
        await go(page, '#/tarot')
        for (const spread of ['yes-no', 'three-card']) await page.click(`input[name=spread][value=${spread}]`)
        await clickButton(page, 'How it works')
        await page.click('button[type=submit]')
        await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
        await finish(page)
        const shareFragment = await page.evaluate(() => location.hash)
        await go(page, '#/tarot')
        await page.click('input[name=spread][value=yes-no]')
        await page.type('#question', 'Will it rain?')
        await page.click('button[type=submit]')
        await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
        await finish(page)
        await page.screenshot({ path: path.join(shotDir, `csp-${scheme}-${width}-yesno.png`), fullPage: true })
        await clickButton(page, 'Share')
        const link = await page.evaluate(() => document.querySelector<HTMLInputElement>('.share-link')?.value ?? null)
        if (link) await go(page, link.slice(link.indexOf('#')))
        else await go(page, '#/r/v1/three-card/major-00.cups-05r.wands-10')
        await page.waitForSelector('.reading .spread-slot', { state: 'attached' })
        await go(page, '#/oracle')
        await clickButton(page, 'How it works')
        await page.click('.oracle-intro button.primary, main button.primary')
        await page.waitForSelector('.oracle-reading', { state: 'attached' })
        await finish(page)
        const art = await page.evaluate(() => !!document.querySelector('.oracle-art svg'))
        await page.screenshot({ path: path.join(shotDir, `csp-${scheme}-${width}-oracle.png`), fullPage: true })
        check(`${tag}: home, tarot, guide, readings, share link and oracle show no policy violation`, art && violations.length === start, `shareFragment=${shareFragment} ${violations.slice(start).join(' | ')}`)
        await page.close()
      }
    }

    check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
  } finally {
    await closeAll()
  }
})
