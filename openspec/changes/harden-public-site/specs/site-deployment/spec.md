## ADDED Requirements

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
