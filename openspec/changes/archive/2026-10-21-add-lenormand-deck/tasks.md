# Tasks

## 1. Lenormand data and logic

- [x] 1.1 Add the deck data: `data/lenormand/deck.json` (`lenormand-01`…`36` with numbers) and `data/i18n/en/lenormand/cards.json` with the appendix text (name, keywords, meaning). Add `src/lib/lenormand.ts` with the types, `rawLenormand*` exports and `buildLenormandCards`, with no module-level calls, and `src/lib/lenormand-data.test.ts`. Verify that `npm test` passes and the test checks:
  - 36 distinct ids
  - numbers 1–36 with the spec's names in order
  - non-empty keywords
  - meanings at most 400 characters
- [x] 1.2 Add `data/lenormand/spreads.json`, the position labels in `data/i18n/en/lenormand/spreads.json`, and `buildLenormandSpreads`. Verify with tests:
  - the Lenormand spread ids equal the tarot spread ids
  - Yes / No has positions "First card" and "Second card", and Three cards has Past, Present and Future
  - names and `requiresQuestion` come from tarot, and `showsVerdict` is false
- [x] 1.3 Add the `{ reversals }` option to `draw` (default true; when false, no random roll for reversal). Verify:
  - the existing draw, fairness and snapshot tests pass unchanged
  - new tests show Lenormand draws are never reversed and have no repeats
  - a seeded uniformity test over the 36 cards passes within tolerance
- [x] 1.4 Add `prompts/lenormand.md` and `buildLenormandPrompt` as in the design. Verify with tests:
  - the Ship then Sun Yes / No prompt lists "First card: 3 Ship" and "Second card: 31 Sun", asks for Yes, No or Maybe first, and contains no written verdict
  - the three-card prompt lists the positions in order with no "upright" or "reversed"
  - "</question>" can't close the question block
  - a missing placeholder throws
  - identical readings give identical text

## 2. Tarot screen with a deck choice (dev only)

- [x] 2.1 Change `ScreenGuide` to take `guide` text, update its tarot and oracle callers, and add `data/i18n/en/lenormand/guide.json` with the design's draft, exported from `lenormand.ts`, plus a test for the plain text and the spec's key phrases. Verify that `npm test` passes and `guide-check` still passes 54/54 against `npm run dev`.
- [x] 2.2 Add `DeckPicker` ("Choose a deck": Tarot / Lenormand) and the `deck` state in `App.tsx`, wired as in the design: the DEV-only `buildLenormand()`, the per-deck spreads to `SpreadPicker` and `draw`, the per-deck guide text, and the deck kept across Home and New reading. Verify in the dev app:
  - the picker sits above the guides with Tarot selected
  - switching keeps the spread and question
  - Lenormand Yes / No says "2 cards, question required"
  - an open "About this deck" stays open and switches text
- [x] 2.3 Add `LenormandCardFace` and `LenormandReadingView`, and change `CopyForClaude` to take a `prompt` and `AskClaude` to take a request `body`, updating the tarot callers. Style the placeholder face and the Yes / No note in `src/index.css` for both schemes. Verify in the dev app:
  - a Lenormand Yes / No shows "Lenormand · Yes / No", two numbered and named cards, the note and no verdict, with New reading, Copy for Claude and Ask Claude and no Share
  - Copy for Claude copies the Lenormand prompt
  - tarot readings are unchanged
- [x] 2.4 Verify the public build stays clean: `npm run build`, then grep `dist/` for "Lenormand", "Marie Anne", "First card" and the Fox meaning's "check the details". Expect no matches. If any appears, switch to the `lazy()` fallback from the design before continuing.

## 3. Ask Claude and the journal

- [x] 3.1 Accept `{ lenormand: { spreadId, cards, question } }` in `vite/private-readings.ts` with the design's validation, building the prompt with `buildLenormandPrompt`. Add `appendLenormandJournal` in `vite/journal.ts`, with tests in `journal.test.ts`. Verify:
  - `npm test` passes
  - with `curl` against the port-5174 dev server (scratchpad journal), these each get 400 without spawning Claude: an unknown id, a repeated id, the wrong card count, a Yes / No with an empty question, a 301-character question, and both `lenormand` and `oracle` keys
  - a valid request streams text and ends with `done`, and writes a `deck: 'lenormand'` journal line in the scratchpad journal
- [x] 3.2 Update `README.md`'s "Private readings" section with a short "Lenormand (dev only)" part: deck choice, the two-card Yes / No answered by Ask Claude, no share links, where the data and prompt live, and the journal entry. Verify the paths and labels match the code.

## 4. Checks

- [x] 4.1 Add a scratchpad `lenormand-check` browser script covering the `lenormand-readings` and `screen-instructions` scenarios:
  - the picker and default, switching, the counts, the question rule, a Yes / No and a Three cards reading (cards distinct, none reversed, labels, note, actions, no Share)
  - New reading keeping the deck and spread, the deck kept across Home
  - guide text switching while open
  - the card faces' accessible names
  - phone width in light and dark
  - a real Ask Claude Yes / No whose answer starts with Yes, No or Maybe, journalled to the scratchpad journal

  Verify it passes against the port-5174 dev server with no console errors.
- [x] 4.2 Run `npm test && npm run build`, every existing check against `npm run dev` (Ask Claude ones on the scratchpad journal), and the `--public` checks against `npm run preview`. Verify:
  - everything passes
  - the preview's tarot screen has no deck choice
  - `dist/` has no dev-only or Lenormand strings
  - the real `~/.tarot/journal` is untouched
- [x] 4.3 After pushing to `main` (with approval), verify:
  - the deploy succeeds
  - the live bundle contains no Lenormand strings
  - the live site passes the guide, navigation, share-link and oracle checks with `--public`

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
- Then plan `add-lenormand-art` (36 drawings, with a style-sample check-in).
