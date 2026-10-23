# Design

## Context

GitHub Pages can't send response headers, so a Content Security Policy can only reach the published site as a `<meta http-equiv>` tag in `index.html`. The built `index.html` is already CSP-friendly:
- It has one external module script and one stylesheet, both under `/tarot-app/assets/`.
- Its only other asset is a `data:` SVG favicon.
- The Fraunces font is bundled as same-origin `.woff2` files.

The dev server is different. Vite injects inline scripts for hot reload, and the Ask Claude panel streams from `/tarot-app/api/reading`.

The app sets custom properties such as `--flip-index` through React's `style` prop. React applies these through the CSSOM (`element.style`), which `style-src` doesn't restrict. The card drawings inserted with `innerHTML` are plain SVG, and existing tests guarantee they contain no `style` or `script`.

## Goals / Non-Goals

**Goals:**
- A policy that blocks inline and cross-origin scripts and outside requests on the public site, without breaking anything it does today.
- Deploy workflow actions that can't change under a moved tag.

**Non-Goals:**
- `frame-ancestors` or `report-uri`/`report-to`: neither works in a meta tag.
- Any CSP in dev.
- Changes to the dev endpoint.

## Decisions

- **Inject the meta tag from a build-only Vite plugin, not by hand in `index.html`.**
  - The plugin is `apply: 'build'` with `transformIndexHtml`, and it inserts the tag first in `<head>`, ahead of the module script, so the policy covers every resource.
  - Alternative: write the tag in `index.html` and loosen it for dev with `'unsafe-inline'`. That weakens the public policy just to satisfy dev.
  - Alternative: a separate HTML file for builds. That duplicates the page.
- **The policy string:**
  `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'`
  - `form-action` is left out. The composer's form never submits, since React prevents the default, and leaving `form-action` unset is harmless.
  - `'self'` covers the `/tarot-app/` path on the GitHub Pages origin.
- **Keep the policy as an exported constant next to the plugin**, in `vite/csp.ts`, so a unit test can assert its exact directives and that the plugin only applies on build.
- **Pin actions with `gh api repos/<owner>/<repo>/commits/<tag>`**, and keep the tag in a trailing comment (`uses: actions/checkout@<sha> # v7`). Dependabot and humans can still read the version.

## Risks / Trade-offs

- **[Risk] A browser blocks something the app needs** (for example an inline style from a library).
  → Mitigation: run the browser checks on the preview server with a listener for `securitypolicyviolation` events and console CSP errors on every screen, in both palettes.
- **[Risk] Pinned SHAs go stale** and miss security fixes in the actions.
  → Mitigation: update them deliberately. That's the point of pinning, and the version comments make outdated pins easy to spot.
- **[Trade-off] A meta CSP is weaker than a header:** it can't set `frame-ancestors`, so the site could still be framed. That's acceptable for a site with no logins or actions to clickjack.
