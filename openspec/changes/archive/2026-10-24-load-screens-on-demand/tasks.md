# Tasks

Requires `add-browser-checks` to be applied first: every task is verified with `npm run e2e` and `npm run e2e:dev`.

## 1. Ids without text

- [x] 1.1 Add `src/lib/deck-ids.ts` exporting the raw cards and spreads from `data/cards.json` and `data/spreads.json` only. Make `deck.ts` re-export them. Record the current entry chunk size from `npm run build`.

  Verify that `npm test` passes and the build is unchanged in behaviour (`npm run e2e`).

## 2. Screen modules

- [x] 2.1 Add `src/screens/OracleScreen.tsx` as in design.md. In `App.tsx`, render it through `React.lazy` inside `<Suspense fallback={null}>` within `<main>`, and drop App's static imports of the oracle components, `oracleById` and `drawOracle`.

  Verify with `npm run e2e` (oracle, nav, reset, table, flip).
- [x] 2.2 Add `src/screens/TarotScreens.tsx` as in design.md, with its own inline dev-only Lenormand deck. In `App.tsx`, render it through `React.lazy`, decode links with `deck-ids.ts`, and drop App's imports of `Composer`, `ReadingView`, `decks.ts`, `buildLenormandDeck` and the lazy Lenormand view.

  Verify with `npm run e2e` and `npm run e2e:dev` (Lenormand), and check that `dist/` contains no "lenormand", "Ask Claude" or "api/reading".
- [x] 2.3 Start both imports in the background after home's first render (`requestIdleCallback`, falling back to `setTimeout`).

  Verify with Playwright's request log that on a fresh home load both screen chunks are requested after the home heading is visible.

## 3. Check the split

- [x] 3.1 Add `e2e/split.spec.ts`: the marker-string check of the entry, tarot and oracle chunks from design.md, plus the four spec scenarios:
  - home's requests before it shows
  - background loading
  - direct links to `#/tarot`, `#/oracle` and a share link
  - Draw, Draw again and New reading with the context set offline after the screen has shown

  Verify that it passes. Also verify that it fails when `App.tsx` temporarily imports `oracleById` statically again.
- [x] 3.2 Run `npm run e2e:same -- main` and verify that every screen is pixel-identical. Record the entry chunk size before and after, raw and gzipped, in the README's Deployment section in one sentence: what loads first and what loads with each screen.

## 4. Live

- [x] 4.1 After pushing to `main` (with approval), verify that the deploy passes its checks and that the live home page requests the entry chunk first and the two screen chunks after it has shown.
