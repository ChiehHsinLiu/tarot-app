# Proposal

## Why

The owner wants more animal cards, and asked for more unusual animals than the usual ones, with no insects. Adding 12, two per colour family, keeps the families balanced (ten each) and leaves the screens and home page as they are. It's the same shape as `add-more-animals` (36 → 48).

## What Changes

- Add 12 animal cards to the existing animal oracle, `animal-49` to `animal-60`, taking the deck from 48 to 60 cards. The animals were chosen by the owner, and the themes avoid overlapping the existing 48:

  | Family   | Animal       | Theme            |
  |----------|--------------|------------------|
  | peach    | Lemur        | Soak Up the Sun  |
  | peach    | Pika         | Small Comforts   |
  | sage     | Wombat       | Solid Ground     |
  | sage     | Okapi        | Quiet Gifts      |
  | sky      | Manta Ray    | Go with the Flow |
  | sky      | Snow Leopard | Quiet Courage    |
  | lavender | Manatee      | Be Gentle        |
  | lavender | Kiwi         | Find Your Way    |
  | butter   | Camel        | Pace Yourself    |
  | butter   | Platypus     | All of You       |
  | rose     | Pufferfish   | Let It Pass      |
  | rose     | Shoebill     | Stillness        |

- Each new card gets original keywords, a message, a reflection question and an affirmation in the same voice as the others, **in English and Traditional Chinese**.
- Each new card also gets its own hand-drawn picture in the existing style and format.
- Each colour family grows from eight cards to ten.
- "Draw again" picks from the other 59 cards.
- The oracle's "About this deck" (English and Chinese) and the README say 60 animals instead of 48.
- No change to the home page, the screens, the card face, the draw rules or the Ask Claude prompt.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `animal-oracle`: the deck has 60 cards instead of 48. Drawing, uniform choice, pictures and "Draw again" now cover 60 cards, and the 12 new animals are named in a scenario.
- `visual-theme`: each of the six oracle colour families is used by ten cards instead of eight.
- `screen-instructions`: the oracle's "About this deck" describes 60 animal cards instead of 48.

## Impact

- **Data:** `data/oracle/animal.json`, `data/i18n/en/oracle/animal.json` and `data/i18n/zh-Hant/oracle/animal.json` (12 entries each).
- **Art:** 12 new SVGs in `src/assets/oracle/animal/`, at most 3,072 bytes each, checked by the existing format test. This adds about 15–20 kB to the oracle screen's chunk. The home page's first load doesn't change.
- **Text:** the oracle "About this deck" in `data/i18n/en/guides.json` and `data/i18n/zh-Hant/guides.json`, and `README.md`.
- **Tests that hard-code 48:** `oracle-data.test.ts`, `oracle.test.ts`, `guides.test.ts`, `language-text.test.ts`, `e2e/oracle.spec.ts` and `e2e/guide.spec.ts`.
- **No code paths change.** The draw, the art lookup and the oracle screen already work for any deck size.
