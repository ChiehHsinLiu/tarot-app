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
