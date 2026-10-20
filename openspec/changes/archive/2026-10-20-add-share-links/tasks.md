# Tasks

## 1. Link encoding

- [x] 1.1 Implement `encodeReading`, `decodeReading`, and `shareUrl` in `src/lib/share.ts` with no React imports; verify unit tests in `src/lib/share.test.ts` for the spec examples (`#/r/v1/three-card/swords-03.major-13r.cups-01` and `?q=Will%20it%20work%3F`), encode→decode round trips for both spreads with and without questions (including emoji and non-Latin text), and that `includeQuestion: false` never emits `q`
- [x] 1.2 Add decode rejection tests for every invalid case in the spec (wrong version, unknown spread, wrong card count, unknown card, repeated card, malformed `r` suffix, question over 300 characters) and `kind: 'none'` for empty or non-`#/r/` fragments; verify `npm test` passes
- [x] 1.3 Add a pinned-links test decoding a fixed list of v1 links to their expected readings; verify it passes and fails if a card id in `data/cards.json` is renamed (check by temporarily renaming one locally, then reverting)
- [x] 1.4 Verify `src/lib/share.ts` imports in plain Node (`node --input-type=module -e "await import('./src/lib/share.ts')"`)

## 2. Opening links

- [x] 2.1 Extend `App` state to `revealed { reading, shared }`, decode `location.hash` on mount and on `hashchange`, and show the decoded reading with `shared: true`; verify in the browser that opening a copied link in a new tab shows the same cards, orientations, meanings, and verdict, and that pasting a different link into the same tab switches readings
- [x] 2.2 Show the "This reading link isn't valid." notice above an empty composer for invalid links; verify in the browser with `#/r/v1/yes-no/major-99` and `#/r/v2/yes-no/major-01`
- [x] 2.3 Label shared readings "Shared reading · <spread name>" and replace "New reading" with "Draw your own", which removes the fragment via `history.replaceState` and shows the composer with no spread and an empty question; verify in the browser that the address bar loses the fragment and no history entry is added (Back leaves the app rather than returning to the reading)
- [x] 2.4 Confirm own draws do not change the URL; verify in the browser that the address bar is unchanged after Draw

## 3. Share UI

- [x] 3.1 Add the Share button and inline panel to `ReadingView` (read-only link field, Copy link button, `aria-live` confirmation); verify in the browser that Copy link puts the URL on the clipboard and shows "Link copied"
- [x] 3.2 Add the "Include my question" checkbox, shown only when the reading has a question and unticked each time the panel opens; verify in the browser that the link has no `q` by default, gains it when ticked, and the checkbox is absent for a question-less three-card reading
- [x] 3.3 Implement the manual-copy fallback (select the field and show a copy hint when `navigator.clipboard` is missing or rejects); verify by stubbing `navigator.clipboard.writeText` to reject in the browser console
- [x] 3.4 Check the Share panel layout at 375 px and 1280 px with no horizontal scroll, including a long question link; verify with screenshots

## 4. Integration check

- [x] 4.1 Run `npm test && npm run build && npm run preview` and, at `http://localhost:4173/tarot-app/`, draw each spread, share with and without the question, open each link in a fresh tab, and run the add-card-draw browser checks again; verify everything passes and the console has no errors
- [x] 4.2 After pushing to `main`, verify the deploy succeeds and a link copied from `https://chiehhsinliu.github.io/tarot-app/` opens the same reading in a fresh browser session

## Workflow follow-up

- Archive the change with `/opsx:archive` once the live site is verified.
