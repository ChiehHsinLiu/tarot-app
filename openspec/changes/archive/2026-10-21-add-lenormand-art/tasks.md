# Tasks

## 1. Loading, safety checks and the face

- [x] 1.1 Move the drawing-format checker from `oracle-art.test.ts` to `src/lib/art-format.ts`, with `oracle-art.test.ts` importing it. Add `src/lib/lenormand-art.ts` (`LENORMAND_ART` by card id, via an eager raw glob of `src/assets/lenormand/*.svg`) and `src/lib/lenormand-art.test.ts`, which runs each present file through the checker and checks:
  - its id is a Lenormand card id
  - no two drawings are the same

  Verify that `npm test` passes, with the oracle bad-sample and per-file tests giving the same results as before.
- [x] 1.2 Update `LenormandCardFace`: the number in `.card-numeral` at the top, then `<span class="oracle-art lenormand-art" aria-hidden="true">` with the card's drawing (keeping the large-number placeholder only when a card has no file yet), then the name. Add the Lenormand palette and face rules to `Lenormand.css`. Verify in the dev app, with a temporary test drawing in scratchpad only and nothing committed:
  - the face shows the number, drawing and name
  - the accessible name is still "{number}, {name}"
  - cards without a file still show the placeholder
- [x] 1.3 Extend the scratchpad contact-sheet generator with a `--deck lenormand` mode (Lenormand face, palette and real CSS, at card size and 2×, light and dark). Verify it renders the drawings present without console errors.

- [x] 1.4 Give each Lenormand card its pastel family: add `palette` to `data/lenormand/deck.json` per the design's table, carry it onto `LenormandCard`, set the family variables on `LenormandCardFace`, drop the fixed antique palette from `Lenormand.css`, and use the family in the contact sheet. Verify:
  - a data test checks every card has one of the six families
  - `npm test` passes
  - the sample faces show their family colours in the dev app and on the contact sheet

## 2. Style samples (check-in with the owner)

- [x] 2.1 Draw `lenormand-01` (Rider), `lenormand-04` (House) and `lenormand-02` (Clover) following the design's style rules. Verify:
  - the format test passes
  - the contact sheet shows all three, recognisable at card size in both schemes
  - the owner approves the style and palette, or the requested changes are made and approved

  Pause here until the owner approves.

## 3. The remaining 33 drawings

Each task is verified when the format test passes for its files and the contact sheet shows the batch, recognisable at card size in both schemes, reviewed against the style rules.

- [x] 3.1 Cards 3 and 5–9: Ship, Tree, Clouds, Snake, Coffin, Bouquet.
- [x] 3.2 Cards 10–18: Scythe, Whip, Birds, Child, Fox, Bear, Stars, Stork, Dog.
- [x] 3.3 Cards 19–27: Tower, Garden, Mountain, Crossroads, Mice, Heart, Ring, Book, Letter.
- [x] 3.4 Cards 28–36: Gentleman, Lady, Lily, Sun, Moon, Key, Fish, Anchor, Cross.
- [x] 3.5 With all 36 present, remove the placeholder fallback (`.lenormand-number` and the no-file branch) and make the test require exactly one drawing per card. Verify:
  - `npm test` passes
  - the full contact sheet shows no two drawings alike
  - the design's look-alike groups (plants, sky, animals, people, pointed objects) are clearly distinct

## 4. Docs and checks

- [x] 4.1 Add a short paragraph to the README's "Lenormand (dev only)" section on the drawings: where they live (`src/assets/lenormand/<card-id>.svg`), and that they follow the same format rules as the animal oracle (the test in `src/lib/art-format.ts`). Verify the paths match the code.
- [x] 4.2 Extend the scratchpad `lenormand-check` so that:
  - every drawn Lenormand card shows a `.lenormand-art` drawing and no placeholder
  - the accessible name is unchanged and the drawing is hidden from assistive technology
  - drawing again with the network off after a reading still shows drawings

  Then run `npm test && npm run build`, every check against `npm run dev` (Ask Claude ones on the scratchpad journal), and the `--public` checks against `npm run preview`. Verify:
  - everything passes
  - `dist/` has no "lenormand" in any form
  - the bundle's `viewBox="0 0 100 100"` count is still 36
  - the real `~/.tarot/journal` is untouched
- [x] 4.3 After pushing to `main` (with approval), verify:
  - the deploy succeeds
  - the live bundle has no "lenormand" and still exactly 36 drawings
  - the live site passes the guide, navigation, share-link and oracle `--public` checks

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
