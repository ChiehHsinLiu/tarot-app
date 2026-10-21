# Design

## Context

`src/App.tsx` holds one in-memory `State`: `composing`, `revealed` (own or shared reading), or `oracle` (a card plus a saved copy of the composer so "Back" can restore it). The URL is read only for share links. `decodeReading` handles `#/r/...`, and a `hashchange` listener reacts when a link is pasted into an open tab. Any other fragment is ignored. The home page is `Composer` followed by `OracleSection`. `ReadingView` and `OracleCardView` focus their `h2` on mount. `SharePanel` builds links from `location.origin + location.pathname`, and `AskClaude` sends `encodeReading(...)`, so neither depends on the current fragment. See proposal.md for why this changes.

## Goals / Non-Goals

**Goals:**
- The URL fragment decides which screen is shown. Per-screen state lives separately in memory, so going Home and back keeps it.
- Routing is a small pure function with unit tests, with no router library.
- Share links, their encoding, the private bridge, and the journal are untouched.

**Non-Goals:**
- Putting drawn readings or oracle cards in the URL.
- Saving state across reloads (no `localStorage`).
- A visual redesign beyond the polish items listed in the proposal, such as new colours, fonts, or card art.

## Decisions

### Route from the fragment: `src/lib/route.ts`
`parseRoute(hash)` returns `'home' | 'tarot' | 'oracle' | 'share'`.
- `''`, `'#'`, `'#/'` and anything unrecognised map to `'home'`.
- `'#/tarot'` and `'#/oracle'` map to their screens.
- Anything starting with `#/r/` maps to `'share'`, which App then passes to the existing `decodeReading`.

It is pure, like `share.ts`, so it can be tested in Node. App keeps `hash` in state, initialised from `location.hash` and updated by the existing `hashchange` listener. The route is derived on each render.

*Alternative:* React Router with `HashRouter`. It adds a dependency for three fixed screens, and its route matching would have to coexist with the `#/r/v1/...?q=` share format. A 15-line parser is clearer.

### Navigation uses plain links
The home choices and the Home link are `<a href="#/tarot">`, `<a href="#/oracle">` and `<a href="#/">`. The browser pushes a history entry and fires `hashchange` by itself, which gives Back, middle-click and copy-link behaviour for free.

"Draw your own" is the one programmatic navigation. It calls `history.replaceState(null, '', pathname + search + '#/tarot')`, so Back doesn't reopen the shared reading. Because `replaceState` doesn't fire `hashchange`, it then sets `hash` in state itself.

*Alternative:* buttons with `pushState`. That reimplements what links already do, and links are the correct element for navigation.

### State split per screen
`App` replaces the single `State` with two pieces:
- `tarot: { kind: 'composing'; spreadId; question; invalidLink? } | { kind: 'revealed'; reading }`
- `oracleCardId: string | null`

These are independent of the route, so leaving a screen never clears it. This is what "Screens keep their state during a visit" needs, and it removes the `composer` copy the oracle state used to carry.

Shared readings aren't stored. When the route is `'share'`, App decodes the fragment on each render:
- A valid reading renders `ReadingView` with `shared`.
- An invalid link renders the tarot screen with an empty composer and the notice. On the initial load and on `hashchange`, App sets `tarot` to the empty composer with `invalidLink`, as it does today, and the notice clears when the user edits.

Reloading resets everything, because nothing is persisted.

### Screens and components
- **Header.** On home it is the large `<h1>Tarot</h1>`, as today. On the other screens it is a compact row with a "Home" link on the left and a smaller `<h1>Tarot</h1>`. title-page still sees exactly one `h1` "Tarot".
- **`HomeChoices`** (new; replaces `OracleSection.tsx`) shows two link cards. Each has a symbol (the tarot star from `CardFace`, the paw from `OracleCardView`), a title, and one line:
  - Tarot reading: "Ask a question and draw one or three cards."
  - Animal oracle: "Draw one animal card for a little guidance today."

  The two symbols are exported from their existing components rather than duplicated.
- **Tarot screen.** It gets a new `h2` "Tarot reading" above the composer, as the focus target, followed by the composer or `ReadingView` as now. "New reading" works as before.
- **Oracle screen.** It shows `OracleIntro` when `oracleCardId` is null: the `h2` "Today's animal oracle", the intro sentence and "Draw". This is the old `OracleSection` content, moved. Otherwise it shows `OracleCardView`, now without "Back", and still keyed by card id.
- **Focus.** Each screen's main heading has `tabIndex={-1}` and is focused on mount, extending the pattern `ReadingView` and `OracleCardView` already use. Home focuses its `h1` only when it is reached from another screen, not on the first load, so the page doesn't start with a focused heading.

### Layout polish (CSS plus two markup changes)
1. **Card columns.**
   - Remove the `reversed-label` element from `CardFace`. The rotated face, the "(reversed)" title suffix and the existing `aria-label` "…, reversed" already convey it.
   - Faces then sit at the same height in every column.
   - `.card-meaning` gets `text-align: left`. Labels, titles and keywords stay centred.
2. **Action rows.**
   - `.reading-actions` widens from 560px to 720px, so "New reading / Draw your own" (primary) and "Share", "Copy for Claude" and "Ask Claude" (secondary) fit on one line on desktop. Panels still drop below through the existing `order: 1`.
   - At 480px and below, the row becomes a single column of full-width buttons with the primary one first.
   - The oracle card view keeps "Draw again" as its only primary action.
3. **Consistency.**
   - The verdict box gets `width: 100%; max-width: 320px; box-sizing: border-box`, matching the single-card column.
   - The `.card-face.oracle-face` width override (160px) is removed, so oracle and tarot faces are both 140px.
   - The compact header uses about 24px for the `h1`.

Home choice cards use a two-column grid at 560px and up, and one column below. They have equal heights, the same border and surface tokens as `.spread-option`, and an accent border on hover and `:focus-visible`.

## Risks / Trade-offs

- **[Old bookmarks of the root URL now land on home, not the composer]** → One extra tap. Share links still open directly.
- **[Browser Back from a drawn tarot reading goes home, not to the composer]** → This is the accepted trade-off for keeping cards out of the URL. Returning to `#/tarot` still shows the reading, because state is kept.
- **[`replaceState` doesn't fire `hashchange`, so "Draw your own" could leave the old view showing]** → It updates `hash` state directly. A browser check covers it.
- **[The scratchpad browser checks assume the composer is on the root page]** → Update them to open `#/tarot` or `#/oracle` and add a navigation check. They live outside the repo, so the code doesn't change for them.
- **[StrictMode double-mounts screens, which could steal focus twice]** → Focusing is idempotent, so a second focus call is harmless.

## Migration Plan

This is a static site deploy, as before. Push to `main`, let GitHub Actions run the tests and build, then check the live site with the updated browser scripts using `--public`. To roll back, revert the commit and push again. There is no data or link-format migration: existing share links keep working.
