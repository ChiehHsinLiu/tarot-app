# Proposal

## Why

The owner wants the tarot card names to stay in English in the Chinese app (for example "The Star", not 星星). The rest of each card (keywords, meaning and yes/no note) stays in Traditional Chinese.

## What Changes

- In the Chinese app, every tarot card name is shown in English, exactly as in the English app, in both the Classic and Dachshund decks. This includes the name on the card, the name in the reading, and the name a screen reader announces.
- The keywords, meanings and yes/no notes stay in Traditional Chinese.
- The word for reversed stays Chinese, so a reversed card is announced as, for example, "Queen of Cups，逆位".
- English card names in the Chinese app are marked as English, so screen readers say them correctly.
- In the local dev app, the oracle's Ask Claude question box gets Chinese text in the Chinese app: its label "Ask about this card", the "(optional)" hint and the placeholder "What should I focus on today?". The Ask Claude button, its messages and the prompt stay English.
- The Chinese tarot guide names the first and last major cards in English ("The Fool" to "The World"), to match the cards. The suit words in the guide (權杖, 聖杯, 寶劍, 錢幣) stay Chinese.

Not changing: the oracle animals, other interface text, spread text, Copy for Claude, share links and Lenormand.

## Capabilities

### New Capabilities

### Modified Capabilities
- `app-language`: tarot card names stay English in both languages. They are added to the list of things that stay the same, and taken out of the card text that follows the language. The dev oracle question box becomes the one Ask Claude text that follows the language.

## Impact

- **Data:** `data/i18n/zh-Hant/cards.json` uses the English name for each card, as `zh-Hant/spreads.json` already repeats the English spread text. `zh-Hant/guides.json` gets one sentence edited.
- **Code:** a small dev-only Chinese table for the three question-box texts, used by `AskClaudeOracle.tsx` (still never in the public build). `CardFace.tsx` and `ReadingView.tsx` set `lang="en"` on the card name when the app is in Chinese.
- **Tests:** the unit check now expects the Chinese names to equal the English ones. The e2e check expects "The Star" and "Queen of Cups，逆位", and allows the words of card names in its "no unexpected English" check.
- **Size:** slightly smaller, because the Chinese names go away.
