# Tasks

## 1. Spread data, picker and question hint

- [x] 1.1 Add `situation-action-outcome` and `choice` to `data/spreads.json` after `three-card` (ids, question rule and positions as in design.md, `showsVerdict: false`), and add their names and position labels to `data/i18n/en/spreads.json`. Verify:
  - `npm test` passes after `deck.test.ts` is updated to expect four spreads in order with these labels
  - the share tests add a round trip for each new spread, and a Three cards link from before the change still decodes to the same reading
- [x] 1.2 Add an optional `questionHint` to `SpreadText`/`Spread` (copied in `buildSpreads`), set it for Choice to "Name your two options, e.g. Stay or move?", and give `QuestionBox` a `placeholder` prop. `Composer` passes the hint and falls back to today's two hints. Verify with a unit or component test that Choice shows its hint, and that Yes / No and Three cards show "Ask a yes or no question" and "What would you like to know?" as before.
- [x] 1.3 Make Lenormand tarot-only-safe:
  - `buildLenormandSpreads` keeps only spreads that have Lenormand positions
  - `Composer` clears `spreadId` when the chosen deck doesn't offer it

  Verify:
  - a `lenormand-data` or `lenormand-draw` unit test shows the Lenormand spreads are exactly Yes / No and Three cards
  - `npm run dev` starts, and the tarot screen with Lenormand selected lists two spreads

## 2. Prompt guide

- [x] 2.1 Add a `{{guidance}}` line after `Spread: {{spread}}` in `prompts/reading.md`, make it a required placeholder in `src/lib/prompt.ts`, and fill it from an optional `guide` on the spread text. Add the two guides from design.md to `data/i18n/en/spreads.json`. Verify:
  - the existing Yes / No and Three cards prompt snapshots in `src/lib/__snapshots__/prompt.test.ts.snap` are unchanged, with no `-u` used
  - new tests show each new spread's prompt lists its positions in order and contains its guide and no verdict
  - removing `{{guidance}}` from the template makes the builder throw

## 3. Guide and docs

- [x] 3.1 Update the tarot "How it works" in `data/i18n/en/guides.json` to describe Situation, Action, Outcome (where you stand, what to do, where it leads; question optional) and Choice (one card per option plus advice; question naming both options required). Extend `guides.test.ts` to check for both spread names. Verify `npm test` passes, and that the guide text has no markup and doesn't mention Claude.
- [x] 3.2 Update `README.md`:
  - the Tarot reading line (line 22) names all four spreads
  - the Lenormand section says the two new spreads are tarot only

  Verify by reading the rendered paragraphs.

## 4. Browser checks

- [x] 4.1 Add e2e coverage, either in a new `e2e/spreads.spec.ts` or extending the existing specs:
  - the picker lists four spreads in order with "3 cards" and "3 cards, question required"
  - Situation, Action, Outcome draws three cards labeled Situation, Action, Outcome, with no verdict
  - Choice keeps Draw disabled until a question is typed and shows its hint, then draws Option A, Option B, Advice
  - a Choice reading's share link starts with `#/r/v1/choice/` and reopens the same cards

  In `e2e/dev/lenormand.spec.ts`, add: selecting Choice and then Lenormand leaves no spread selected and keeps the question. Verify:
  - `npm run e2e` and `npm run e2e:dev` pass
  - changing a Choice position label in the data makes the new spec fail
- [x] 4.2 Look at the composer and a reading of each new spread at 1280 px and 320 px, in light and dark, including the face-down preview mat. If "Situation, Action, Outcome" wraps badly, apply the fallback in design.md. Also run `npm run e2e:same -- main`. Verify:
  - only the expected composer differences (four options) appear
  - the entry chunk size is unchanged in `npm run build`
- [x] 4.3 Show the owner the two new spreads on the dev server, including a Choice prompt from Copy for Claude. Verify the owner approves, or the requested wording changes are made and approved.

## 5. Ship

- [x] 5.1 After the owner approves the push to `main`, verify:
  - the deploy run succeeds, with unit tests and e2e passing
  - on the live site, both new spreads draw, show and share correctly in light and dark, at 1280 px and 320 px, with no console errors

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified, which syncs the tarot-spreads, reading-prompt, screen-instructions and lenormand-readings deltas.
