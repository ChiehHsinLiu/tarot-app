# Design

## Context

The repo is empty apart from OpenSpec files (`openspec/`, `.claude/`). The GitHub remote is `ChiehHsinLiu/tarot-app`, so GitHub Pages serves it as a *project* site under the `/tarot-app/` sub-path rather than at a domain root. Local toolchain: Node 22, npm 10. Requirements are in `specs/title-page/spec.md` and `specs/site-deployment/spec.md`.

## Goals / Non-Goals

**Goals:**
- Smallest conventional Vite React-TS layout, so future features drop in without restructuring.
- Deploy pipeline that needs no secrets or personal tokens.

**Non-Goals:**
- Lint/format tooling (ESLint, Prettier) and a test runner — can be added in later changes.
- Client-side routing and the SPA 404 fallback it would require on Pages.
- PR preview deployments.

## Decisions

**App lives at the repo root, scaffolded from the `react-ts` Vite template, then trimmed.**
Root placement keeps scripts and the workflow simple (no `working-directory`). The template's demo content (counter, logos, `App.css` boilerplate) is removed, leaving an `App` that renders `<h1>Tarot</h1>` and `index.html` with `<title>Tarot</title>`. Alternative: a hand-written minimal setup — rejected; the template's tsconfig split (`tsconfig.app.json` / `tsconfig.node.json`) is the maintained default and less error-prone.

**`base: '/tarot-app/'` hard-coded in `vite.config.ts`.**
Required for asset URLs on a project Pages site. Alternatives: an env var (`VITE_BASE`) or `base: './'` — relative base breaks once routing is added, and an env var adds indirection with no second deploy target today. Trade-off: `npm run dev` serves at `http://localhost:5173/tarot-app/`, which is acceptable.

**Official Pages actions: `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`.**
Workflow `.github/workflows/deploy.yml` with two jobs: `build` (checkout → `actions/setup-node` with Node 22 and npm cache → `npm ci` → `npm run build` → upload `dist/`) and `deploy` (needs `build`, environment `github-pages`). Permissions: `contents: read`, `pages: write`, `id-token: write`. Triggers: `push` on `main` and `workflow_dispatch`. Alternative: `peaceiris/actions-gh-pages` pushing to a `gh-pages` branch — rejected; it needs write access to contents and leaves a build branch in the repo history.

**Build script runs `tsc -b && vite build`** (the template default), so type errors fail the build and therefore the deploy, satisfying "Failed builds do not deploy".

**Concurrency group `pages` with `cancel-in-progress: false`.**
Queues rather than cancels an in-flight deployment, matching GitHub's recommended Pages setup; the newest run still deploys last.

**npm with committed `package-lock.json`**, enabling `npm ci` for reproducible CI installs.

## Risks / Trade-offs

- [Pages not enabled, or source set to "Deploy from a branch"] → the `deploy` job fails. Mitigation: a task for the repo owner to set Settings → Pages → Source = "GitHub Actions"; `configure-pages` surfaces a clear error otherwise.
- [Repo renamed] → hard-coded `base` breaks asset paths. Mitigation: single place to update in `vite.config.ts`; noted in README.
- [Template versions drift] → scaffold output may differ slightly from this description. Mitigation: tasks specify the end state (files/content), not exact template output.

## Migration Plan

Greenfield — no migration. Rollback: revert the commit on `main`; the next workflow run republishes the prior state, or disable Pages in repo settings.
