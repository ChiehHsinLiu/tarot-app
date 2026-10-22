# Design

## Context

- **Reading layout today:**
  - `ol.spread.spread-N` is a grid of `li.spread-slot`.
  - Each slot is itself a grid of, in order: `p.position-label`, the card (`div.card-flip` on a drawn reading, `div.card` on a shared one), `h3.card-title`, `p.card-keywords` and `p.card-meaning`.
  - `.spread-3` has three columns from 720px, and Lenormand's `.spread-2` has two. Below 720px, and always for `.spread-1`, the slots stack in one column.
- **Oracle:** `div.oracle-slot` is a grid of the card (`div.card-flip`), title, keywords, message, reflection and affirmation.
- **Composer:** `form.composer` in `App.tsx` holds the deck picker (dev only), `SpreadPicker`, `QuestionBox`, then `div.draw-row`. The chosen spread (`spread`) is already computed there for the right deck.
- **Card back:** `CardBack` in `CardFlip.tsx` renders `div.card-back[aria-hidden]` at a fixed 140px width.
- **Contrast tests:** `palette.test.ts` checks oracle colours with `contrastRatio` from `palette.ts`.

See proposal.md for the motivation and the delta spec for the required behaviour.

## Goals / Non-Goals

**Goals:**
- No change to the reading's DOM order, so screen readers and the existing checks read the same content in the same order.
- The mat is pure CSS: no image files and no extra elements in the readings.
- One set of mat styles shared by readings, the oracle and the preview.

**Non-Goals:**
- Putting text on the cloth, or a full-screen table.
- Animating the preview, or carrying the preview's cards over to the reading as the same elements.
- A mat or a preview on the oracle intro screen.

## Decisions

### The mat is a pseudo-element placed in the grid

A grid's `::before` pseudo-element is itself a grid item, so it can be placed in grid rows and columns behind the real children, with no extra markup.

- **Stacked (narrow screens, and `.spread-1`):** `.spread-slot::before` spans `grid-row: 1 / 3` (rows 1 and 2, which hold the label and the card), in the slot's single column. That gives each card its own mat.
- **Wide (`.spread-3` from 720px, and `.spread-2` from 720px):**
  - The slots become `display: grid; grid-row: span 5; grid-template-rows: subgrid`, so the five parts of every slot line up in shared rows across the spread.
  - `.spread::before` then spans `grid-column: 1 / -1; grid-row: 1 / 3` (the label and card rows), which is one mat behind every label and card.
  - The per-slot `::before` is turned off at these widths.
  - A side benefit: card titles and meanings line up across the columns.
- **The oracle:** `.oracle-slot::before` covers grid row 1, which holds the card.
- **Stacking order:** the pseudo-element gets `z-index: 0`, and its siblings get `position: relative; z-index: 1`. That keeps the mat behind the 3D flip.
- **Spacing:** the label gets a top margin and the card a bottom margin inside the mat, so the cloth shows around them, about 18px.
- *Alternatives considered:*
  - **Wrapping the label and card in a new element:** it changes the DOM, needs edits in three views, and still needs per-width logic for the wide mat.
  - **Moving all the cards into one row with the meanings below:** this was rejected while exploring, because it changes the reading order and shrinks the cards on phones.
- **Subgrid support:** Chrome 117+, Safari 16+ and Firefox 71+. If a browser lacks it, the wide layout still shows each card's own mat, because the per-slot rule is the default and the wide rule sits inside `@supports (grid-template-rows: subgrid)`.

### One cloth recipe as tokens

- **The tokens** go on `:root` and are the same in both palettes, like the card back:
  - `--mat-bg: #2e4a3b`
  - `--mat-sheen: #3b5c4a`
  - `--mat-edge: var(--card-border)`
  - `--mat-label: #e9d9b6`
- **The look:** a shared selector list (the three `::before` rules and `.spread-preview`) gets:
  - the velvet: two soft radial-gradient sheens over `--mat-bg`
  - a 2px gold border, a 22px radius, an inset stitch line using `inset 0 0 0 6px --mat-bg, inset 0 0 0 7px` gold at 55%, and a soft drop shadow
- **Labels:** `.spread .position-label` and `.spread-preview` labels use `--mat-label`.
- **Contrast:** `#e9d9b6` measures 6.98:1 on `--mat-bg` and 5.35:1 on `--mat-sheen`.
- *Why fixed colours:* the cream card faces and the plum backs are fixed too. The gold edge separates the mat from the dark page, where green on dusk is only 1.69:1. That's fine, since the mat is decoration, not text.

### `SpreadPreview` component for the composer

- **What it renders:** `src/components/SpreadPreview.tsx` exports `SpreadPreview({ spread }: { spread: Spread | null })`. It renders:

  ```
  div.spread-preview[aria-hidden=true]
    for each position: div.preview-slot
      span.position-label
      CardBack
  ```

- **Where it goes:** `Composer` renders `<SpreadPreview spread={spread} />` just before `div.draw-row`.
- **No spread chosen:** the mat keeps a minimum height of about one small back plus a label, so the screen doesn't jump when a spread is first picked.
- **Size of the backs:** inside the preview, `.card-back` is `width: clamp(64px, 22vw, 110px)`, and the mat lays the slots out in a centred flex row with no wrapping. At 320px, three backs of 70px each plus gaps fit inside the mat.
- **Stillness:** there's no transition. `CardBack` carries the `rotateY(180deg)` that the flip relies on, so the preview resets `transform: none`. The drawing is symmetric anyway.
- *Why reuse `CardBack`:* it's one drawing, so the preview and the dealt cards match exactly.

### Label contrast test

A new test `src/lib/mat-colors.test.ts` reads `src/index.css` with `node:fs` (Vitest stubs CSS imports, so `?raw` returns nothing there) and reads `--mat-bg`, `--mat-sheen` and `--mat-label` with a regex. It asserts `contrastRatio(label, bg) >= 4.5` for both cloth colours. This keeps the tokens in CSS while still testing them, without copying the colours into TypeScript.

## Risks / Trade-offs

- **Subgrid alignment changes the wide reading's spacing:** rows now line up across columns, so a short meaning leaves space under it. → This is acceptable, and it matches cards to their row. `flip-check`, `polish-check` and the screenshots will show it.
- **The mat sits behind a 3D-transformed card:** a `z-index` mistake could show the mat over the card mid-flip. → The checks screenshot frames paused mid-flip.
- **Checks that measure layout:** `polish-check` and `theme-fit-check` may assert today's gaps or label colour (`--muted`). → Re-run them and update any assertion that encodes the old label colour.
- **The preview pushes Draw lower on a phone:** about 150px. → The small backs keep it short, and the hint stays next to Draw.

## Migration Plan

This is a pure front-end change. Rollback means reverting the commit.
