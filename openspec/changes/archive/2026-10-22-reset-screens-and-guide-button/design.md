# Design

## Context

**State in `src/App.tsx`:**
- It holds `tarot: TarotState` (composer, tarot reading or Lenormand reading) and `oracleCardId`, apart from the route, so both survive navigation. That is the behaviour being reversed.
- Routes come from `parseRoute(hash)`. A `hashchange` listener updates `hash` and handles invalid share links.
- "Draw your own" swaps the address with `history.replaceState`, which fires no `hashchange`, and resets the composer itself.

**Other pieces:**
- `ReadingView`, `LenormandReadingView` and `OracleCardView` each render an `<h2>` that is focused on mount, and put their start-over button at the end in `.reading-actions`.
- `ScreenGuide` renders two `<details>` sections. The composer and `OracleIntro` place it after the heading (the composer after the deck picker, in dev). The text comes from `guides.json` and, in dev, `lenormand.guide`.

## Goals / Non-Goals

**Goals:**
- One rule for entering a screen, applied in one place.
- Guides out of the way but one tap from every start screen, accessible without ARIA beyond a standard disclosure button.
- No change to guide text, share links, data or Claude features.

**Non-Goals:**
- A modal dialog or overlay for the guide.
- Remembering whether the panel was open.
- Changing what "New reading" keeps within a screen. It still keeps the spread, and the deck in dev.

## Decisions

### Reset on entry, decided in the hashchange handler

`App` keeps the route it last rendered in a ref. When a `hashchange` produces a different route:
- entering `tarot` sets `tarot` to `EMPTY_COMPOSER`, which has no spread, an empty question and the deck `'tarot'`
- entering `oracle` sets `oracleCardId` to `null`

The existing invalid-link branch runs first, as now. Same-route changes leave the state alone. Within a screen, the address doesn't change at all, so drawing, New reading and deck switches are unaffected.

This covers the Home link, home choices, Back and Forward, and typed addresses, because all of them change the hash. Reloads already start fresh.

- **Instead of resetting when leaving a screen:** that misses a typed address from home and Forward after Back. Deciding on entry is the single rule the spec states.
- **Instead of dropping the stored state and keeping it in each screen component:** `TarotState` still needs to live in `App`, because the composer and the reading views swap within the same screen.

### Top action

Each reading view renders the same handler twice:
- a `secondary` button in a new `.reading-top-actions` row, right after its `<h2>`
- the existing primary button at the bottom

The labels follow the spec:
- "New reading", or "Draw your own" for a shared reading, in `ReadingView`
- "New reading" in `LenormandReadingView`
- "Draw again" in `OracleCardView`

On mount, focus stays on the heading, so the top button comes next in tab order.

### "?" button and panel: `GuidedHeading`

`ScreenGuide` is replaced by `src/components/GuidedHeading.tsx`:

```tsx
<GuidedHeading guide={text}>
  <h2 …>Tarot reading</h2>
</GuidedHeading>
```

**Structure:**
- A `.guided-heading` wrapper holds a `.heading-row` (the heading, then the button) and, when open, the panel.
- **The button:** `<button type="button" class="guide-toggle" aria-expanded aria-controls={panelId} aria-label="How it works and about this deck">?</button>`. As a `type="button"` element inside the composer form, it never submits.
- **The panel:** `<section id={panelId} class="guide-panel" aria-label="How it works and about this deck">` holds:
  - `<h3>How it works</h3>` and the steps `<ol>`
  - `<h3>About this deck</h3>`, the paragraphs and the shared note
  - a "Close" button

**State:** `open` is component state that starts `false`. The composer and `OracleIntro` remount whenever their screen is shown, so the panel is always closed then.

**Closing:**
- Escape pressed on the button or anywhere in the panel closes it and focuses the button.
- "Close" does the same.

Switching deck re-renders with new `guide` text, leaving `open` and focus untouched.

**Placement:** the deck picker and spread picker follow the heading block, so with the panel closed the screens look as they did before the guides arrived. The composer passes `useLenormand ? lenormand.guide : guides.screens.tarot`, as now. The dev-only boundary is unchanged: the Lenormand text still only arrives through the DEV-built deck.

- **Instead of a native `<details>` with "?" as its `<summary>`:** the panel has to sit below the whole heading row at full width, and a `<summary>` must be the first child of its `<details>`. A button with `aria-expanded` is the standard disclosure pattern and keeps the layout simple.
- **Instead of a modal dialog:** it would need focus trapping and an inert background for content that is just reading material. An inline panel is lighter and works at phone width.

**Styling:**
- **The "?":** a 28px round button with an accent border, in Fraunces, with a `:focus-visible` ring.
- **The panel:** the same light card as the old sections (`--surface`, `--border`, 14px radius), max 560px, left-aligned, with an `h3` size close to the old summary.
- **Spacing:** the heading row is centred, with an 8px gap.
- **Fit:** it is checked at 320px, in light and dark.

### Tests and checks

The guide text tests (`guides.test.ts`, `lenormand-guide.test.ts`) are unchanged. The scratchpad checks change:
- **`guide-check`** is rewritten for the button and panel:
  - the "?" shows on both start screens, and on no reading, share link or home page
  - the panel starts closed, opens with Enter and Space, and the expanded state is reported
  - Escape and "Close" close it and return focus
  - the key phrases and the note appear in the panel
  - it doesn't affect the spread or question, or submit the form
  - it reads at 320px in light and dark
  - in dev, a deck switch keeps the panel open with the new text
- **A new `reset-check`** covers "Screens start fresh when opened":
  - entering through the Home link, the home choice, Back and Forward, and a typed address
  - the top actions on tarot, shared, oracle and Lenormand readings, which behave like the bottom ones
- **`nav-check`, `oracle-check` and `lenormand-check`** flip the assertions that expected remembered state, and `lenormand-check`'s guide part follows the panel.

## Risks / Trade-offs

- **Someone midway through a question loses it by going Home.** → This is what the owner asked for. Within the screen nothing is lost, and the question box is short.
- **Two buttons with the same name on a reading.** → They do the same thing, so either works for a screen-reader user. The top one is secondary and the bottom one keeps the primary style.
- **The "?" is less discoverable than visible sections.** → It sits right beside the heading on every start screen and has a clear accessible name. The README mentions it.

## Migration Plan

This is a normal push to `main` after approval, followed by the live checks. To roll back, revert the commit. There's no data or link change.
