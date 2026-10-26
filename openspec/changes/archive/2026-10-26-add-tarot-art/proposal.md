# Proposal

## Why

Every tarot card looks almost the same: the frame, one small suit symbol, a numeral on the major cards, and the name. The animal oracle and the dev-only Lenormand deck already give every card its own drawing, so tarot, the app's main reading, is now the plainest deck. A reader also can't tell the Three of Cups from the Eight of Cups without reading the name.

## What Changes

- **Original drawings on the tarot faces,** in the same storybook style and hand-written SVG format as the oracle art: simple shapes only, no text, colours only through the art classes, and checked by a format test.
- **One colour family per suit and one for the major cards,** so a spread can be read at a glance and follows both palettes.
- **The 22 major cards each get their own drawing.**
- **The 16 court cards (Page, Knight, Queen, King) each get their own drawing,** following one pattern per rank so they read as a set.
- **The 40 number cards (Ace to Ten) show their count of suit symbols,** laid out by code in one fixed arrangement per number, in the Marseille tradition. The owner chose this (option B) over a scene on every card or drawing only the major cards. That makes 38 drawings in all.
- **The art loads with the tarot screens,** in their own file (see `load-screens-on-demand`), so home doesn't grow.
- **The card's name, numeral and reversed turn stay as they are.** Screen readers keep announcing just the card's name, as with the oracle art.
- **The drawings are made in batches, each reviewed by the owner:** number cards, then courts, then the major cards in two halves. The change is pushed once all are in.
- **Not in scope:**
  - Copying or tracing any existing deck. All drawings are original.
  - Changing card meanings, the card back, the flip or the mat.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `tarot-deck`: "Minimal card face" becomes an illustrated face: name, numeral, and the card's own drawing, or its count of suit symbols for Ace to Ten.
- `visual-theme`: "Storybook card face" gains the tarot colour families, matching "Oracle cards have their own colours". It adds a requirement that tarot drawings are original, decorative for assistive technology, and need no network once the tarot screen has shown.

## Impact

- New `src/assets/tarot/<card-id>.svg` files and `src/lib/tarot-art.ts`, loaded like `oracle-art.ts`, with a `tarot-art.test.ts` format check reusing `art-format.ts`.
- `src/components/CardFace.tsx` and `src/styles/card.css`: the drawing and the suit colour families. The current symbols may stay as the pip shapes.
- About 1.2 kB per drawing: about 45 kB for the 38 drawings, in the tarot screens' file.
- Browser checks: the theme and table checks cover the new faces at 1280 and 320 in both palettes, including the phone mats and reversed cards.
- Depends on `add-browser-checks` and `load-screens-on-demand` being applied first.
