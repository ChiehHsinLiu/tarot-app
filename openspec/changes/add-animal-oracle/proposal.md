# Proposal

## Why

Tarot readings need a spread and often a question. The owner also wants something lighter: one card of gentle guidance for the day, drawn whenever they like. Tarot has no fitting tool for this, and commercial oracle decks are copyrighted. So the app gets its own original deck of 36 animal cards, written for this project. In the local dev app, Claude can then explain the card in more depth or answer a question such as "What should I focus on today?".

## What Changes

- Add an original **Animal Oracle** deck of 36 cards. There are no insects. Each card pairs one animal with one theme, such as Dachshund · Small but Mighty, Alpaca · Gentle Boundaries, Honey Badger · Fearless, Flying Squirrel · Leap of Faith and Magpie · Notice What Shines. Each card also has keywords, a 2–3 sentence message, a reflection question and a one-line affirmation. The data follows the tarot layout: neutral ids in `data/`, English text in `data/i18n/en/`.
- Add a **Today's animal oracle** entry point to the home page, separate from the tarot spreads. **Draw** shows one card, chosen uniformly at random with the crypto RNG, and with no question and no reversal. **Draw again** draws a different card, and **Back** returns to the home page. You can draw any time; there is no daily lock.
- In the dev app only, the oracle card gets **Ask Claude**, plus an optional box of up to 300 characters for a specific question (placeholder "What should I focus on today?"). This reuses the existing local bridge with its streaming, Stop, Ask again, errors, timeout and journal.
  - An empty box gets a fuller explanation of the card for today.
  - A filled box gets an answer to that question, grounded in the card.
  - The box stays editable between asks, so **Ask again** can ask a new question about the same card.
- The local endpoint also accepts an oracle request: a known card id and an optional question of at most 300 characters. It builds the prompt from a new `prompts/oracle.md`. As before, it never accepts raw prompt text.
- Journal entries for oracle answers record the card and question. Tarot journal entries are unchanged.
- The public site gets the oracle deck and its written messages, but no Ask Claude code. The tarot spreads, share links and Copy for Claude don't change.

Out of scope:

- Share links and Copy for Claude for oracle cards
- Card images
- A once-per-day lock or a shared "card of the day"
- Reversed oracle cards
- Other languages

## Capabilities

### New Capabilities
- `animal-oracle`: The 36-card animal oracle deck and its content, the home-page entry point, drawing one card, and showing its written reading.

### Modified Capabilities
- `private-readings`:
  - Ask Claude is also offered on an oracle card, with an optional follow-up question.
  - The endpoint accepts a validated oracle request in addition to a tarot reading.
  - Oracle answers are journaled.

## Impact

- **New files:**
  - Deck data: `data/oracle/animal.json` and `data/i18n/en/oracle/animal.json`
  - Logic: `src/lib/oracle.ts` (deck building, draw and prompt building, with tests) and `prompts/oracle.md`
  - Components: `src/components/OracleSection.tsx`, `src/components/OracleCardView.tsx` and a dev-only `src/components/AskClaudeOracle.tsx`
- **Changed files:**
  - `src/App.tsx`: new oracle state
  - `src/components/AskClaude.tsx`: the streaming logic is shared with the oracle view
  - `vite/private-readings.ts`: oracle requests
  - `vite/journal.ts`: oracle entries
  - `src/index.css` and `README.md`
- **Public bundle:** grows by the oracle deck text, about 15–20 KB before gzip.
- **Dependencies:** none added.
