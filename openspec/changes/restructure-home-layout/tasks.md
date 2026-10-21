# Tasks

## 1. Routing logic

- [x] 1.1 Add `parseRoute(hash)` in `src/lib/route.ts`, returning `'home' | 'tarot' | 'oracle' | 'share'`. Verify unit tests cover:
  - `''`, `'#'` and `'#/'` give home
  - `'#/tarot'` and `'#/oracle'` give their screens
  - `'#/r/v1/yes-no/major-01'` and an invalid `'#/r/v2/x'` give share
  - `'#/nowhere'` and `'#/tarotx'` give home

## 2. Screens and navigation

- [x] 2.1 Split `App` state into `tarot` and `oracleCardId`, keep `hash` in state from `location.hash` and `hashchange`, and render by `parseRoute`, with shared and invalid links decoded as today. Verify in the browser:
  - `#/tarot` shows the composer with nothing selected, and `#/oracle` shows the intro
  - `#/nowhere` shows home
  - a valid share link still shows the shared reading, and an invalid one shows the notice above an empty composer
- [x] 2.2 Build `HomeChoices`, replacing `OracleSection.tsx`. It has two link cards, "Tarot reading" and "Animal oracle", with the exported star and paw symbols, and a header that is the large `h1` on home and compact with a "Home" link elsewhere. Verify in the browser:
  - home shows both choices and no spread choice, question box, draw button or card
  - choosing each opens `#/tarot` or `#/oracle`
  - browser Back returns home
  - "Home" works from tarot, oracle and a shared reading
  - there is exactly one `h1` "Tarot" on every screen, and the document title stays "Tarot"
- [x] 2.3 Move the intro into `OracleIntro` (the `h2` "Today's animal oracle", the intro line and "Draw"), and remove "Back" from `OracleCardView`. Verify in the browser:
  - Draw shows a card, and "Draw again" always gives a different card
  - going Home and back shows the same card
  - reloading `#/oracle` shows the intro again
  - the dev-only Ask Claude box still appears under the card
- [x] 2.4 Keep the tarot state across screens, and make "Draw your own" `replaceState` to `#/tarot` and set `hash` itself. Verify in the browser:
  - a chosen spread and typed question survive Home → Oracle → Home → Tarot
  - a drawn reading is still shown after going Home and back
  - drawing leaves the address at `#/tarot`
  - "Draw your own" ends at `#/tarot` with an empty composer, and browser Back doesn't reopen the shared reading
- [x] 2.5 Add the tarot screen `h2` "Tarot reading" and focus each screen's heading on mount. Home focuses its `h1` only when reached from another screen. Verify in the browser that after choosing a screen with the keyboard, `document.activeElement` is that screen's heading, and that a first load of home doesn't focus a heading.

## 3. Layout polish

- [x] 3.1 Remove the `reversed-label` element and its CSS from `CardFace`, and left-align `.card-meaning`. Verify with a three-card reading containing a reversed card at 1280px: the three card faces have the same top offset (measured with `getBoundingClientRect`), and `aria-label` still says "…, reversed".
- [x] 3.2 Rework `.reading-actions`: up to 720px wide, primary first, and a single column of full-width buttons at 480px and below. Verify with 1280px screenshots that "New reading", "Share", "Copy for Claude" and the dev-only "Ask Claude" sit on one row, that at 375px they stack with the primary first, and that the Share and Copy panels still open below the buttons.
- [x] 3.3 Make the verdict box match the 320px card column, make the oracle face 140px like tarot, and style the home choice cards (two columns at 560px and up, one below, accent border on hover and `:focus-visible`). Verify with screenshots at 375px and 1280px of home, tarot, yes/no, three-card and oracle in light and dark mode, with no horizontal scroll on any of them.
- [x] 3.4 Update `README.md`: describe the home page with its two choices and the `#/tarot` and `#/oracle` addresses, and replace "Back" in the animal oracle section with "Home". Verify the described steps match the running app.

## 4. Integration

- [x] 4.1 Update the scratchpad browser checks to start from `#/tarot` or `#/oracle` and drop the oracle "Back" step, and add a navigation check covering the app-navigation scenarios. Then run `npm test && npm run build`, every check against `npm run dev`, and the `--public` checks against `npm run preview`. Verify all pass with no console errors, and that `dist/` contains no "Ask Claude", `oracle-question` or `api/reading`.
- [ ] 4.2 After pushing to `main` (with approval), verify the deploy succeeds and that the live site passes the navigation and oracle `--public` checks and the share-link check.

## Workflow follow-up

- Archive the change with `/opsx:archive` once the live site is verified.
