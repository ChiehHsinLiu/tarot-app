# Proposal

## Why

Cards are now dealt face down and turned over, but they land straight on the paper background. The tarot screen also reads like a form, with half a page of empty space under the Draw button. While exploring designs, the owner chose a "reading table": a forest-green cloth mat under the cards, and a face-down preview of the chosen spread before drawing.

## What Changes

- **A reading mat under drawn cards:** a forest-green velvet mat with a gold edge and a faint inner stitch line sits under the cards of a tarot reading, a shared reading, a Lenormand reading, and the drawn animal oracle card.
  - **On wide screens,** one mat spans the whole card row.
  - **On a phone,** where the cards are stacked, each card sits on its own small mat.
  - **Only the cards and their position labels are on the mat.** Card names, keywords, meanings, the verdict and the buttons stay on the paper as today.
- **Position labels on the cloth:** PAST, PRESENT, FUTURE, ANSWER and so on move onto the mat in a pale gold that stays readable on the green.
- **A face-down preview on the tarot screen:** just above Draw, the tarot screen shows an empty mat. Once a spread is chosen, the mat holds that spread's cards face down (the night-sky back), with their position labels.
  - Changing the spread changes the preview at once, with no animation.
  - The Lenormand deck (dev only) shows its own spreads' positions.
  - The preview is decoration: it is hidden from assistive technology, and on a phone the backs shrink so the mat fits without scrolling sideways.
- **Unchanged:**
  - the card flip and its timing
  - what the reading shows and the order a screen reader reads it in
  - share links, the oracle intro screen (still no card), and the rule that the tarot screen starts with no spread selected (it then shows the empty mat)
- The README's description of the reading mentions the mat and the preview.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `visual-theme`: adds requirements for the reading mat under drawn cards (its look, wide and phone layouts, readable position labels, staying still and out of assistive technology) and for the face-down spread preview on the tarot screen.

## Impact

- `src/index.css`: mat tokens, the mat drawn behind the card row (wide) or each card (phone), position label colours, and the preview layout.
- `src/App.tsx` (the composer) and a new small `SpreadPreview` component that reuses `CardBack` from `CardFlip.tsx`.
- `src/lib/palette.test.ts` or a new small test that checks the label colour against the mat colours.
- `README.md`.
- Scratchpad browser checks: a new `table-check`, and re-running `flip-check`, `polish-check`, `theme-check`, `lenormand-check` and `oracle-check`, which measure the card layout.
- No change to data, routes, share links, prompts, Ask Claude, or the flip.
