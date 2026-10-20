# Proposal

## Why

The public site gives written meanings only; it has no AI and must stay a static GitHub Pages site. A "Copy for Claude" button lets any visitor take a reading to their own Claude (claude.ai, the desktop app, or Claude Code) for a personal interpretation, at no cost or risk to the site. The prompt it builds is also the shared template the planned private Claude Code bridge will send, so readings are phrased the same way everywhere.

## What Changes

- Add a prompt template file `prompts/reading.md` and a pure prompt builder that turns a reading into a self-contained prompt: spread, question, and for each card its position, name, orientation, keywords, and written meaning; for Yes / No readings, the written verdict and note with an instruction to explain rather than contradict it.
- The question is placed in a clearly delimited block and labeled as the subject of the reading, not instructions, so text typed into the question box is treated as data.
- Add a **Copy for Claude** action next to **Share** on every shown reading (own and shared). It copies the prompt to the clipboard and confirms "Prompt copied"; if the clipboard is unavailable it shows the prompt in a selected text area for manual copying.
- The prompt includes the reading's question whenever the reading has one (copying goes to the user's own clipboard, unlike a share link). A shared reading's prompt includes the question only if the link carried it.

Out of scope: opening claude.ai automatically or pre-filling a chat, any network call to an AI service, the private `npm run dev` Claude bridge, and editing the prompt in the page.

## Capabilities

### New Capabilities
- `reading-prompt`: Turning a reading into a prompt for Claude, what the prompt must contain, and how a user copies it.

### Modified Capabilities
<!-- None. Existing reading, spread, deck, and share-link requirements are unchanged; the new action sits alongside Share. -->

## Impact

- **New files**: `prompts/reading.md` (template), `src/lib/prompt.ts` and `src/lib/prompt.test.ts` (pure builder, no React), `src/components/CopyForClaude.tsx`.
- **Changed files**: `src/components/ReadingView.tsx` (adds the action), `src/index.css`.
- **Privacy**: nothing leaves the browser; the prompt goes only to the user's clipboard.
- **Dependencies**: none added.
