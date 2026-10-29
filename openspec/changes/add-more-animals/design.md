# Design

## Context

The animal oracle's code already handles a deck of any size:
- `drawOracle` picks from whatever ids it is given.
- `oracle-deck.ts` builds the cards from `data/oracle/animal.json` joined with `data/i18n/en/oracle/animal.json`.
- `ORACLE_ART` globs `src/assets/oracle/animal/*.svg`.
- The card face takes its colours from the card's family.

What hard-codes 36 is the data checks and the copy: `oracle-data.test.ts` (ids 01–36 and six per family), `oracle.test.ts` (uniform over 36), `guides.test.ts` and `e2e/guide.spec.ts` (the phrase "36"), and `e2e/oracle.spec.ts` ("reaches all 36", "all 36 drawings are different").

The 36 drawings were written by hand in `add-oracle-animal-art`, following its drawing format and style rules. The format is enforced by `art-format.ts` and `oracle-art.test.ts`: a 100×100 viewBox, the shape, attribute and class allow-lists, `art-ink` eyes and at most 3,072 bytes. The style rules are a round, friendly storybook look, a side or three-quarter view, the animal filling the box, and a recognisable outline at card size. There's no generator script for the animal art, unlike `scripts/tarot-art/`. The contact-sheet tool from that change lived in an old scratchpad and is gone.

See proposal.md for why and what.

## Goals / Non-Goals

**Goals:**
- 12 new cards that look and read as if they were always part of the deck.
- Every family stays balanced, with eight cards each.
- The checks keep pinning the exact deck size, and the e2e coverage check stays deterministic.

**Non-Goals:**
- Plants or any other kind of card.
- A deck picker, or any change to wording, screens or the home page.
- Redrawing or rewording any of the existing 36 cards.
- A generator script for the animal art.

## Decisions

### Ids are appended: `animal-37` to `animal-48`, in family order
The new ids are appended in the order of the proposal's table:

```
37 Quokka   38 Hamster    peach      43 Octopus   44 Hippo     lavender
39 Pangolin 40 Chameleon  sage       45 Lion      46 Giraffe   butter
41 Puffin   42 Narwhal    sky        47 Flamingo  48 Axolotl   rose
```

Appending keeps every existing id, file name and saved reading valid. The ids carry no meaning, since the data is already mixed across families.

*Alternative:* renumbering to group by family. That would rename 36 files and break saved ids for no visible gain.

### Drawings are written by hand in the existing format and style
Each new SVG follows the same rules as the first 36, so it passes the existing format test without changes. Making them by hand, as the originals were, keeps the deck looking like one set.

*Alternative:* a generator script like the tarot's. It suits the tarot, where 38 drawings share parts like heads, hands and suit symbols. The animals share no parts, and a generator would drift from the hand-made look.

Some new animals share a family with an animal they could be mistaken for. Each such drawing gets a deliberate difference:

| New | Looks like (same family) | How it stays distinct |
|---|---|---|
| Hippo | Elephant (lavender) | half-submerged in water: round head, little ears and nostrils, no trunk |
| Puffin | Penguin (sky) | big striped beak, standing on a cliff edge, smaller and rounder |
| Narwhal | Whale, Dolphin (sky) | the long spiral tusk leads the outline |
| Pangolin | Hedgehog (sage) | overlapping scales drawn as plates, a long tail, curled pose |
| Chameleon | Frog, Snake (sage) | on a branch with a curled tail and a cone eye |
| Lion | Bear (butter) | a full mane ring around the face |
| Giraffe | Horse, Goat (butter) | the neck runs up out of the box top area, with patches |
| Quokka | Capybara (peach) | upright, small, with a wide smile and round ears |
| Flamingo | Swan (lavender, different family) | on one leg, with an S-neck and a bent beak |
| Axolotl | Frog (sage, different family) | frilly gills either side of the head |

### Samples first: Hippo, Octopus, Flamingo
These three have the most different outlines: round, many-armed and leggy. Drawing them first and pausing for the owner's approval is the same check-in that worked for the oracle, home and tarot art. The other nine are drawn after approval.

### Text in the existing voice, reviewed with the samples
Each new card gets three keywords, a two- or three-sentence message in the second person, one reflection question and a first-person affirmation, matching the first 36. The themes are the ones settled in the proposal. All 12 texts are shown to the owner together with the sample drawings, so wording and drawings are approved in one pass.

### Checks
- `oracle-data.test.ts` keeps pinning the spec: ids `animal-01` to `animal-48`, 48 distinct animals, eight per family, and the added animals present.
- `oracle.test.ts` checks the uniform draw over 48.
- `guides.test.ts` and `e2e/guide.spec.ts` look for "48".
- `e2e/oracle.spec.ts` takes the deck size from the data file instead of a literal, so its messages and limits follow the deck. Its fixed random sequence (`fixRandomness`) has to reach all 48 within the loop's cap. The cap rises if the sequence needs more than 300 draws, and the comment records the draw at which all 48 appear. The test timeout rises with it if needed.

### Contact sheet rebuilt in the scratchpad
A scratchpad page shows all 48 drawings on their family faces at card size and 2×, in light and dark, using the real `.oracle-art` CSS. It is used for the sample check-in and the final no-two-alike review. It stays out of the repo, as before.

## Risks / Trade-offs

- [A new drawing looks like an old one at 140px] → the look-alike table above, a side-by-side check on the contact sheet, and the owner's review.
- [A drawing goes over 3,072 bytes: the Octopus's arms and the Pangolin's scales are detailed] → keep shapes few and reuse paths with `transform`; the format test fails on oversize.
- [The fixed random sequence doesn't reach all 48 within the cap] → raise the cap and record the reach point, as was done for 36.
- [The text drifts in tone] → write the new texts beside existing ones from the same family, and have the owner review them.
- [Bundle growth] → about 13 kB raw on the on-demand `OracleScreen` chunk only. The entry chunk doesn't change.

## Migration Plan

The change ships with a normal push to `main`, with approval, and the deploy runs the unit and e2e checks. To roll back, revert the commit. Nothing persists that depends on the new ids, apart from dev-only journal entries, which keep working while the ids exist.
