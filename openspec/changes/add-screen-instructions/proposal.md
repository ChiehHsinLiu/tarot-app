# Proposal

## Why

The tarot and animal oracle screens assume the visitor already knows how a reading works. Nothing explains what a spread is, why a card can appear upside down, where the Yes / No answer comes from, or what the decks are. The user wants each screen to carry its own instructions and an explanation of its deck. Doing this now also sets up the pattern the dev-only Lenormand screen (`add-lenormand-deck`) will reuse.

## What Changes

- The tarot screen and the animal oracle screen each get two expandable sections under their heading:
  - **How it works:** short steps for using that screen. For tarot this means choosing a spread, the question, drawing, reading upright and reversed cards, where the Yes / No answer comes from, and sharing. For the oracle it means drawing, reading the message, reflection question and affirmation, and drawing again.
  - **About this deck:** what the deck is. For tarot: 78 cards, 22 Major and 56 Minor Arcana in four suits, meanings written for this app. For the oracle: 36 original animal cards in six colour families.
- Both sections start closed, so the screens look the same as now until a visitor opens one.
- Both sections end with the same short note that readings are for reflection and fun, not professional advice.
- The guide text lives in one data file keyed by screen, separate from the code. A later screen, such as Lenormand, adds its own entry.
- The sections appear only on each screen's starting view, the tarot spread choice and the oracle intro. Drawn readings and opened share links don't show them.

## Capabilities

### New Capabilities

- `screen-instructions`: per-screen "How it works" and "About this deck" guides. Covers where they appear, how they open and close, their accessibility, and the content each screen's guide must cover.

### Modified Capabilities

None. The existing tarot and oracle requirements (heading, intro, spreads, Draw, focus on open) stay as they are; the guides are added alongside them.

## Impact

- **New:** `src/components/ScreenGuide.tsx`; `data/i18n/en/guides.json`, the text; a data test that every screen's guide is complete.
- **Changed:**
  - `src/App.tsx` (the tarot composer) and `src/components/OracleIntro.tsx`, to show the guide.
  - `src/index.css`, for the guide styles in both colour schemes.
  - `README.md`, the "Using the app" section.
- **Public site:** yes. The tarot and oracle guides go live, with no dev-only text in them.
- **No new dependencies and no network requests.**
