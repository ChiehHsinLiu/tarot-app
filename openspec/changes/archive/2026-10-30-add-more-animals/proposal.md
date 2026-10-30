# Proposal

## Why

The animal oracle has 36 cards, and with "Draw again" and no daily limit the same animals come round often. The owner wants more variety in the existing deck. Plants may follow later as their own change. Adding 12 animals, two per colour family, keeps the families balanced and leaves the screens, home page and wording untouched.

## What Changes

- Add 12 animal cards to the existing animal oracle, `animal-37` to `animal-48`, taking the deck from 36 to 48 cards. The animals and themes, settled with the owner:

  | Family   | Animal    | Theme                  |
  |----------|-----------|------------------------|
  | peach    | Quokka    | Look on the Bright Side |
  | peach    | Hamster   | Prepare                |
  | sage     | Pangolin  | Soft Inside            |
  | sage     | Chameleon | See Both Sides         |
  | sky      | Puffin    | Belonging              |
  | sky      | Narwhal   | Be Unusual             |
  | lavender | Octopus   | Curiosity              |
  | lavender | Hippo     | Take Up Space          |
  | butter   | Lion      | Lead with Heart        |
  | butter   | Giraffe   | Look Ahead             |
  | rose     | Flamingo  | Balance                |
  | rose     | Axolotl   | Healing                |

- Each new card gets original keywords, a message, a reflection question and an affirmation in the same voice as the first 36. Each also gets its own hand-written drawing in the existing style and format.
- Each colour family grows from six cards to eight.
- "Draw again" picks from the other 47 cards instead of the other 35.
- The oracle's "About this deck" text and the README say 48 animals instead of 36.
- No change to the home page, the "Animal oracle" and "Today's animal oracle" wording, the subtitle, the cat window, the card face, the draw rules or the Ask Claude prompt.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `animal-oracle`: the deck has 48 cards instead of 36. Drawing, uniform choice, illustrations and "Draw again" now cover 48 cards, and "Draw again" picks from the other 47. The new animals are named in a scenario.
- `visual-theme`: each of the six oracle colour families is used by eight cards instead of six.
- `screen-instructions`: the oracle's "About this deck" describes 48 original animal cards instead of 36.

## Impact

- Data: `data/oracle/animal.json` and `data/i18n/en/oracle/animal.json` (12 entries each).
- Art: 12 new SVGs in `src/assets/oracle/animal/`, at most 3,072 bytes each, checked by the existing format test. That adds about 13 kB to `OracleScreen`'s chunk, and the entry chunk doesn't change.
- Text: `data/i18n/en/guides.json` (oracle "About this deck") and `README.md`.
- Tests that hard-code 36: `src/lib/oracle-data.test.ts`, `src/lib/oracle.test.ts`, `src/lib/guides.test.ts`, `e2e/oracle.spec.ts` and `e2e/guide.spec.ts`. Also the "six cards" comment in `src/lib/oracle.ts`.
- No code paths change: `drawOracle`, `ORACLE_ART` and the oracle screen already work for any deck size. Share links don't carry oracle cards. Lenormand uses the same colour families but has its own data, so it is unaffected.
