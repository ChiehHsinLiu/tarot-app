# Tasks

## 1. Screens start fresh

- [x] 1.1 In `src/App.tsx`, reset on entry: track the last rendered route in a ref. On a `hashchange` to a different route, set the tarot state to `EMPTY_COMPOSER` when entering `tarot`, and clear `oracleCardId` when entering `oracle`, keeping the invalid-link handling as it is. Verify in the dev app:
  - a selected spread and typed question, or a drawn reading, are gone after Home → Tarot reading
  - a drawn oracle card is gone after Home → Animal oracle, and after Back then Forward
  - Lenormand resets to Tarot after Home
  - New reading still keeps the spread and deck
- [x] 1.2 Add the top start-over button: a `secondary` button in `.reading-top-actions` right after the `<h2>` in `ReadingView` ("New reading" / "Draw your own"), `LenormandReadingView` ("New reading") and `OracleCardView` ("Draw again"), with the same handler as the bottom one, plus its CSS. Verify in the dev app that each top button behaves exactly like the bottom one, and that focus still lands on the reading heading.

## 2. Guides behind a "?" button

- [x] 2.1 Replace `ScreenGuide` with `src/components/GuidedHeading.tsx`: the heading row with the "?" disclosure button and the panel, as in the design. It needs `aria-expanded` and `aria-controls`, the accessible name "How it works and about this deck", `h3` sections, the shared note, "Close", and Escape closing it and focusing the button. Use it for the composer heading (tarot or Lenormand guide text) and the `OracleIntro` heading. Remove the old `.screen-guide` styles, and add the button and panel styles for both schemes. Verify:
  - `npm test` passes
  - `npm run build` type-checks
  - in the dev app, both start screens show the "?" with no guide text, the panel opens and closes, and the spread and question are untouched

## 3. Docs and checks

- [x] 3.1 Update `README.md`'s "Using the app" section: screens start fresh when you open them from Home, New reading or Draw again sits at the top and bottom of a reading, and the "?" by each screen's heading opens "How it works" and "About this deck". Verify the labels match the app.
- [x] 3.2 Rewrite the scratchpad `guide-check` for the "?" button and panel, and add a `reset-check` as described in the design. Flip the remembered-state assertions in `nav-check`, `oracle-check` and `lenormand-check`, and move `lenormand-check`'s guide checks to the panel. Verify each passes against `npm run dev`, and `guide-check`, `reset-check` and `nav-check` also with `--public` against `npm run preview`, with no console errors.
- [x] 3.3 Run `npm test && npm run build`, every check against `npm run dev` (Ask Claude ones on the scratchpad journal), and the `--public` checks against `npm run preview`. Verify:
  - everything passes
  - no request goes to another origin
  - `dist/` has no dev-only or Lenormand strings
  - the real `~/.tarot/journal` is untouched
- [ ] 3.4 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `guide-check --public`, `reset-check --public`, the navigation, share-link and oracle checks.

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
