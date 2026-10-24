# site-deployment Specification

## Purpose

Defines how the Little Oracle web app is built and published to GitHub Pages so that the public site always reflects the latest `main` branch.

## Requirements

### Requirement: Push to main triggers deployment
Every push to the `main` branch SHALL trigger an automated workflow that builds the app and publishes it to GitHub Pages.

#### Scenario: Commit merged to main
- **WHEN** a commit is pushed to `main`
- **THEN** a GitHub Actions run starts that builds the app and, on success, deploys the build output to GitHub Pages

#### Scenario: Push to another branch
- **WHEN** a commit is pushed to a branch other than `main`
- **THEN** no deployment to GitHub Pages occurs

### Requirement: Deployment can be triggered manually
The deployment workflow SHALL be runnable on demand from the GitHub Actions UI against `main`.

#### Scenario: Manual redeploy
- **WHEN** a maintainer manually dispatches the deployment workflow
- **THEN** the app is rebuilt from `main` and redeployed to GitHub Pages

### Requirement: Failed builds do not deploy
If type-checking or building fails, the workflow SHALL fail and SHALL NOT replace the currently published site.

#### Scenario: Type error on main
- **WHEN** a commit pushed to `main` contains a TypeScript type error
- **THEN** the workflow run fails and the previously deployed site remains live

### Requirement: Site works under the project Pages path
The deployed site SHALL be served at `https://chiehhsinliu.github.io/tarot-app/` with all assets resolving under that path.

#### Scenario: Visiting the published URL
- **WHEN** a user opens `https://chiehhsinliu.github.io/tarot-app/` after a successful deployment
- **THEN** the Little Oracle home page is displayed and no asset request returns a 404

### Requirement: Concurrent deployments do not conflict
When multiple deployments are triggered in quick succession, only one SHALL publish at a time, and the latest commit SHALL end up deployed.

#### Scenario: Two quick pushes
- **WHEN** two commits are pushed to `main` before the first deployment finishes
- **THEN** the site ends up serving the build from the later commit

### Requirement: Published page restricts what it may load
The published `index.html` SHALL carry a Content Security Policy that allows scripts, styles, fonts and network requests only from the site's own origin, images only from the site's own origin or `data:` URLs, no plugins, and no `<base>` element. The policy SHALL NOT block anything the published app uses. The local dev server SHALL NOT be given this policy.

#### Scenario: Policy present on the published site
- **WHEN** the built `index.html` is inspected
- **THEN** it has a Content Security Policy meta tag with `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self'`, `object-src 'none'` and `base-uri 'none'`

#### Scenario: App works under the policy
- **WHEN** a user opens the home page, draws a tarot reading, opens a share link and draws an oracle card on the built site in either palette
- **THEN** every screen looks and behaves as before, and the browser reports no Content Security Policy violation

#### Scenario: Injected markup cannot run or load
- **WHEN** the built page tries to run an inline script or load a script from another origin
- **THEN** the browser blocks it and reports a Content Security Policy violation

#### Scenario: Dev server unaffected
- **WHEN** the app is run with `npm run dev`
- **THEN** its page has no Content Security Policy meta tag and hot reload and Ask Claude work as before

### Requirement: Deploy workflow uses pinned actions
Every third-party action in the deployment workflow SHALL be referenced by a full 40-character commit SHA rather than a tag or branch, with the version it corresponds to noted beside it.

#### Scenario: Workflow inspected
- **WHEN** `.github/workflows/deploy.yml` is inspected
- **THEN** every `uses:` reference ends in `@` followed by a 40-character hexadecimal SHA and a comment naming its version

#### Scenario: Deploy still succeeds
- **WHEN** a commit with the pinned workflow is pushed to `main`
- **THEN** the workflow builds, tests and deploys the site successfully

### Requirement: Browser checks gate deployment
The deploy workflow SHALL run the repository's browser checks against the built site, after the build and before publishing, and SHALL NOT publish if any check fails. A failed run SHALL keep a test report that can be downloaded from the workflow run.

#### Scenario: All checks pass
- **WHEN** a commit pushed to `main` builds and every browser check passes
- **THEN** the site is deployed as before

#### Scenario: A screen is broken
- **WHEN** a commit pushed to `main` builds, but a browser check fails (for example, Draw no longer shows any cards)
- **THEN** the workflow run fails, the previously deployed site remains live, and the run has a downloadable report naming the failed check

#### Scenario: Checks run locally
- **WHEN** a developer runs `npm run e2e`
- **THEN** the site is built and the same checks the workflow runs are run against it locally, with the same result
