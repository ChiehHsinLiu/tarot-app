# Tasks

## 1. The two windows

- [x] 1.1 Add the window format to `src/lib/art-format.ts`, as in the design: `viewBox="0 0 160 180"`, the `win-*` classes, a 6 KB cap, and both a `win-day` and a `win-night` group required. Add `src/lib/home-art.test.ts`, which checks every file in `src/assets/home/` against it, and confirm that the oracle and Lenormand art tests still pass.
- [x] 1.2 Draw `src/assets/home/window-tarot.svg`: arch, sky, fanned deck of card backs on the sill (no face, number or name), frame and mullions, with day and night groups. Draw `window-oracle.svg` the same way, with a cat sitting side-on on the sill in the oracle style. Render both in light and dark at desktop and 320px, and **show the owner the two windows for approval** before continuing.
- [x] 1.3 In `HomeChoices.tsx`, replace the line symbol with the inlined window in `span.home-window[aria-hidden=true]`, keeping the title and description as the link text. In `index.css`, add:
  - the `win-*` colours for light and dark, and the day/night switch
  - the window sizing (max 240px, same size in both columns)
  - the hover and focus recolouring of frame and sill, plus the focus outline

  Remove the tile background, border and shadow. Verify `npm test` passes and `npm run build` type-checks.

## 2. Docs and checks

- [x] 2.1 Update `README.md`'s description of the home page to mention the two illustrated windows, and verify the wording matches the app.
- [x] 2.2 Add a scratchpad `home-window-check`, covering each scenario in the spec delta:
  - both windows, their subjects, and that they are the same size
  - clicking the drawing opens the screen
  - day sky in light and night sky in dark, including a scheme change without a reload
  - screen-reader names unchanged, and the drawings hidden from assistive technology
  - keyboard focus recolours the frame and sill, shows a ring, and no transform is applied
  - 320px stacked with no horizontal scroll, in both palettes
  - no request to another origin

  Run it against `npm run dev` and, with `--public`, against `npm run preview`, together with `nav-check`, `theme-check`, `theme-fit-check` and `polish-check`. Fix any home assertions that expected the old tiles. Verify everything passes with no console errors.
- [ ] 2.3 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `home-window-check --public`, `nav-check --public` and `theme-check --public`.

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
