# Proposal

## Why

The owner noticed two "Draw again" buttons on an oracle card reading. The top copy was added so long readings could be restarted without scrolling, but an oracle reading is one card and short enough that both buttons show at once, which looks like a duplicate.

## What Changes

- An oracle card reading shows "Draw again" only at the bottom, as before the top actions arrived.
- Tarot readings ("New reading"), shared readings ("Draw your own") and Lenormand readings ("New reading") keep their button at both the top and the bottom.
- The README's description of the start-over buttons says this.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-navigation`: "Start over from the top of a reading" no longer covers oracle cards. It is replaced by "Start over from the top of a longer reading", which lists tarot, shared and Lenormand readings and says an oracle card has only its bottom "Draw again".

## Impact

- `src/components/OracleCardView.tsx`: remove the top action row.
- `README.md`.
- The scratchpad `reset-check` oracle assertions. No data, route or spec change for the oracle itself: "Draw again and going home" still holds.
