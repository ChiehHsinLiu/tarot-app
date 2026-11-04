# Proposal

## Why

The owner wants Little Oracle to be readable in Traditional Chinese as well as English, so Chinese-speaking friends and family can use it comfortably. The English text already lives in its own files (`data/i18n/en/`), which makes a second language a natural next step. The buttons and headings are still written into the components, though.

## What Changes

- Add a **language switch** on every screen's header: it shows **中文** while the app is in English and **English** while it is in Chinese. The choice is remembered on this device. On a first visit, the app starts in Chinese if the browser prefers Traditional Chinese, and in English otherwise.
- In Chinese, **what a visitor reads is in Traditional Chinese**:
  - the buttons, headings, notices and the How it works guides
  - all 78 tarot card names, keywords, meanings and yes/no notes
  - all 48 oracle animals: name, theme, keywords, message, reflection and affirmation
- **Kept in English, at the owner's request:** the spread names (Yes / No, Three cards), their position labels (Answer, Past, Present, Future), the answer words (Yes, No, Maybe), and everything for Claude: the Copy for Claude button, its messages and the prompt it copies. In the dev app, Ask Claude stays English too.
- **Share links don't change.** A link opens in the language of the person viewing it.
- The page's language tag follows the choice, so screen readers and browsers read the text correctly. Chinese text uses the device's own Chinese fonts, so no font is downloaded.
- The app name **"Little Oracle"** and the card drawings stay the same in both languages.
- The translations are written in batches, and the owner checks each batch in the dev app before the next one.

Not changing: the Lenormand deck (dev-only) stays English only, and the draw, the decks, the art and the share-link format are untouched.

## Capabilities

### New Capabilities
- `app-language`: choosing English or Traditional Chinese, remembering the choice, which text follows it (interface, guides, tarot cards, oracle animals), the rules the Chinese text must follow, and what stays English (the app name, spread names and answer words, everything for Claude, Lenormand).

### Modified Capabilities
- `title-page`: the home subtitle shows in the chosen language.

## Impact

- **Data:** new `data/i18n/zh-Hant/` files mirroring `en` (cards, spreads, guides, oracle animals), plus a new `ui.json` in both languages for the interface text now written into the components. Dev-only Ask Claude text moves to `data/i18n/en/ui-dev.json`, English only.
- **Code:**
  - a small language module and React context (current language, `t()` for interface text, saved in `localStorage`)
  - a language switch in `SiteHeader.tsx`
  - every component with written-in text moves it to `ui.json`
  - `deck.ts`, `guides.ts` and `oracle.ts` look text up by language
  - Copy for Claude always builds its prompt from the English text
  - `index.html` `lang` is kept in step
- **Size:** each language's card and animal text loads with its screen, as English does today. The home page's first load gains only the interface text and the switch.
- **Tests:**
  - unit checks that every Chinese file has exactly the same keys and limits as English
  - a check that the copied prompt is the same in both languages
  - e2e checks for the switch: it is remembered after reload, follows the browser on a first visit, sets `lang`, a share link opens in Chinese, Lenormand stays English in dev, and the public build still has no Lenormand text
- **Docs:** README.
