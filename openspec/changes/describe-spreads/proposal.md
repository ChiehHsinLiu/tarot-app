# Proposal

## Why

The spread choice says only how many cards each spread draws, and three of the four spreads draw 3 cards, so "3 cards" doesn't help anyone choose. The owner also found "Three cards" unclear next to "Situation, Action, Outcome": both draw three cards, and only the positions differ. Naming that spread after its positions, and giving every spread a short line about what it's for, makes the choice clear at a glance.

## What Changes

- Rename the "Three cards" spread to **"Past, Present, Future"**, in the same style as "Situation, Action, Outcome". Its spread id stays `three-card`, so existing share links keep working. The new name shows everywhere the spread name does: the spread choice, the reading heading, the shared heading, the Copy for Claude prompt, the guides, and the dev-only Lenormand screen.
- In the spread choice, replace the card count under each spread name with a short description of what the spread is for. When a question is required, "Question required" is shown on its own line below the description (the owner chose this after a "·" was left dangling when the line wrapped on a phone):
  - Yes / No: "One card for a clear yes or no"
  - Past, Present, Future: "How things are unfolding"
  - Situation, Action, Outcome: "What to do, and where it leads"
  - Choice: "Choose between A and B, with advice"
- In the dev-only Lenormand deck, Yes / No gets its own description, "Two cards read together for a yes or no". Past, Present, Future uses the tarot line.
- The tarot and Lenormand "How it works" guides use the new name.

Out of scope: changing any spread's positions, rules or prompt guide; adding or removing spreads.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `tarot-spreads`: "Three cards" is renamed "Past, Present, Future", and the spread choice shows a description instead of a card count.
- `reading-prompt`: the themed-spread guide requirement refers to the renamed spread and no longer promises a byte-identical prompt, since the spread name in it changes.
- `lenormand-readings`: the Lenormand spread choice shows descriptions (with Lenormand's own Yes / No line), and the renamed spread appears in its scenarios and instructions.
- `screen-instructions`: the tarot "How it works" uses the new name.
- `visual-theme`: the spread preview scenarios use the new name.
- `animal-oracle`: one navigation scenario uses the new name.

## Impact

- Data: `data/i18n/en/spreads.json` (new name and a `description` for each spread), `data/i18n/en/lenormand/spreads.json` (Lenormand Yes / No description), `data/i18n/en/guides.json`, `data/i18n/en/lenormand/guide.json`.
- Code: `src/lib/deck.ts` (description field), `src/lib/lenormand.ts` (Lenormand description override), `src/components/SpreadPicker.tsx` (description instead of count).
- Prompt: the Past, Present, Future prompt's `Spread:` line changes, and so does its snapshot. No other prompt text changes.
- Tests: unit (deck, prompt snapshot, guides, Lenormand) and e2e (spreads, share, nav, guide, dev Lenormand).
- README.
- Share links: unchanged, because the id `three-card` stays.
