# Tasks

## 1. Guide text and data

- [x] 1.1 Add `data/i18n/en/guides.json`, with the shared note and `tarot` and `oracle` entries using the draft text from the design, and `src/lib/guides.ts`, which exports the typed data and `GuideScreen`. Add `src/lib/guides.test.ts` with the completeness, plain-text, no-"Claude" and key-phrase checks from the design. Verify that `npm test` passes, and that the test fails when a tarot step's "reversed" is removed or a `*` is added (try both locally, then revert).

## 2. The guide on each screen

- [x] 2.1 Add `src/components/ScreenGuide.tsx`: two `<details>` sections, "How it works" (an `<ol>` of steps) and "About this deck" (paragraphs, then the note). Style them in `src/index.css` with theme tokens: a light card, a custom chevron that rotates (no rotation under reduced motion), and the default marker hidden, including `::-webkit-details-marker`. Verify with `npm run build` that it type-checks.
- [x] 2.2 Show `<ScreenGuide screen="tarot" />` in the tarot composer after the invalid-link notice and before the spread picker, and `<ScreenGuide screen="oracle" />` in `OracleIntro` after the intro sentence and before Draw. Verify in the browser:
  - both screens show the two sections closed, in that place
  - opening one on the tarot screen keeps the selected spread and question, and does not submit the form
  - focus still lands on each screen's heading when it opens
- [x] 2.3 Update the "Using the app" section of `README.md` to mention the "How it works" and "About this deck" sections and name `data/i18n/en/guides.json` as where their text lives (it covers both screens, so it belongs there rather than in the "Animal oracle" section). Verify the paths and labels match the code.

## 3. Checks

- [x] 3.1 Add a scratchpad `guide-check` browser script covering the spec scenarios:
  - sections closed on open, on both screens, and closed again after Home and back
  - Enter and Space toggle a section, and the expanded state is reported to assistive technology
  - the key phrases are visible once a section is open
  - no section on a drawn reading, a drawn oracle card, a share link or home
  - no horizontal scroll at 320px with both sections open, in light and dark

  Verify it passes against `npm run dev` and against `npm run preview` with `--public`, with no console errors.
- [x] 3.2 Run `npm test && npm run build`, then the existing checks (card draw, share links, navigation, polish, theme, oracle, Copy for Claude, Ask Claude on the scratchpad journal) against `npm run dev`, and the `--public` checks against `npm run preview`. Verify:
  - everything passes, adjusting any check that counted the screens' elements
  - no request goes to another origin
  - `dist/` still has no dev-only strings
- [ ] 3.3 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `guide-check --public`, the navigation check and the oracle check.

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
