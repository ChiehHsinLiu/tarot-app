import { defineConfig, devices } from '@playwright/test'

// The browser checks (see README "Browser checks").
// - public: the built site on `npm run preview`, every check except e2e/dev/.
//   `npm run e2e`, and CI before every deploy.
// - dev: the dev server, every check in its dev mode (Lenormand, the deck picker,
//   no Content Security Policy), except Ask Claude. `npm run e2e:dev`.
// - ask: real Ask Claude answers, which use the owner's Claude plan. Only with
//   ASK_CLAUDE=1 npm run e2e:dev.
const ask = !!process.env.ASK_CLAUDE
const preview = 'http://localhost:4173/tarot-app/'
const dev = 'http://localhost:5173/tarot-app/'
const project = process.env.E2E_PROJECT ?? 'public'

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The Ask Claude checks count running Claude processes and new journal
  // entries, so with them, run one test at a time.
  workers: ask ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { ...devices['Desktop Chrome'], actionTimeout: 10_000, navigationTimeout: 20_000 },
  projects: [
    { name: 'public', use: { baseURL: preview }, testIgnore: 'dev/**' },
    { name: 'dev', use: { baseURL: dev }, testIgnore: ['dev/ask.spec.ts', 'dev/oracle-ask.spec.ts'] },
    ...(ask ? [{ name: 'ask', use: { baseURL: dev }, testMatch: ['dev/ask.spec.ts', 'dev/oracle-ask.spec.ts'] }] : []),
  ],
  // Only the server the chosen project needs. `npm run e2e` builds first. A
  // running preview is never reused, since it may be serving an older build; a
  // running dev server is, since it always serves the current code.
  webServer:
    project === 'public'
      ? { command: 'npm run preview -- --strictPort', url: preview, reuseExistingServer: false }
      : { command: 'npm run dev -- --strictPort', url: dev, reuseExistingServer: true },
})
