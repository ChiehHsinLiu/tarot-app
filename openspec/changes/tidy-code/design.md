# Design

## Context

See proposal.md for why. The relevant facts for how:

- **`src/index.css`:** imported once from `src/main.tsx`. Its sections are already marked with comments, and media queries sit next to the rules they adjust, except for one shared `@media (max-width: 480px)` block after the flip section.
- **Lenormand stays out of the public bundle** because `App.tsx` writes `import.meta.env.DEV ? buildLenormandDeck(spreads) : null`. Vite folds this to `null` in a build and tree-shaking then drops the Lenormand data. The dev endpoint builds Lenormand unconditionally, which is fine since it only runs in dev.
- **Vitest stubs CSS imports,** so `mat-colors.test.ts` reads the stylesheet from disk.

## Goals / Non-Goals

**Goals:**
- Each file has one clear job, and finding a style or the deck setup takes one guess.
- The built CSS is identical to today's, rule for rule and in the same order.

**Non-Goals:**
- Renaming classes, reorganising rules inside a section, or tidying the styles themselves.
- CSS modules or any new tooling.
- Sharing the spread layout between the two reading views (option D, skipped by the owner).

## Decisions

- **CSS is split by cutting `index.css` into contiguous pieces, in order, at its existing section comments.** `index.css` keeps only the `@import` lines, and Vite inlines `@import`s at build time. Because every piece is a contiguous range imported in the original order, the concatenated output is the same stylesheet.
  - Alternative: group rules by topic, for example moving every 480px rule next to its component. That changes the order of rules and could change which rule wins, so it's not in a pure refactor.
  - The files under `src/styles/`, in import order:

    | File | Contents |
    |---|---|
    | `theme.css` | the tokens in both palettes and base elements: body, headings, focus |
    | `header.css` | the home title and the compact header |
    | `home.css` | home and the arched windows |
    | `composer.css` | the composer, the spread preview, the Draw row and the primary button |
    | `reading.css` | the reading layout |
    | `mat.css` | the reading mat, including the subgrid block and the centred meaning |
    | `card.css` | the card face |
    | `flip.css` | the card back, flip, reveal and reduced motion |
    | `phone.css` | the shared `max-width: 480px` block |
    | `actions.css` | notices and secondary actions |
    | `share.css` | Share and Copy for Claude |
    | `oracle.css` | the animal oracle |
    | `guide.css` | screen guides |

  - The exact cut points follow the section comments. A comment that introduces a section moves with it.
- **`src/lib/decks.ts` exports ready-built data only:** `cards`, `cardsById`, `deckIds`, `deckIdSet`, `spreads`, `oracleCards`, `oracleById` and `oracleIds`. It has no React imports, like `share.ts`, so the Vite plugin can import it under Node.
  - Lenormand is deliberately not in it. If it were exported from a shared module, the public bundle's tree-shaking would depend on Vite proving the export unused. Keeping the existing `import.meta.env.DEV` expression in `App.tsx` keeps today's guarantee.
- **`AskButtons({ claude, body })`** takes the `useClaudeStream()` result and the request body, and renders Stop while streaming, or Ask Claude / Ask again otherwise. `ClaudeAnswer` stays in each caller, because the oracle version wraps the buttons in its own `.reading-actions` row with the question box above.
- **`SiteHeader` and `Composer` move as they are.**
  - The `ComposingState` / `TarotState` types and `EMPTY_COMPOSER` that `Composer` needs move to `Composer.tsx` and are exported for `App.tsx`.
  - Both `App.tsx` and `Composer.tsx` need the Lenormand-or-null deck, so each builds it with its own inline `import.meta.env.DEV ? buildLenormandDeck(spreads) : null`. In dev that builds the deck twice, which is cheap.
  - Both alternatives were tried during apply, and both leak Lenormand into the public bundle:
    - **A prop:** the bundler can't see that it's null in a build, so the deck picker and the Lenormand code stay.
    - **A shared `dev-lenormand.ts` module:** the bundler doesn't fold a `null` imported from another module.

## Risks / Trade-offs

- **[Risk] A missed or reordered rule changes how something looks.**
  → Mitigation: before and after the split, build and compare `dist/assets/index-*.css` byte for byte. They must match exactly, apart from the file name hash. Then run every browser check.
- **[Risk] Lenormand or Ask Claude code leaks into the public bundle after the move.**
  → Mitigation: after building, verify that `dist/` contains no "lenormand", "Ask Claude" or "api/reading", and that the JS bundle is no larger than today's 349.39 kB.
- **[Trade-off] 13 small CSS files instead of one.** Each is easy to scan, but a style search now spans a folder. Editors search folders anyway.
