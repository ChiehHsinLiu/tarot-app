# Design

## Context

- **The animal oracle drawings,** from the archived `add-oracle-animal-art`:
  - They're hand-written SVGs in `src/assets/oracle/animal/<id>.svg`.
  - `src/lib/oracle-art.ts` loads them with `import.meta.glob(..., { query: '?raw', import: 'default', eager: true })`, casting the result rather than passing a generic, which breaks the transform.
  - They're inlined with `dangerouslySetInnerHTML` in an `aria-hidden` span.
  - They're coloured only by the classes `art-fill`, `art-deep`, `art-light`, `art-ink`, `art-blush` and `art-line`, which `index.css` maps to `--family-face` and `--family-edge` under `.oracle-art`.
  - `oracle-art.test.ts` holds the format checker (`formatProblems`): an element, attribute and class allow-list, an `art-ink` shape, at most 3,072 bytes, and no text, comments or CDATA.
- **The Lenormand face** (`LenormandCardFace`) currently shows a large number (`.lenormand-number`) and the name. `LenormandReadingView` is lazy-loaded behind `import.meta.env.DEV` and imports `Lenormand.css`, so everything it imports lands in a dev-only chunk.
- **The scratchpad contact-sheet generator** renders oracle drawings with the real CSS for review.

## Goals / Non-Goals

**Goals:**
- 36 drawings that read clearly at card size (96px) and in both schemes, in the same storybook style as the animal deck.
- One shared format checker, so both decks are held to identical rules.
- No Lenormand bytes in `dist/`.

**Non-Goals:**
- Playing-card insets.
- Animation.
- Any change to the tarot or oracle faces.

## Decisions

### Files, loader and dev-only boundary

- **Files:** `src/assets/lenormand/lenormand-NN.svg`.
- **Loader:** `src/lib/lenormand-art.ts` mirrors `oracle-art.ts` and exports `LENORMAND_ART` keyed by card id.
- **Dev-only boundary:** only `LenormandCardFace` imports the loader, and only the lazy `LenormandReadingView` imports that face. The eager glob therefore lands in the dev-only chunk, which the production build never creates.
- **Verification:**
  - `dist/` has no "lenormand" in any form.
  - The number of `viewBox="0 0 100 100"` strings in the bundle stays 36, the oracle's count.
- **Offline:** once the chunk is loaded, every Lenormand drawing is in memory, so drawing again needs no network.

### Shared format checker

Move `formatProblems`, the root string, the allow-lists and `MAX_BYTES` from `oracle-art.test.ts` to `src/lib/art-format.ts`. Only tests import it.

- `oracle-art.test.ts` keeps its bad-sample tests and per-file checks, now importing the checker, with the same results.
- `lenormand-art.test.ts` runs every Lenormand file through it.
- The `art-ink` requirement stays. For Lenormand objects it means a dark accent, such as a keyhole, a window or the eye of the Rider's horse, which keeps every drawing anchored with some contrast.

**Instead of copying the checker:** two copies would drift, and the safety argument for `dangerouslySetInnerHTML` rests on a single allow-list.

### Pastel colour families and face layout

The first samples used one antique palette (parchment `#f3ead8` with antique blue `#5f7f99`). The owner chose pastel instead.

**The families:** each Lenormand card gets one of the six oracle families from `ORACLE_PALETTES` in `src/lib/palette.ts`, whose contrast is already unit-tested against the card ink. The family is stored as `palette` in `data/lenormand/deck.json` and carried onto `LenormandCard`. The data test checks every card has a valid family.

**Grouped by subject:**

| Family | Cards |
|---|---|
| Peach (home and warm animals) | Rider, House, Fox, Bear, Dog, Mice |
| Sage (plants and nature) | Clover, Tree, Snake, Garden, Mountain, Crossroads, Lily |
| Sky (sky, sea and travel) | Ship, Clouds, Stars, Moon, Fish, Anchor |
| Butter (sun, luck and gold) | Child, Stork, Ring, Letter, Sun, Key |
| Rose (love and people) | Bouquet, Birds, Heart, Gentleman, Lady |
| Lavender (endings and mystery) | Coffin, Scythe, Whip, Tower, Book, Cross |

**How the face uses it:**
- `LenormandCardFace` sets `--family-face` and `--family-edge` inline from `ORACLE_PALETTES`, as the oracle face does.
- `Lenormand.css` binds `--face-bg` and `--face-edge` to them.
- The drawing span carries `class="oracle-art lenormand-art"`. It reuses the public art-class rules, which are scoped to `.oracle-art` and read the family variables, so public CSS stays unchanged. `.lenormand-art` only names the element for checks.

**Layout:** the frame's three grid rows hold:
1. `.card-numeral` with the number, in Fraunces at the size tarot uses for its numeral
2. the 96px drawing
3. the name

**Fallback while drawing:** until all 36 exist, a card without a file keeps the large-number placeholder, on its family face. Task 3.5 removes the fallback, and the test then requires all 36.

### Drawing style rules (for review with the samples)

- `viewBox="0 0 100 100"`, one centred subject filling about 70–80% of the box, with a soft `art-line` outline on the main shapes.
- About 8–20 shapes, so the picture reads at 96px. There's no text, numbers or letters, not even on the Letter or the Book.
- Traditional pictures, drawn fresh:
  - **People:** the Rider is a person on a trotting horse. The Gentleman and Lady are friendly head-and-shoulders portraits, told apart by a top hat for the Gentleman and a flower in the hair for the Lady, with no caricature.
  - **Plants:**
    - Clover: a four-leaf clover
    - Tree: a single leafy tree with roots
    - Bouquet: a wrapped bunch of flowers
    - Garden: a little gate with hedges
    - Lily: one tall lily stem
  - **Sky:**
    - Clouds: two clouds, one darker
    - Stars: a cluster of five-point stars
    - Sun: a sun with rays
    - Moon: a crescent with a small star
  - **Animals:**
    - Snake: a coiled snake
    - Fox: a sitting fox
    - Bear: a standing bear
    - Birds: two birds on a branch
    - Stork: a stork on one leg
    - Dog: a sitting dog
    - Mice: two mice
    - Fish: two fish
  - **Objects:**
    - Ship: a sailing ship
    - House: a cottage
    - Coffin: a closed coffin, gentle rather than gloomy
    - Scythe: a scythe
    - Whip: crossed birch rods
    - Ring: a ring with a gem
    - Book: a closed book with a clasp
    - Letter: a sealed envelope
    - Key: a key
    - Anchor: an anchor with rope
    - Cross: a simple cross on a small hill
    - Tower: a tall stone tower
    - Mountain: twin peaks
    - Crossroads: a forked path with a signpost, with no text
    - Child: a small child holding a toy

  Fox, Dog and Bear share no outline with the oracle's animals. Each is redrawn for this deck, not copied.

### Samples and review

- **Samples:** Rider, House and Clover cover a figure with an animal, a building and a plant, the three hardest kinds of subject.
- **Review:** the scratchpad contact sheet gains a `--deck lenormand` mode that renders each drawing on the Lenormand face at card size and 2×, in light and dark.
- **Groups to compare side by side** before finishing:
  - plants: Clover, Tree, Bouquet, Garden, Lily
  - sky: Clouds, Stars, Sun, Moon
  - animals: Fox, Dog, Bear
  - people: Gentleman, Lady, Child, Rider
  - pointed objects: Scythe, Whip, Key, Anchor, Cross

## Risks / Trade-offs

- **The CSS reuse couples Lenormand to `.oracle-art` naming.** → It's a single class name, documented in `Lenormand.css`. Renaming it later is a mechanical change, and it avoids duplicating about 30 lines of public CSS.
- **A drawing leaks into the public bundle through a wrong import.** → The `dist/` grep and the viewBox count run in the checks, on the preview and on the live bundle.
- **Some subjects (Coffin, Cross, Scythe) could feel grim.** → They're drawn soft and rounded, in the same cozy palette, with blush accents allowed. The owner reviews the full sheet.
- **96px is small for the detailed subjects (Ship, Garden, Crossroads).** → The shape budget, plus a review at card size, not only at 2×.

## Migration Plan

This is a normal push to `main` after approval. The live site should be unchanged, which the live checks and a live-bundle grep confirm. To roll back, revert the commit, and the faces fall back to the number placeholder.
