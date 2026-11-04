# Tasks

## 1. Card names

- [x] 1.1 In `data/i18n/zh-Hant/cards.json`, set each card's `name` to its English name; keywords, meanings and notes are unchanged
- [x] 1.2 In the Chinese app, mark the card name as English (`lang="en"`) on the card face and in the reading, so screen readers say it correctly
- [x] 1.3 In `data/i18n/zh-Hant/guides.json`, name the first and last major cards "The Fool" and "The World"

## 2. Dev oracle question box

- [x] 2.1 Add Chinese for the oracle question box's label, "(optional)" hint and placeholder (dev-only, beside `ui-dev.json`), and use it in `AskClaudeOracle.tsx` when the app is in Chinese; other Ask Claude text stays English
- [x] 2.2 Dev e2e: in Chinese, the oracle question box shows the Chinese label, hint and placeholder, and the button still reads "Ask Claude"; the public build still contains none of this text

## 3. Checks

- [x] 3.1 Unit check: every Chinese card name equals the English name (replacing the "name has Chinese characters" check)
- [x] 3.2 E2E: The Star shows "The Star" in Chinese; the screen reader hears "Queen of Cups，逆位"; the "no unexpected English" check allows the words of card names
- [x] 3.3 Run `npm test`, `npm run e2e` and `npm run e2e:dev`; look at a Classic and a Dachshund reading in Chinese at phone width
