# Tasks

## 1. Language plumbing

- [x] 1.1 Add `src/lib/language.ts`:
  - the `Language = 'en' | 'zh-Hant'` type
  - `detectLanguage(languages)`: zh-TW, zh-HK, zh-MO and any zh-Hant tag give Chinese; everything else gives English
  - saved-choice helpers for `little-oracle.lang`, with every storage call in try/catch

  Verify with unit tests: the spec's browser cases, a stored choice wins, a bad stored value is ignored, and storage that throws.
- [x] 1.2 Add `data/i18n/en/ui.json` and move every public interface string into it:
  - the components, screens, `App.tsx` and the subtitle
  - aria labels and notices
  - the dev-only Ask Claude strings

  Add `LanguageProvider` and `useLanguage()` (`lang`, `setLang`, `t`), which set `<html lang>`. The English app must look exactly as before. Verify with `npx tsc -b`, `npm test` and `npm run e2e`, all unchanged.
- [x] 1.3 Add the language switch to `SiteHeader` (both forms). It shows the other language's name and has `lang` on its text. Add `data/i18n/zh-Hant/ui.json` as a copy of the English, to be translated in batch 1. Switching keeps the screen, the composer state and a shown reading. Verify with a first e2e `e2e/language.spec.ts`: the switch flips the label and `<html lang>`, it is remembered after reload, a first visit follows `zh-TW` versus `fr-FR`, and a drawn reading keeps its cards after switching.
- [x] 1.4 Look up text by language in `deck.ts`, `guides.ts` and `oracle.ts`, keeping the English exports. While translating, a missing Chinese key falls back to English. The tarot and oracle screens build their cards, spreads and guides from `lang`, and share links render in the viewer's language. Verify with `npm test` and an e2e check that an English share link opened in the Chinese app shows the same cards.
- [x] 1.5 Prompts stay English (owner's choice): Copy for Claude builds its prompt from the English spread and cards whatever the app language, and the button and its messages keep their English text. Ask Claude (dev) is unchanged and its text stays English in `ui-dev.json`. Verify that the prompt tests and snapshots are unchanged, and that the copied prompt is identical in both languages (e2e in 3.2).
- [x] 1.6 Fonts: add `:lang(zh-Hant)` system CJK stacks for `--font-story` and the body. Verify there is no new font request (CSP e2e), and that the Chinese composer, a reading and the oracle at 320 px have no sideways scroll and no text overflowing the card.

## 2. Translation batches (owner approves each in the dev app)

- [x] 2.1 Batch 1: translate `ui.json`, `guides.json` and the subtitle (spread names, position labels, answer words and Copy for Claude stay English). List any terms the owner should choose. Wait for approval.
- [x] 2.2 Batch 2: the 22 major arcana in `zh-Hant/cards.json`: names, keywords, meanings and yes/no notes, keeping each verdict. Wait for approval.
- [x] 2.3 Batch 3: wands and cups (Ace to King, 28 cards). Wait for approval.
- [x] 2.4 Batch 4: swords and pentacles (28 cards). Wait for approval.
- [x] 2.5 Batch 5: the 48 oracle animals in `zh-Hant/oracle/animal.json`. Wait for approval.

## 3. Coverage and checks

- [x] 3.1 Remove the English fallback. Add unit tests that every Chinese file has exactly the English keys, non-empty strings and the same limits (meanings ≤ 400, notes ≤ 140), with no Simplified-only characters from a checked list.
- [x] 3.2 Finish `e2e/language.spec.ts`:
  - each public screen in Chinese has no Latin words except "Little Oracle" and Roman numerals
  - The Star upright in Chinese
  - a screen reader name for a reversed Queen of Cups
  - the copied prompt identical in both languages
  - switching while offline after the tarot screen has shown
  - the home first load holds no card or animal text in either language

  In `e2e/dev/`, check that Lenormand stays English with the app in Chinese. Verify with `npm run e2e` and `npm run e2e:dev`.
- [x] 3.3 Update the README (the language switch, where the text files live, and how to add a string). Record the home first-load and tarot and oracle chunk sizes before and after from `npm run build`. Verify that `npm test`, `npm run e2e` and `npm run e2e:dev` all pass, and that `dist/` still has no Lenormand text.
  Result: the home page's first-load script went from 239.60 KB (73.78 KB gzip) to 245.19 KB (75.99 KB gzip), +2.2 KB gzip for the interface text in both languages, the language context and the switch; no card or animal text (checked in `e2e/language.spec.ts`). The TarotScreens chunk went from 339.64 KB (42.60 KB gzip) to 376.64 KB (57.76 KB gzip), and OracleScreen from 80.93 KB (18.99 KB gzip) to 100.41 KB (28.04 KB gzip), for the Chinese card and animal text. `npm test` 796 passed, `npm run e2e` 15 passed, `npm run e2e:dev` 16 passed and 1 skipped (as before), and `dist/` has no Lenormand text.
