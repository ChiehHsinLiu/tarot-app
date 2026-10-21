# Proposal

## Why

The dev-only Lenormand deck (`add-lenormand-deck`) shows a placeholder on each card: a large number and the name. Lenormand is a picture deck, where each card *is* its image (a rider, a clover, a ship), and the owner wants real drawings, as planned when the deck was split into two changes. The animal oracle already has a safe, tested way to ship original SVG drawings that this change can reuse.

## What Changes

- **36 original drawings**, one per Lenormand card, hand-written as small SVGs in the same storybook style as the animal oracle: soft shapes, round line caps, no text. Each is its card's traditional picture (1 Rider to 36 Cross), drawn fresh for this project.
- **Card face:** the number moves to the top of the frame, where tarot shows its numeral, with the drawing in the middle and the name at the bottom. The accessible name stays "{number}, {name}", and the drawing is hidden from assistive technology.
- **Pastel colour families:** after seeing the first samples in one antique-blue palette, the owner chose pastel. Each Lenormand card gets one of the animal oracle's six pastel families (peach, sage, sky, lavender, butter, rose), picked to suit its picture, and stored as `palette` in `data/lenormand/deck.json`. Its face and drawing use that family through the same art classes, so plants are green, sky cards blue, and both picture decks feel like one set.
- **Same safety rules as the oracle drawings:** the format test (allowed elements, attributes and classes, no hard-coded colours, no text or scripts, at most 3 KB) is shared by both decks. One rule changes meaning: the required `art-ink` shape, eyes on the animals, is any dark accent on Lenormand objects, such as a keyhole or a window.
- **Still dev-only:** the drawings load only with the lazily loaded Lenormand reading view, so the public build stays free of Lenormand. This is checked as before.
- **Style check-in:** three samples (Rider, House, Clover) are drawn first for the owner's approval before the other 33.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `lenormand-readings`: the reading display's card face now shows the number, the drawing and the name. A new requirement covers every card having its own original drawing that is decorative, works offline, follows the Lenormand palette and stays out of the production build.

## Impact

- **New:**
  - `src/assets/lenormand/<card-id>.svg` (36 files)
  - `src/lib/lenormand-art.ts`, the loader
  - `src/lib/lenormand-art.test.ts`
  - `src/lib/art-format.ts`, the drawing-format checker moved out of `oracle-art.test.ts` so both decks share it
- **Changed:**
  - `src/components/LenormandCardFace.tsx`
  - `data/lenormand/deck.json` and `src/lib/lenormand.ts`, for each card's `palette`, with a data test
  - `src/components/Lenormand.css`, for the face layout
  - `src/lib/oracle-art.test.ts`, which now uses the shared checker with unchanged rules and results
  - `README.md`
- **Public site:** no change, verified by grepping the build and the live bundle. No new dependencies.
