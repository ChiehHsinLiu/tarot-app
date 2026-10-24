# Tasks

## 1. Set up

- [x] 1.1 Add `@playwright/test` as a dev dependency, pinned to an exact current version. Add `playwright.config.ts` with the `public`, `dev` and `ask` projects and servers from design.md. Add `e2e/helpers.ts` (fixed randomness, finishing or pausing animations, waiting for fonts, mat geometry, CSP violation listener). Add the `e2e`, `e2e:dev` and `e2e:same` scripts. Add `playwright-report/` and `test-results/` to `.gitignore`. Set Vitest's `include` to `src/**` and `vite/**`.

  Verify that `npm test` still runs 389 tests and that `npm run e2e` starts the preview and reports no tests yet.

## 2. Public checks

Each spec file starts with a comment listing the spec scenarios it covers. For each task, verify that the new file passes with `npm run e2e`, and that the old scratch script (if this session still has it) passes against the same build.

- [x] 2.1 `e2e/theme.spec.ts` and `e2e/polish.spec.ts`: palettes, bundled font, decoration, contrast and oracle colours (visual-theme).
- [x] 2.2 `e2e/nav.spec.ts` and `e2e/reset.spec.ts`: routes, Home links, Back/Forward, and screens starting fresh (app-navigation, tarot-readings).
- [x] 2.3 `e2e/flip.spec.ts` and `e2e/table.spec.ts`: face-down landing, flip order and timing, reduced motion, shared links face up, the reading mat and the face-down spread preview at 1280 and 320 (visual-theme, reading-share-links).
- [x] 2.4 `e2e/guide.spec.ts`, `e2e/share.spec.ts` and `e2e/oracle.spec.ts`: How it works panels, share links and Copy for Claude, oracle draw and Draw again, and no Ask Claude or Lenormand UI in the public build (screen-instructions, reading-share-links, animal-oracle, private-readings).
- [x] 2.5 `e2e/csp.spec.ts`: policy present, no violation on any screen in either palette, and injected inline and cross-origin scripts blocked (site-deployment).

## 3. Dev checks and the screenshot comparison

- [x] 3.1 `e2e/dev/lenormand.spec.ts` on the `dev` project, which also runs every shared check in its dev mode (including the CSP check's dev branch), and `e2e/dev/ask.spec.ts` and `e2e/dev/oracle-ask.spec.ts` on the `ask` project. Verify that `npm run e2e:dev` passes and skips Ask Claude, and that `ASK_CLAUDE=1 npm run e2e:dev` passes with real answers.
- [x] 3.2 `e2e/same.ts`, run by `npm run e2e:same -- <ref>`, as in design.md. Verify that `npm run e2e:same -- HEAD` on a clean tree reports every screen identical and removes its worktree, and that a deliberate one-line CSS change in the working tree is reported as a difference.

## 4. CI

- [x] 4.1 In `.github/workflows/deploy.yml`:
  - After `npm run build`, add `npx playwright install --with-deps chromium` and `npm run e2e`.
  - On failure, upload `playwright-report/` with `actions/upload-artifact`, pinned to the SHA `gh api` returns for its current major tag, with a `# vN` comment.
  - Add `if: github.ref == 'refs/heads/main'` to the deploy job.

  Verify on a branch (with approval to push it) by dispatching the workflow there: the checks pass, the deploy job is skipped, and a deliberately failing check makes the run fail and keeps its report. Then delete the branch.
- [x] 4.2 Add a README section "Browser checks" covering the three scripts, that CI runs `npm run e2e` before every deploy, and that Ask Claude checks need `ASK_CLAUDE=1`. Verify by reading it back.

## 5. Live

- [ ] 5.1 After pushing to `main` (with approval), verify that the deploy run shows the e2e step passing and the site deploys.
