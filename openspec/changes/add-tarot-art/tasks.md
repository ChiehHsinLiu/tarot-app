# Tasks

Requires `add-browser-checks` and `load-screens-on-demand` to be applied first. Every task is verified with `npm test` and `npm run e2e`, plus `npm run e2e:dev` where Lenormand could be affected.

## 1. Colours and number cards

- [x] 1.1 Add `TAROT_PALETTES` to `palette.ts` with the values from design.md. Add the `palette.test.ts` cases: at least 3:1 on `#fffaf0` and `#f6ecdc`, and five distinct edges. Make `CardFace` set `--face-edge` from the card's family.

  Verify that the tests pass, and that the frame of each suit's card is its family colour on the reading mat in both palettes.
- [x] 1.2 Add `src/lib/pips.ts` and `pips.test.ts` as in design.md. Render number cards' pips in `CardFace` and add the pip box size to `styles/card.css`. Make a contact sheet of all 40 number cards in both palettes, at 1280 and 320 wide.

  Verify that the tests pass, then show the sheet to the owner and adjust on request.

## 2. Court cards

- [x] 2.1 Add `src/lib/tarot-art.ts`, `tarot-art.test.ts` and the `.tarot-art .art-*` rules. While drawings are still missing, the test asserts only the format and that there's no file for a card that doesn't exist. The "exactly one per card" assertion is switched on in 3.2. Render a card's drawing in `CardFace` when one exists, otherwise its current symbol.

  Verify with `npm test`.
- [x] 2.2 Draw the 16 court cards (`<suit>-11` to `<suit>-14`) following the per-rank pattern in design.md. Make a contact sheet of the 16 in both palettes at full size and at 320px wide, upright and reversed.

  Verify that `tarot-art.test.ts` passes, then show the sheet to the owner and redraw on request.

## 3. Major cards

- [x] 3.1 Draw `major-00` to `major-10`, then make a contact sheet as in 2.2 and get the owner's review.
- [x] 3.2 Draw `major-11` to `major-21`, and make the contact sheet and get the owner's review. Switch on the "exactly one drawing per major and court card" assertion. Remove the major sparkle from `SYMBOLS` and the symbol fallback from `CardFace`.

  Verify that every unit test passes.

## 4. Checks and docs

- [x] 4.1 Add `e2e/tarot-art.spec.ts` covering the tarot-deck and visual-theme scenarios:
  - pip counts for the Ace, Three and Ten of each suit
  - same arrangement for two suits
  - a court and a major drawing present
  - three suits giving three frame colours
  - accessible names unchanged, upright and reversed
  - pictures inside the frame and pips at least 9px wide at 320 wide
  - drawing offline after the screen has shown

  Add a tarot drawing marker to `e2e/split.spec.ts`'s entry chunk check.

  Verify that `npm run e2e` passes, and that `npm run e2e:dev` passes (the Lenormand faces are unchanged).
- [x] 4.2 In the README, describe the tarot faces under Using the app. Add a "Tarot art" section like the animal oracle's, covering:
  - where the files live
  - the format
  - the colour families
  - that number cards are laid out by code in `src/lib/pips.ts`

  Record the tarot chunk's size before and after. Verify by reading it back.

## 5. Live

- [ ] 5.1 After pushing to `main` (with approval), verify that the deploy's checks pass, then check a Yes / No and a three-card reading on the live site in both palettes at desktop and phone width. The owner checks in Safari.
