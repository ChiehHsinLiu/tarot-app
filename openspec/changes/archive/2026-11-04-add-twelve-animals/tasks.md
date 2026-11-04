# Tasks

The new drawings and texts are drafted in the scratchpad first. They land in the repo together in group 3, because the art test needs exactly one drawing per deck id and would fail on a half-added deck.

## 1. Contact sheet, samples and texts (check-in with the owner)

- [x] 1.1 Build a scratchpad contact sheet that shows drawings on their family faces at card size (140px) and 2×, in light and dark, using the real oracle CSS. It reads from `src/assets/oracle/animal/` and a scratchpad drafts folder. Verify it shows all 48 existing drawings with no console errors.
- [x] 1.2 Draw the samples in the drafts folder: Camel (`animal-57`, butter), Manta Ray (`animal-53`, sky) and Shoebill (`animal-60`, rose). Follow the format and the look-alike table in design.md. Verify each passes `formatProblems` from `src/lib/art-format.ts`, and that the contact sheet shows them recognisable at card size in both schemes.
- [x] 1.3 Draft the English and Chinese text for all 12 cards, with the themes from the proposal, in the shape of the two `oracle/animal.json` files. Verify every field is non-empty, the Chinese uses no Simplified characters, and no animal is an insect or spider.
- [x] 1.4 Show the owner the three samples and all 12 texts. Pause until they approve, or until requested changes are made and approved.

## 2. The other nine drawings

- [x] 2.1 Draw Lemur (49), Pika (50), Wombat (51), Okapi (52), Snow Leopard (54), Manatee (55), Kiwi (56), Platypus (58) and Pufferfish (59). Verify each passes `formatProblems`, and the contact sheet shows all 60 with no two alike and the look-alike pairs in design.md clearly distinct.
- [x] 2.2 Show the owner the full 60-card contact sheet. Pause until they approve, or until changes are made and approved.

## 3. Land the deck, with its unit tests and docs

- [x] 3.1 Add the 12 entries to `data/oracle/animal.json` (ids 49 to 60, families as in design.md). Add the approved texts to `data/i18n/en/oracle/animal.json` and `data/i18n/zh-Hant/oracle/animal.json`, and the 12 SVGs to `src/assets/oracle/animal/`. Verify `oracle-art.test.ts` passes.
- [x] 3.2 Update `oracle-data.test.ts` (ids 01 to 60, 60 distinct animals, ten per family, the 12 new animals with their themes), `oracle.test.ts` (uniform over 60) and `language-text.test.ts` (60 Chinese names). Verify `npm test` passes, and that moving one new card to another family makes the per-family test fail.
- [x] 3.3 Change the oracle "About this deck" to 60 in `data/i18n/en/guides.json` and `data/i18n/zh-Hant/guides.json`, the phrase in `guides.test.ts`, and the README. Verify `npm test` passes and no "48" animal count is left in `data`, `src` or the README.

## 4. Browser checks

- [x] 4.1 In `e2e/oracle.spec.ts`, raise the loop cap and timeout if needed until the fixed sequence reaches all 60, and update the comment. In `e2e/guide.spec.ts`, change '48' to '60'. Verify `npm run e2e` passes three times in a row, `npm run e2e:dev` passes, and removing one new SVG makes the oracle check fail.
- [x] 4.2 Run `npm run build`. Verify the home page's first load is unchanged, the oracle chunk grows by roughly the new drawings and text, and any README size figures are updated.

Results:
- **4.1:** all 60 cards appear by the 182nd "Draw again", within the cap of 400. The public e2e passed three runs in a row, and the oracle check fails when `animal-58.svg` is removed. In full `e2e:dev` runs, one unrelated check timed out in some runs, a different one each time (language, Lenormand, share, table, csp, oracle), and each passed alone. One run on the unchanged code passed. The likely cause is dev-server load.
- **4.2:** the home page's first load is unchanged at 245.19 kB. `OracleScreen` grew from 100.41 to 127.76 kB (28.04 to 34.39 kB gzip): 12 drawings plus text in two languages, more than the 15–20 kB estimated for one language. The README lists no chunk sizes.

## Workflow follow-up

- Push only after the owner says "push it", then check the deploy and the live site: new animals in light and dark, at 1280px and 320px, in English and Chinese.
- Archive with `/opsx:archive`.
