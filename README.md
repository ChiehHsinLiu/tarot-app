# Little Oracle

Tarot and animal oracle cards for today, in English or Traditional Chinese. A web app built with React, Vite and TypeScript.

Live site: https://chiehhsinliu.github.io/tarot-app/

## Run it

```sh
npm install
npm run dev       # http://localhost:5173/tarot-app/
npm test          # unit tests
npm run build     # type-check and build into dist/
```

The app lives under `/tarot-app/` because it's a GitHub Pages project site. If the repo is renamed, update `base` in `vite.config.ts`.

## What's in it

- **Tarot reading:** two decks (Classic and Dachshund) with the same 78 cards, two spreads (Yes / No and Three cards), and share links.
- **Animal oracle:** one card from 78 original cards of real and legendary animals, each with a message, a question to reflect on and an affirmation.
- **Languages:** a 中文 / English switch on every screen. Card names, spread names and everything for Claude stay English.

The detailed behaviour of each part is in `openspec/specs/`.

## Where things are

| What | Where |
|---|---|
| Text, in both languages | `data/i18n/en/` and `data/i18n/zh-Hant/` (same files in each) |
| Animal oracle deck | `data/oracle/animal.json`, drawings in `src/assets/oracle/animal/` |
| Classic tarot drawings | `src/assets/tarot/`, made by `npm run draw:tarot` from `scripts/tarot-art/` |
| Dachshund drawings | `src/assets/dachshund/`, made by `npm run draw:dachshund` from `scripts/dachshund-art/` |
| Drawing rules (shapes, colour classes, size) | `src/lib/art-format.ts` |

The draw scripts overwrite their files, so change a generated drawing in the script, not in the SVG. Run `npm test` after any change to text or drawings, because the tests check that both languages match and every card has exactly one valid drawing.

## Dev-only features

These run only with `npm run dev`. The public site doesn't include them.

- **Ask Claude:** sends a reading to your own [Claude Code](https://claude.com/claude-code) and shows its answer. It needs Claude Code installed and logged in, and uses your Claude plan. Answers are saved to a private journal in `~/.tarot/journal/` (or `TAROT_JOURNAL_DIR`).
- **Lenormand:** a third deck, in `data/lenormand/`, answered by Ask Claude.

Don't start the dev server with `--host`.

## Browser checks

The end-to-end checks in `e2e/` drive the real app in a browser with [Playwright](https://playwright.dev). Install the browser once with `npx playwright install chromium`.

```sh
npm run e2e                  # the public site (what the deploy runs)
npm run e2e:dev              # the dev app, including Lenormand
ASK_CLAUDE=1 npm run e2e:dev # also ask Claude for real answers
npm run e2e:same -- main     # compare screenshots with main, for refactors
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`. It builds the app, runs the unit tests and `npm run e2e`, and publishes to GitHub Pages only if everything passes.

The build runs in Playwright's Docker image. Its version must match `@playwright/test` in `package.json`, so update both together.

One-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**.
