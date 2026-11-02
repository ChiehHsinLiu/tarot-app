# Design

## Context

`SpreadPicker` builds the line under each name from `positions.length` ("1 card" / "N cards") plus ", question required". Spread names come from `data/i18n/en/spreads.json`. Lenormand spreads are built from the tarot ones in `buildLenormandSpreads` (name and question rule copied, positions from `data/i18n/en/lenormand/spreads.json`). The reading heading, the shared heading ("Shared reading · <name>"), the Lenormand heading ("Lenormand · <name>") and the prompt's `Spread:` line all print `spread.name`, so renaming the data renames all of them.

## Goals / Non-Goals

**Goals:**
- Rename by changing data only. The id `three-card` stays, so share links, journal entries and the Ask Claude endpoint don't change.
- Keep the description wording in data, next to the other spread text.

**Non-Goals:**
- Showing the card count anywhere else. The face-down preview mat already shows it.

## Decisions

### 1. `description` in the spread text, with a Lenormand override

`SpreadText` gains a required `description: string`, and `buildSpreads` copies it onto `Spread`. It's required, not optional like `guide`, because every spread is listed in the picker. A unit test checks every spread has a non-empty description.

The Lenormand spread text (`LenormandSpreadText`) gains an optional `description`. `buildLenormandSpreads` uses it when set and the tarot description otherwise. Only Lenormand Yes / No sets it ("Two cards read together for a yes or no"), because "One card…" would be wrong for a two-card draw.

*Alternative:* write the descriptions into `SpreadPicker` keyed by id. That was rejected for the same reason as in add-three-card-spreads: spread wording lives in data.

### 2. The detail line

`SpreadPicker` shows `description`, and when `requiresQuestion` is true, a second `.spread-detail.spread-required` line reading "Question required". (As built: the first version put " · question required" after the description, but on a 320 px phone the "·" was left at the end of a wrapped line, so the owner chose a line of its own.) The text stays inside the option's `<label>`, so the accessible name is still the name plus its detail, as it is today. The `.spread-detail` class and its contrast check are unchanged.

### 3. Spec scenarios keep their titles

OpenSpec won't let a MODIFIED requirement drop or rename a scenario. So the scenarios titled "Three cards chosen", "Card count and question rule in the spread choice", "Card count in the spread choice" and "Existing spreads unchanged" keep their titles, and their steps now describe the new behaviour.

## Risks / Trade-offs

- [Descriptions make the picker taller on a phone] → they're one short line each, replacing a line that was already there, so the height should barely change. Check at 320 px.
- [The Past, Present, Future prompt snapshot changes] → update only that snapshot, and check that its diff is exactly the `Spread:` line.
- [Tests that name "Three cards" in e2e and unit] → update each one. A leftover would fail rather than pass silently, because they compare exact text.

## Migration Plan

Push to `main` as usual. Old links keep working because the id is unchanged. To roll back, revert the commit.
