# Tasks

## 1. One Draw again on oracle cards

- [x] 1.1 Remove the `.reading-top-actions` row from `src/components/OracleCardView.tsx`, keeping the bottom "Draw again" and focus on the heading. Verify `npm test` passes and `npm run build` type-checks.
- [x] 1.2 Update `README.md`'s start-over sentence: the top and bottom buttons are for tarot, shared and Lenormand readings, and an oracle card has one **Draw again** at the bottom.

## 2. Checks

- [x] 2.1 Update the scratchpad `reset-check` so an oracle card expects no top action and exactly one "Draw again". Run `reset-check`, `oracle-check` and `nav-check` against `npm run dev`, and `reset-check --public` against `npm run preview`. Verify all pass with no console errors.
- [ ] 2.2 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `reset-check --public` and `oracle-check --public`.
