## ADDED Requirements

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
