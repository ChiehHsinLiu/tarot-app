# Proposal

## Why

When a reading is drawn, every card appears face up at once. Turning cards over is the moment of a real reading, and the app has nothing like it. While exploring designs, the owner chose to start with an automatic reveal: each card lands face down and turns itself over, one after another. A tap-to-turn mode may come later on top of the same pieces.

## What Changes

- **A card back:** one original night-sky drawing used by every deck. It is deep plum with a gold frame, a crescent moon and scattered stars, and it is mirror-symmetric so it looks the same mid-flip.
- **Cards turn over on their own:** on a newly drawn tarot reading, oracle card or Lenormand reading, each card first shows its back and then flips face up. The cards flip in order, about 0.3 seconds apart, with each flip taking about 0.6 seconds. A three-card reading is fully face up in about 1.2 seconds.
- **Text follows its card:** the card's title, keywords and meaning fade in as each card lands. For the Yes / No spread, the verdict fades in with the first card. On the oracle screen, the card's reading fades in with it.
- **Draw again flips again:** each new oracle card turns over the same way.
- **Shared reading links open face up:** someone opening a link sees the result straight away, with no flip.
- **Reduced motion:** when the system asks for reduced motion, cards and text appear face up at once, with no flip and no fade.
- **Nothing waits on the animation:** the whole reading is in the page from the start. Focus still moves to the heading, screen readers can read everything at once, and every button works immediately. The card back is hidden from assistive technology.
- **Clarification:** the "Decoration stays out of the way" rule (decoration "SHALL NOT move") covers flourishes, frames and texture. It does not cover the card reveal, which is now its own requirement.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `visual-theme`: adds requirements for the card back and the automatic card reveal (order, timing, text, reduced motion, accessibility), and clarifies that the "no movement" rule for decoration does not cover the reveal.
- `reading-share-links`: a shared reading opens with its cards already face up.

## Impact

- New `src/components/CardFlip.tsx` (the face-down wrapper and the night-sky back), used by `ReadingView.tsx`, `OracleCardView.tsx` and `LenormandReadingView.tsx`.
- New flip, fade and reduced-motion styles in `src/index.css`.
- No change to drawing, data, routes, share link format, prompts, or Ask Claude. The public build gains one small inline drawing and some CSS.
- Scratchpad browser checks: a new flip check, plus re-running the existing reading, oracle, share, theme and Lenormand checks.
