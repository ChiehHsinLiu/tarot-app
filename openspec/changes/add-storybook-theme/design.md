# Design

## Context

All styling lives in `src/index.css`, with a few `:root` tokens:
- colours: `--text`, `--muted`, `--bg`, `--surface`, `--border`, `--accent`, `--accent-text`, `--card-bg` and `--card-border`
- verdict colours: `--yes`, `--no` and `--maybe`

A `prefers-color-scheme: dark` block redefines those tokens. The dev-only `AskClaude.css` uses the same tokens.

- **Fonts:** the system UI stack, plus Georgia for card names and the affirmation.
- **Card faces** (`CardFace`, `OracleCardFace`): a `.card-face` grid with a numeral or theme, an SVG symbol and the name. The oracle face reuses the classes and shows a paw.
- **Header:** `SiteHeader` in `src/App.tsx` renders `<h1>Tarot</h1>`, large on home and compact elsewhere.
- **`index.html`:** has `<title>Tarot</title>` and an empty `data:` favicon.

See proposal.md for why this changes.

## Goals / Non-Goals

**Goals:**
- Theme by changing tokens and CSS, so components barely change and the layout from `restructure-home-layout` stays intact.
- Keep oracle colour families as data, so the animal-drawings change can reuse them.
- Make contrast checkable: family colours in a unit test, page tokens in a browser check.

**Non-Goals:**
- Animal illustrations. They come in the next change, and the paw stays for now.
- A manual light/dark toggle. The theme follows the system only.
- Animation, transitions, or card flips.
- Changing the repo name, `base: '/tarot-app/'`, or the share-link format.

## Decisions

### Palette tokens
The existing token names are kept, so every current rule picks up the theme. Two tokens are added: `--paper-texture` (a background image) and `--flourish` (the colour of the decorative lines). The starting values are below; they'll be fine-tuned during implementation within the contrast limits in the spec.

| Token | Light: warm paper | Dark: cozy dusk |
|---|---|---|
| `--bg` | `#f7f0e3` | `#241c2b` |
| `--surface` | `#fffaf1` | `#30263a` |
| `--text` | `#2f2630` | `#f5ecdf` |
| `--muted` | `#6b5e66` | `#c7b8c3` |
| `--border` | `#e3d5c1` | `#4a3d55` |
| `--accent` / `--accent-text` | `#8a4f7d` / `#ffffff` | `#e8a6c9` / `#241c2b` |
| `--card-bg` / `--card-border` | `#fffaf0` / `#c9a96e` | `#f6ecdc` / `#c9a96e` |
| `--flourish` | `#b9926a` | `#c9a96e` |

**Cards stay cream in dark mode, like real cards on a dark table.** Their text keeps a dark ink colour (`--card-ink: #2f2630`) in both modes, so a face reads the same everywhere.

*Alternative:* dark card faces in dark mode. That would need a second set of pastels for the oracle families and makes the cards look less like objects.

The paper texture is two layered, very faint `radial-gradient`s on `body`, with no image files. It is static and costs nothing to load.

### Bundled font: Fraunces "soft"
Add `@fontsource-variable/fraunces` 5.3.0 and import `@fontsource-variable/fraunces/soft.css` once in `src/main.tsx`.
- Vite copies the `woff2` files into `dist/assets/` under `/tarot-app/`, so they come from the app's own origin. The CSS splits by `unicode-range`, so English text only downloads the Latin file, about 62 KB.
- A new token, `--font-story: 'Fraunces Variable', Georgia, serif`, with `font-variation-settings: 'SOFT' 100`, applies to `h1`, `h2`, `.card-title`, `.card-name`, `.home-choice-title`, `.verdict-word` and `.oracle-affirmation`.
- Body text stays on the system stack.

*Alternatives:*
- Google Fonts: a third-party request, and it fails offline.
- A rounded sans such as Nunito: friendlier, but less storybook-like.

`font-display: swap`, the package default, means text shows at once in Georgia and swaps to Fraunces when it loads.

### Card frame without extra markup
`.card-face` gets the cream background, a 2px `--card-border` outer edge, and a rounder radius.
- `::before` draws an inner frame: a 1px `--flourish` line inset 6px.
- `::after` draws four corner dots with `radial-gradient` backgrounds.

Pseudo-elements are never announced and can't be focused, which satisfies "Decoration stays out of the way" without touching the accessible names. The reversed rotation still applies to the whole face, frame included.

### Redrawn symbols
The five symbols in `CardFace.tsx` are replaced with softer line drawings in the same 24×24 viewBox: round caps and joins, and a 1.6 stroke.
- **Major arcana:** a four-point sparkle.
- **Wands:** a budding branch.
- **Cups:** a rounded goblet.
- **Swords:** a rounded blade with a crossguard.
- **Pentacles:** a circle around a five-point star.

`TAROT_SYMBOL`, which the home choice card uses, follows automatically.

### Oracle colour families as data
- `data/oracle/animal.json` gains `"palette"` on each card. It's one of `peach`, `sage`, `sky`, `lavender`, `butter` or `rose`, and the appendix gives the mapping.
- `OracleCardData` gets `palette: OraclePalette`, and `buildOracleCards` carries it through.
- A new `src/lib/palette.ts` exports `ORACLE_PALETTES: Record<OraclePalette, { face, edge }>`, a pure module with no React.

`OracleCardFace` and `OracleCardView` set `--family-face` and `--family-edge` as inline CSS variables from it:
- The face background uses `--family-face`, and its inner frame and paw stroke use `--family-edge`.
- In the reading, the "Reflect" box and the affirmation get a faint `--family-face` tint, and a `--family-edge` rule above the affirmation.

Text colour never comes from the family: it stays `--card-ink` on faces and the page tokens elsewhere. That keeps contrast simple.

*Alternative:* colour classes in CSS, such as `.palette-peach`. That works too, but the colours couldn't be tested in Node and the next change couldn't read them from TypeScript.

Starting family colours (face / edge):

| Family | Face / edge |
|---|---|
| Peach | `#fbe1cf` / `#d98c63` |
| Sage | `#dfead3` / `#7f9d6b` |
| Sky | `#d8e8f3` / `#6c97b8` |
| Lavender | `#e6dcf2` / `#9b84c2` |
| Butter | `#f7ecc2` / `#c4a13f` |
| Rose | `#f6d9e1` / `#c97a8f` |

### Name, subtitle, flourish, favicon
- **Home header (`SiteHeader`):** `<h1>Little Oracle</h1>`, then `<p class="subtitle">tarot & animal cards for today</p>`, with a small inline SVG sprig of leaves and stars on each side of the heading. The SVG has `aria-hidden="true"` and `focusable="false"`.
- **Compact header:** "Little Oracle" at 24px, with no subtitle or flourish.
- **`index.html`:** `<title>Little Oracle</title>`, and an inline `data:image/svg+xml` favicon of a crescent moon and star in accent plum on cream. It makes no request.

*Alternative:* a favicon file in `public/`. Inline keeps it to one line and needs no request.

### Screens restyled through tokens
These pick up the theme mostly through tokens, with a few radius and shadow tweaks:
- spread options, the question box, buttons and the verdict
- the share panel and the Copy for Claude fallback
- the dev-only answer panel in `AskClaude.css`
- the home choice cards: rounder, a soft shadow, and an accent border on hover and focus

Buttons stay pill-shaped. The primary button is plum with white text in light mode, and pink with dusk text in dark mode.

### Verification
- **Unit:**
  - `oracle-data.test.ts` checks every card's `palette` is valid and that there are six of each.
  - A new `palette.test.ts` computes WCAG contrast of `--card-ink` (`#2f2630`) on each family face, requiring at least 4.5.
- **Browser (scratchpad `theme-check.mjs`):** in both colour schemes, on home, tarot, a three-card reading and an oracle card:
  - it computes the contrast of rendered text colour against the effective background for body text, muted text, keywords, buttons and headings
  - it checks that `document.fonts.check('1em "Fraunces Variable"')` is true after load
  - it records every font request and asserts it's same-origin
  - it checks that decorations have `aria-hidden` and nothing decorative is focusable
  - it checks that two drawn oracle cards from different families have different face backgrounds
  - screenshots at 375px and 1280px
- **Existing checks:** run them all, with the expected title "Tarot" changed to "Little Oracle".

## Risks / Trade-offs

- **[Pastels that are too pale disappear on cream paper]** → Each face has a `--family-edge` frame and the outer gold border, and the screenshots are reviewed in both modes.
- **[The font flashes from Georgia to Fraunces on first load]** → `swap` is the accepted trade-off for showing text immediately. Georgia is a close fallback, so the shift is small.
- **[A larger bundle]** → About 62 KB of Latin font, loaded only when text needs it. That's acceptable for a decorative identity.
- **[The scratchpad checks still expect "Tarot"]** → Update them as part of the integration task. They live outside the repo.
- **[A name change could confuse returning visitors]** → The address and share links are unchanged, and the home layout and choices are the same.

## Migration Plan

This is a static deploy as usual. Push to `main`, let Actions test and build, then run the live checks. To roll back, revert the commit. Nothing is stored, so there's no data migration. The new `palette` field is only read by the app.

## Appendix: oracle colour families

| Family | Cards |
|---|---|
| peach | Dachshund (01), Hermit Crab (09), Capybara (22), Fox (23), Golden Retriever (32), Red Panda (35) |
| sage | Sloth (03), Turtle (05), Snake (10), Hedgehog (26), Frog (28), Koala (31) |
| sky | Otter (04), Salmon (08), Dolphin (14), Penguin (21), Seahorse (33), Whale (36) |
| lavender | Owl (07), Wolf (12), Cat (16), Elephant (17), Magpie (18), Swan (19) |
| butter | Alpaca (02), Bear (11), Beaver (15), Meerkat (20), Horse (25), Goat (34) |
| rose | Hummingbird (06), Honey Badger (13), Deer (24), Flying Squirrel (27), Dove (29), Bowerbird (30) |
