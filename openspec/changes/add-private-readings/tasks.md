# Tasks

## 1. Pure helpers

- [x] 1.1 Implement `parseLine` and `classifyFailure` in `vite/claude-stream.ts` (pure functions, no I/O); verify unit tests using fixture lines captured from `claude -p --output-format stream-json --verbose --include-partial-messages` (text deltas, non-text events ignored, success and error `result` lines, malformed lines) and classification of `ENOENT`, auth failures, and other failures
- [x] 1.2 Capture the real not-logged-in output by running `claude -p` with `CLAUDE_CONFIG_DIR` set to an empty temp directory, add it as a fixture, and verify `classifyFailure` returns `not-logged-in` for it
- [x] 1.3 Implement `appendJournal` in `vite/journal.ts` writing one JSON line per answer to `<dir>/YYYY-MM-DD.jsonl` (dir from `TAROT_JOURNAL_DIR` or `~/.tarot/journal`, created `0700`, files `0600`); verify unit tests with a temp directory for completed and stopped entries, file permissions, and that the default path is outside the repository

## 2. Dev-server bridge

- [x] 2.1 Create `vite/private-readings.ts` with an `apply: 'serve'` plugin adding middleware at `${base}api/reading`, register it in `vite.config.ts`, and add `vite/**/*.ts` to `tsconfig.node.json`; verify `npm run build` passes type-checking and the plugin is not loaded by `vite build`
- [x] 2.2 Implement the request guard (POST only; loopback `Host` on the server's port; matching `Origin`; body ≤ 8 KB; `decodeReading` must return a reading) responding `403`/`400` without spawning; verify with `curl` against `npm run dev`: wrong method, foreign `Origin`, `Host: evil.example`, raw prompt body, over-long question, and a valid fragment
- [x] 2.3 Spawn Claude Code with `--tools ""`, stream-json, partial messages, and `--no-session-persistence` in a temp `cwd`, write the built prompt to stdin, and stream NDJSON `text`/`done`/`error` events; verify with `curl -N` that text arrives incrementally and ends with exactly one `done`
- [x] 2.4 Add the 2-minute timeout and kill-on-disconnect, and journal completed and stopped answers; verify that aborting `curl` mid-stream ends the `claude` process (`pgrep -f "claude -p"` empty) and writes a `stopped` entry, and that a forced short timeout (temporary env override) yields a `timeout` error and no leftover process
- [x] 2.5 Verify error mapping end to end: `PATH` without `claude` → `not-installed`; empty `CLAUDE_CONFIG_DIR` → `not-logged-in`

## 3. Ask Claude UI

- [x] 3.1 Build `AskClaude` (Ask Claude / Stop / Ask again, NDJSON reader with `AbortController`, plain-text answer with preserved paragraphs, `aria-live` status) and render it in `.reading-actions` only when `import.meta.env.DEV`; verify in the browser on `npm run dev` that an own reading and a shared link both stream an answer
- [x] 3.2 Show the specific messages for `not-installed`, `not-logged-in`, `timeout`, `failed`, and `invalid`; verify each by triggering it as in 2.4–2.5 and checking the page text
- [x] 3.3 Style the answer panel and status; verify at 375 px and 1280 px with no horizontal scroll while streaming and after completion
- [x] 3.5 Render the answer's basic Markdown (headings, paragraphs, bullet and numbered lists, horizontal rules, bold, italics) with a pure `src/lib/markdown.ts` parser and React elements only (no raw HTML); verify unit tests for each element, unclosed markers mid-stream showing as text, and that HTML in the answer (e.g. `<img onerror>`) renders as literal text, then check a real answer in the browser
- [x] 3.4 Verify the production bundle excludes the feature: after `npm run build`, `grep` finds neither "Ask Claude" nor `api/reading` in `dist/`, and `npm run preview` shows no Ask Claude button

## 4. Docs and integration

- [x] 4.1 Add a "Private readings" section to `README.md` (requirements, `npm run dev`, where the journal lives, do not use `--host`); verify the steps work as written
- [x] 4.2 Run `npm test && npm run build`, the existing card-draw, share-link, and copy-for-claude browser checks against `npm run preview`, and an Ask Claude round trip with Stop and Ask again on `npm run dev`; verify everything passes with no console errors and journal entries for completed and stopped answers
- [ ] 4.3 After pushing to `main`, verify the deploy succeeds and the live site has no Ask Claude button or `api/reading` reference

## Workflow follow-up

- Archive the change with `/opsx:archive` once the live site is verified.
