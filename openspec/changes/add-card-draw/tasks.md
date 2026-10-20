# Tasks

Prerequisite: `add-project-scaffold` is implemented (app builds, deploy workflow exists).

## 1. Test setup

- [x] 1.1 Add `vitest` as a dev dependency and a `"test": "vitest run"` script; verify `npm test` runs and exits 0 with a placeholder test
- [x] 1.2 Add an `npm test` step before `npm run build` in `.github/workflows/deploy.yml`; verify by reading the workflow that the build job runs tests first

## 2. Deck and spread data model

- [x] 2.1 Create `data/cards.json` with all 78 card entries (ids `major-00`…`major-21`, `<suit>-01`…`<suit>-14`, arcana, suit, rank; `yesNo` left for content tasks) and `data/spreads.json` with `yes-no` (one position `answer`, `requiresQuestion: true`, `showsVerdict: true`) and `three-card` (`past`, `present`, `future`); verify the JSON parses
- [x] 2.2 Create `data/i18n/en/spreads.json` with names "Yes / No" and "Three cards" and position labels "Answer", "Past", "Present", "Future"; verify every spread position has a label
- [x] 2.3 Implement `src/lib/deck.ts` (types `Card`, `Spread`, `Orientation`, `Verdict`; loader joining neutral data with `en` text; Roman numeral helper with 0 for The Fool) with no React imports; verify with unit tests for the join and numerals (XVI for The Tower, VIII for Strength, XI for Justice)
- [x] 2.4 Add `src/lib/deck.test.ts` data-integrity tests covering every `tarot-deck` requirement (78 unique ids, 22 majors, 14 per suit, Strength = 8 / Justice = 11, all text fields present, meanings ≤ 400 chars, notes ≤ 140 chars, verdicts in {yes, no, maybe}); verify it fails now (text missing) and lists which cards are incomplete

## 3. Card content (English)

Style: second person, present tense, non-fatalistic, no medical/legal/financial advice; reference Waite's *Pictorial Key to the Tarot* (1910) and conventional yes/no tables, written fresh rather than copied.

- [x] 3.1 Write names, keywords, upright/reversed meanings, yes/no verdicts, and yes/no notes for the 22 major arcana; verify the integrity test reports no incomplete major arcana
- [x] 3.2 Write the same for Wands (14 cards); verify the integrity test reports no incomplete Wands cards
- [x] 3.3 Write the same for Cups (14 cards); verify the integrity test reports no incomplete Cups cards
- [x] 3.4 Write the same for Swords (14 cards); verify the integrity test reports no incomplete Swords cards
- [x] 3.5 Write the same for Pentacles (14 cards); verify `npm test` passes the full data-integrity suite
- [x] 3.6 Repo owner reviews all card text and verdicts; verify by owner sign-off on the PR

## 4. Draw logic

- [x] 4.1 Implement `src/lib/random.ts` with a crypto-backed `RandomInt` using `crypto.getRandomValues` and rejection sampling, plus a seeded deterministic RNG for tests; verify unit tests that outputs stay in `[0, max)` and that the seeded RNG is reproducible
- [x] 4.2 Implement `draw()` in `src/lib/draw.ts` (partial Fisher-Yates, per-card `rng(2)` reversal, returns `Reading`) with no React imports; verify unit tests: correct card count per spread, positions in order, no duplicate cards, exact output for a fixed seed
- [x] 4.3 Add statistical tests: 78,000 single-card draws pass a chi-square uniformity check at p = 0.001, and reversed share of 10,000 cards is within 0.5 ± 0.03; verify `npm test` passes on three consecutive runs
- [x] 4.4 Implement `countChars` and `truncateToLimit` in `src/lib/question.ts` using `Intl.Segmenter`; verify unit tests: ASCII, emoji (including multi-code-point emoji like flags), accented letters, and truncation at 300 never splits a character

## 5. Reading UI

- [x] 5.1 Build `SpreadPicker` (radio group, nothing selected on page load) and `QuestionBox` (textarea with grapheme-based limit on input and paste, "n / 300" counter, required hint for Yes / No); verify in `npm run dev` that typing and pasting behave per the `tarot-readings` question scenarios
- [x] 5.2 Implement the `composing` → `revealed` → `composing` state in `App`, with `spreadId` starting as `null` and Draw disabled until a spread is chosen, and also when the selected spread requires a question and it is blank; verify in the browser that on page load no spread is selected and Draw is disabled with a "choose a spread" prompt, Draw stays disabled for an empty Yes / No question, and is enabled for Three cards
- [x] 5.3 Build `CardFace` (name, numeral for majors, inline SVG suit or major symbol, 180° rotated face with unrotated "Reversed" label when reversed, `aria-label` with "reversed"); verify by visually checking an upright and a reversed card and inspecting the accessible name in devtools
- [x] 5.4 Build `ReadingView` (question shown as text, verdict panel with verdict and note for Yes / No, cards with position label, name, and orientation-matched meaning, "New reading" button); verify in the browser: three-card reading shows Past/Present/Future with no verdict, Yes / No reading shows verdict matching the card's orientation, and "New reading" clears question and cards while keeping the spread
- [x] 5.5 Keep the scaffold's single `<h1>Tarot</h1>` as the page header and add basic responsive layout (three cards side by side on desktop, stacked at phone width); verify at 375 px and 1280 px widths with no horizontal scroll

## 6. Integration check

- [x] 6.1 Run `npm test && npm run build && npm run preview`, then at `http://localhost:4173/tarot-app/` do one Yes / No and one Three cards reading, disconnect the network (devtools offline) and draw again; verify both readings work offline and the console has no errors
- [ ] 6.2 After merge to `main`, verify the deploy workflow passes tests and the live site at `https://chiehhsinliu.github.io/tarot-app/` supports both spreads

## Workflow follow-up

- Archive the change with `/opsx:archive` once the live site is verified.
