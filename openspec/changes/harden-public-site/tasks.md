# Tasks

## 1. Content Security Policy

- [x] 1.1 Add `vite/csp.ts`:
  - It exports the policy string from design.md and a `contentSecurityPolicy()` Vite plugin with `apply: 'build'`.
  - Its `transformIndexHtml` inserts `<meta http-equiv="Content-Security-Policy" content="...">` first in `<head>`.

  Register the plugin in `vite.config.ts`. Add `vite/csp.test.ts`, which asserts:
  - the exact directives
  - that the plugin applies only on build
  - that the transformed HTML has the tag before any `<script>`

  Verify with `npm test`. Also check that `npm run build` produces a `dist/index.html` containing the tag, while the dev server's page at http://localhost:5173/tarot-app/ does not.
- [x] 1.2 Add a scratchpad `csp-check.mjs` (`node csp-check.mjs <url> <shotdir> [--public]`):
  - On every screen in light and dark (home, tarot with each spread, a drawn three-card and Yes / No reading, a share link, the oracle, and the How it works panel), it records `securitypolicyviolation` events and console CSP errors and asserts there are none.
  - It asserts that an inline `<script>` injected with `document.createElement` doesn't run and reports a violation.

  Verify that it passes against a fresh `npm run build` on `npm run preview` with `--public`. Also re-run `theme-check`, `polish-check`, `nav-check`, `flip-check` and `table-check` there with `--public`, and verify they all still pass.
- [x] 1.3 Add one sentence to the README's Deployment section saying that the built page carries a Content Security Policy (build only) and that the workflow's actions are pinned to commit SHAs. Verify by reading it back.

## 2. Pinned actions

- [x] 2.1 In `.github/workflows/deploy.yml`, replace each `uses:` tag with the full commit SHA it currently points to, resolved with `gh api`, followed by a `# vN` comment. The actions are `actions/checkout@v7`, `actions/setup-node@v7`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5` and `actions/deploy-pages@v5`.

  Verify that every `uses:` line matches `@[0-9a-f]{40} # v` and that each SHA is the one `gh api repos/<action>/commits/<tag>` returns.

## 3. Live

- [ ] 3.1 After pushing to `main` (with approval), verify:
  - the deploy succeeds with the pinned actions
  - the live `index.html` has the CSP tag
  - `csp-check --public`, `theme-check --public` and `table-check --public` pass against https://chiehhsinliu.github.io/tarot-app/

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
