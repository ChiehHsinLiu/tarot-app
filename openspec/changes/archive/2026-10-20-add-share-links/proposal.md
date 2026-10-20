# Proposal

## Why

A reading currently disappears when the page is closed or reloaded, and there is no way to show it to someone else. Share links let a visitor send a reading to a friend or to themselves, and they are the bridge the later "private Claude readings" work relies on: a reading drawn on the public site (for example on a phone) can be opened elsewhere and interpreted from the same link.

## What Changes

- Add a versioned share-link format that encodes a reading in the URL fragment: `#/r/v1/<spread-id>/<cards>[?q=<question>]`, where cards are the existing stable card ids in position order, each suffixed with `r` when reversed (e.g. `#/r/v1/three-card/swords-12.cups-04.wands-09r`).
- Add a **Share** action to every shown reading: it shows the link, offers an **Include my question** checkbox (unticked by default, shown only when the reading has a question), and copies the link to the clipboard.
- Opening a share link shows that exact reading — same cards, orientations, positions, meanings, and verdict — labeled as a shared reading, with a **Draw your own** action that returns to a fresh, empty composer.
- Invalid or unsupported links (unknown version, unknown spread, wrong card count, unknown or repeated cards, over-long question) show a short notice above an empty composer instead of a broken page.
- Drawing a reading does not change the address bar; only the Share action produces a link.

Out of scope: native share sheets (Web Share API), short-link services, saving readings or history, "Copy for Claude", and private readings.

## Capabilities

### New Capabilities
- `reading-share-links`: Encoding a reading as a versioned link, sharing it with or without the question, and opening a link to view the same reading.

### Modified Capabilities
<!-- None. Opening a share link is a new entry point; existing tarot-readings, tarot-spreads, tarot-deck, title-page, and site-deployment requirements are unchanged. "Draw your own" returns to the same empty composer a fresh page load shows. -->

## Impact

- **Code**: new pure module `src/lib/share.ts` (encode/decode, no React) with unit tests; `App.tsx` gains link handling on load and on `hashchange`; `ReadingView` gains Share UI and a shared-reading variant.
- **Public contract**: the `v1` link format and the card ids in it must keep working once published; any future change to either needs a new version prefix.
- **Privacy**: questions leave the page only when the user ticks "Include my question".
- **Dependencies**: none added.
