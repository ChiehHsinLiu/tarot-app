# Design

## Context

- The tarot screen's starting view is the `Composer` form in `src/App.tsx`. In order it shows:
  - the "Tarot reading" heading, which is focused on open
  - an optional invalid-link notice
  - `SpreadPicker`
  - `QuestionBox`
  - the Draw row
- The oracle's starting view is `OracleIntro`: the heading, one intro sentence, and Draw.
- Both views remount whenever the screen is shown. Going Home and back, "New reading", and "Draw again" then returning all remount them. So an uncontrolled `open` state starts closed each time without extra code.
- Display text already lives in `data/i18n/en/*.json`, and the data tests check it for completeness (`deck-data.test.ts`, `oracle-data.test.ts`).
- The dev-only Lenormand screen (`add-lenormand-deck`) will need the same guide, so the guide must not be tied to tarot or oracle code.

## Goals / Non-Goals

**Goals:**
- One `ScreenGuide` component and one text file, keyed by screen. Adding a screen's guide is one data entry and one line of JSX.
- Native, accessible disclosure behaviour with no new state in `App`.

**Non-Goals:**
- No guide on the home page, the reading views or share links.
- No mention of Ask Claude or any other dev-only feature. A dev-only extra paragraph can come later if it's wanted.
- No remembering which sections were open, in memory or in storage.
- No translations beyond the English file, though the file sits in `i18n/en` like the rest.

## Decisions

### Native `<details>` / `<summary>`, two per screen

Each section is a `<details className="screen-guide">` whose `<summary>` is "How it works" or "About this deck". Browsers give `<summary>` keyboard toggling (Enter and Space) and announce it as expanded or collapsed, which covers the accessibility requirement without ARIA wiring.

- **Instead of a button with `aria-expanded` and React state:** that would re-implement the same behaviour, and the state would have to reset on screen changes. The remount gives that reset for free with `<details>`.
- **Instead of always-visible text:** about 150 words per screen would push the spread choice and Draw below the fold on phones. Closed sections keep the screens as they are now.
- **Instead of one combined section:** two short labelled sections let a returning visitor open just the deck explanation. They also match the user's "instruction and explanation" wording.

The default triangle marker is hidden (`list-style: none`, plus `::-webkit-details-marker` for Safari) and replaced by a small chevron that rotates when the section is open. Under `prefers-reduced-motion` it changes without rotating.

### Text in `data/i18n/en/guides.json`

```json
{
  "note": "Readings are for reflection and fun, not professional advice.",
  "screens": {
    "tarot":  { "howItWorks": ["step", "..."], "about": ["paragraph", "..."] },
    "oracle": { "howItWorks": ["..."],          "about": ["..."] }
  }
}
```

`howItWorks` renders as an `<ol>` of steps. `about` renders as paragraphs, then the shared `note` as a final `.guide-note` paragraph. Everything is a React text node, so the text can never inject markup. A `src/lib/guides.ts` module exports the typed data and `GuideScreen = 'tarot' | 'oracle'`; Lenormand will widen the union.

- **Instead of hard-coding the text in JSX:** keeping it in data matches how card and spread text is stored, and lets a test check it.

### Placement

- **Tarot:** after the invalid-link notice and before `SpreadPicker`, inside the form. The `<summary>` elements are not buttons, so toggling never submits the form.
- **Oracle:** after the intro sentence and before Draw.
- Focus still goes to the heading on open, as `app-navigation` requires. The guides come right after it in tab order.

### Draft text, for review

**Tarot, How it works**
1. Choose a spread. Yes / No draws one card to answer a question. Three cards draws three, for your past, present and future.
2. Type your question. Yes / No needs one; for Three cards it's optional.
3. Press Draw. Each card comes out upright or reversed. A reversed card is shown upside down and read with its reversed meaning.
4. In Yes / No, the answer (Yes, No or Maybe) comes from the card you drew and whether it's upright or reversed.
5. Press Share to turn your reading into a link anyone can open. You choose whether the link includes your question.

**Tarot, About this deck**
- This is a full 78-card tarot deck. The 22 Major Arcana, from The Fool to The World, speak to life's big themes. The 56 Minor Arcana cover everyday matters in four suits: Wands for energy and drive, Cups for feelings and relationships, Swords for thoughts and challenges, and Pentacles for work, money and home.
- The card meanings were written for this app.

**Oracle, How it works**
1. Press Draw for one animal card. There's no question to ask.
2. Read its message, then take a moment with its reflection question and affirmation.
3. Want another? Press Draw again for a different card, as often as you like.

**Oracle, About this deck**
- The animal oracle is an original deck made for this app: 36 animals, each paired with a theme, such as the Dachshund · Small but Mighty. The cards come in six colour families, from peach to rose, and each animal has its own drawing.

**Shared note:** Readings are for reflection and fun, not professional advice.

### Tests

`src/lib/guides.test.ts` checks:
- every `GuideScreen` has non-empty `howItWorks` and `about`
- no string contains `<`, `>`, a Markdown marker (`*`, `#`, `` ` ``), or "Claude"
- the content requirements, by key phrases:
  - tarot steps mention "Yes / No", "Three cards", "reversed" and "Share"
  - tarot about mentions "78", "22", "56" and the four suits
  - oracle steps mention "Draw again"
  - oracle about mentions "36" and "six colour families"

A scratchpad browser check (`guide-check`) covers the rendered behaviour.

## Risks / Trade-offs

- **The text drifts from the app**, for example after a new spread. → The key-phrase test fails when a spread or deck fact named in the spec changes. Adding a spread will need a guide update as part of that change.
- **Closed sections are easy to miss.** → They sit right under the heading with clear labels, styled as light cards with a chevron. Defaulting them to open would undo the clean layout from the storybook redesign.
- **Older Safari shows the default marker anyway.** → The marker is hidden with both standard and `-webkit-` rules, and checked in the browser at phone width.

## Migration Plan

This is a normal push to `main` after approval: GitHub Pages deploys, then the live checks run. To roll back, revert the commit. There's no data or link format change.
