// Shared by the browser checks. Each check file is one test that records many
// named checks as soft assertions, so a run lists every failing check, not just
// the first.
import path from 'node:path'
import { expect } from '@playwright/test'
import type { Browser, Page, TestInfo } from '@playwright/test'
import { journalDir, localDate } from '../vite/journal.ts'

export const repo = path.resolve(import.meta.dirname, '..')

// Today's Ask Claude journal file, where the dev endpoint records each answer.
export const journalFile = () => path.join(journalDir(), `${localDate(new Date())}.jsonl`)

export function setup(browser: Browser, testInfo: TestInfo) {
  const appUrl = testInfo.project.use.baseURL!
  const pages: Page[] = []
  let permissions: string[] = []
  let checks = 0
  return {
    appUrl,
    // The public build, or the dev server with its dev-only features.
    publicBuild: testInfo.project.name === 'public',
    // Screenshots for looking at by hand, kept in the test's output folder.
    shotDir: testInfo.outputDir,
    check(name: string, ok: unknown, detail: unknown = '') {
      checks++
      expect.soft(!!ok, detail === '' ? name : `${name} [${detail}]`).toBe(true)
    },
    // Permissions for every page opened after this, such as the clipboard.
    grant(names: string[]) {
      permissions = names
    },
    // A new page in a fresh context, like a new incognito tab. Closed by closeAll.
    async open() {
      const page = await browser.newPage()
      if (permissions.length) await page.context().grantPermissions(permissions, { origin: new URL(appUrl).origin })
      pages.push(page)
      return page
    },
    // Closes every page and reports how many checks ran, so a run that stops
    // early can't pass unnoticed.
    async closeAll() {
      await Promise.all(pages.map((p) => p.context().close().catch(() => {})))
      console.log(`${testInfo.title}: ${checks} checks`)
    },
  }
}

// The same "random" numbers on every run, so two builds draw the same cards.
export async function fixRandomness(page: Page) {
  await page.addInitScript(() => {
    let n = 7
    crypto.getRandomValues = (<T extends ArrayBufferView | null>(a: T): T => {
      const view = a as unknown as Uint32Array
      for (let i = 0; i < view.length; i++) view[i] = n = (n * 1103515245 + 12345) >>> 0
      return a
    }) as Crypto['getRandomValues']
  })
}

export type AxNode = { role: string; name: string; expanded?: boolean; children: AxNode[] }

// Chrome's accessibility tree, with ignored nodes (such as aria-hidden ones)
// left out and their children lifted up. Roles are Chrome's: an img is "image".
export async function axSnapshot(page: Page): Promise<AxNode> {
  const cdp = await page.context().newCDPSession(page)
  const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as {
    nodes: {
      nodeId: string
      ignored: boolean
      role?: { value: string }
      name?: { value: string }
      properties?: { name: string; value: { value: unknown } }[]
      childIds?: string[]
    }[]
  }
  await cdp.detach()
  const byId = new Map(nodes.map((n) => [n.nodeId, n]))
  const build = (id: string): AxNode[] => {
    const n = byId.get(id)
    if (!n) return []
    const children = (n.childIds ?? []).flatMap(build)
    if (n.ignored) return children
    const expanded = n.properties?.find((p) => p.name === 'expanded')?.value.value
    return [{ role: n.role?.value ?? '', name: n.name?.value ?? '', expanded: expanded as boolean | undefined, children }]
  }
  return build(nodes[0].nodeId)[0]
}
