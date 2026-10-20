# Design

## Context

The app is a static Vite + React site. Pure modules already exist for everything the bridge needs: `src/lib/share.ts` (`encodeReading` / strict `decodeReading`), `src/lib/prompt.ts` (`buildPrompt`, Node-compatible), `prompts/reading.md`, and `src/lib/deck.ts` (all import cleanly in Node 22). `vite.config.ts` registers only the React plugin; `tsconfig.node.json` type-checks only `vite.config.ts`. Claude Code 2.1.304 is installed on the owner's machine; a probe of `claude -p --tools "" --output-format stream-json --verbose --include-partial-messages --no-session-persistence` emits one JSON object per line, with text in `{"type":"stream_event","event":{"type":"content_block_delta","delta":{"type":"text_delta","text":…}}}` and a final `{"type":"result","subtype":…,"is_error":…}`. Requirements: `specs/private-readings/spec.md`.

## Goals / Non-Goals

**Goals:**
- Zero footprint in the production bundle and on GitHub Pages.
- The endpoint cannot be used as a general "run Claude" service, from another website, or from another machine.
- Reuse the exact share-link validation and prompt builder, so private and copied prompts never drift.

**Non-Goals:**
- Supporting any Claude access other than the local Claude Code CLI (no API keys).
- Journal browsing UI or analytics.

## Decisions

**Dev-only Vite plugin with `apply: 'serve'`.** `vite/private-readings.ts` exports a plugin whose `configureServer` adds middleware at `${base}api/reading` (i.e. `/tarot-app/api/reading`). `apply: 'serve'` means `vite build` never loads it. Alternative: a separate local server process — rejected (another thing to start, cross-origin calls, CORS). The client side is gated by `import.meta.env.DEV`, which Vite replaces with `false` in production so the `AskClaude` component and its import are tree-shaken; a build test greps the bundle for "Ask Claude" and `api/reading`.

**Request = share fragment; response = NDJSON stream.** The browser POSTs `{ "fragment": encodeReading(reading, { includeQuestion: true }) }`. The server runs `decodeReading` with the real spreads and card ids; anything but `kind: 'reading'` → `400`, Claude not run. Bodies over 8 KB are rejected before parsing. The response is `application/x-ndjson`, one event per line: `{type:"text",text}`, `{type:"done"}`, or `{type:"error",code,message}`, with `code ∈ not-installed | not-logged-in | timeout | failed | invalid`. NDJSON over a `fetch` body reader is simpler than SSE (no `EventSource` POST limitation) and easy to test.

**Request guard.** Before anything else: method must be `POST`; `Host` hostname must be `localhost` or `127.0.0.1` and its port must equal the server's; `Origin` must be exactly `http://<that host>`. Otherwise `403`. This blocks cross-site requests (Origin mismatch) and DNS-rebinding (Host mismatch). Vite's default `server.host` is already loopback-only; the README tells the owner not to run with `--host`.

**Spawning Claude Code.** `child_process.spawn('claude', ['-p', '--tools', '', '--output-format', 'stream-json', '--verbose', '--include-partial-messages', '--no-session-persistence'], { cwd: os.tmpdir(), stdio: ['pipe','pipe','pipe'] })`, writing the prompt to stdin then closing it. No shell, so nothing in the prompt is ever interpreted by a shell. `cwd` is a temp directory so the repo's `.claude/` settings and `CLAUDE.md` don't shape the reading. Tools are disabled, so even a successful prompt injection can only produce text.

**Stream parsing and error classification in `vite/claude-stream.ts` (pure, unit-tested).** `parseLine(line)` maps a stream-json line to `text | result | ignore`. `classifyFailure({ spawnError, exitCode, stderr, result })` returns an error code: `ENOENT` → `not-installed`; stderr/result text matching login/authentication/`/login` patterns → `not-logged-in`; otherwise `failed`. Patterns are verified during implementation by running with `CLAUDE_CONFIG_DIR` pointed at an empty temp directory.

**Lifecycle.** A 2-minute timer kills the child (`SIGTERM`, then `SIGKILL` after 3 s) and emits `timeout`. If the browser aborts (Stop, navigation), the response `close` event kills the child. Exactly one terminal event (`done` or `error`) is sent.

**Journal in `vite/journal.ts`.** Appends one JSON line per answer to `~/.tarot/journal/YYYY-MM-DD.jsonl` (local date): `{ time, link, spreadId, question, cards, answer, status: "completed" | "stopped" }`, where `link` is the share fragment. Directory created with mode `0700`, files `0600`. Overridable with `TAROT_JOURNAL_DIR` for tests. Stopped answers are written on abort with the text received so far; errors with no text are not journaled.

**Client `AskClaude` component.** States: `idle → streaming → (done | stopped | error)`. Uses `fetch` with an `AbortController`; reads the body with a `TextDecoder` and splits on newlines. Buttons: "Ask Claude" (idle), "Stop" (streaming), "Ask again" (done/stopped/error). Answer text is rendered as plain text with preserved paragraphs (React escaping; no Markdown/HTML rendering) inside an `aria-live="polite"` region; a status line shows "Claude is writing…", "Stopped", or the error message. It sits in `.reading-actions` after "Copy for Claude"; output appears below the actions like the other panels.

## Risks / Trade-offs

- [Claude Code's stream-json format changes in a future version] → parsing is isolated in `claude-stream.ts` with fixtures from the probed format; unknown lines are ignored, and a missing `result` still ends cleanly via process exit.
- [Auth error wording changes] → falls back to a generic `failed` message that includes Claude Code's own error text.
- [Owner runs `vite --host`] → Host/Origin guard still rejects non-loopback hosts; README warns against it.
- [Readings use the owner's plan quota] → button, not automatic; Stop ends the process immediately.
- [Journal holds sensitive questions] → stored only in the owner's home directory with owner-only permissions, never in the repo.

## Migration Plan

No data migration. Nothing changes on the deployed site. Rollback: revert the commit; `npm run dev` returns to the public behavior.
