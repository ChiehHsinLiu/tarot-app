# Design

## Context

- **Card faces today:**
  - `CardFace`, `OracleCardFace` and `LenormandCardFace` each render `div.card > div.card-face[role=img]`.
  - The face is 140px wide with `aspect-ratio: 3 / 5`.
  - A reversed tarot face uses `transform: rotate(180deg)` on `.card-face`.
- **Where the reading views mount:**
  - `ReadingView` mounts fresh for every draw.
  - `OracleCardView` is keyed by card id, and `drawOracle` never repeats the current card.
  - Shared readings are keyed by the reading. So a fresh mount means a new card, and the views keep no state worth carrying over.
- **Motion today:** there is one 0.15s hover transition, no keyframes, and no `prefers-reduced-motion` rule.
- **Tests:** these are Vitest unit tests on `src/lib` only. Screens are checked with Puppeteer scripts in the scratchpad.

See proposal.md for the motivation, and the delta specs for the required behaviour.

## Goals / Non-Goals

**Goals:**
- A flip that needs no new app state, timers or effects, and that plays again on its own whenever a card view mounts.
- The final, resting state is today's DOM and layout, so that if the animation is turned off, cut short or unsupported, the result is the current face-up reading.
- One wrapper shared by all three decks.

**Non-Goals:**
- Tap to turn, sound, shuffling, or dealing cards from a deck. These are possible later changes.
- A different back per deck or per colour scheme.
- Animating anything else on the page.

## Decisions

### CSS keyframes on mount, not JavaScript

The flip is a CSS `@keyframes` animation with `animation-fill-mode: both`. Its delay is computed from a `--flip-index` custom property: `calc(var(--flip-index) * 0.3s)`. Before the delay ends, the `from` frame holds the card face down. After it, the `to` frame is the plain face-up state.

- *Why:* new elements start their animations on their own, so a new reading, a new oracle card or Draw again replays it with no code. React StrictMode's double mount, the remount keys and Back navigation need no special handling.
- *Alternatives:*
  - **A `revealed` state set by timers in `useEffect`:** this adds timers to clean up, double-runs in StrictMode, and leaves a hidden face if a timer fails.
  - **The Web Animations API:** the same lifecycle work, with no gain for three cards.

### A `CardFlip` wrapper around the existing faces

A new `src/components/CardFlip.tsx` exports `CardFlip({ index, children })`. It renders this structure:

```
div.card-flip   style --flip-index: index   (perspective)
  div.card-flip-inner                        (preserve-3d, animated rotateY)
    div.card-back  aria-hidden               (night-sky SVG, pre-rotated 180deg)
    {children}                               (the existing div.card > div.card-face)
```

- **Stacking:** `.card-flip-inner` is a one-cell grid, and the back and the face share that cell. The back is sized like `.card-face` (140px, 3 / 5, the same radius), so the layout around the card does not change.
- **The rotation:** the inner element animates from `rotateY(180deg)` to `rotateY(0)`. The back and the face both have `backface-visibility: hidden`, along with the `-webkit-` prefix for Safari, and the back sits at `rotateY(180deg)`.
- **Reversed cards:** the face's own `rotate(180deg)` happens inside the 3D context, about the z axis. It doesn't affect which side faces the viewer, so a reversed card lands upside down with no extra rule.
- *Why a wrapper:* the three face components and their `role="img"` labels stay as they are. Each view wraps its face in one place.

### The views decide when to flip

- **`ReadingView`** wraps faces only when `!shared`. A shared reading renders exactly what it does today, with no back in the DOM, which meets "no card back is shown".
- **`OracleCardView` and `LenormandReadingView`** always wrap their faces.
- **The index:** each slot passes its card position as `index`. The oracle's single card is index 0.

### Text fades are tied to the same index

- **The slot carries the index:** each spread slot and the oracle slot gets the `reveal` class and the same `--flip-index`.
- **What fades:** a `reveal-fade` keyframe (opacity 0 to 1, 0.3s, `fill-mode: both`) plays on these elements, with a delay of `index * 0.3s + 0.45s`, so they appear as the card lands:
  - `.card-title`, `.card-keywords` and `.card-meaning`
  - on the oracle, also its message, reflection and affirmation
- **The verdict** gets the fade with index 0.
- **Shown at once:** position labels, the heading, the question and the buttons are never faded.
- **Shared readings** have no `reveal` class, so they get no fade.
- *Why opacity only:* text at opacity 0 is still in the accessibility tree and can still be selected, which meets "The reveal never blocks the reading". `visibility` and `display` would hide it from screen readers.

### Reduced motion turns the animations off

`@media (prefers-reduced-motion: reduce)` sets `animation: none` on `.card-flip-inner` and on the faded text. With no animation, each element shows its resting state, which is face up and fully opaque. The back is still in the DOM but faces away and is hidden by `backface-visibility`, so nothing about the back shows.

### The back is inline JSX, in fixed colours

- **The drawing:** it lives in `CardFlip.tsx` as JSX shapes, like the suit symbols in `CardFace.tsx`, on the card's 3 / 5 shape.
- **What it shows:**
  - a plum field
  - a gold inner frame matching the face's frame inset
  - a gold crescent moon in the centre
  - small dot and sparkle stars placed mirror-symmetrically
- **New tokens:** two tokens, `--back-bg` (deep plum, around `#3b2a4a`) and `--back-gold` (reusing `--card-border`).
- **Same in both palettes:** these don't change in the dusk palette, just as card faces stay cream in both.
- *Why not an SVG file through `art-format.ts`:* that format is built for the 24 oracle and Lenormand cards, where drawings are coloured by their family. One fixed drawing is simpler kept in JSX, and it adds no network request.
- **Approval:** the owner approves the drawing from a screenshot before it is wired into all three views.

## Risks / Trade-offs

- **3D flip quirks in Safari:** a missing `-webkit-backface-visibility` shows both sides. → Include the prefix, and check in WebKit (Puppeteer with Safari is not available, so check by hand in Safari).
- **The fade delay feels slow on one card:** about 0.75s before the oracle message appears. → The timings are CSS variables, so they're easy to tune after review.
- **Opacity-0 text can be found with find-in-page** before it fades in. → This is harmless, and it lasts at most about 1.5s.
- **A card's box-shadow mid-flip** may look flat. → It's acceptable. A later polish can move the shadow to the wrapper.
- **The verdict colour block appears after the heading area,** so the layout is stable but the block "pops" in. → It fades with the first card, as the spec requires.

## Migration Plan

This is a pure front-end change with no data or URL changes. Rollback means reverting the commit.
