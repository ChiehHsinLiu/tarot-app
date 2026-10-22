# Proposal

## Why

The owner doesn't like the round "?" button beside the screen titles. The guides should stay one tap away, but the titles should stand on their own.

## What Changes

- The "?" button beside the tarot and oracle screen headings is replaced by a small text link, **How it works**, centred under the heading, with a small chevron that turns when the panel is open.
- It opens the same panel as before, with "How it works", "About this deck", the note and **Close**. The guide text, the panel, and its behaviour don't change: it's closed whenever a screen is shown, Escape or **Close** closes it and returns focus to the link, and in dev a deck switch updates it in place.
- The accessible name stays "How it works and about this deck", which starts with the visible label.
- The README's "Using the app" describes the link instead of the "?".

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `screen-instructions`: the guide opens from a **How it works** link under the heading instead of a "?" button beside it.

## Impact

- `src/components/GuidedHeading.tsx` and the guide styles in `src/index.css`.
- `README.md`.
- The scratchpad `guide-check` wording. No data, share-link, or Claude-feature change.
