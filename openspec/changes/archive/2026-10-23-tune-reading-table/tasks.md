# Tasks

## 1. Teal cloth and centred Draw

- [x] 1.1 In `src/index.css`:
  - set `--mat-bg: #1f4a4c` and `--mat-sheen: #2b5e60`
  - change the two "forest-green" comments to "teal"
  - make `.draw-row` a centred column (Draw centred, with an 8px gap)
  - centre `.draw-hint` on its own line under the button

  Update "forest-green" to "teal" in `README.md`. Verify that `npm test` passes, including the label contrast test (about 7.0:1 and 5.2:1), and that `npm run build` type-checks. Take screenshots of the tarot screen (empty, Three cards, Yes / No hint) and a three-card reading at 1280 and 320, light and dark, and **show the owner**.

## 2. Checks

- [x] 2.1 In the scratchpad `table-check`, change the expected cloth from `rgb(46, 74, 59)` to `rgb(31, 74, 76)`, and add the "Draw centred" scenario: at 1280 and 320, the centre of Draw is within 2px of the mat's centre, and the hint is below the button and centred. Run `table-check` against `npm run dev` and, with `--public`, against a fresh `npm run build` on `npm run preview`. Also re-run `theme-check`, `polish-check`, `nav-check`, `flip-check` and `lenormand-check`. Verify that everything passes with no console errors.
- [x] 2.2 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `table-check --public` and `theme-check --public`.

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
