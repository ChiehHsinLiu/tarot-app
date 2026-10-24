import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { contentSecurityPolicy } from './vite/csp.ts'
import { privateReadings } from './vite/private-readings.ts'

// https://vite.dev/config/
export default defineConfig({
  // Served from the GitHub Pages project path; update if the repo is renamed.
  base: '/tarot-app/',
  // privateReadings only runs under `npm run dev` (apply: 'serve');
  // contentSecurityPolicy only under `npm run build` (apply: 'build').
  plugins: [react(), privateReadings(), contentSecurityPolicy()],
  // Unit tests only; the browser checks in e2e/ run under Playwright.
  test: { include: ['src/**/*.test.{ts,tsx}', 'vite/**/*.test.ts'] },
})
