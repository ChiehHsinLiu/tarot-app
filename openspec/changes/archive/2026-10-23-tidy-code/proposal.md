# Proposal

## Why

The owner wants the code easier to read and change. Four spots are harder to follow than they need to be:
- **One big stylesheet:** every style lives in one 1,235-line `src/index.css`.
- **Decks built twice:** the decks are built in both `App.tsx` and the dev endpoint.
- **Copied buttons:** the Ask Claude / Stop / Ask again buttons are written out twice.
- **A crowded `App.tsx`:** it holds the screen header and the tarot composer as well as the app's routing.

## What Changes

A refactor only. The app looks and behaves exactly the same, in both the public build and dev.

- **Styles split by area:**
  - `src/index.css` becomes a list of `@import`s of files in `src/styles/`, one per section that already exists in it: tokens and base, site header, home, composer and preview, reading, mat, card face, card back and flip, actions, share, oracle, and guide.
  - The rules keep their order, so the cascade is unchanged.
- **One place that builds the decks:**
  - A new `src/lib/decks.ts` builds the tarot cards and spreads, the animal oracle cards, and their lookups (by id, the id lists).
  - Both `App.tsx` and `vite/private-readings.ts` use it.
  - Lenormand stays built where it is, behind the dev-only check, so it never enters the public bundle.
- **Shared Ask Claude buttons:** a small `AskButtons` component shows Stop while streaming, and otherwise Ask Claude or Ask again. `AskClaude` and `AskClaudeOracle` both use it.
- **Smaller `App.tsx`:** `SiteHeader` and `Composer` move into their own files in `src/components/`.
- **Not in scope:**
  - Sharing the spread layout between `ReadingView` and `LenormandReadingView`. The owner chose to skip it, as it touches the flip, the mat and the screen reader order.
  - Any change to behaviour, text or styles.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. No requirement changes, so the change sets `skip_specs: true`.

## Impact

- **CSS:**
  - `src/index.css` and a new `src/styles/` folder.
  - `src/lib/mat-colors.test.ts` reads the tokens file instead of `index.css`.
  - Three comments that point at `index.css` (`CardFlip.tsx`, `home-art.ts`, `oracle-art.ts`) name the new file instead.
- **Decks:** a new `src/lib/decks.ts`, used by `src/App.tsx` and `vite/private-readings.ts`.
- **Buttons:** a new `src/components/AskButtons.tsx`, used by `src/components/AskClaude.tsx` and `src/components/AskClaudeOracle.tsx`.
- **`App.tsx` split:** new `src/components/SiteHeader.tsx` and `src/components/Composer.tsx`.
- **Not touched:** dependencies, the public URL and the share-link format.
