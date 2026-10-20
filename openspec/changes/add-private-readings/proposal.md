# Proposal

## Why

"Copy for Claude" makes AI readings possible but takes a copy-paste round trip. The owner wants AI-written readings inside the app, using their own Claude subscription, with no deployed server and nothing private published. Running the app locally with `npm run dev` already starts a Node process on their machine; a small dev-only bridge from that process to Claude Code (`claude -p`) gives an in-page "Ask Claude" experience that never exists on GitHub Pages.

## What Changes

- Add a Vite plugin that, only while `npm run dev` is running, serves a local endpoint which takes a reading, builds the prompt with the existing `prompts/reading.md` builder, runs Claude Code non-interactively with all tools disabled and session persistence off, and streams the reading text back.
- The endpoint accepts only the reading in share-link form and validates it with the existing strict decoder (known spread and cards, question ≤ 300 characters); it never accepts a raw prompt. It only answers requests whose `Host` and `Origin` are this machine's dev server.
- Add an **Ask Claude** button to readings, visible only in the dev build. It streams Claude's interpretation into the page, offers **Stop** while streaming (which also ends the Claude process) and **Ask again** afterwards (a new interpretation of the same cards and question).
- Clear error messages when Claude Code is not installed, not logged in, fails, or takes longer than 2 minutes.
- Each finished or stopped answer is appended to a private journal in `~/.tarot/journal/`, outside the repository.
- The production build contains no Ask Claude code and no endpoint; the public site is unchanged.

Out of scope: a page for browsing the journal, an extra "context" field for the question, choosing a Claude model, a terminal-only Claude Code skill, and any use from the deployed site or other devices.

## Capabilities

### New Capabilities
- `private-readings`: Asking the owner's local Claude Code to interpret a reading from inside the locally running app, including streaming, stopping, errors, safety limits of the local endpoint, the journal, and exclusion from the public build.

### Modified Capabilities
<!-- None. Public behavior (tarot-readings, reading-share-links, reading-prompt, site-deployment) is unchanged; the bridge reuses the share-link decoder and prompt builder as-is. -->

## Impact

- **New files**: `vite/private-readings.ts` (dev-server plugin), `vite/claude-stream.ts` (parsing Claude Code's stream-json output and classifying errors), `vite/journal.ts`, `src/components/AskClaude.tsx`, plus tests.
- **Changed files**: `vite.config.ts` (registers the plugin for `serve` only), `tsconfig.node.json` (includes the plugin), `src/components/ReadingView.tsx`, `src/index.css`, `README.md` (how to use private readings).
- **Requirements on the owner's machine**: Claude Code installed and logged in; readings use their Claude plan.
- **Privacy**: questions and answers go only to Anthropic via the owner's own Claude Code and to the local journal; nothing is written into the repository or the public site.
- **Dependencies**: none added.
