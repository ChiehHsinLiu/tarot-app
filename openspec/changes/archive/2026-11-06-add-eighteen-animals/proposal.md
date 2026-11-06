# Proposal

## Why

The owner wants more animal cards, including cute legendary animals with a Japanese feel. Adding 18, three per colour family, keeps the families balanced at 13 each and takes the deck to 78, the same size as a tarot deck. It's the same shape as `add-twelve-animals` (48 → 60), plus the first legendary animals.

## What Changes

- Add 18 cards to the existing animal oracle, `animal-61` to `animal-78`, taking the deck from 60 to 78. The owner chose the animals. The themes are proposed, avoid overlapping the existing 60, and get the owner's review with the card text:

  | Family   | Animal        | Kind      | Theme              |
  |----------|---------------|-----------|--------------------|
  | peach    | Binturong     | real      | Your Own Charm     |
  | peach    | Orangutan     | real      | Find Shelter       |
  | peach    | Phoenix       | legendary | Rise Again         |
  | butter   | Yak           | real      | Weather the Storm  |
  | butter   | Griffin       | legendary | Guard What Matters |
  | butter   | Tanuki        | legendary | Lighten Up         |
  | sage     | Tapir         | real      | Follow Your Nose   |
  | sage     | Tree Kangaroo | real      | Try Something New  |
  | sage     | Tsuchinoko    | legendary | Happy Surprises    |
  | sky      | Jellyfish     | real      | Your Own Glow      |
  | sky      | Harp Seal     | real      | Let Others Care    |
  | sky      | Komainu       | legendary | You Are Safe       |
  | rose     | Kookaburra    | real      | Laugh Out Loud     |
  | rose     | Crane         | real      | Keep Hoping        |
  | rose     | Unicorn       | legendary | Let It Come to You |
  | lavender | Bat           | real      | Trust the Dark     |
  | lavender | Raccoon       | real      | Clean Slate        |
  | lavender | Kitsune       | legendary | See Beyond         |

- The seven legendary animals work like every other card, with a drawing, message, question and affirmation, and no special label.
- Each new card gets original text **in English and Traditional Chinese**, and its own hand-drawn picture in the existing style and format. All are drawn round, soft and cute.
- Each colour family grows from ten cards to 13.
- "Draw again" picks from the other 77 cards.
- The oracle's "About this deck" (English and Chinese) and the README say 78 animals, real and legendary.
- No change to the home page, the screens, the card face, the draw rules or the Ask Claude prompt.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `animal-oracle`: the deck has 78 cards instead of 60, may include legendary animals, and names the 18 new cards in a scenario. Drawing, uniform choice, pictures and "Draw again" now cover 78 cards.
- `visual-theme`: each of the six oracle colour families is used by 13 cards instead of ten.
- `screen-instructions`: the oracle's "About this deck" describes 78 real and legendary animal cards.

## Impact

- **Data:** `data/oracle/animal.json`, `data/i18n/en/oracle/animal.json` and `data/i18n/zh-Hant/oracle/animal.json` (18 entries each).
- **Art:** 18 new SVGs in `src/assets/oracle/animal/`, at most 3,072 bytes each, checked by the existing format test. Going by the last change, this adds about 40 kB to the oracle screen's chunk. The home page's first load doesn't change.
- **Text:** the oracle "About this deck" in `data/i18n/en/guides.json` and `data/i18n/zh-Hant/guides.json`, and `README.md`.
- **Tests that hard-code 60:** `oracle-data.test.ts`, `oracle.test.ts`, `guides.test.ts`, `language-text.test.ts`, `e2e/oracle.spec.ts` and `e2e/guide.spec.ts`.
- **No code paths change.** The draw, the art lookup and the oracle screen already work for any deck size.
