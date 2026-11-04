# Design

## Context

This follows `add-more-animals` (archived 2026-10-30), which took the deck from 36 to 48. Its design still holds:
- The draw, the deck builder, the art lookup (`ORACLE_ART`) and the card face already handle any deck size.
- What hard-codes the size is the tests and the "About this deck" copy.
- Drawings are hand-written SVGs that follow the rules in `art-format.ts`: a 100×100 viewBox, allowed shapes and classes only, `art-ink` eyes, and at most 3,072 bytes.

What's new since then is Traditional Chinese. `language-text.test.ts` requires the Chinese animal file to have exactly the English ids, every field filled with Chinese, distinct animal names, and no Simplified characters.

See proposal.md for why and what.

## Goals / Non-Goals

**Goals:**
- 12 new cards that look and read as if they were always part of the deck, in both languages.
- Every family stays balanced, with ten cards each.
- The checks keep pinning the exact deck size, and the e2e coverage check stays deterministic.

**Non-Goals:**
- Plants or any other kind of card.
- Insects or spiders.
- Changes to wording, screens or the home page.
- Redrawing or rewording any of the existing 48 cards.

## Decisions

### Ids are appended: `animal-49` to `animal-60`, in the proposal's table order
```
49 Lemur      50 Pika          peach      55 Manatee   56 Kiwi        lavender
51 Wombat     52 Okapi         sage       57 Camel     58 Platypus    butter
53 Manta Ray  54 Snow Leopard  sky        59 Pufferfish 60 Shoebill   rose
```
Appending keeps every existing id and file name valid, as last time.

### Families chosen by colour and mood
- **peach** (warm): Lemur, sunbathing, and Pika, cosy.
- **sage** (earthy): Wombat, ground, and Okapi, forest.
- **sky** (blue): Manta Ray, sea, and Snow Leopard, snow.
- **lavender** (dusk): Manatee, soft, and Kiwi, night bird.
- **butter** (sand): Camel, desert, and Platypus, a playful oddity.
- **rose**: Pufferfish and Shoebill.

### Themes avoid the existing 48
Some first ideas overlapped existing cards, so the themes were changed:
- Camel isn't "Patience", which is Turtle's theme, and isn't "Persistence", which is Salmon's.
- Pika isn't "Prepare", which is Hamster's theme.
- Platypus isn't "Be Unusual", which is Narwhal's theme.
- Pufferfish isn't "Boundaries", which is close to Alpaca's "Gentle Boundaries".
- Manatee isn't "Rest" or "Calm", which are Sloth's and Capybara's themes.

### Drawings by hand, with deliberate differences from look-alikes
| New | Could look like | How it stays distinct |
|---|---|---|
| Lemur | Red Panda, Cat | upright, sitting with arms open to the sun; long black-and-white ringed tail curling up; big round eyes |
| Pika | Hamster, Quokka | very small and round, no visible tail, round ears, on a rock with a flower in its mouth |
| Wombat | Bear, Koala, Capybara | low and square, short legs, blunt nose, beside a burrow mouth |
| Okapi | Horse, Giraffe, Deer | short neck, striped back legs only, big ears |
| Manta Ray | Whale, Dolphin | seen from above or below as a wide diamond with wing tips and head fins |
| Snow Leopard | Cat, Lion | spots drawn as rings, a very thick long tail wrapped round, snowflakes |
| Manatee | Hippo, Whale | in water, with a paddle tail, round whiskery snout and small flippers |
| Kiwi | Hummingbird, Dove | round body with no visible wings, long thin beak to the ground, small moon |
| Camel | Horse, Alpaca, Giraffe | one or two humps lead the outline, long curved neck, knobbly legs |
| Platypus | Beaver, Otter | the flat duck bill, a flat paddle tail, webbed feet |
| Pufferfish | Salmon | a round ball with short spines and small fins, puffed up |
| Shoebill | Flamingo, Swan, Dove | tall grey-blue standing bird with a huge clog-shaped bill, seen in profile |

### Samples first: Camel, Manta Ray, Shoebill
These have the most different outlines (humped, flat-winged, tall), and Camel is the one the owner asked for. Draw them first and pause for the owner's approval, as last time. The other nine follow after approval.

### Text in both languages, reviewed with the samples
- Each card gets the same fields as the others: three keywords, a short second-person message, one reflection question and a first-person affirmation.
- The Chinese is natural Taiwanese Traditional Chinese with the same gentle tone, and uses common Taiwanese animal names:
  狐猴, 鼠兔, 袋熊, 霍加狓, 鬼蝠魟, 雪豹, 海牛, 奇異鳥, 駱駝, 鴨嘴獸, 河豚, 鯨頭鸛
- The owner sees all 12 English and Chinese texts together with the three samples.

### Contact sheet rebuilt in the scratchpad
The tool from last time is gone. A scratchpad page shows all 60 drawings on their family faces at card size and 2×, in light and dark, using the real oracle CSS. It is used for the sample check-in and the final no-two-alike review, and it stays out of the repo.

### Checks
- `oracle-data.test.ts`: ids `animal-01` to `animal-60`, 60 distinct animals, ten per family, and the new animals present with their themes.
- `oracle.test.ts`: uniform draw over 60.
- `language-text.test.ts`: 60 distinct Chinese animal names.
- `guides.test.ts` and `e2e/guide.spec.ts`: "60".
- `e2e/oracle.spec.ts` already takes the deck size from the data. Its fixed sequence has to reach all 60 within the loop cap, so the cap (and timeout) rises if needed, and the comment records the draw at which all 60 appear.

## Risks / Trade-offs

- [A drawing reads as a different animal at card size] → look-alike table, samples first, full-sheet review by the owner.
- [Some of these animals are less familiar, such as Okapi, Pika and Shoebill] → the drawing focuses on the one feature that identifies each, and the name is always on the card.
- [The e2e coverage loop gets slower with 60 cards] → raise the cap and timeout, and keep the sequence fixed.
- [Chinese names for rare animals vary] → use the common Taiwanese name, and the owner reviews them.

## Migration Plan

Ship as one push after the owner approves the drawings and texts and all checks pass. The art test needs one drawing per id, so the deck can't be added halfway. Rollback is a revert. Share links don't carry oracle cards.
