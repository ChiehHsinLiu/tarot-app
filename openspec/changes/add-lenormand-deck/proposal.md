# Proposal

## Why

The owner wants to read with a second deck, Lenormand, alongside tarot, choosing the deck on the tarot screen and keeping the same spreads. Lenormand is read by combining cards, not by a fixed verdict per card. So its Yes / No answer comes from Ask Claude, and the whole deck stays in `npm run dev` like the other private features. This change also sets up deck choice so further decks can be added later without reworking it.

## What Changes

- **Lenormand deck (dev-only):** the 36 traditional Lenormand cards (1 Rider to 36 Cross), each with keywords and a meaning written for this app. The deck data lives in the public repo but never reaches the public build.
- **Deck choice (dev-only):** in `npm run dev`, the tarot screen shows a "Choose a deck" picker, Tarot or Lenormand, above the guides. Tarot is selected by default. The choice is kept with the spread and question when going Home and back. The public site shows no picker and behaves exactly as now.
- **The same two spreads with either deck:**
  - **Yes / No:** with Lenormand it draws **2 cards** ("First card", "Second card") and still needs a question. There is no written verdict: the reading invites Ask Claude for the answer, which Claude gives from how the two cards combine.
  - **Three cards:** draws Past, Present and Future with either deck.
  - Lenormand cards are never reversed.
- **Lenormand reading view:** each card shows a placeholder face (its number and name in the card frame), with its keywords and meaning. It has New reading, Copy for Claude and Ask Claude, and no Share. Readings and share links stay tarot-only.
- **Claude for Lenormand:** a new prompt template, `prompts/lenormand.md`, tells Claude to read the cards as combinations. For Yes / No, Claude starts with a clear Yes, No or Maybe. The local endpoint accepts a new `lenormand` request, and the journal records Lenormand answers.
- **Lenormand guide:** with Lenormand chosen, the screen's "How it works" and "About this deck" show Lenormand text. That text is also dev-only.
- **Drawings:** the 36 drawings come in a follow-up change, `add-lenormand-art`.

## Capabilities

### New Capabilities

- `lenormand-readings`: the dev-only Lenormand deck, deck choice on the tarot screen, Lenormand draws and spreads, the reading view, its Claude prompt and its guide text.

### Modified Capabilities

- `tarot-spreads`: the one-card Yes / No position and its written verdict now apply to the tarot deck only.
- `tarot-readings`: the 78-card fair draw and the 50/50 reversals now apply to tarot draws only.
- `reading-share-links`: the Share action is offered on tarot readings only.
- `reading-prompt`: the orientation and verdict rules of the prompt apply to tarot readings, and Lenormand prompts follow `lenormand-readings`.
- `private-readings`: the endpoint also accepts a valid Lenormand request, and the journal records Lenormand answers.
- `screen-instructions`: the tarot screen's guides show Lenormand text while Lenormand is chosen.

## Impact

- **New data:**
  - `data/lenormand/deck.json`, the ids and numbers
  - `data/lenormand/spreads.json`, the positions for each shared spread id
  - `data/i18n/en/lenormand/cards.json`, `spreads.json` and `guide.json`, the text
- **New code:**
  - `src/lib/lenormand.ts`, with the deck, draw and prompt builder
  - `src/components/LenormandReadingView.tsx`, `DeckPicker.tsx` and `LenormandCardFace.tsx`
  - `prompts/lenormand.md`
  - tests for each
- **Changed code:**
  - `src/App.tsx`, for the deck state and dev-only wiring
  - `src/lib/draw.ts`, with an option for no reversals
  - `src/components/ScreenGuide.tsx`, which now takes the guide text as a prop
  - `vite/private-readings.ts` and `vite/journal.ts`
  - `src/index.css`
  - `README.md`
- **Public site:** no visible change. The build is checked to contain no Lenormand text or code.
- **Share-link format and the public specs' behaviour for tarot:** unchanged. No new dependencies.
