# Tasks

## 1. The mat

- [x] 1.1 Add the mat tokens (`--mat-bg`, `--mat-sheen`, `--mat-edge`, `--mat-label`) to `:root` in `index.css`, as in the design. Add `src/lib/mat-colors.test.ts`, which reads them from `index.css` (with `node:fs`, since Vitest stubs CSS imports) and asserts that the label colour has at least 4.5:1 contrast on both cloth colours. Verify `npm test` passes.
- [x] 1.2 Draw the mat in `index.css` with the shared cloth recipe:
  - **Stacked and `.spread-1`:** a per-slot mat on `.spread-slot::before` covering the label and card rows.
  - **Wide:** one `.spread::before` mat across the label and card rows for `.spread-3` and `.spread-2` from 720px, with subgrid slots, inside `@supports (grid-template-rows: subgrid)`.
  - **The oracle:** a mat on `.oracle-slot::before` behind the card.
  - **Around it:** the stacking order above the mat, the spacing inside it, and `--mat-label` on `.spread .position-label`.

  Take screenshots in `npm run dev`, frozen mid-flip and settled, of a three-card reading at 1280 and 375 wide, a Yes / No reading, a shared reading, an oracle card and both Lenormand spreads, in light and dark. **Show the owner for approval** before continuing. Verify `npm run build` type-checks.

## 2. The preview

- [x] 2.1 Create `src/components/SpreadPreview.tsx` as in the design: an `aria-hidden` mat with one `CardBack` and position label per position, and an empty mat when no spread is chosen. Render it in `Composer` in `App.tsx` just before the draw row. Add its styles to `index.css`: the shared cloth, a centred row that doesn't wrap, backs sized `clamp(64px, 22vw, 110px)` with no transform, a minimum height, and no transition. In `npm run dev`, verify:
  - a fresh tarot screen shows an empty mat
  - Three cards shows three labelled backs
  - switching to Yes / No shows one back
  - Lenormand Yes / No shows two backs
  - at 320px there is no horizontal scroll

  Take screenshots in light and dark and **show the owner** with the readings from 1.2, if they weren't already approved together.
- [x] 2.2 Update the README's reading paragraph to mention the green reading mat and the face-down preview on the tarot screen, and verify the wording matches the app.

## 3. Checks

- [x] 3.1 Add a scratchpad `table-check` covering each scenario in the spec delta:
  - **The reading mat:** one mat spanning the cards and labels at 1280, with the names and meanings below it; the oracle mat; the shared-reading mat.
  - **Phone:** a mat per card at 375, and no horizontal scroll at 320 in both palettes.
  - **Contrast:** the label colour against the cloth.
  - **Out of the way:** the mat and preview have no accessibility-tree nodes and nothing focusable, and the reading's accessibility-tree order is unchanged.
  - **The preview:** empty when no spread is chosen; three labelled backs for Three cards; one back after switching to Yes / No, with no running animation; two backs for Lenormand.
  - no request to another origin

  Run it against `npm run dev` and, with `--public`, against `npm run preview` (skipping Lenormand). Also re-run `flip-check`, `polish-check`, `theme-check`, `theme-fit-check`, `nav-check`, `oracle-check`, `share-check` and `lenormand-check`. Update `theme-check`'s `.position-label` contrast check to measure against the mat. Verify that everything passes with no console errors, and that `npm test` passes.
- [x] 3.2 Check by hand in Safari that the mats line up (subgrid), and that the flipping cards stay above the mat mid-flip.
- [ ] 3.3 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `table-check --public`, `flip-check --public` and `theme-check --public`.

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
