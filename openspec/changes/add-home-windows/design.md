# Design

## Context

- **Home today:** `HomeChoices` renders a `nav.home-choices` with two `a.home-choice` tiles. Each tile has a small line symbol (`TAROT_SYMBOL` or `PAW`), a title and a description. The grid is one column on a phone and two from 560px.
- **Art today:** the oracle and Lenormand drawings are hand-written SVG files, imported `?raw`, inlined, and coloured only through `art-*` classes in `index.css`. `src/lib/art-format.ts` is an allow-list checker (root `<svg>`, elements, attributes, classes, size) used by the art tests.
- **Theme:** colours are tokens on `:root`, redefined for dark under `prefers-color-scheme: dark`. "Decoration stays out of the way" requires decoration to be hidden from assistive technology, not focusable, and not moving.

See proposal.md for the motivation.

## Goals / Non-Goals

**Goals:**
- Two windows that read as a matching pair from one drawing style, sharing a frame and differing only in what is inside.
- Day and night from the same files, driven by the existing tokens.
- The same safety rules as the card art: inlined, allow-listed, colour from CSS only.

**Non-Goals:**
- Animation of any kind, including a hover lift. The spec says the drawings don't move.
- Changing the other screens. The "reading table" look is a possible later change.
- A light or dark toggle in the app. The sky follows the system setting, as the palettes do.

## Decisions

### One SVG per window, frame included

Each window is a single file, `src/assets/home/window-tarot.svg` and `window-oracle.svg`, with a `viewBox="0 0 160 180"`. It contains:
- the arch (a rounded-top path), filled with the sky
- the sky layers
- the subject on the sill: the fanned deck, or the cat
- the frame outline, a mullion cross and the sill drawn on top

**Instead of** an HTML/CSS arch with the picture inside: one SVG keeps the frame, sill and subject in a single coordinate space, so the cat sits exactly on the sill at every size, and it scales as one unit.

**Instead of** reusing the oracle Cat card's file: that drawing is sized for a card face. The window cat is drawn new in the same style (round head, triangle ears, ink dot eyes, blush), sitting side-on so its tail can hang over the sill.

### Day and night as two groups, switched by CSS

Each file has a `<g class="win-day">` (sun and two clouds) and a `<g class="win-night">` (crescent moon and stars). CSS hides one of them with `display: none`, based on the same `prefers-color-scheme` query as the palette tokens, so they switch together without a reload.

**Instead of** swapping two different files with JavaScript: it needs no script and can't fall out of step with the palette.

### Colour classes

The drawings use their own allow-listed classes, styled in `index.css` from the existing tokens:

| Class | Used for | Colour |
|---|---|---|
| `win-sky` | the sky inside the arch | a pale sky blend in light; deep dusk blue in dark |
| `win-glow` | sun, moon, stars | warm yellow in light; cream in dark |
| `win-cloud` | clouds | near-white |
| `win-frame` | arch outline, mullions | `--flourish`; `--accent` on hover and focus |
| `win-sill` | the sill | `--card-border`; `--accent` on hover and focus |
| `art-fill`, `art-light`, `art-line`, `art-ink`, `art-blush`, `art-deep` | the cat and the cards | the same roles as on the oracle cards, with fixed home colours: butter for the cat, cream and rose for the cards |

`art-format.ts` gains a second format for windows: the same rules with the window `viewBox`, the `win-*` classes added, a larger size cap (6 KB, since a window has a whole scene), and a requirement that both a `win-day` and a `win-night` group are present. The window test checks both files against it, just as the oracle and Lenormand tests check their drawings.

### Markup

`HomeChoices` replaces the line symbol with the inlined window, wrapped in a `span.home-window` with `aria-hidden="true"`. The SVG itself is `focusable="false"`. The link keeps its title and description as its only text, so its accessible name doesn't change. `TAROT_SYMBOL` and `PAW` stay exported, because the card faces still use them.

### Layout and styles

- The tiles lose their card background, border and shadow. The window itself is the visual, with the title and description centred under it.
- The window is `width: 100%` with a `max-width` of 240px, so it scales down on a phone. The grid is still one column below 560px and two from 560px, with the windows the same size.
- **Hover and focus:** `.home-choice:hover` and `:focus-visible` recolour `.win-frame` and `.win-sill` to `--accent`. Focus also gets a 2px accent outline with an offset around the whole link. There is no transform or transition on the drawing.

## Risks / Trade-offs

- **Losing the tile border makes the choices look less clickable.** → The title keeps the storybook font and the window frame is the boundary; hover and focus both recolour the frame. Check this in the screenshots before calling it done.
- **The night sky must stay distinct from the dusk page background.** → Give `win-sky` a bluer, slightly lighter tone than `--bg` in dark, and check it in the screenshots.
- **Drawing quality.** → The Lenormand art took a few redraw rounds. Plan for the owner to review the two windows before the rest of the work, as with "approve, draw the rest".
- **Spec wording.** The app-navigation requirement says the home page shows no card. The fanned deck shows only card backs and edges, with no face, number or name, and the visual-theme delta says so explicitly.

## Migration Plan

This is a normal push to `main` after approval, followed by the live checks. To roll back, revert the commit. Nothing about data or links changes.

## Open Questions

None. The owner settled the layout, the subjects, and the scope, and the defaults (the sky follows the theme, nothing moves, original SVG) were stated in exploration without objection.
