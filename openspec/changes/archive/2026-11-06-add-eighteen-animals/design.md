# Design

## Context

This follows `add-twelve-animals` (archived 2026-11-04), which took the deck from 48 to 60. Its design still holds:
- The draw, the deck builder, the art lookup (`ORACLE_ART`) and the card face already handle any deck size.
- What hard-codes the size is the tests and the "About this deck" copy.
- Drawings are hand-written SVGs that follow the rules in `art-format.ts`: a 100×100 viewBox, allowed shapes and classes only, `art-ink` eyes, and at most 3,072 bytes.
- `language-text.test.ts` requires the Chinese animal file to have exactly the English ids, every field filled with Chinese, distinct animal names, and no Simplified characters.

What's new is legendary animals. No code treats them differently.

See proposal.md for why and what.

## Goals / Non-Goals

**Goals:**
- 18 new cards that look and read as if they were always part of the deck, in both languages.
- Legendary animals that are cute first, with a Japanese feel where the animal comes from Japanese folklore.
- Every family stays balanced, with 13 cards each.
- The checks keep pinning the exact deck size, and the e2e coverage check stays deterministic.

**Non-Goals:**
- A label, section or separate deck for legendary animals.
- Kappa, Qilin, Dragon, Pegasus, Moon Rabbit, Giant Catfish, Star-nosed Mole or Peacock, which were considered and turned down in favour of this list.
- Plants, insects or spiders.
- Changes to wording, screens or the home page.
- Redrawing or rewording any of the existing 60 cards.

## Decisions

### Ids are appended: `animal-61` to `animal-78`, in the proposal's table order
```
61 Binturong   62 Orangutan      63 Phoenix        peach
64 Yak         65 Griffin        66 Tanuki         butter
67 Tapir       68 Tree Kangaroo  69 Tsuchinoko     sage
70 Jellyfish   71 Harp Seal      72 Komainu        sky
73 Kookaburra  74 Crane          75 Unicorn        rose
76 Bat         77 Raccoon        78 Kitsune        lavender
```
Appending keeps every existing id and file name valid, as last time.

### Legendary animals stay mixed into the families
They were presented to the owner as ordinary cards with no special label, so they sit in the same data shape as every other card. The spec names them in their own scenario only so the checks can pin them.

### Themes avoid the existing 60
- Phoenix's "Rise Again" stays different from Hermit Crab's "Begin Again" by being about recovering after something hard. The message makes that clear.
- Jellyfish isn't about drifting, which is Manta Ray's "Go with the Flow".
- Unicorn isn't "Be Gentle", which is Manatee's theme.
- Kitsune isn't "Adapt", which is Fox's theme.
- Griffin isn't "Fearless" or "Protect Your Energy", which are Honey Badger's and Hedgehog's themes.
- Komainu is about feeling safe, and Griffin is about standing up for something.

### Drawings by hand, with deliberate differences from look-alikes
All are round and soft, including the ones usually drawn as fierce: Griffin is a baby, and Phoenix and Kitsune have friendly faces.

| New | Could look like | How it stays distinct |
|---|---|---|
| Binturong | Red Panda, Bear | long shaggy body, tufted ears, very long curling tail round a branch |
| Orangutan | Lemur, Bear | long arms holding a big leaf overhead as an umbrella, wide cheeks |
| Phoenix | Hummingbird, Dove | sweeping tail of flame-shaped feathers, small crest, round body rising from a small flame |
| Yak | Goat, Alpaca, Bear | wide curved horns, long fringe of hair almost to the ground, mountain behind |
| Griffin | Lion, Puffin | fluffy eagle-chick head and small beak, lion-cub body and tufted tail, small wings |
| Tanuki | Raccoon, Red Panda | straw hat tilted back, flat leaf between round ears, dark eye mask, big shiny eyes, rosy puffed cheeks, standing and waving, coin on a string, thick striped tail |
| Tapir | Elephant, Hippo | short bendy nose, two-tone body with a pale saddle, round ears |
| Tree Kangaroo | Koala, Lemur | sitting on a branch, long plain hanging tail, small round ears |
| Tsuchinoko | Snake, Pufferfish | very short, chubby and bottle-shaped, with a thin tail, peeking from grass |
| Jellyfish | Octopus | see-through bell with soft wavy threads and little glow dots |
| Harp Seal | Manatee, Penguin | fluffy cream pup lying on ice, whiskers, small flippers |
| Komainu | Lion, Cat, Golden Retriever | chibi: big head, oversized cream mane of curls, open-mouthed smile, small body, bell on a rope, cherry-blossom petals |
| Kookaburra | Puffin, Owl, Kiwi | big head, large straight beak open mid-laugh, on a branch |
| Crane | Swan, Flamingo, Shoebill | Japanese red-crowned crane: red cap, black neck and tail, white body, wings raised to dance |
| Unicorn | Horse, Okapi, Narwhal | round pony with a spiral horn, soft curled mane, small flowers |
| Bat | Flying Squirrel, Owl | hanging upside down, wings folded like a cloak, big ears |
| Raccoon | Tanuki, Red Panda | black eye mask, ringed tail, washing something in a small stream |
| Kitsune | Fox, Cat | white fox-spirit look, several fanned tails, small red marks on its face |

The tails are the point of Kitsune. Nine may not fit inside 3,072 bytes at card size, so it shows as many as can be told apart, and the message says nine.

### Samples first: Unicorn, Tanuki, Harp Seal, Komainu
The owner asked for Unicorn by name. Tanuki and Komainu test the cute Japanese style, and Harp Seal is the real animal that replaced the catfish. Draw them first and pause for the owner's approval, because "cute enough" is the owner's call and they must match the existing cards. The other 14 follow after approval.

### Match the existing cards' simple style
The owner rejected the first samples for having heavy dark shapes and large shiny eyes. New drawings use light bodies, small plain ink eyes, little `art-deep`, and simple poses, like Cat, Whale and Horse. The owner asked for Tanuki's and Komainu's fuller folk-art looks directly, so those two carry more detail. Colours still come only from each card's family.

### Text in both languages, reviewed with the samples
- Each card gets the same fields as the others: three keywords, a short second-person message, one reflection question and a first-person affirmation.
- Legendary messages tell a little of the story, as real animals' messages tell a real habit: the kitsune's nine tails, the komainu at the shrine gate. All text is newly written.
- The Chinese is natural Taiwanese Traditional Chinese with the same gentle tone, using these names, which the owner reviews:
  熊狸, 紅毛猩猩, 鳳凰, 犛牛, 獅鷲, 化狸, 馬來貘, 樹袋鼠, 槌之子, 水母, 豎琴海豹, 狛犬, 笑翠鳥, 丹頂鶴, 獨角獸, 蝙蝠, 浣熊, 九尾狐

### Contact sheet rebuilt in the scratchpad
A scratchpad page shows all 78 drawings on their family faces at card size and 2×, in light and dark, using the real oracle CSS. It is used for the sample check-in and the final no-two-alike review, and it stays out of the repo.

### Checks
- `oracle-data.test.ts`: ids `animal-01` to `animal-78`, 78 distinct animals, 13 per family, and the new animals present with their themes.
- `oracle.test.ts`: uniform draw over 78, with chi-square critical values at p = 0.001 for 77 and 76 degrees of freedom, computed rather than estimated.
- `language-text.test.ts`: 78 distinct Chinese animal names.
- `guides.test.ts` and `e2e/guide.spec.ts`: "78".
- `e2e/oracle.spec.ts` already takes the deck size from the data. Its fixed sequence has to reach all 78 within the loop cap, so the cap (and timeout) rises if needed, and the comment records the draw at which all 78 appear.

## Risks / Trade-offs

- [A drawing reads as a different animal at card size] → look-alike table, samples first, full-sheet review by the owner.
- [Tanuki and Raccoon look alike, and both are new] → Tanuki has its hat, leaf and coin, Raccoon has a black mask and a stream, and they are in different families.
- [Griffin lore makes it look fierce] → it's drawn as a baby.
- [Folklore names are unfamiliar, such as Tsuchinoko] → the drawing focuses on one identifying feature, and the name is on the card.
- [The e2e coverage loop gets slower with 78 cards] → raise the cap and timeout, and keep the sequence fixed.
- [Chinese names vary] → use the common Taiwanese name, and the owner reviews them.

## Migration Plan

Ship as one push after the owner approves the drawings and texts and all checks pass. The art test needs one drawing per id, so the deck can't be added halfway. Rollback is a revert. Share links don't carry oracle cards.
