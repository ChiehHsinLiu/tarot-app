# Tasks

## 1. The card back and the flip

- [x] 1.1 Create `src/components/CardFlip.tsx` with the night-sky back as described in the design:
  - a plum field and a gold inner frame
  - a crescent moon in the centre
  - mirror-symmetric dot and sparkle stars
  - `aria-hidden`

  Also add the `--back-bg` and `--back-gold` tokens to `index.css`. Temporarily render one back beside a card face on the tarot screen in `npm run dev`, take screenshots in light and dark, and **show the owner the back for approval** before continuing. Then remove the temporary render.
- [x] 1.2 Add the `CardFlip` wrapper and its styles to `index.css`:
  - `.card-flip` perspective
  - `.card-flip-inner` as a one-cell 3D grid
  - the back pre-rotated 180deg
  - `backface-visibility` with the `-webkit-` prefix
  - the `card-flip` keyframes from `rotateY(180deg)` to `0`, lasting 0.6s, with `fill-mode: both` and a delay of `calc(var(--flip-index) * 0.3s)`

  Verify that `npm run build` type-checks.

## 2. The reveal on each screen

- [x] 2.1 In `ReadingView.tsx`, when the reading is not shared:
  - wrap each `CardFace` in `CardFlip` with its slot index
  - give each slot the `reveal` class and `--flip-index`
  - give the verdict the fade with index 0

  Add the `reveal-fade` keyframes and the rules for the title, keywords, meaning and verdict: 0.3s, with a delay of `index * 0.3s + 0.45s`. Verify in `npm run dev`:
  - A three-card draw shows three backs that turn over in order, with each meaning appearing as its card lands.
  - A reversed card lands upside down.
  - A Yes / No verdict appears with the card.
  - A shared link has no `.card-back` and no fade.
- [x] 2.2 In `OracleCardView.tsx`, wrap `OracleCardFace` in `CardFlip` with index 0, and fade in the title, keywords, message, reflection and affirmation. Verify that a draw and each Draw again show the back and then flip.
- [x] 2.3 In `LenormandReadingView.tsx`, wrap each `LenormandCardFace` and fade its text, as in 2.1. Verify that the two-card and three-card Lenormand draws flip in order in `npm run dev`.
- [x] 2.4 Add the `@media (prefers-reduced-motion: reduce)` rule that turns off the flip and fade animations. With reduced motion emulated, verify that every card is face up and every meaning is visible as soon as a reading opens.
- [x] 2.5 Add a sentence to the README's reading section saying that drawn cards turn over one after another, that shared links open face up, and that reduced motion shows them face up at once. Verify the wording matches the app.

## 3. Checks

- [x] 3.1 Add a scratchpad `flip-check` covering each scenario in the spec deltas:
  - the same back on all three decks
  - the back hidden from the accessibility tree
  - three cards land in order, and all are face up within about 1.5s
  - a reversed card lands upside down
  - Draw again flips the new card
  - each meaning fades in after its card starts turning
  - the verdict fades in with the first card
  - focus is on the heading, and every name and meaning is in the accessibility tree during the flip
  - New reading works mid-flip
  - reduced motion: face up at once
  - a share link: face up, with no `.card-back`
  - no request to another origin

  Run it against `npm run dev` and, with `--public`, against `npm run preview` (skipping Lenormand). Also re-run `oracle-check`, `share-check`, `nav-check`, `theme-check`, `polish-check` and `lenormand-check`. Fix any checks that read card text before it fades in. Verify that everything passes with no console errors, and that `npm test` passes.
- [ ] 3.2 Check by hand in Safari that the flip shows only one side at a time, and that a reversed card lands upside down.
- [ ] 3.3 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `flip-check --public`, `share-check --public` and `oracle-check --public`.

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
