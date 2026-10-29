# Tasks

The new drawings and texts are drafted in the scratchpad first. They land in the repo together in group 3, because the art test needs exactly one drawing per deck id and would fail on a half-added deck.

## 1. Contact sheet, samples and texts (check-in with the owner)

- [x] 1.1 Build a scratchpad contact sheet that renders SVGs on their family faces at card size (140px) and 2×, in light and dark. It uses the real `.oracle-art` and card-face CSS and reads drawings from both `src/assets/oracle/animal/` and a scratchpad drafts folder. Verify it renders all 36 existing drawings with no console errors.
- [x] 1.2 Draw the samples in the scratchpad drafts folder: Hippo (`animal-44`, lavender), Octopus (`animal-43`, lavender) and Flamingo (`animal-47`, rose). Follow the existing format and style rules and the look-alike table in design.md. Verify that each passes `formatProblems` from `src/lib/art-format.ts` (run through a scratch script), and that the contact sheet shows them recognisable at card size in both schemes. Hippo goes next to Elephant, and Flamingo next to Swan.
- [x] 1.3 Draft the text for all 12 cards: three keywords, message, reflection and affirmation, with the themes from the proposal. Write them in the voice of the existing cards and save them as a scratchpad JSON in the `data/i18n/en/oracle/animal.json` shape. Verify that every field is non-empty and no animal name is on the insect list in `oracle-data.test.ts`.
- [x] 1.4 Show the owner the three samples on the contact sheet and all 12 texts. Verify the owner approves, or the requested changes are made and approved. Pause here until they approve.

## 2. The other nine drawings

- [x] 2.1 Draw Quokka (37), Hamster (38), Pangolin (39), Chameleon (40), Puffin (41), Narwhal (42), Lion (45), Giraffe (46) and Axolotl (48) in the drafts folder. Verify that each passes `formatProblems`, and that the contact sheet shows all 48 with no two alike and the design's look-alike pairs clearly distinct: Puffin/Penguin, Narwhal/Whale/Dolphin, Pangolin/Hedgehog, Chameleon/Frog/Snake, Lion/Bear, Giraffe/Horse/Goat, Quokka/Capybara and Axolotl/Frog.
- [x] 2.2 Show the owner the full 48-card contact sheet. Verify the owner approves, or changes are made and approved.

## 3. Land the deck, with its unit tests and docs

- [x] 3.1 Add the 12 entries to `data/oracle/animal.json` (ids 37 to 48, families as in design.md) and the approved texts to `data/i18n/en/oracle/animal.json`. Copy the 12 approved SVGs into `src/assets/oracle/animal/`. Verify that `oracle-art.test.ts` passes (one drawing per id, format, all distinct).
- [x] 3.2 Update `src/lib/oracle-data.test.ts`:
  - ids `animal-01` to `animal-48`
  - 48 distinct animals
  - eight cards per family
  - a test that the 12 added animals are present with their themes

  Update `src/lib/oracle.test.ts` to check the uniform draw over all 48, and fix the "six cards" comment in `src/lib/oracle.ts`. Verify that `npm test` passes, and that changing one new card's family makes the per-family test fail.
- [x] 3.3 Change the oracle "About this deck" in `data/i18n/en/guides.json` to 48 animals, update the phrase checked in `src/lib/guides.test.ts`, and change the animal oracle paragraph in `README.md` to 48. Verify that `npm test` passes and `grep -rn "36 anim" data README.md src` finds nothing.

## 4. Browser checks

- [x] 4.1 In `e2e/oracle.spec.ts`, take the deck size from the data file instead of the literal 36: in the loop condition, the "reaches all" check and the "all drawings are different" check. Raise the loop cap, and the test timeout if needed, until the fixed sequence reaches all 48. Update the comment with the draw at which all 48 appear. In `e2e/guide.spec.ts`, change `'36'` to `'48'`. Verify:
  - `npm run e2e` passes three times in a row with no flakes
  - `npm run e2e:dev` passes
  - removing one new SVG makes the oracle check fail
- [x] 4.2 Run `npm run build` and check the sizes. Verify:
  - the entry chunk is unchanged
  - `OracleScreen` grows by roughly the new drawings and text (about 13–20 kB raw)
  - the README size figures are updated if they list `OracleScreen`

## 5. Ship

- [ ] 5.1 After the owner approves the push to `main`, verify:
  - the deploy run succeeds, with unit tests and e2e passing
  - on the live site, drawing on the oracle screen in light and dark, at 1280px and 320px, shows new animals with their drawings and no console errors

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified, which syncs the animal-oracle, visual-theme and screen-instructions deltas.
- Plants are a possible later change, explored on 2026-10-28.
