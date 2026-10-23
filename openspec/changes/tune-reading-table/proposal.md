# Proposal

## Why

After using the live reading table, the owner doesn't like the forest-green cloth and wants teal or purple instead. The Draw button also sits at the left edge under a centred mat, which looks off. Mockups compared two teals, a purple and a lavender, and the owner chose **teal** (`#1f4a4c`). On teal the plum card backs stand out most clearly, and the labels stay well above 4.5:1. The purples hide the face-down backs, and lavender fails the label contrast.

## What Changes

- **A teal cloth:** the reading mat changes from forest green to teal: `#1f4a4c`, with a `#2b5e60` sheen. This applies everywhere the mat appears: drawn, shared, Lenormand and oracle readings, and the tarot screen's preview. The gold edge, the stitch line and the pale-gold labels stay as they are.
- **Draw centred:** on the tarot screen, the Draw button is centred under the preview mat. Its hint ("Choose a spread to begin.", "A yes / no reading needs a question.") moves to a centred line under the button instead of beside it.
- The README says "teal" instead of "forest-green".

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `visual-theme`:
  - "Drawn cards lie on a reading mat" now says teal instead of forest green.
  - "Face-down spread preview on the tarot screen" adds that Draw is centred under the mat, with its hint centred under the button.

## Impact

- `src/index.css`: the `--mat-bg` and `--mat-sheen` tokens, the two "forest-green" comments, and the `.draw-row` and `.draw-hint` layout.
- `README.md`: one word.
- `mat-colors.test.ts` needs no change; it reads the tokens from `index.css`.
- Scratchpad checks:
  - `table-check` currently asserts the forest-green cloth colour, so it needs updating, plus new assertions for the centred Draw and hint.
  - Re-run `theme-check`, `polish-check`, `lenormand-check` and `nav-check`. They read the hint or measure the tarot screen.
