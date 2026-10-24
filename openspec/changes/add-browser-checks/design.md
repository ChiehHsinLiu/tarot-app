# Design

## Context

- **The checks today:** Puppeteer scripts in the session scratchpad, run by hand with `node <name>-check.mjs <url> <shotdir> [--public]`. They drive Chrome through `puppeteer-core` and need a local Chrome install. Each one covers the scenarios of a spec or change, and `--public` skips dev-only parts.
  - The lasting ones: theme, polish, nav, flip, table, guide, share, reset, csp, oracle, lenormand, ask, oracle-ask, and same-check (the screenshot comparison).
  - The rest are one-off probes and screenshot helpers and are not carried over.
- **Techniques the checks rely on, which must be kept:**
  - **Animations finished or paused by hand:** `document.getAnimations()` is finished, or paused with its clock set, so flip timings are exact.
  - **Fixed randomness:** `crypto.getRandomValues` is replaced before the page loads, so a draw is repeatable.
  - **Mat geometry:** the mat is a `::before` pseudo-element, so its box is worked out from the grid's computed rows.
- **CI today:** `.github/workflows/deploy.yml` runs `npm ci`, `npm test` and `npm run build` on ubuntu-latest, then uploads `dist/`. Every action is pinned to a SHA, as the site-deployment spec requires.
- **The scratch scripts are lost when the session that wrote them ends.** If this change is applied in a later session, the checks are rewritten from the specs, and these notes are what's left of the techniques.

## Goals / Non-Goals

**Goals:**
- One command runs every public check locally, and CI runs the same thing before every deploy.
- Each check names the spec scenario it covers, so a failure points at a requirement.
- A refactor can still be proven pixel-identical against an earlier commit.

**Non-Goals:**
- Covering behaviour the unit tests already cover (draw fairness, share encoding, prompts).
- Cross-browser runs or stored screenshot baselines.

## Decisions

- **Playwright Test, not Puppeteer.** It brings its own Chromium (`npx playwright install chromium`), so neither CI nor a fresh clone needs Chrome. It also has a test runner with retries, traces and an HTML report.
  - Alternative: keep `puppeteer-core` and write a small runner. That means a Chrome install in CI and the runner to maintain.
- **Layout:**
  - `e2e/*.spec.ts`, one file per area, matching the current checks: `theme`, `polish`, `nav`, `flip`, `table`, `guide`, `share`, `reset`, `csp`, `oracle`, plus `dev/lenormand`, `dev/ask` and `dev/oracle-ask`.
  - Each file is one test that records its named checks as soft assertions. A failure lists every failing check by name, and each run prints how many checks it made.
  - `e2e/helpers.ts` holds the shared helpers: fixed randomness, finishing or pausing animations, mat geometry, and listening for CSP violations.
  - Vitest's `include` stays on `src/**` and `vite/**`, so the two runners never pick up each other's files.
  - The checks are untyped JavaScript ported from the scratch scripts, so `tsconfig.e2e.json` type-checks them with `strict` off.
- **Projects in `playwright.config.ts`:**

  | Project | Server | Contents | Who runs it |
  |---|---|---|---|
  | `public` | `npm run build && npm run preview` on 4173 | every check except `dev/` | `npm run e2e`, CI |
  | `dev` | `npm run dev` on 5173 | every check in its dev mode, plus `dev/lenormand` | `npm run e2e:dev` |
  | `ask` | `npm run dev` | `dev/ask`, `dev/oracle-ask` (one test at a time, since they count Claude processes and journal entries) | `ASK_CLAUDE=1 npm run e2e:dev` |

  - `public` runs each test in both palettes at 1280 and 320 wide, where the current check did. `colorScheme` and `viewport` come from the project or the test.
  - `npm run e2e` builds first, and Playwright then starts its own preview. A running preview is never reused, since it may serve an older build. A running dev server is reused.
- **`e2e:same` is a script, not a test project.** `e2e/same.ts <ref>`:
  1. builds `<ref>` in a temporary `git worktree` and previews it on 4174
  2. builds and previews the working tree on 4173
  3. screenshots the same screens on both, with randomness fixed and animations finished
  4. reports which screens differ and keeps the pairs for inspection
  5. removes the worktree when done
- **CI:**
  - After `npm run build`, CI runs `npx playwright install --with-deps chromium` and `npm run e2e`. The `public` server finds the build already done and only previews it.
  - On failure, `actions/upload-artifact` (pinned to a SHA with a version comment) uploads `playwright-report/`.
  - Retries are 1 in CI and 0 locally, so a single flaky run doesn't block a deploy but a real failure does.
- **Fonts and timing:** the checks wait for `document.fonts.ready` before measuring. Layout thresholds keep their current tolerances, so the different font rendering on Linux doesn't fail them.

## Risks / Trade-offs

- **[Risk] A check that passes on the Mac fails in CI** because of Linux font metrics or slower machines.
  → Mitigation: before relying on it, push to a branch and dispatch the workflow on that branch. The deploy job gets `if: github.ref == 'refs/heads/main'`, so a branch run only builds and checks, and never deploys. Loosen the measured tolerance where Linux differs, never the scenario.
- **[Risk] Rewriting the checks loses something they covered.**
  → Mitigation: each spec file lists the scenarios it covers. Before the old scripts are dropped, both old and new run against the same build and must agree.
- **[Trade-off] The deploy takes about a minute longer**, mostly installing Chromium. The npm cache covers the package itself.
