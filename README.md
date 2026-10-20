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

## Private readings

When you run the app locally with `npm run dev`, each reading also has an **Ask Claude** button. It sends the reading to your own [Claude Code](https://claude.com/claude-code) on this computer and streams Claude's interpretation into the page. This feature exists only in `npm run dev`; the public site and `npm run build` don't include it.

Requirements:

- Claude Code installed and logged in. Check with `claude --version`, and run `claude` then `/login` if needed. Each reading uses your Claude plan.

Use it:

1. Run `npm run dev` and open http://localhost:5173/tarot-app/.
2. Draw a reading, or open a share link, then click **Ask Claude**. Use **Stop** to end an answer early and **Ask again** for a new interpretation of the same cards.

Claude Code runs with all tools turned off and without saving the session, from a temporary directory.

Each finished or stopped answer is saved to your private journal in `~/.tarot/journal/`, one `YYYY-MM-DD.jsonl` file per day. The journal is outside this repository and readable only by you. Set `TAROT_JOURNAL_DIR` to store it somewhere else.

Don't start the dev server with `--host`. The Ask Claude endpoint only answers requests from this computer, but there's no reason to expose it on your network.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages. It can also be run manually from the Actions tab.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
