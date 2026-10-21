# Design

## Context

`OracleCardFace` in `src/components/OracleCardView.tsx` renders, inside a `.card-face.oracle-face`:
- the theme
- `<svg className="card-symbol">` with the shared `PAW` path
- the name

The face sets `--family-face` and `--family-edge` inline from `ORACLE_PALETTES` (`src/lib/palette.ts`). The theme also provides `--card-ink` and `--card-ink-soft`, which are the same in both colour schemes because cards stay cream or pastel.

`.card-face` is 140px wide at a 3:5 ratio, with an inner frame 6px in. Its grid rows are the numeral or theme, the symbol, and the name. `HomeChoices` also uses `PAW`.

The colour families were mapped in `add-storybook-theme` so that they suit their animals: sage for the Frog and Sloth, sky for the Whale and Dolphin, peach for the Fox and Red Panda. That's why the drawings can take their colours from the family.

See proposal.md for why this changes.

## Goals / Non-Goals

**Goals:**
- One SVG file per card, easy to review, redraw or replace, named by card id.
- Every drawing coloured entirely by theme classes, so it follows its card's family and never hard-codes a colour.
- A consistent style across all 36, enforced where possible by a test: the drawing box, the allowed shapes and classes, and the size.
- No new runtime dependency and no network use.

**Non-Goals:**
- Tarot card illustrations.
- Animation or hover effects on the drawings.
- Artwork from outside the project, including AI image tools or traced references.
- Changing the home page paw symbol.

## Decisions

### Files: `src/assets/oracle/animal/<card-id>.svg`
There are 36 hand-written SVG files, for example `animal-01.svg` for the Dachshund. They are named by id, as the earlier image-storage discussion settled, so renaming or translating a card never breaks its drawing.

*Alternative:* 36 React components. Those are harder to look at, harder to replace one by one, and mix drawing data with code.

### Loading: build-time raw import, then inline
`src/lib/oracle-art.ts` uses:

```ts
import.meta.glob('../assets/oracle/animal/*.svg', { query: '?raw', import: 'default', eager: true })
```

This builds `ORACLE_ART: Record<string, string>` keyed by card id. `OracleCardFace` then renders:

```tsx
<span className="oracle-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ORACLE_ART[card.id] }} />
```

in place of the paw `<svg>`.

- **Inline markup** lets the drawing's classes use the page's CSS variables. An `<img src>` can't.
- **Eager bundling** means draws stay offline-safe.
- **The markup is static and comes from files in this repo,** never from user input. The test in the next section limits what those files may contain, which is what makes `dangerouslySetInnerHTML` safe here.

*Alternative:* vite-plugin-svgr. That adds a dependency for 36 files.

### Drawing format, enforced by `oracle-art.test.ts`
Every file must have:
- **A root of** `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" focusable="false">`.
- **Elements only from** `svg`, `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline` and `polygon`. In particular, no `text`, `image`, `use`, `script`, `style` or `foreignObject`.
- **Attributes only from** the root attributes above, `class`, `d`, `cx`, `cy`, `r`, `rx`, `ry`, `x`, `y`, `width`, `height`, `x1`, `y1`, `x2`, `y2`, `points` and `transform`. That excludes `fill`, `stroke`, `style`, `href`, and any `on*` handler, so colour can only come from classes.
- **Classes only from** the art palette below, with at least one `art-ink` shape for the eyes.
- **A size of at most 3,072 bytes.**

The test also checks that the file ids exactly match the deck ids, and that all 36 files' contents are distinct.

### Art palette (CSS in `src/index.css`, under `.oracle-art`)
These are the only colours a drawing can use. Each is defined from the card's family and the card ink:

| Class | Paint | Used for |
|---|---|---|
| `art-fill` | `color-mix(in srgb, var(--family-edge) 45%, var(--family-face))` | The main body: a mid tone of the family |
| `art-deep` | `color-mix(in srgb, var(--family-edge) 80%, var(--card-ink))` | Darker patches, such as ears, spots, stripes and shells |
| `art-light` | `#fffaf0`, the card cream | Bellies, muzzles and highlights |
| `art-ink` | `var(--card-ink)` | Eyes, noses and small mouths |
| `art-blush` | `#f0a39b` at 0.6 opacity | Cheeks |
| `art-line` | No fill; stroke `color-mix(in srgb, var(--family-edge) 45%, var(--card-ink))`, width 2.2, round caps and joins | Outlines and whiskers |

A shape can combine one fill class with `art-line`, for example `class="art-fill art-line"`.

Because faces are pastel in both schemes, the drawings look the same in light and dark mode. The family supplies the variety: a sage frog, a sky whale, a peach fox.

### Style rules for the drawings
These are written down so all 36 stay consistent, and they are checked by eye on the contact sheet:
- **Pose:** a three-quarter or front view, sitting or standing, centred, filling about 70–80% of the 100×100 box with roughly 10 units of margin.
- **Shapes:** chunky and simple, with big heads. Eyes are small `art-ink` dots, cheeks are `art-blush`, and there are no sharp teeth or claws.
- **Features:** each animal's key feature exaggerates just enough to be recognisable at 96px:
  - the dachshund's long body
  - the alpaca's fluffy neck
  - the honey badger's white back stripe
  - the flying squirrel's gliding membrane
  - the magpie's long tail
  - the seahorse's curl
  - the bowerbird beside a little blue treasure, drawn in `art-deep`
- **Background:** the card face is the background, so none is drawn.

### Face layout
`.oracle-art` replaces the symbol row: a 96×96px block centred in the face's middle row, with the theme above and the name below as now. The paw path stays exported for `HomeChoices`.

### Style check-in and contact sheet
A scratchpad generator writes a contact-sheet page. It shows every drawing on its own family face at card size and at 2×, in both schemes, using the real `index.css` rules for `.oracle-art`.
- **First, three sample cards** (Dachshund, Capybara, Owl) are drawn, and the contact sheet is shown to the user. The remaining 33 are drawn only after the user approves the style, or adjusts it.
- **Then the cards are drawn family by family,** six at a time, each batch reviewed on the contact sheet before the next.

## Risks / Trade-offs

- **[Hand-written SVG may not be recognisable for every animal, especially similar ones like otter and beaver, or dove and magpie]**
  → Exaggerate one distinctive feature per animal: the beaver's flat paddle tail and big teeth, the otter floating on its back with a pebble, the dove's olive sprig, the magpie's long two-tone tail.
  → Review on the contact sheet at real size, and redraw any the user finds unclear.
- **[A simple, icon-like style may feel less rich than painted art]** → This was the accepted trade-off of option (a). The style samples let the user judge it early, before 33 more are drawn.
- **[`dangerouslySetInnerHTML`]** → The input is build-time files from this repo, and the test enforces the element and attribute allow-list, with no scripts, handlers, links or styles.
- **[A larger bundle]** → 36 files at up to 3 KB each, about 25 KB gzipped. That's acceptable, and it keeps draws offline-safe.

## Migration Plan

This is a static deploy, as before. Push to `main` with approval, let Actions run, then run the live checks. To roll back, revert the commit, which restores the paw. There are no data or URL changes.
