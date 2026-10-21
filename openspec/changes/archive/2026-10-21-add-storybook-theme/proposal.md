# Proposal

## Why

The site is called just "Tarot" even though it now offers two kinds of reading, and its look is plain: a system font, flat backgrounds and one accent colour. The animal oracle suffers most, because all 36 cards show the same outline paw and differ only in two words of text. This change gives the site a name and a cozy storybook identity that fits both features. It also gives the oracle cards their own colours and frame, so the deck feels varied before the animal drawings arrive in a later change.

## What Changes

- **New name: "Little Oracle".** It appears in the browser tab and the main heading, with the subtitle "tarot & animal cards for today" on the home page. **BREAKING** (text only): the visible title changes from "Tarot". The repo name, the site address `/tarot-app/`, and share links are unchanged.
- **Storybook theme.**
  - Light mode is warm paper cream, and dark mode is a deep "cozy dusk" plum instead of near-black.
  - The background has a soft texture, drawn with CSS rather than images.
  - Buttons, choice cards and panels are softer and more rounded.
  - A small leaf-and-star flourish appears by the title.
  - A story-like site icon replaces the blank favicon.
- **Bundled heading font.** Headings, card names and the affirmation use a soft rounded serif, Fraunces. It is bundled with the app from npm, so no font is fetched from a third party and readings still work offline. Body text keeps the system font for readability.
- **Storybook card frames.**
  - Tarot and oracle faces share a cream card with an inner frame and corner flourishes.
  - Tarot suit and major arcana symbols are redrawn in the same soft line style.
  - Reversed cards still rotate, and "(reversed)" still follows the card name.
- **A colour for each oracle card.**
  - Each of the 36 cards is assigned one of six pastel colour families in the deck data: peach, sage, sky, lavender, butter or rose.
  - The card face, its frame and the reading's accents use that colour.
  - The paw stays as a placeholder until the animal-drawings change.
- **Restyled screens.** The spread choice, the question box, the yes/no verdict, the share and answer panels, and the home choice cards are restyled to the theme. Layout and behaviour don't change.
- **Accessibility kept.**
  - Text meets WCAG AA contrast in both modes.
  - Decorations are hidden from assistive technology.
  - Nothing new moves, so there is no animation to reduce.
- **Spec correction.** The `tarot-deck` requirement for reversed cards still describes the upright "Reversed" label under the face, which `restructure-home-layout` removed. It is updated to describe the "(reversed)" marker after the card name.

## Capabilities

### New Capabilities
- `visual-theme`: the storybook look as a contract:
  - light and dark palettes that follow the system setting
  - the bundled heading font with no third-party font requests
  - the shared card frame
  - one pastel colour family per oracle card
  - decorations hidden from assistive technology
  - minimum text contrast

### Modified Capabilities
- `title-page`: the main heading and document title become "Little Oracle", and the home page shows the subtitle.
- `app-navigation`: the home page scenario names the heading "Little Oracle" instead of "Tarot".
- `site-deployment`: the published-URL scenario refers to the Little Oracle home page instead of the "Tarot title page".
- `tarot-deck`: the reversed-card requirement describes the "(reversed)" marker after the card name instead of a separate "Reversed" label.

## Impact

- **Code:**
  - `index.html`: title and favicon.
  - `src/App.tsx`: the heading, subtitle and flourish.
  - `src/index.css`: tokens, theme, frames and screens.
  - `src/components/CardFace.tsx`: redrawn symbols and the frame markup.
  - `src/components/OracleCardView.tsx`: the colour family on the face and the reading.
  - `src/components/HomeChoices.tsx`.
  - `src/components/AskClaude.css`: panel styling for the dev-only answer.
- **Data:**
  - `data/oracle/animal.json` gains a `palette` field on each card. The text file is unchanged.
  - `src/lib/oracle.ts` carries the field through, and the data test checks it.
- **Dependencies:** adds `@fontsource-variable/fraunces` 5.3.0 (OFL-1.1 licence), which is bundled into the build.
- **Docs:** `README.md` gets the new title.
- **Unchanged:** routing, share-link format, prompts, the private bridge and journal, and the deploy workflow.
