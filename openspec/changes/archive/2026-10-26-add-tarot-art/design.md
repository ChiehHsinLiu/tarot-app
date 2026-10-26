# Design

## Context

- **Today's face:** `src/components/CardFace.tsx` renders a 140px-wide cream card (`.card-face` in `styles/card.css`) as a three-row grid:
  - top: the numeral row (empty on minor cards)
  - middle: one 56px stroke symbol from the `SYMBOLS` map, one per suit plus a major sparkle
  - bottom: the name
- **Card colours:** the face is `--card-bg` (`#fffaf0` light, `#f6ecdc` dark), and the outer border, inner frame and dots are `--card-border` (`#c9a96e`).
  - That gold is only 2.2:1 on the light face and 1.9:1 on the dark face. That's fine for the thin decorative frame, but too faint for picture outlines.
- **The oracle art is the model to follow:**
  - Each card's SVG lives in `src/assets/oracle/animal/`, is loaded with `import.meta.glob(..., { eager: true })`, and is inlined with `dangerouslySetInnerHTML`.
  - Each drawing is checked by `formatProblems()` from `art-format.ts`: a 100×100 root, simple shapes only, the six `art-*` classes, at least one `art-ink` shape, and at most 3 KB.
  - Its colours come from `--family-face` / `--family-edge` through `.oracle-art .art-*` rules in `styles/oracle.css`.
  - The drawings average about 1.2 KB.
- **Card data:** minor cards have `suit` and `rank` 1–14, where 11–14 are Page, Knight, Queen and King. Major cards have `rank` 0–21.
- **Loading:** after `load-screens-on-demand`, `CardFace` is only imported by the tarot screens' chunk, so anything it imports lands there.

## Goals / Non-Goals

**Goals:**
- Every card is recognisable at a glance, number cards can be counted, and the deck reads as one storybook set beside the oracle.
- The home page's download stays the same size.

**Non-Goals:**
- New card back, flip, mat or meanings.
- Animated or per-orientation art.

## Decisions

- **Five colour families in `palette.ts`,** as `TAROT_PALETTES: Record<'major' | Suit, { edge: string }>`. The face stays cream (`--card-bg`). Starting values, all at least 3:1 on both cream faces:

  | Family | Edge | Light face | Dark face |
  |---|---|---|---|
  | major | `#a07a2c` gold | 3.8 | 3.4 |
  | wands | `#b05a35` terracotta | 4.6 | 4.1 |
  | cups | `#4a7aa3` blue | 4.4 | 3.9 |
  | swords | `#76679f` lavender | 4.8 | 4.3 |
  | pentacles | `#5a8448` green | 4.2 | 3.7 |

  - `palette.test.ts` asserts 3:1 against both faces and that the five edges are distinct.
  - The outer border stays `--card-border` gold for every card, so tarot cards still read as one deck. The inner frame, dots and picture take the family edge through `--face-edge`, which `.card-face` already uses.
  - Alternative: pastel faces per suit, like the oracle. That would make tarot and oracle cards look alike, and the spec keeps tarot faces cream.
- **Number cards are drawn by code, not files.**
  - `src/lib/pips.ts` exports `PIP_LAYOUTS: Record<1..10, { x, y, size }[]>` in a 100×130 box. The layouts:
    - 1: one large centred symbol
    - 2–3: a vertical line
    - 4–10: two columns, with the odd one centred, in the Marseille-style arrangements
  - `CardFace` renders them as one `<svg viewBox="0 0 100 130">` containing a `<g transform>` per pip around the existing `SYMBOLS[suit]` paths. That keeps the soft stroke symbols the app already has.
  - `pips.test.ts` asserts, for every rank: the count equals the rank, every pip lies inside the box with a 4-unit margin, no two pips overlap, and the layout is left–right symmetric.
- **Drawn cards are files:** `src/assets/tarot/<card-id>.svg` for the 22 major cards (`major-00` … `major-21`) and the 16 courts (`<suit>-11` … `<suit>-14`). 38 files.
  - They use the same format and `formatProblems()` as the oracle. Figures need `art-ink` eyes anyway, and a major card without a face, such as The Tower, uses `art-ink` for a dark accent, as the Lenormand objects do.
  - `src/lib/tarot-art.ts` loads them like `oracle-art.ts`. `tarot-art.test.ts` asserts exactly one file per major and court card, no others, no two files identical, and no format problems.
  - **Courts follow one pattern per rank,** so the 16 read as a set: the Page stands and holds the suit's symbol up, the Knight rides, the Queen and King sit enthroned, each holding their suit's symbol. They are drawn in the suit's colours.
  - **Major cards use their traditional symbols in new compositions** (a tower and lightning, a lion with a figure, a wheel). Nothing is traced or copied from an existing deck.
- **The face grid stays the same three rows,** and the middle row grows. A drawing shows at 96×96px. The pip box shows at 96×125px on the 140px card and scales with the card on the phone mat.
  - The `SYMBOLS` map stays, now used for the pips. The major sparkle is no longer shown and is removed.
- **Art colours:** `.tarot-art .art-*` rules in `styles/card.css`, mirroring the oracle ones, with `--face-edge` in place of `--family-edge` and `--card-bg` in place of `--family-face`.
- **Work in batches, each reviewed by the owner** on a contact sheet before the next:
  1. colours and number cards
  2. courts
  3. major cards 0–10
  4. major cards 11–21

  The change is only pushed when all 38 drawings are in, because until then the spec isn't met.

## Risks / Trade-offs

- **[Risk] 38 drawings vary in quality or style.**
  → Mitigation: a contact sheet of the batch in both palettes, at full size and at 320px wide, for the owner after every batch. Redraw on request before moving on.
- **[Risk] Ten pips don't fit or can't be counted on a phone.**
  → Mitigation: `pips.test.ts` for geometry, and an e2e check at 320px wide that counts the pip groups and measures that each pip is at least 9px wide.
- **[Risk] Tarot art grows the home download.**
  → Mitigation: `e2e/split.spec.ts` from `load-screens-on-demand` already fails if the entry chunk gains card drawings. Add a tarot drawing marker to it.
- **[Trade-off] About 45 kB more in the tarot screens' chunk** (38 × ~1.2 kB). It loads in the background after home has shown.
  - Actual, as built: the drawings average about 2.2 kB, so the chunk went from 49 kB to 131 kB (17 kB to 30 kB gzipped). The entry chunk is unchanged at 239 kB.

## As built

- **Bigger pictures, at the owner's request:** the pip box shows at 104×135px (not 96×125) and the drawings at 112×112px (not 96×96), the most the middle row holds when the name wraps to two lines. Pip sizes in `PIP_LAYOUTS` were raised to match: the Ten's pips are 28 units, about 16–21px on screen.
- **Rounder figures, at the owner's request:** large heads, bell-shaped bodies and rounded limbs, closer to the oracle animals.
- **The offline check** in `e2e/tarot-art.spec.ts` runs on the public build only, like `split.spec.ts`: the dev server fetches each module as it is first used.
