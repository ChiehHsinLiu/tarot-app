# Proposal

## Why

A security review of the app found no vulnerabilities:
- `npm audit` is clean.
- The public build contains no dev-only code.
- Share links are strictly checked.
- No user or Claude text is ever inserted as HTML.

The public site still has two gaps that would matter if something else went wrong:
- **No Content Security Policy.** A future bug that let markup in could load or run anything.
- **Actions pinned by tag.** The deploy workflow uses movable tags (for example `actions/checkout@v7`), so a hijacked action tag could change what gets published.

## What Changes

- **A Content Security Policy for the public site:**
  - The built `index.html` gets a `<meta http-equiv="Content-Security-Policy">` that allows scripts, styles, fonts and requests only from the site itself, and images from the site or `data:` URLs (the favicon).
  - It also forbids plugins (`object-src 'none'`) and `<base>` changes (`base-uri 'none'`).
  - It is added only to `npm run build` output. The dev server needs inline scripts for hot reload, so `npm run dev` stays without it.
- **Pinned workflow actions:** each action in `.github/workflows/deploy.yml` is pinned to a full commit SHA, with its version tag kept in a comment.
- **Not in scope:**
  - A limit on simultaneous Ask Claude answers. Only the local app can call that endpoint, so it isn't worth the code.
  - Changing the dev endpoint itself, which already checks Host and Origin, limits body size, rebuilds readings server-side and runs Claude with tools off.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-deployment`: adds a requirement that the published page carries a restrictive Content Security Policy, and a requirement that the deploy workflow uses actions pinned to commit SHAs.

## Impact

- `vite.config.ts`: a small build-only plugin that adds the CSP meta tag to `index.html`.
- `.github/workflows/deploy.yml`: action references change from tags to SHAs.
- README: one sentence under Deployment about the CSP and pinned actions.
- No change to app code, the dev endpoint or the look of the site.
