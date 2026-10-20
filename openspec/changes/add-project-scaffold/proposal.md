# Proposal

## Why

The repository contains only OpenSpec scaffolding — there is no application yet. We need a minimal, working web app and a hands-off deployment path so every later feature lands on a live, publicly reachable site as soon as it is merged to `main`.

## What Changes

- Add a React + Vite + TypeScript single-page app at the repository root (`package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/`).
- The app renders a title page whose main heading reads "Tarot", and the browser tab title is "Tarot".
- Configure Vite's `base` so built asset URLs resolve under the GitHub Pages project path (`https://chiehhsinliu.github.io/tarot-app/`).
- Add a GitHub Actions workflow that, on every push to `main` (and on manual dispatch), installs dependencies, type-checks and builds the app, and publishes `dist/` to GitHub Pages using the official Pages actions.
- Add `.gitignore` for `node_modules/`, `dist/`, and similar build output.

Out of scope: routing, tarot card content or logic, styling beyond a basic centered title, tests framework setup, custom domain.

## Capabilities

### New Capabilities
- `title-page`: The landing page users see when they open the app — what it displays and how the document is titled.
- `site-deployment`: How the app is built and published to GitHub Pages, including triggers and the public URL path it must work under.

### Modified Capabilities
<!-- None: no existing specs. -->

## Impact

- **New code**: entire frontend scaffold at the repo root; `.github/workflows/deploy.yml`.
- **Dependencies**: `react`, `react-dom`; dev: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`. Lockfile `package-lock.json` committed (npm).
- **External systems**: GitHub Pages must be enabled for the repository with source set to "GitHub Actions" (one-time manual repo setting by the owner).
