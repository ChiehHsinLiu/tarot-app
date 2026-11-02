# Tasks

## 1. Rename and descriptions in data and code

- [x] 1.1 In `data/i18n/en/spreads.json`, rename `three-card` to "Past, Present, Future" and add a `description` to all four spreads (wording in the proposal). Add `description` to `SpreadText`/`Spread` and copy it in `buildSpreads`. Verify that `npm test` passes after:
  - `deck.test.ts` expects the new name and order, and that every spread has a non-empty description
  - in `prompt.test.ts`, only the three-card snapshot is updated, and its diff is exactly the `Spread:` line
  - the pinned share links in `share.test.ts` still decode unchanged
- [x] 1.2 Make `SpreadPicker` show the description, with "Question required" on its own line below when required, instead of the card count. Verify with `npm run build`, and check by eye on the dev server that the four tarot options read as in the proposal.
- [x] 1.3 Add an optional `description` to the Lenormand spread text, set Lenormand Yes / No to "Two cards read together for a yes or no", and use it in `buildLenormandSpreads`, falling back to the tarot description. Verify with a `lenormand-data.test.ts` test that Lenormand Yes / No has its own line and Past, Present, Future has the tarot one.

## 2. Guides and docs

- [x] 2.1 Replace "Three cards" with "Past, Present, Future" in `data/i18n/en/guides.json` and `data/i18n/en/lenormand/guide.json`, rewording the sentences so they still read naturally. Update the phrases checked in `guides.test.ts` and `lenormand-guide.test.ts`. Verify that `npm test` passes and that `grep -rn "Three cards" data src` finds nothing.
- [x] 2.2 Update `README.md`: the new name, and a sentence saying the spread choice shows a short description. Verify that `grep -n "Three cards" README.md` finds nothing.

## 3. Browser checks

- [x] 3.1 Update the e2e checks that use the old name or card counts:
  - `e2e/spreads.spec.ts`: the option list now has descriptions
  - `e2e/share.spec.ts`: headings "Past, Present, Future" and "Shared reading · Past, Present, Future"
  - `e2e/nav.spec.ts`: focus check on `H2:Past, Present, Future`
  - `e2e/guide.spec.ts`: the phrases
  - `e2e/dev/lenormand.spec.ts`: details are descriptions, and the heading is "Lenormand · Past, Present, Future"

  Verify:
  - `npm run e2e` and `npm run e2e:dev` pass
  - `grep -rn "Three cards" e2e` finds only comments, if any
- [x] 3.2 Look at the composer at 320 and 1280 px in light and dark, and run `npm run e2e:same -- main`. Verify that only the composer and the three-card reading/shared headings differ, and that there's no horizontal scroll at 320 px.
- [x] 3.3 Show the owner the new spread list and a Past, Present, Future reading on the dev server. Verify the owner approves, or wording changes are made and approved.

## 4. Ship

- [ ] 4.1 After the owner approves the push to `main`, verify:
  - the deploy run succeeds with unit tests and e2e passing
  - on the live site, the spread list shows the descriptions, and an old `#/r/v1/three-card/...` link opens under "Shared reading · Past, Present, Future"

## Workflow follow-up

- Archive with `/opsx:archive`, which syncs the six deltas. The add-three-card-spreads archive, which is still uncommitted, is committed together with this change.
