# Design

## Context

- Card, spread, guide and animal text already lives in `data/i18n/en/` and is imported statically by `src/lib/deck.ts`, `guides.ts`, `oracle.ts` and `lenormand.ts`. Those modules have no React imports, because Node scripts and the dev Vite plugin (`vite/private-readings.ts`) reuse them.
- Interface text (headings, buttons, notices, aria labels, the subtitle) is written into the components and screens. The Copy for Claude prompt comes from `prompts/reading.md` plus English verdict words in `src/lib/prompt.ts`. The dev Ask Claude endpoint builds the tarot, oracle and Lenormand prompts on the server from `prompts/*.md`.
- The tarot and oracle screens are lazy chunks (`App.tsx` `onDemand`), and site-deployment requires card text to stay out of the home page's first load. The app stores nothing in the browser today.
- Fonts: `--font-story` is Fraunces (self-hosted, Latin only), then Georgia and serif. The CSP allows fonts only from the site's own origin.
- `index.html` has `lang="en"`.

## Goals / Non-Goals

**Goals:**
- One language value drives every visible string, and switching is instant and keeps state.
- The Chinese text has the same shape as the English text and is checked by the same tests, so nothing can be missing.
- The owner reads every translated batch before it ships.

**Non-Goals:**
- Simplified Chinese, or a general framework for many languages (the structure allows a third later, but none is planned).
- Translating Lenormand, the README, the specs, or code comments.
- Putting the language in share links or the URL.
- Translating "Little Oracle".

## Decisions

### Language ids and files
- The ids are `'en' | 'zh-Hant'`. `data/i18n/zh-Hant/` mirrors `en`: `cards.json`, `spreads.json`, `guides.json` and `oracle/animal.json`.
- A new `ui.json` in both folders holds the interface strings, keyed by short dotted names such as `composer.draw` and `reading.newReading`, with `{name}` placeholders where text is built from parts.
- Lenormand files are not copied.
- `src/lib/language.ts` (no React) exports the `Language` type, `detectLanguage(navigatorLanguages)`, and the saved-choice helpers. The choice is saved under `localStorage['little-oracle.lang']`, and every read and write is wrapped in try/catch. It follows the "remembered" rule in the spec.

### Text lookup by language, kept React-free
- `deck.ts`, `guides.ts` and `oracle.ts` import both languages' text.
- They expose builders keyed by language (for example `buildDeck(lang)`, `guidesFor(lang)`, `buildOracleCards(data, textFor(lang))`), and their existing English exports stay for Node scripts and existing tests.
- The tarot and oracle chunks therefore carry both languages. That's about +50 KB raw each for cards and animals, small after compression. In return, switching on a shown screen needs no fetch and works offline.
- The home page's first load gets only `ui.json` for both languages (a few KB).
- *Alternative:* load each language's text on demand. That would mean a smaller chunk, but it adds a loading state and breaks offline switching. It isn't worth it at this size.

### React side
- A `LanguageProvider` in `App.tsx` holds the language state, sets `document.documentElement.lang`, and saves the choice.
- `useLanguage()` returns `{ lang, setLang, t }`, where `t(key, vars?)` reads `ui.json`.
- Screens derive their cards, spreads and guides from `lang` with `useMemo`.
- Readings store only card ids, orientations and the spread id (`Reading` is unchanged), so switching language re-renders the same reading with the other text and never redraws.
- The switch lives in `SiteHeader` in both of its forms. It is a `<button>` whose text is the *other* language, with `lang` set on the text so screen readers pronounce it correctly.

### Everything for Claude stays English (owner's choice during batch 1)
- `ReadingView` builds the Copy for Claude prompt from `prompts/reading.md` with the English spread and the English cards (`tarotDecks.en`), whatever the app language. So the prompt for a reading is byte-identical in both languages, and the prompt builders, templates and dev endpoint are unchanged.
- The Copy for Claude button, its "Prompt copied" message and the manual-copy hint keep their English text in `zh-Hant/ui.json`.
- The dev-only Ask Claude text lives in `data/i18n/en/ui-dev.json` and is not translated.

### Fonts
- Under `:lang(zh-Hant)`, `--font-story` and the body font become system CJK stacks:
  - story: `'Fraunces Variable', 'Songti TC', 'Noto Serif TC', 'PMingLiU', serif`
  - body: `system-ui, 'PingFang TC', 'Microsoft JhengHei', 'Noto Sans TC', sans-serif`
- Latin numerals keep Fraunces, and nothing is downloaded, so the CSP is unchanged.
- Line-height and the card meaning box are checked at 320 px. Chinese is denser than English, so overflow risk is low.

### Translation approach
- I write the translations as natural Taiwanese Traditional Chinese, not literal word-for-word, with the same gentle tone.
- Tarot names follow common Taiwanese usage: 愚者, 魔術師 … 世界. The suits are 權杖, 聖杯, 寶劍 and 錢幣, and the courts are 侍者, 騎士, 皇后 and 國王. Upright is 正位 and reversed is 逆位.
- **Kept English (owner, batch 1):** the spread names, the position labels (Answer, Past, Present, Future), and the answer words Yes, No and Maybe. `zh-Hant/spreads.json` therefore repeats the English, and the guides name them in English inside 「」.
- **Review batches**, each checked by the owner in the dev app before the next:
  1. Interface, guides and the subtitle
  2. The 22 majors
  3. Wands and cups (28)
  4. Swords and pentacles (28)
  5. The 48 animals
- Until a batch is approved, missing Chinese keys fall back to English, so the app works in Chinese throughout. The fallback is removed and coverage is enforced in the last task.

## Risks / Trade-offs

- [Translation quality: I'm not a native reviewer] → The owner approves every batch. The text is written as natural Chinese rather than literal translation, and unclear terms are listed for the owner in each batch.
- [Interface strings missed while moving them to `ui.json`] → An e2e check walks every public screen in Chinese and fails on Latin-letter words other than "Little Oracle" and Roman numerals.
- [Fonts differ by device (no CJK serif on some Android phones)] → The stacks fall back to the system serif or sans. It still reads fine, just less storybook. No download is acceptable under the CSP.
- [Browser storage blocked] → try/catch, and the choice lasts for the visit only (in the spec).
- [Chunk growth] → Measured in the final task. The home page's first load grows only by `ui.json` and the switch.

## Migration Plan

Ship as one push after all five batches are approved and the unit and e2e checks pass. Existing visitors start in English, unless their browser prefers Traditional Chinese, and old share links are unchanged. Rollback is a revert. The saved `little-oracle.lang` key is then simply ignored.
