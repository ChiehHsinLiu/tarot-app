# Proposal

## Why

The tarot screen offers only Yes / No and Three cards (Past, Present, Future), so most questions get the same timeline reading. Two themed 3-card spreads give real variety for the two most common kinds of question, "what should I do?" and "which should I choose?". They reuse the existing three-card layout, mats, flip and share links, so no new layout is needed.

## What Changes

- Add two tarot spreads, so the spread choice lists four, in this order: Yes / No, Three cards, **Situation, Action, Outcome**, **Choice**.
  - **Situation, Action, Outcome**: 3 cards labeled Situation, Action, Outcome; question optional.
  - **Choice**: 3 cards labeled Option A, Option B, Advice; question **required**, and the question box hint asks the user to name both options (for example "Stay or move?").
- The question box hint becomes spread-specific: Choice gets its own hint; the other spreads keep today's hints.
- "Copy for Claude" (and the dev-only "Ask Claude", which uses the same prompt) gains a one-line, per-spread reading guide for the two new spreads, telling Claude how to read their positions. Prompts for Yes / No and Three cards stay exactly as they are today.
- The tarot "How it works" guide describes the two new spreads and when each needs a question.
- The new spreads are **tarot only**. The dev-only Lenormand deck keeps its two spreads; switching the deck to Lenormand while a tarot-only spread is selected clears the spread choice.
- Share links work for the new spreads with their own spread ids (`#/r/v1/situation-action-outcome/...`, `#/r/v1/choice/...`). Existing links are unchanged.

Out of scope: spreads with more than three cards (a new layout), new spreads for Lenormand, and a verdict for any spread other than Yes / No.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `tarot-spreads`: the list of spreads grows from two to four; adds position and question rules for Situation, Action, Outcome and Choice, and Choice's question hint.
- `reading-prompt`: prompts for the new spreads carry a per-spread reading guide; prompts for the existing spreads are unchanged.
- `screen-instructions`: the tarot "How it works" covers the new spreads.
- `lenormand-readings`: Lenormand offers only Yes / No and Three cards, and switching to Lenormand clears a tarot-only spread choice.

## Impact

- Data: `data/spreads.json`, `data/i18n/en/spreads.json` (names, labels, question hint, prompt guide), `data/i18n/en/guides.json`.
- Prompt: `prompts/reading.md` gains an optional `{{guidance}}` slot; `src/lib/prompt.ts` fills it.
- Code: `src/lib/deck.ts` (spread text type), `src/components/QuestionBox.tsx` (hint per spread), `src/components/Composer.tsx` (clear a spread the chosen deck lacks), `src/lib/lenormand.ts` (build only spreads Lenormand defines).
- Tests: unit (deck, prompt snapshot, share, guides, Lenormand spreads) and e2e (draw and share each new spread, Choice question rule, Lenormand deck switch).
- No new dependencies. Bundle size grows only by the new text.
