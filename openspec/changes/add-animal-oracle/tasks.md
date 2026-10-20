# Tasks

## 1. Deck data and pure logic

- [ ] 1.1 Add `data/oracle/animal.json` (ids `animal-01`…`animal-36`) and `data/i18n/en/oracle/animal.json` from the design appendix; verify a data test checks 36 cards, distinct ids and animals, non-empty animal/theme/keywords/message/reflection/affirmation, the presence of Dachshund, Alpaca, Honey Badger, Flying Squirrel and Magpie, and that no animal is in an insect/spider list
- [ ] 1.2 Implement `buildOracleCards` and `drawOracle(ids, rng, excludeId?)` in `src/lib/oracle.ts`; verify unit tests with `seededRandomInt` for the join, that `excludeId` is never returned, and a fairness test showing all 36 (and the other 35 with an exclusion) are drawn roughly uniformly
- [ ] 1.3 Write `prompts/oracle.md` and `buildOraclePrompt` (single-pass `{{card}}`/`{{question}}`, missing-placeholder error, `escapeQuestion`, empty-question wording); verify unit tests and snapshots for an empty question, a question, and a question containing `</question>`

## 2. Public oracle UI

- [ ] 2.1 Add `OracleSection` below the tarot composer and the `oracle` state in `src/App.tsx` (stores and restores the composer state); verify in the browser that "Today's animal oracle" and an enabled "Draw" show on load, tarot drawing still works, and "Back" restores a chosen spread and typed question
- [ ] 2.2 Build `OracleCardFace` and `OracleCardView` (animal and theme on the face, keywords, message, "Reflect", affirmation, "Draw again", "Back", heading focus, keyed by card id) with styles in `src/index.css`; verify in the browser that a draw shows all fields, "Draw again" always shows a different card, and there's no horizontal scroll at 375 px and 1280 px
- [ ] 2.3 Verify the public build: `npm run build` passes, and `npm run preview` shows the oracle with no "Ask Claude" or question box, with `grep` finding neither "Ask Claude", `oracle-question`, nor `api/reading` in `dist/`

## 3. Private oracle readings

- [ ] 3.1 Move the streaming client out of `AskClaude.tsx` into `useClaudeStream` and a `ClaudeAnswer` panel with no behaviour change; verify by re-running `ask-check.mjs` and `error-check.mjs` against `npm run dev` unchanged
- [ ] 3.2 Accept `{ oracle: { cardId, question } }` in `vite/private-readings.ts` (exactly one of `fragment`/`oracle`, known `animal-` id, question a string of ≤ 300 characters), built with `prompts/oracle.md`; verify with `curl`: unknown id, missing or non-string question, 301-character question and both keys at once get 400 without spawning; a valid request streams text and ends with `done`
- [ ] 3.3 Journal oracle answers as `{ time, deck: "animal", cardId, question, answer, status }`, keeping tarot entries byte-identical in shape; verify `journal.test.ts` covers both entry kinds with a temp `TAROT_JOURNAL_DIR`
- [ ] 3.4 Build `AskClaudeOracle` (question box `oracle-question` with live count, disabled while streaming, Ask Claude / Stop / Ask again) and lazy-load it behind `import.meta.env.DEV` in `OracleCardView`; verify in the browser on `npm run dev` (journal in the scratchpad) an empty-box answer, a "What should I focus on today?" answer, Stop, Ask again with an edited question, and that "Draw again" clears the box and answer
- [ ] 3.5 Update `README.md` (the animal oracle, and that Ask Claude with a question works on oracle cards in dev); verify the steps work as written

## 4. Integration

- [ ] 4.1 Run `npm test && npm run build`, the existing card-draw, share-link, copy-for-claude and Ask Claude browser checks, plus the new oracle checks; verify all pass with no console errors
- [ ] 4.2 After pushing to `main`, verify the deploy succeeds, the live site shows the animal oracle, and it has no Ask Claude or `api/reading` reference

## Workflow follow-up

- Archive the change with `/opsx:archive` once the live site is verified.