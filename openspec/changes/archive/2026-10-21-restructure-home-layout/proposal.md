# Proposal

## Why

The home page shows the tarot composer first, with its Draw button disabled, and puts the animal oracle under a divider below it. On a phone the oracle is below the fold, so it looks like an afterthought rather than one of two features. The reading screens also have layout rough edges: the REVERSED label pushes three-card columns out of line, long meanings are centred, and the action buttons wrap untidily. Now that the app has two ways to read, the home page should present them as equal choices, and the screens behind them should be tidied at the same time.

## What Changes

- **Home page with two choices.** The home page (`#/`, or no fragment) shows the "Tarot" heading and two equal choice cards, **Tarot reading** and **Animal oracle**, each with a short description. Nothing is drawn or selected on the home page.
- **A screen for each feature, with its own address.**
  - `#/tarot` holds the spread choice, the question and the reading.
  - `#/oracle` opens with a short intro and a **Draw** button, then shows the card with **Draw again**.
  - Each screen has a **Home** link. Browser Back, refresh and bookmarks work because each screen is a separate address.
  - Unknown fragments show the home page.
- **Share links unchanged.** `#/r/v1/...` links, the link format, and the default of leaving the question out all stay the same. "Draw your own" on a shared reading now goes to `#/tarot` with no spread selected. Drawing a reading still never puts the cards in the URL.
- **Remembered while you move around.** During a visit, each screen keeps what it last showed when you go Home and come back: the chosen spread and typed question, the drawn reading, or the oracle card. A refresh starts that screen fresh.
- **The oracle "Back" button is replaced by the Home link.** **BREAKING** (UI only): the oracle reading no longer has a "Back" button, and the oracle is no longer a section on the home page.
- **Layout polish.**
  - Three-card columns line up: the separate REVERSED label under the card face is removed, because the rotated face and "(reversed)" in the title already show it. Long meanings are left-aligned.
  - Action rows put the primary action first and keep the secondary actions together on one row where they fit, stacking neatly on phones.
  - Consistency: the big "Tarot" heading appears only on the home page, with a compact header on the other screens. The yes/no verdict box matches the card column width, and the oracle card face matches the tarot face size.

## Capabilities

### New Capabilities
- `app-navigation`: the home page and its two choices, the screen addresses (`#/`, `#/tarot`, `#/oracle`), the Home link, browser Back and refresh behaviour, and remembering each screen's state during a visit.

### Modified Capabilities
- `animal-oracle`: the entry point moves from a home-page section to the **Animal oracle** choice and the `#/oracle` screen with an intro and **Draw**. "Back" is replaced by the Home link.
- `tarot-spreads`: "no spread selected" now applies when the tarot screen is first opened in a visit, not to the home page.
- `reading-share-links`: "Draw your own" goes to the tarot screen at `#/tarot`. "Drawing does not change the address" now means the address stays `#/tarot`, with no reading fragment.

`title-page` is unchanged: the root URL still shows the single top-level heading "Tarot", and the document title stays "Tarot".

## Impact

- **Code:**
  - `src/App.tsx`: routing state, home screen, Home link and screen focus.
  - A new pure `src/lib/route.ts` with unit tests.
  - A new home component, which replaces `src/components/OracleSection.tsx`.
  - `src/components/OracleCardView.tsx`: the intro and draw states; "Back" is removed.
  - `src/components/CardFace.tsx`: the reversed label is removed.
  - `src/components/ReadingView.tsx`: action order.
  - `src/index.css`: the home cards, compact header, column alignment, action rows, verdict width and oracle face size.
- **Unchanged:** the private bridge (`vite/`), prompts, journal format, share-link encoding and deck data.
- **Docs:** README sections on the animal oracle and the home page.
- **Dependencies:** none. Routing uses `location.hash` and `hashchange`, with no router library.
- **Deploy:** GitHub Pages is unaffected, because hash addresses need no server rewrites under `/tarot-app/`.
