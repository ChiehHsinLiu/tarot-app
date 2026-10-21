# Proposal

## Why

Every animal oracle card still shows the same outline paw, so the deck looks repetitive even with its six colour families. This is the second half of the storybook redesign: each of the 36 cards gets its own drawing of its animal, in the cozy storybook style that `add-storybook-theme` set up.

## What Changes

- **36 original animal drawings,** one per card, from the Dachshund to the Whale. Claude draws them as hand-written SVG in a shared storybook style:
  - rounded, softly filled shapes and friendly faces
  - one consistent line weight
  - colours taken from the card's family and the theme's card ink, so each drawing matches its card in both light and dark mode
- **The paw is replaced on the card face** by the drawing, larger than the paw was. The theme and animal name stay above and below it. The paw stays as the "Animal oracle" symbol on the home page.
- **The drawings are original and safe to publish.** There is no traced or copied art, and no text inside the drawings. They are part of the app bundle, so oracle draws still need no network once the page has loaded.
- **A style check-in before drawing the rest.** Three sample cards (Dachshund, Capybara and Owl) are drawn first and shown for approval before the other 33.
- **Safety and consistency checks for the drawing files.** A unit test checks every drawing for one shared drawing format, an approved set of SVG elements, no scripts, event handlers or external links, and a size budget.

## Capabilities

### New Capabilities
<!-- None: the drawings belong to the existing animal-oracle capability. -->

### Modified Capabilities
- `animal-oracle`: the oracle reading display now includes the card's own illustration of its animal on the face. A new requirement covers the illustrations: one per card, distinct, original, coloured by the card's family, decorative for assistive technology, and needing no network.

## Impact

- **New files:** `src/assets/oracle/animal/animal-01.svg` … `animal-36.svg`, the drawings, named by card id.
- **New code:** `src/lib/oracle-art.ts` loads the drawings at build time and maps each card id to its drawing, with a test in `src/lib/oracle-art.test.ts`.
- **Changed code:**
  - `src/components/OracleCardView.tsx`: `OracleCardFace` renders the drawing instead of the paw.
  - `src/index.css`: the drawing size, and the drawing classes mapped to the theme colours.
- **Bundle:** about 36 small SVGs, budgeted at 3 KB each, bundled into the app, about 100 KB uncompressed and much less gzipped.
- **Docs:** README animal oracle section.
- **Unchanged:** deck data and text, colour families, prompts, the private bridge, routing, share links and the tarot cards.
