# Proposal

## Why

After `add-project-scaffold`, the app shows only a "Tarot" heading. This change delivers the core product: a visitor types a question, picks a spread, draws cards, and reads written interpretations — entirely in the browser, so the site stays static on GitHub Pages. It also lays down the shared data and draw logic that later changes (share links, "Copy for Claude", private Claude readings, card images) will build on.

## What Changes

- Add a full 78-card tarot deck (22 major, 56 minor arcana in the Rider-Waite-Smith tradition) as language-neutral data, with English names, keywords, upright and reversed meanings, and a yes/no verdict (Yes / No / Maybe) plus short note per card and orientation.
- Add two spreads: **Yes / No** (one card, question required, shows a verdict) and **Three cards** (Past / Present / Future, question optional).
- Add a question box (max 300 user-visible characters, with a live counter) that is locked once cards are drawn; "New reading" starts over.
- Draw cards fairly from a full shuffled deck using cryptographic randomness, with each card independently upright or reversed at 50/50; no card appears twice in one reading.
- Show minimal text-based card faces (numeral, name, suit symbol). Reversed cards are shown rotated with an upright "Reversed" label.
- The "Tarot" heading from `add-project-scaffold` remains the page's single top-level heading; the reading UI sits beneath it.
- Add Vitest for unit tests of the draw logic and deck data integrity.

Out of scope (later changes): share links and routing, "Copy for Claude", private AI readings, card images, more spreads, other languages, reversal toggle, reading history.

## Capabilities

### New Capabilities
- `tarot-deck`: The set of 78 cards, their written meanings and yes/no verdicts, and how a card is presented (face, orientation).
- `tarot-spreads`: The spreads a user can choose from, their positions, and spread-specific rules (question required, verdict shown).
- `tarot-readings`: Asking a question, drawing cards for a spread, and presenting the resulting reading, including fairness of the draw and starting a new reading.

### Modified Capabilities
<!-- None. `title-page` (from add-project-scaffold, not yet archived) is unchanged: its single "Tarot" heading is kept. -->

## Impact

- **Depends on** `add-project-scaffold` being implemented first (React + Vite app, Pages deploy).
- **New files**: `data/` (deck, spreads, `data/i18n/en/` text), `src/lib/` (draw logic and data loading), reading UI components in `src/`.
- **Dependencies**: dev dependency `vitest`; a `test` npm script, also run in the deploy workflow before building.
- **Content effort**: writing 156 meanings, 156 verdicts, and 156 yes/no notes in English is the largest part of the work.
