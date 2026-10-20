# Design

## Context

Builds on `add-project-scaffold` (React + Vite + TypeScript at the repo root, `base: '/tarot-app/'`, Pages deploy via `.github/workflows/deploy.yml`, no test runner, no routing). Nothing is implemented yet, so this change assumes the scaffold's end state. Requirements: `specs/tarot-deck`, `specs/tarot-spreads`, `specs/tarot-readings`.

Later planned changes shape the boundaries here: share links (versioned `#/r/v1/...`), "Copy for Claude" with a shared prompt template, a private `npm run dev`-only Claude Code bridge, and card images. They need the deck, spreads, and draw logic to be reusable outside React (e.g. from a Node script or Vite plugin).

## Goals / Non-Goals

**Goals:**
- Deck and spread data usable from both the browser app and plain Node, with no React imports.
- Text separated from language-neutral data so another locale can be added without reshaping data.
- Draw logic that is pure and testable with an injected random source.

**Non-Goals:**
- i18n library, locale switcher, or extracting UI strings (UI text stays inline in components).
- Serializing readings (share-link encoding is the next change; the `Reading` type is designed to make it straightforward).
- Card images (an optional `image` field is reserved but not used).

## Decisions

**Data lives in `data/` at the repo root as JSON, split into neutral and text files.**
```
data/cards.json              [{ id, arcana, suit?, rank, yesNo: { upright, reversed } }]
data/spreads.json            [{ id, requiresQuestion, showsVerdict, positions: [{ id }] }]
data/i18n/en/cards.json      { [cardId]: { name, keywords[], upright, reversed,
                                           yesNoNote: { upright, reversed } } }
data/i18n/en/spreads.json    { [spreadId]: { name, positions: { [posId]: label } } }
```
Verdicts are values (`"yes" | "no" | "maybe"`), so they sit in neutral data; their explanatory notes are text, so they sit under `i18n/en`. Alternative: TypeScript modules in `src/` — rejected because a Node script or the future Claude Code skill should read them without a TS toolchain, and JSON is easy for a writer to edit.

**Card ids are stable and human-readable:** `major-00` … `major-21`; `wands-01` … `wands-14` (01 = Ace, 11 = Page, 12 = Knight, 13 = Queen, 14 = King), likewise `cups-`, `swords-`, `pentacles-`. These ids will appear in share links, so they are treated as a public, never-renamed contract from this change onward.

**Data is bundled, not fetched.** JSON is imported statically, so Vite inlines it into the bundle; this satisfies the offline-after-load requirement and avoids loading states. English text for 78 cards is roughly 100–150 KB uncompressed — acceptable. When a second locale arrives, per-locale dynamic `import()` can replace the static import.

**Typed loader with integrity checks in `src/lib/deck.ts`.** It joins neutral data with a locale's text into `Card` objects and exposes types (`Card`, `Spread`, `Orientation`, `Verdict`). A Vitest data-integrity test enforces the `tarot-deck` requirements (78 unique ids, counts per suit, Strength = 8 / Justice = 11, every card has all text fields, length limits, verdicts in the allowed set, every spread position has a label).

**Pure draw function in `src/lib/draw.ts`:**
```ts
type DrawnCard = { cardId: string; positionId: string; reversed: boolean }
type Reading = { spreadId: string; question: string; cards: DrawnCard[] }
draw(spread: Spread, deckIds: string[], question: string, rng: RandomInt): Reading
```
`RandomInt` is `(maxExclusive: number) => number`. The default implementation uses `crypto.getRandomValues` on a `Uint32Array` with rejection sampling to avoid modulo bias. Cards are chosen with a partial Fisher-Yates shuffle (only as many swaps as positions); reversal is `rng(2) === 1` per card. Tests inject a seeded deterministic RNG for exact-output tests, and use the real RNG with a chi-square bound for the uniformity scenarios. `crypto.getRandomValues` exists in browsers and in Node 22 as a global, so the same module serves both.

**Question length counted in graphemes via `Intl.Segmenter`.** `src/lib/question.ts` exports `countChars` and `truncateToLimit(text, 300)`, used by the text box on input and paste. Alternative: `maxLength` on the `<textarea>` — rejected because it counts UTF-16 code units, so emoji count as 2 and can be split. `Intl.Segmenter` is supported in all current evergreen browsers and Node 22.

**UI state is a two-state machine in `App`:** `composing { spreadId: string | null, question }` → (Draw) → `revealed { reading }` → (New reading) → `composing { spreadId, question: "" }`. `spreadId` starts as `null` on page load (no default spread); Draw is enabled only when a spread is selected and, for spreads with `requiresQuestion`, the question is non-blank. Locking the question is structural: the revealed state renders the question as text, not as an input. No state library; `useState` with a discriminated union is enough.

**Components:** `SpreadPicker` (radio group), `QuestionBox` (textarea + counter + required hint), `ReadingView` (question, verdict panel for `showsVerdict` spreads, cards in position order), `CardFace` (name, numeral for majors, suit symbol as small inline SVG, rotation for reversed with an unrotated "Reversed" label, `aria-label` like "The Tower, reversed"). The scaffold's `<h1>Tarot</h1>` stays as the page header.

**Interpretation content is written fresh in modern English** in the Rider-Waite-Smith tradition, using A. E. Waite's *Pictorial Key to the Tarot* (1910, public domain) and conventional yes/no tables as reference, not copied from copyrighted modern books. Meanings ≤ 400 characters, yes/no notes ≤ 140. Drafted during implementation and reviewed by the repo owner before merge.

**Vitest added as a dev dependency** with an `npm test` script (`vitest run`). The deploy workflow gains an `npm test` step before `npm run build`, so a failing data-integrity or draw test blocks deployment, consistent with the scaffold's "failed builds do not deploy" requirement.

## Risks / Trade-offs

- [Content quality and tone vary across 312 written entries] → write by suit in batches with a shared style guide (second person, present tense, non-fatalistic, no medical/legal/financial advice), and owner review per batch.
- [Verdicts feel arbitrary for ambiguous cards] → "Maybe" is available, and every verdict carries a note explaining why.
- [Card ids become a public contract once share links ship] → ids fixed in this change and covered by the integrity test; renames would require a new share-link version.
- [Rotated text-only cards hard to read] → only the face rotates; label and meaning text stay upright.
- [Statistical tests can flake] → use generous bounds (e.g. chi-square at p = 0.001) and enough samples; exact behavior is tested with the seeded RNG.

## Migration Plan

No existing data or users. Deploys via the existing workflow on merge to `main`. Rollback is reverting the merge commit.
