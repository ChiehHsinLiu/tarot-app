# Design

## Context

- **What the bundle holds,** measured from a source map of the current build (341 kB minified):
  - React and React DOM: about 190 kB
  - card text: tarot meanings 44 kB and oracle messages 17 kB of source JSON
  - the 38 bundled SVG drawings: 44 kB (36 oracle, 2 home windows)
  - the app's own code: about 35 kB
- **`App.tsx` imports everything statically:**
  - `Composer`, `ReadingView`, `OracleIntro`, `OracleCardView`
  - `cardsById`, `deckIdSet`, `oracleById`, `oracleIds` and `spreads` from `decks.ts`
  - `rawSpreads` from `deck.ts`
- **App needs ids to decode links.** It decodes every hash with `decodeReading(hash, rawSpreads, deckIdSet)` to spot an invalid share link, both on first load and on every `hashchange`. That needs spread ids and position counts, plus card ids, but no text.
- **`deck.ts` imports both `cards.json` (ids) and the English text JSON** at module level, so importing anything from it may bring the text along.
- **The Lenormand rule from tidy-code still holds:** `import.meta.env.DEV ? buildLenormandDeck(spreads) : null` has to be written inline in each module that uses it, or Lenormand leaks into the public build.
- **`decks.ts` is also loaded by the dev Vite plugin under Node,** so it must keep working without a bundler.

## Goals / Non-Goals

**Goals:**
- The first chunk holds no card text and no card drawings, and the tarot art planned next lands outside it.
- No visible change: every browser check passes unchanged.

**Non-Goals:**
- Lazy-loading single cards' text or drawings. A screen's file holds its whole deck.
- Smaller fonts, a different framework, or offline support.

## Decisions

- **Two screen modules, loaded on demand inside `<Suspense>`:**
  - `src/screens/TarotScreens.tsx` takes the tarot state from App (composing, revealed, shared, Lenormand revealed) and renders `Composer`, `ReadingView` or the Lenormand view. It builds cards and spreads with text from `decks.ts`, and its own inline dev-only Lenormand deck.
  - `src/screens/OracleScreen.tsx` takes `cardId` and `onDraw` (which receives the newly drawn id, from both Draw and Draw again), and renders `OracleIntro` or `OracleCardView`.
  - **Not `React.lazy` itself** (found while applying): `lazy` suspends on first render even when the file has already arrived, and React then holds the screen back for about 300 ms, which would leave `<main>` empty after every first click. A small `onDemand()` helper in `App.tsx` caches the `import()`, marks the promise fulfilled when it settles, and reads it with `use()` inside a stable wrapper component, so a preloaded screen renders straight away and a still-loading one suspends as with `lazy`.
  - **State stays in `App.tsx`** as plain ids and readings, so the screen-reset rules (`onHashChange`) don't move. App's own `lenormand` line goes, because only the tarot module renders Lenormand now.
  - Alternative: one lazy chunk for both screens. That is simpler, but the oracle visitor would still download all tarot text.
- **Ids without text:** a new `src/lib/deck-ids.ts` exports the raw card ids and raw spreads from `data/cards.json` and `data/spreads.json` only. `deck.ts` re-exports from it, so existing imports keep working, and App imports `deck-ids.ts` directly.
  - **The decks split per screen** (found while applying): `decks.ts` built both decks, so the tarot file pulled the oracle text into a chunk it shared with the oracle screen. `src/lib/tarot-deck.ts` and `src/lib/oracle-deck.ts` now build one deck each, the screens import their own, and `decks.ts` re-exports both for the dev Ask Claude endpoint.
  - The tarot state types and `EMPTY_COMPOSER` move from `Composer.tsx` to `src/screens/tarot-state.ts`, so App can hold the state without loading the composer.
  - The oracle draw picks from `oracleIds`, which comes from `data/oracle/animal.json` without text. `drawOracle` moves into the oracle screen with it, because App only needs to know a card was drawn. The screen passes the id back up.
- **Background loading:** once the first screen has shown, both dynamic `import()`s run inside `requestIdleCallback`, falling back to `setTimeout(…, 200)` where it's missing (Safari). The effect lives in a `PreloadScreens` component inside the same `<Suspense>` as the screen, so on a direct link it waits until that screen has shown rather than competing with its file. The screen reuses the same promise when it mounts. A direct link starts its own screen's import at once.
- **The fallback while loading is `null` inside `<main>`.** The header is outside the `Suspense` boundary, so it shows at once. A spinner would flash for less time than it takes to notice.
- **Checking the split:**
  - After `npm run build`, the entry chunk named by `dist/index.html` must contain none of these marker strings:
    - one tarot meaning
    - one oracle message
    - an `art-fill` path from an oracle drawing
  - The tarot and oracle chunks must each contain their own markers.
  - This is added to the browser checks as `e2e/split.spec.ts`. It also records, with Playwright's request log, which files each scenario in the spec downloads.

## Risks / Trade-offs

- **[Risk] Lenormand leaks into the public build** when the tarot module moves.
  → Mitigation: keep the inline `import.meta.env.DEV` expression in each file that uses Lenormand, and after building check that `dist/` contains no "lenormand", "Ask Claude" or "api/reading".
- **[Risk] Text sneaks back into the entry chunk** through a re-export.
  → Mitigation: the `split.spec.ts` marker check fails the build in CI.
- **[Accepted by the owner] Offline before the background load finishes.** Someone who opens home and loses the connection within about a second can't open a screen whose file hasn't arrived. They see the header and an empty `<main>` until they're back online.
  - No existing requirement breaks. Every "no network once the page has loaded" promise (tarot readings, oracle draw and drawings, Copy for Claude, guides) is about something done on a screen that is already showing, and a showing screen has all its content.
- **[Risk] A slow connection shows an empty screen on a direct link** for a moment.
  → Accepted: the header shows, and the screen's file is about 60–80 kB. Home, the most common first page, gets faster.
- **[Trade-off] Two more requests** on the first visit, made after home has shown, so they don't delay it.
