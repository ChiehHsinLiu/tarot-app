# Design

## Context

The app is a single page with no router (`src/App.tsx` holds a `composing | revealed` state union). Readings are `Reading { spreadId, question, cards: { cardId, positionId, reversed }[] }` from `src/lib/draw.ts`; card and spread ids in `data/` were fixed in `add-card-draw` as a public contract for exactly this use. The site is served from GitHub Pages under `/tarot-app/`, which has no server-side routing. Requirements: `specs/reading-share-links/spec.md`.

## Goals / Non-Goals

**Goals:**
- A link format that is readable, stable, and decodable from plain Node (the future private Claude Code bridge will accept these links).
- Decoding that never trusts the link: every field is validated against the deck and spreads.

**Non-Goals:**
- A router library or path-based routes.
- Persisting readings anywhere other than the link itself.

## Decisions

**Hash fragment, not path or query string.** `/tarot-app/#/r/v1/...` works on GitHub Pages without a 404 fallback page, and the fragment is never sent to the server, so a shared question does not appear in GitHub's request logs. Alternative: path routes with a `404.html` redirect trick — rejected as fragile and it would expose questions in server requests.

**Format `#/r/v1/<spread-id>/<id>[r].<id>[r]…[?q=…]`.** Uses the existing ids rather than shorter codes, so links stay readable and need no second mapping table. A three-card link is about 60 characters before the question; a 300-character question adds at most ~2.7 KB percent-encoded (non-Latin text), well within URL limits. Positions are implied by order, matching `spread.positions`. The `r` suffix is unambiguous because every id ends in two digits. The question is `encodeURIComponent`-encoded in a `q` parameter parsed with `URLSearchParams`.

**Pure module `src/lib/share.ts`, no React:**
```ts
encodeReading(reading: Reading, opts: { includeQuestion: boolean }): string   // returns the fragment, e.g. "#/r/v1/..."
decodeReading(fragment: string, spreads: SpreadData[], cardIds: Set<string>): DecodeResult
type DecodeResult = { kind: 'none' } | { kind: 'reading'; reading: Reading } | { kind: 'invalid' }
shareUrl(fragment: string, location: { origin: string; pathname: string }): string
```
`none` means the fragment does not start with `#/r/` (normal page load). `invalid` covers every rule in the spec: version ≠ `v1`, unknown spread, card count ≠ positions, unknown or duplicate card, malformed segment, or question over 300 graphemes (reusing `countChars` from `question.ts`). Validation is strict rather than forgiving so that a corrupted link never shows a reading that differs from what was shared.

**App state marks where a revealed reading came from:** `revealed { reading, shared: boolean }`. On mount and on `hashchange`, `App` runs `decodeReading(location.hash)`: `reading` → `revealed` with `shared: true`; `invalid` → `composing` (no spread, empty question) plus a dismissible notice; `none` → leave state alone. "Draw your own" calls `history.replaceState(null, '', location.pathname + location.search)` to drop the fragment without adding a history entry, then shows the empty composer. Own draws never touch the URL.

**Share UI is an inline panel in `ReadingView`,** not a modal: a Share button toggles a panel containing the "Include my question" checkbox (rendered only if `reading.question` is non-empty, reset to unticked each time the panel opens), a read-only text field with the full URL, and a Copy link button. Copy uses `navigator.clipboard.writeText`; on rejection or absence the text field is focused and selected and a "Press Ctrl+C / ⌘C to copy" hint is shown. Confirmation text is in an `aria-live="polite"` region. Shared readings use the same panel, so a recipient can pass the link on.

**Shared-reading labeling:** the reading heading reads "Shared reading · <spread name>", and the bottom action is "Draw your own" instead of "New reading".

## Risks / Trade-offs

- [Card ids or spread ids are renamed later] → links break silently. Mitigation: a unit test pins the decoding of a fixed set of v1 links; any id change makes it fail and forces a `v2`.
- [Someone crafts a link to show an odd reading attributed to "you"] → the view is clearly labeled "Shared reading" and contains only deck text; no arbitrary content beyond the question, which is rendered as plain text (React escapes it).
- [Long links in chat apps get truncated or wrapped] → acceptable for v1; the question is opt-in, so default links stay short.
- [Clipboard API needs a secure context and user gesture] → GitHub Pages and localhost are secure; Copy runs in a click handler; manual-copy fallback covers the rest.

## Migration Plan

No data migration. Deploys with the normal push to `main`. Rollback: revert the commit; any links already shared would then just load the normal page (the fragment is ignored).
