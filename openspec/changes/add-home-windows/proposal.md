# Proposal

## Why

The owner wants the app to look more storybook-like, starting with the page layout. The home page is two plain rounded tiles with small line symbols, the least illustrated screen in an app whose oracle and Lenormand cards all have their own drawings. Exploring layouts, the owner chose "arched windows": each home choice becomes a small illustrated window, keeping the two equal choices.

## What Changes

- **Two arched windows on the home page:**
  - Each home choice becomes an arched window with an original drawing, its title and one-line description underneath, and the whole window and text forming one link.
  - **Tarot reading:** a fanned deck of cards resting on the windowsill, drawn as artwork (no card face, number or name).
  - **Animal oracle:** a cat sitting on the windowsill, drawn in the style of the oracle animals.
  - The windows sit side by side on wider screens and stack on a phone, as the tiles do today.
- **The sky follows the colour scheme:** in the light palette each window shows a soft day sky (sun and clouds); in the dusk palette, a night sky (moon and stars). It switches with the system setting, without a reload.
- **Hover and focus:** the window's frame and sill take the accent colour, plus the usual focus ring for keyboards. Nothing moves, in line with "Decoration stays out of the way".
- **Unchanged:** the heading, subtitle, the two titles and descriptions, where each choice leads, and the rule that the home page shows no spread choice, question box, draw action, or card. The drawings are hidden from assistive technology, so screen readers announce the same two links as before.
- The README's description of the home page mentions the windows.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `visual-theme`: adds a requirement for the illustrated home windows (their pictures, day and night skies, hover and focus, and that they stay decorative and fit at phone width).

## Impact

- `src/components/HomeChoices.tsx` and the home styles in `src/index.css`.
- Two new hand-written SVG drawings under `src/assets/home/`, with a format test like the oracle and Lenormand art tests.
- `README.md`.
- Scratchpad checks for the home page (a new window check, plus the existing navigation, theme and polish checks).
- No change to routes, data, share links, readings, or the dev-only features. The public build gains only the two small drawings.
