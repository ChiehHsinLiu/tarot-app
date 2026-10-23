# Tasks

## 0. Baseline

- [x] 0.1 Before any edit, run `npm run build` and save a copy of `dist/assets/index-*.css`, `dist/index.html` and the JS bundle size in the scratchpad (`baseline/`). Verify the files exist.

## 1. Styles split by area

- [x] 1.1 Cut `src/index.css` into the 13 files under `src/styles/` listed in design.md, as contiguous ranges at the existing section comments, in order. Leave `src/index.css` as the matching `@import` lines only. Point `mat-colors.test.ts` at `src/styles/theme.css`, and update the `index.css` mentions in the comments of `CardFlip.tsx`, `home-art.ts` and `oracle-art.ts` to the new file names.

  Verify that:
  - `cat src/styles/*.css`, taken in import order, equals the old `index.css` apart from the cut points
  - `npm test` passes
  - `npm run build` gives a CSS file byte-identical to the baseline

## 2. One place that builds the decks

- [x] 2.1 Add `src/lib/decks.ts`, which exports the built tarot cards and spreads, the oracle cards and their lookups as listed in design.md, with no React imports. Use it in `src/App.tsx` and `vite/private-readings.ts`. Lenormand stays as it is.

  Verify that:
  - `npm test` and `npm run build` pass
  - `dist/` contains no "lenormand", "Ask Claude" or "api/reading"
  - the JS bundle is no larger than the baseline
  - Ask Claude still answers a tarot, an oracle and a Lenormand reading on `npm run dev` (`claude-check` / `oracle-ask-check` / `lenormand-check --ask`, or by hand)

## 3. Shared Ask Claude buttons

- [x] 3.1 Add `src/components/AskButtons.tsx`, which renders Stop while streaming, and otherwise Ask Claude or Ask again. Use it in `AskClaude.tsx` and `AskClaudeOracle.tsx`, keeping each one's `ClaudeAnswer` and the oracle question box. Verify that `npm test` passes and that `ask-check` and `oracle-ask-check` pass on dev, covering Stop, Ask again, and the oracle question being sent.

## 4. Smaller App.tsx

- [x] 4.1 Move `SiteHeader` into `src/components/SiteHeader.tsx` and `Composer` (with the types and `EMPTY_COMPOSER` it needs) into `src/components/Composer.tsx`, unchanged, and import them in `App.tsx`. Verify that `npm test` and `npm run build` pass, the JS bundle is no larger than the baseline, and `nav-check` and `reset-check` pass on dev.

## 5. Whole-app check

- [x] 5.1 Run every browser check against `npm run dev`:
  - theme, polish, nav, flip, table, guide, share, reset, oracle, lenormand

  Then build fresh and run the public ones with `--public` on `npm run preview`:
  - theme, polish, nav, flip, table, share, oracle

  If `harden-public-site` is in by then, also run `csp-check`. Verify that all pass with no console errors. Take screenshots of home, the tarot screen, a reading and the oracle at 1280 and 320 in both palettes, and show the owner that they look unchanged.

## Workflow follow-up

- Commit and push only with the owner's approval. Verify the live deploy with `theme-check --public` and `table-check --public`.
- Archive with `/opsx:archive` (no spec sync; `skip_specs: true`).
