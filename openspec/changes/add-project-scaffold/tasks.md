# Tasks

## 1. Project scaffold

- [x] 1.1 Scaffold a Vite `react-ts` app at the repo root without overwriting `openspec/` or `.claude/` (e.g. generate into a temp dir and copy in `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/`, `public/`); verify those files exist at the root and `openspec/` is unchanged (`git status openspec`)
- [x] 1.2 Set `"name": "tarot-app"` in `package.json`, keep the `build` script as `tsc -b && vite build`, run `npm install`, and verify `package-lock.json` is created and `node_modules/` is populated
- [x] 1.3 Add `.gitignore` covering `node_modules/`, `dist/`, `*.local`, `.DS_Store`, and editor/log files; verify `git status` does not list `node_modules/` or `dist/`

## 2. Tarot title page

- [x] 2.1 Replace the template demo in `src/App.tsx` with a component rendering a single `<h1>Tarot</h1>`, remove unused template assets/styles (logos, counter, boilerplate CSS), and keep a minimal centered style; verify `npm run build` succeeds with no unused-import errors
- [x] 2.2 Set `<title>Tarot</title>` in `index.html` (and drop the template's Vite favicon reference if the asset is removed); verify by grepping `dist/index.html` after build
- [x] 2.3 Set `base: '/tarot-app/'` in `vite.config.ts`; verify `dist/index.html` references assets under `/tarot-app/assets/`, then run `npm run preview` and confirm `http://localhost:4173/tarot-app/` shows the "Tarot" heading, tab title "Tarot", and no 404s or console errors

## 3. GitHub Pages deployment

- [x] 3.1 Create `.github/workflows/deploy.yml` triggered on `push` to `main` and `workflow_dispatch`, with permissions `contents: read`, `pages: write`, `id-token: write` and concurrency group `pages` (`cancel-in-progress: false`); verify the YAML parses (e.g. `npx --yes yaml-lint` or `python3 -c "import yaml,sys;yaml.safe_load(open(sys.argv[1]))" .github/workflows/deploy.yml`)
- [x] 3.2 Add a `build` job (checkout → `actions/setup-node` Node 22 with npm cache → `npm ci` → `npm run build` → `actions/configure-pages` → `actions/upload-pages-artifact` with `path: dist`) and a `deploy` job (`needs: build`, environment `github-pages` with `url: ${{ steps.deployment.outputs.page_url }}`, `actions/deploy-pages`); verify by reviewing that deploy only runs after a successful build
- [x] 3.3 Add a short `README.md` covering `npm install`, `npm run dev` (served at `/tarot-app/`), `npm run build`, the live URL, the one-time Pages setting, and the note that `base` must change if the repo is renamed; verify the documented commands run as written locally

## 4. Integration check

- [x] 4.1 Repo owner sets Settings → Pages → Source = "GitHub Actions" for `ChiehHsinLiu/tarot-app`; verify the setting shows "GitHub Actions"
- [ ] 4.2 Push to `main` and verify the "Deploy" workflow run succeeds (`gh run list --workflow deploy.yml`), then open `https://chiehhsinliu.github.io/tarot-app/` and confirm the "Tarot" heading, tab title, and no 404s in the network panel

## Workflow follow-up

- Archive the change with `/opsx:archive` once the live site is verified.
