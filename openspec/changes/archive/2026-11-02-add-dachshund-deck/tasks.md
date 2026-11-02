# Tasks

## 1. Deck choice and wiring

- [x] 1.1 Add `TarotStyle = 'classic' | 'dachshund'`, rename the deck id `'tarot'` to `'classic'`, add `'dachshund'` to `DeckId`, and carry `style` in the revealed state (`tarot-state.ts`, `TarotScreens.tsx`, `App.tsx`). Draw and New reading keep the deck, and entering the screen resets it to Classic. Verify with `npx tsc -b` and `npm test`.
- [x] 1.2 Make `DeckPicker` public: Classic and Dachshund always, Lenormand only under an inline `import.meta.env.DEV`. Wire it in `Composer` so Dachshund draws a tarot reading with `style: 'dachshund'`. Update the existing dev Lenormand e2e (`e2e/dev/lenormand.spec.ts`) for the "Classic" label. Verify with `npm run e2e:dev` and a build grep showing no Lenormand text in `dist/`.
- [x] 1.3 Add `src/lib/dachshund-art.ts` (eager glob of `src/assets/dachshund/*.svg`) and a `style` prop on `CardFace`, passed by `ReadingView`. For now a missing dachshund drawing falls back to the Classic picture. Verify with a unit test that `CardFace` renders the dachshund file when present and the Classic picture otherwise.
- [x] 1.4 Share links: `encodeReading` adds `d=dachshund` before `q`. `decodeReading` returns the style, treats a missing `d` as Classic, and rejects any other `d` value as invalid. The shared view uses the decoded style. Verify with `share.test.ts` cases for the spec's Dachshund link, an older link, `?d=poodle`, and a round trip with and without a question.
- [x] 1.5 Add e2e `e2e/dachshund.spec.ts`: the public picker shows exactly Classic and Dachshund with Classic selected; New reading keeps Dachshund; Home and back resets to Classic; the copied prompt is identical for both styles; a Dachshund share link opens with the Dachshund style and "Draw your own" resets to Classic. Verify with `npm run e2e`.

## 2. Drawing tools

- [x] 2.1 Add `dachshundProblems` to `art-format.ts` (same allow-list and classes, 5 KB cap, needs `art-ink`) with unit tests for the cap and a valid sample. Verify with `npm test`.
- [x] 2.2 Add `scripts/dachshund-art/` (`shapes.ts` with the root, the parametric dachshund helper and the four suit symbols; empty `majors.ts`, `courts.ts`, `numbers.ts`; `draw.ts`) and `npm run draw:dachshund`. Verify by running it and seeing it report 0 drawings without error.
- [x] 2.3 Add a dev-only contact-sheet script that writes an HTML page to the scratchpad. It shows given card ids at mat size and at 320 px, in light and dark, upright and reversed, beside the cards already approved. Verify by generating one for an empty batch and opening it.

## 3. Drawings (each batch: draw, run `npm run draw:dachshund` and `npm test`, show the contact sheet, owner approves)

- [x] 3.1 Batch 0, style sample: The Fool, Three of Cups and Queen of Cups. The owner approves the dachshund's look before anything else is drawn.
- [x] 3.2 Batch 1: major arcana 0–10 (redraw The Fool if the style changed). Owner approves.
- [x] 3.3 Batch 2: major arcana 11–21. Owner approves.
- [x] 3.4 Batch 3: the 16 court cards. Owner approves.
- [x] 3.5 Batch 4: Ace to Ten of Wands and Cups, each with exactly its number of suit symbols, countable at 320 px. Owner approves.
- [x] 3.6 Batch 5: Ace to Ten of Swords and Pentacles, same rule. Owner approves.

## 4. Finish

- [x] 4.1 Remove the Classic fallback for missing dachshund drawings and add `dachshund-art.test.ts`: exactly one drawing per each of the 78 card ids, none extra, each passes `dachshundProblems`, and no duplicates. Verify with `npm test`.
- [x] 4.2 Add e2e checks for the Dachshund face: a drawn card shows its drawing upside down when reversed; the accessible name is only the name and orientation; offline after the screen has shown still draws with pictures; the night-sky back shows before the flip. Verify with `npm run e2e`.
- [x] 4.3 Update README (the deck choice, `npm run draw:dachshund`, the contact sheet) and record the tarot chunk size before and after from `npm run build`. Verify the home page's first-load script is unchanged in size and that `npm run e2e`, `npm run e2e:dev` and `npm test` all pass.
  Result: the TarotScreens chunk went from 130.69 KB (29.54 KB gzip) to 339.64 KB (42.60 KB gzip). The home page's first-load script went from 239.39 KB (73.68 KB gzip) to 239.60 KB (73.78 KB gzip), not unchanged: +0.2 KB from the share-link decoder, which loads with the home page to spot invalid links, now reading `d`. No drawings or card text reach it. `npm test` 637, `npm run e2e` 14 passed, `npm run e2e:dev` 14 passed and 1 skipped (as before).

## Workflow follow-up

- Push to `main` only after the owner approves the push, then verify the deploy run and check a Dachshund reading and a Dachshund share link on the live site in both palettes at desktop and phone width.
- Archive the change with `/opsx:archive`.
