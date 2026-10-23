# Proposal

## Why

The site ships as one 341 kB JavaScript file (104 kB gzipped), so the home page downloads everything before it shows anything. That includes all 78 tarot cards' text, all 36 oracle cards' text and their drawings, though home only needs its two window drawings. Roughly a third of the file belongs to screens the visitor may never open.

The coming tarot card art would add about 45 kB more to that same file. Splitting by screen first means the art costs home nothing.

## What Changes

- **The first file holds home and the app shell only:** the header, routing, home and its two windows, and React. It also keeps the card and spread ids that are needed to recognise a share link.
- **The tarot screens load as their own file:** the composer, readings, shared readings, all tarot card text, and later the tarot art. Lenormand stays dev-only and out of the public build, as today.
- **The oracle screen loads as its own file:** the intro, the card view, the oracle card text and the 36 drawings.
- **Both files start loading in the background as soon as home has shown,** so a click on a home window usually finds its screen already loaded. Opening a screen directly, for example from a share link, loads that screen's file straight away.
- **Nothing visible changes.** Draws still never need the network once a screen is showing.
- **Not in scope:**
  - Replacing React with a smaller library.
  - Changing the fonts.
  - Making the app work offline.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-deployment`: adds a requirement that the first page load carries only what home needs, and that each screen's card text and drawings load with that screen.

## Impact

- `src/App.tsx`: keeps routing and screen state, and renders the tarot and oracle screens through `React.lazy`.
- New `src/screens/TarotScreens.tsx` and `src/screens/OracleScreen.tsx` resolve ids to cards and render the existing components.
- `src/lib/deck.ts` / `src/lib/decks.ts`: the card and spread ids move to a module with no text, so the shell can decode share links without pulling in card text.
- `dist/assets/` has three JS files instead of one, plus the dev-only Lenormand chunk in dev.
- Works under the existing Content Security Policy, since all chunks are same-origin scripts.
- The browser checks from `add-browser-checks` cover every screen unchanged, plus a new check of what each page load downloads.
