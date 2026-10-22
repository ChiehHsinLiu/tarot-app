# Proposal

## Why

Trying the app, the owner found readings "sticky". After drawing, going Home and back brought back the same reading or card. The only way out was a **New reading** button at the very bottom, which made it feel as if you couldn't draw again or pick another deck. The owner also didn't like the "How it works" and "About this deck" sections sitting between the heading and the choices. They asked for:
- screens that start fresh when opened from Home
- the guides moved out of the way

## What Changes

- **Screens start fresh (BREAKING for the current navigation rule):**
  - Whenever the tarot or oracle screen is entered from another screen, it starts clean. That covers the Home link, a home choice, the browser's Back and Forward buttons, and a typed address.
    - **Tarot:** no reading, no spread, an empty question, and Tarot as the deck.
    - **Oracle:** the intro, with no card.
  - This replaces "Screens keep their state during a visit".
  - Within a screen nothing changes: **New reading** still keeps your spread (and, in dev, the deck), and switching deck still keeps your spread and question.
- **A way back at the top of every reading:**
  - Each drawn reading also shows its start-over action right under its heading, as well as at the bottom:
    - **New reading** on your own tarot and Lenormand readings
    - **Draw your own** on a shared reading
    - **Draw again** on an oracle card
  - The top one uses the lighter secondary style, so the bottom button stays the main one.
- **Guides behind a "?" button:**
  - A small round "?" button next to the tarot and oracle screens' headings opens a panel with "How it works" and "About this deck". The guide text doesn't change.
  - The panel is closed whenever a screen is shown and has a **Close** button. Escape also closes it and returns focus to the "?".
  - Until it's opened, the screens look as they did before the guides arrived, with the choices straight under the heading.
  - In dev, switching deck updates an open panel in place.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-navigation`:
  - remove "Screens keep their state during a visit"
  - add "Screens start fresh when opened" and "Start over from the top of a reading"
- `animal-oracle`: "Draw again and back" no longer promises the tarot choice survives a trip to the oracle.
- `lenormand-readings`: "Choosing a deck" now sits under the heading, not above the guide sections, and the deck resets to Tarot when the screen is entered from elsewhere.
- `screen-instructions`: "Guides on each reading screen", "Accessible and offline guides" and "Guides follow the selected deck" now describe the "?" button and panel instead of two expandable sections.

## Impact

- **Code:**
  - `src/App.tsx`: resets screen state on entry, and adds the top action wiring.
  - `src/components/ScreenGuide.tsx`: rewritten as the "?" button and panel.
  - `OracleIntro.tsx`, `ReadingView.tsx`, `LenormandReadingView.tsx` and `OracleCardView.tsx`: the top action and heading row.
  - `src/index.css`.
  - `README.md` ("Using the app").
- **Public site:** visible changes to navigation, the guides and the reading screens.
- **Share-link format, data and Claude features:** unchanged.
- **Scratchpad browser checks:** the ones that asserted remembered state (navigation, oracle, Lenormand) and the guide check are updated to the new behaviour.
