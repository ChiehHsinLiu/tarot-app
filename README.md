# Tarot

A tarot card drawing web app built with React, Vite, and TypeScript.

Live site: https://chiehhsinliu.github.io/tarot-app/

## Development

```sh
npm install
npm run dev       # http://localhost:5173/tarot-app/
npm run build     # type-check and build into dist/
npm run preview   # serve dist/ at http://localhost:4173/tarot-app/
```

The app is served under `/tarot-app/` because GitHub Pages hosts it as a project site. If the repository is renamed, update `base` in `vite.config.ts` to match.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages. It can also be run manually from the Actions tab.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
