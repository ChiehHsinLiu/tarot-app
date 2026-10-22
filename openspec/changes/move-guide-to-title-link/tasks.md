# Tasks

## 1. Link under the title

- [x] 1.1 In `src/components/GuidedHeading.tsx`, move the toggle out of the heading row to sit centred under the heading, with the visible text "How it works" and an `aria-hidden` chevron, keeping `aria-expanded`, `aria-controls`, the accessible name, Escape and "Close". Replace the round `.guide-toggle` styles with a small accent-coloured text link (underline on hover, focus ring, chevron turning when open) and drop `.heading-row`. Verify `npm test` passes, `npm run build` type-checks, and both start screens show the link under the heading in light and dark at 320px and desktop.

## 2. Docs and checks

- [x] 2.1 Update `README.md`'s "Using the app" to describe the **How it works** link under each heading instead of the "?".
- [x] 2.2 Update the scratchpad `guide-check` for the link (under the heading, nothing beside it) and run it against `npm run dev` and, with `--public`, against `npm run preview`, plus `reset-check`, `nav-check` and `lenormand-check` in dev. Verify everything passes with no console errors.
- [ ] 2.3 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes `guide-check --public`.
