# Tasks

## 1. Oracle colour families (data and logic)

- [x] 1.1 Add `palette` to every card in `data/oracle/animal.json` per the design appendix, and carry it through `OracleCardData` and `buildOracleCards` as `OraclePalette`. Verify `oracle-data.test.ts` checks that every card has one of the six families, with exactly six cards each.
- [x] 1.2 Add `src/lib/palette.ts` with `ORACLE_PALETTES` (face and edge for each family) and `CARD_INK`. Verify a new `palette.test.ts` computes WCAG contrast and finds `CARD_INK` at least 4.5:1 on all six faces, and that each family's face colour is distinct.

## 2. Name and font

- [x] 2.1 Rename the site to "Little Oracle":
  - in `index.html`, the `<title>` and an inline SVG favicon
  - in `SiteHeader`, both `h1`s, plus the home subtitle "tarot & animal cards for today" and the `aria-hidden` flourish
  - in `README.md`, the title

  Verify in the browser:
  - the tab title is "Little Oracle"
  - home has exactly one `h1` "Little Oracle" with the subtitle below it
  - the tarot and oracle screens have the compact `h1` and no subtitle
  - the flourish SVG has `aria-hidden="true"` and isn't focusable
- [x] 2.2 Add `@fontsource-variable/fraunces` 5.3.0, import `soft.css` in `src/main.tsx`, and apply `--font-story` to headings, card names, choice titles, the verdict word and the affirmation. Verify in the browser:
  - `document.fonts.check('1em "Fraunces Variable"')` is true after load
  - every font request is same-origin
  - after `npm run build`, the `woff2` files are in `dist/assets/`

## 3. Theme

- [x] 3.1 Replace the light and dark tokens with the warm paper and cozy dusk palettes, add `--card-ink`, `--flourish` and the paper texture, and restyle the home choice cards, buttons, spread options, question box, verdict, share panel, Copy for Claude fallback and `AskClaude.css` through the tokens. Verify with a browser contrast check in both schemes at 375px and 1280px:
  - body, muted, keyword and button text are at least 4.5:1, and headings at least 3:1
  - there is no horizontal scroll
  - the screenshots of home, tarot, yes/no and three-card look right
- [x] 3.2 Add the storybook card frame (cream face, inner `::before` frame, corner `::after` dots) and redraw the five tarot symbols in `CardFace.tsx`. Verify in the browser:
  - The Tower shows its name, XVI and the major symbol inside the frame
  - a reversed card's whole face, frame included, is rotated, with "(reversed)" upright after the name
  - the card's accessible name is unchanged
  - the existing card-draw check passes
- [x] 3.3 Colour the oracle cards. `OracleCardFace` and `OracleCardView` set `--family-face` and `--family-edge` from `ORACLE_PALETTES`, used for the face, its frame, the paw, the Reflect tint and the affirmation rule. Verify in the browser:
  - cards from two different families have different face backgrounds
  - the animal name and theme on every family's face are at least 4.5:1 in both schemes
  - screenshots of a few families in both schemes look right

## 4. Integration

- [x] 4.1 Update the scratchpad checks that expect "Tarot" (`check.mjs`, `oracle-check.mjs`, `nav-check.mjs`), and add `theme-check.mjs` covering the visual-theme scenarios. Then run `npm test && npm run build`, every check against `npm run dev` (with the Ask Claude ones on a scratchpad journal), and the `--public` checks against `npm run preview`. Verify:
  - everything passes with no console errors
  - no request goes to another origin
  - `dist/` contains no dev-only strings
- [x] 4.2 After pushing to `main` (with approval), verify the deploy succeeds and that the live site passes the navigation, oracle `--public`, share-link and theme checks, with the tab title "Little Oracle".

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified, then plan `add-oracle-animal-art` (the 36 drawings).
