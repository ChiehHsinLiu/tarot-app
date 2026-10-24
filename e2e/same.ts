// npm run e2e:same -- <git-ref>
// For refactors that must not change how anything looks: builds <git-ref> in a
// temporary git worktree and the working tree, previews both, and screenshots
// the same screens on each with randomness fixed and animations finished. It
// lists every screen that differs, keeps the pairs in test-results/same/, and
// exits 1 if any differ. Not run in CI, since intended visual changes fail it.
import { execFileSync, spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { chromium } from '@playwright/test'
import type { Page } from '@playwright/test'
import { fixRandomness, repo } from './helpers.ts'

const ref = process.argv[2]
if (!ref) {
  console.error('Usage: npm run e2e:same -- <git-ref>')
  process.exit(2)
}
const out = path.join(repo, 'test-results', 'same')
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(out, { recursive: true })

const screens: [string, string, ((p: Page) => Promise<void>) | null][] = [
  ['home', '', null],
  ['tarot', '#/tarot', (p) => p.click('input[name=spread][value=three-card]')],
  ['reading', '#/tarot', async (p) => {
    await p.click('input[name=spread][value=three-card]')
    await p.click('button[type=submit]')
    await p.waitForSelector('.reading .spread-slot', { state: 'attached' })
  }],
  ['shared', '#/r/v1/yes-no/major-07r?q=Will%20it%20rain%3F', null],
  ['oracle', '#/oracle', async (p) => {
    await p.getByRole('button', { name: 'Draw', exact: true }).click()
    await p.waitForSelector('.oracle-reading', { state: 'attached' })
  }],
]

const run = (cmd: string, args: string[], cwd: string) => execFileSync(cmd, args, { cwd, stdio: 'inherit' })

// Starts `vite preview` for a built folder and waits until it answers.
async function preview(cwd: string, port: number): Promise<[ChildProcess, string]> {
  const url = `http://localhost:${port}/tarot-app/`
  const server = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { cwd, stdio: 'ignore' })
  for (let i = 0; i < 100; i++) {
    if (await fetch(url).then((r) => r.ok, () => false)) return [server, url]
    await new Promise((r) => setTimeout(r, 100))
  }
  server.kill()
  throw new Error(`preview on port ${port} did not start`)
}

const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'tarot-same-'))
const servers: ChildProcess[] = []
let diffs = 0
try {
  run('git', ['worktree', 'add', '--detach', tree, ref], repo)
  fs.symlinkSync(path.join(repo, 'node_modules'), path.join(tree, 'node_modules'))
  run('npm', ['run', 'build'], tree)
  run('npm', ['run', 'build'], repo)
  const [oldServer, oldUrl] = await preview(tree, 4174)
  const [newServer, newUrl] = await preview(repo, 4175)
  servers.push(oldServer, newServer)

  const browser = await chromium.launch()
  const shoot = async (url: string, file: string, hash: string, act: ((p: Page) => Promise<void>) | null, colorScheme: 'light' | 'dark', width: number) => {
    const page = await browser.newPage({ colorScheme, viewport: { width, height: 900 } })
    await fixRandomness(page)
    await page.goto(url + hash, { waitUntil: 'networkidle' })
    if (act) await act(page)
    // No hover left over from a click, every animation finished, fonts loaded,
    // and two frames for the page to paint before the screenshot.
    await page.mouse.move(0, 0)
    await page.evaluate(async () => {
      document.getAnimations().forEach((a) => a.finish())
      await document.fonts.ready
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    })
    const shot = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', path: path.join(out, file) })
    await page.context().close()
    return shot
  }
  // How many pixels differ, and by how much at most (0-255), decoded in the browser.
  const scratch = await browser.newPage()
  const compare = (a: Buffer, b: Buffer) =>
    scratch.evaluate(async ([a, b]) => {
      const load = async (base64: string) => {
        const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${base64}`)).blob())
        const canvas = new OffscreenCanvas(img.width, img.height)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        return ctx.getImageData(0, 0, img.width, img.height)
      }
      const [x, y] = [await load(a), await load(b)]
      if (x.width !== y.width || x.height !== y.height) return `size ${x.width}x${x.height} vs ${y.width}x${y.height}`
      let pixels = 0
      let most = 0
      for (let i = 0; i < x.data.length; i += 4) {
        const d = Math.max(...[0, 1, 2, 3].map((k) => Math.abs(x.data[i + k] - y.data[i + k])))
        if (d) pixels++
        most = Math.max(most, d)
      }
      return `${pixels} pixels, up to ${most}/255`
    }, [a.toString('base64'), b.toString('base64')])
  let total = 0
  for (const scheme of ['light', 'dark'] as const) {
    for (const width of [1280, 320]) {
      for (const [name, hash, act] of screens) {
        const tag = `${name}-${scheme}-${width}`
        // Chromium now and then rasterises an edge a little differently from one
        // paint to the next. A real difference shows every time, so a pair that
        // differs is shot again, up to twice, before it counts.
        let detail = ''
        for (let attempt = 0; attempt < 3; attempt++) {
          const a = await shoot(oldUrl, `${tag}-old.png`, hash, act, scheme, width)
          const b = await shoot(newUrl, `${tag}-new.png`, hash, act, scheme, width)
          detail = a.equals(b) ? '' : await compare(a, b)
          if (!detail) break
        }
        total++
        if (detail) diffs++
        console.log(detail ? `DIFF  ${tag}  (${detail})` : `SAME  ${tag}`)
      }
    }
  }
  await browser.close()
  console.log(`\n${total - diffs}/${total} identical to ${ref}. Screenshots in ${path.relative(repo, out)}/`)
} finally {
  for (const s of servers) s.kill()
  // Unlink the shared node_modules first, so removing the worktree can't touch it.
  fs.rmSync(path.join(tree, 'node_modules'), { force: true })
  execFileSync('git', ['worktree', 'remove', '--force', tree], { cwd: repo })
}
process.exit(diffs ? 1 : 0)
