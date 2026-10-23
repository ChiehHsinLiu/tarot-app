# Proposal

## Why

Every change so far was verified by browser checks: about a dozen Puppeteer scripts that cover the specs screen by screen, plus a before/after screenshot comparison for refactors. They live in a throwaway scratch folder, so they're lost after each session and never run on their own. The deploy workflow runs only the unit tests, so a change that breaks a screen would still be published.

The next two planned changes, loading screens on demand and the tarot card art, both change what every screen loads and shows. They should land with these checks already in place.

## What Changes

- **Browser checks in the repository:** the lasting checks become Playwright tests under `e2e/`. They cover theme, polish, navigation, flip, reading table, guides, share links, screen reset, the Content Security Policy and the oracle, against the public build in both palettes at desktop and phone widths.
- **`npm run e2e`** builds the site and runs the checks against `npm run preview`.
- **`npm run e2e:dev`** runs the dev-only checks (Lenormand, the deck picker, and dev behaviour of the CSP) against `npm run dev`. The Ask Claude checks run only when asked to, because they use the owner's Claude plan.
- **`npm run e2e:same -- <git-ref>`** compares screenshots of the current build with a build of `<git-ref>`, for refactors that must not change how anything looks. It's a local tool, not a CI step, because intended visual changes would fail it.
- **The deploy workflow runs `npm run e2e`** after the build and before publishing. A failing check stops the deploy, and the test report is uploaded so the failure can be read.
- **Not in scope:**
  - WebKit or Firefox runs. Chromium only for now. Safari stays a manual check.
  - Saved screenshot baselines. They wouldn't match between a Mac and the Linux CI machine.
  - Checks that were one-off probes (animation frame timelines, contact sheets, layout measurements).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-deployment`: adds a requirement that the deploy workflow runs the browser checks against the built site and doesn't publish if any fails.

## Impact

- New dev dependency `@playwright/test` (pinned). CI also downloads Playwright's Chromium.
- New `e2e/` folder and `playwright.config.ts`. `vite.config.ts` keeps Vitest away from `e2e/`.
- `package.json`: the `e2e`, `e2e:dev` and `e2e:same` scripts.
- `.github/workflows/deploy.yml`: a browser install step, an `npm run e2e` step, and a pinned `actions/upload-artifact` for the report on failure. The deploy takes about a minute longer.
- README: a short section on running the checks.
- No change to the app itself.
