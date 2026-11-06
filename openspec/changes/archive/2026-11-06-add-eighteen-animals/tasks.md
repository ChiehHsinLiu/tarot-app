# Tasks

The new drawings and texts are drafted in the scratchpad first. They land in the repo together in group 3, because the art test needs exactly one drawing per deck id and would fail on a half-added deck.

## 1. Contact sheet, samples and texts (check-in with the owner)

- [x] 1.1 Build a scratchpad contact sheet that shows drawings on their family faces at card size (140px) and 2×, in light and dark, using the real oracle CSS. It reads from `src/assets/oracle/animal/` and a scratchpad drafts folder. Verify it shows all 60 existing drawings with no console errors.
- [x] 1.2 Draw the samples in the drafts folder: Unicorn (`animal-75`, rose), Tanuki (`animal-66`, butter), Harp Seal (`animal-71`, sky) and Komainu (`animal-72`, sky). Follow the format and the look-alike table in design.md. Verify each passes `formatProblems` from `src/lib/art-format.ts`, and that the contact sheet shows them recognisable and cute at card size in both schemes.
- [x] 1.3 Draft the English and Chinese text for all 18 cards, with the themes from the proposal and the names from design.md, in the shape of the two `oracle/animal.json` files. Verify every field is non-empty, the Chinese uses no Simplified characters, and no animal is an insect or spider.
- [x] 1.4 Show the owner the four samples and all 18 texts, including the themes and Chinese names. Pause until they approve, or until requested changes are made and approved.

## 2. The other 14 drawings

- [x] 2.1 Draw Binturong (61), Orangutan (62), Phoenix (63), Yak (64), Griffin (65), Tapir (67), Tree Kangaroo (68), Tsuchinoko (69), Jellyfish (70), Kookaburra (73), Crane (74), Bat (76), Raccoon (77) and Kitsune (78). Verify each passes `formatProblems`, and the contact sheet shows all 78 with no two alike and the look-alike pairs in design.md clearly distinct.
- [x] 2.2 Show the owner the full 78-card contact sheet. Pause until they approve, or until changes are made and approved.

## 3. Land the deck, with its unit tests and docs

- [x] 3.1 Add the 18 entries to `data/oracle/animal.json` (ids 61 to 78, families as in design.md). Add the approved texts to `data/i18n/en/oracle/animal.json` and `data/i18n/zh-Hant/oracle/animal.json`, and the 18 SVGs to `src/assets/oracle/animal/`. Verify `oracle-art.test.ts` passes.
- [x] 3.2 Update `oracle-data.test.ts` (ids 01 to 78, 78 distinct animals, 13 per family, the 18 new animals with their themes), `oracle.test.ts` (uniform over 78, computed critical values for 77 and 76 degrees of freedom, larger sample sizes to match) and `language-text.test.ts` (78 Chinese names). Verify `npm test` passes, and that moving one new card to another family makes the per-family test fail.
- [x] 3.3 Change the oracle "About this deck" to 78 real and legendary animals in `data/i18n/en/guides.json` and `data/i18n/zh-Hant/guides.json`, the phrase in `guides.test.ts`, and the README. Verify `npm test` passes and no "60" animal count is left in `data`, `src` or the README.

## 4. Browser checks

- [x] 4.1 In `e2e/oracle.spec.ts`, raise the loop cap and timeout if needed until the fixed sequence reaches all 78, and update the comment. In `e2e/guide.spec.ts`, change '60' to '78'. Verify `npm run e2e` passes three times in a row, `npm run e2e:dev` passes (recording any unrelated single-test timeouts), and removing one new SVG makes the oracle check fail.
- [x] 4.2 Run `npm run build`. Verify the home page's first load is unchanged and the oracle chunk grows by roughly the new drawings and text.

Results:
- **4.1:** all 78 cards appear by the 336th "Draw again", within the cap of 400, so the cap and timeout didn't need raising. The public e2e passed three runs in a row and `e2e:dev` passed its full run (16 of 16). The oracle check fails when `animal-71.svg` is removed.
- **4.2:** the home page's first load is unchanged at 245.19 kB. `OracleScreen` grew from 127.76 to 169.44 kB (34.39 to 43.50 kB gzip), in line with the estimate of about 40 kB.

## Workflow follow-up

- Push only after the owner says "push it", then check the deploy and the live site: new animals in light and dark, at 1280px and 320px, in English and Chinese.
- Archive with `/opsx:archive`.
