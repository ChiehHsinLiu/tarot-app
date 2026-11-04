# Spec Delta

## MODIFIED Requirements

### Requirement: Card and animal text follows the language
In Chinese, the tarot card keywords, meanings and yes/no notes, and the oracle animal names, themes, keywords, messages, reflections and affirmations SHALL be shown in Traditional Chinese. Tarot card names SHALL stay in English (see "Some things stay the same in both languages").

#### Scenario: Card text in Chinese
- **WHEN** The Star is drawn upright with the app in Chinese
- **THEN** the card's name is "The Star", its keywords, meaning, and in Yes / No its note, are shown in Traditional Chinese, its answer word stays "Yes", "No" or "Maybe", and its numeral is XVII

#### Scenario: Screen reader in Chinese
- **WHEN** a screen reader reaches a reversed Queen of Cups with the app in Chinese
- **THEN** it announces "Queen of Cups" followed by the Chinese word for reversed, the card name shown on the card and in the reading is marked as English, and the page's language is `zh-Hant`

### Requirement: Some things stay the same in both languages
The app name "Little Oracle", the tarot card names, the tarot Roman numerals, the card drawings, the tarot spread names ("Yes / No", "Three cards"), their position labels ("Answer", "Past", "Present", "Future") and the Yes / No answer words ("Yes", "No", "Maybe") SHALL be the same, in English, in both languages. This holds for both tarot decks (Classic and Dachshund). Where the Chinese tarot guide names a card, it SHALL use the card's English name.

#### Scenario: No English left
- **WHEN** each public screen (home, tarot composer, a Yes / No and a Three cards reading, a shared reading, the oracle) is shown in Chinese
- **THEN** the only English shown is "Little Oracle", tarot card names, Roman numerals, the spread names, position labels and answer words, and "Copy for Claude" with its messages

#### Scenario: Card names in the Dachshund deck
- **WHEN** a Dachshund deck reading is shown in Chinese
- **THEN** each card's name is the same English name the English app shows

### Requirement: Everything for Claude stays English
In both languages, the "Copy for Claude" button, its messages, and the prompt it copies SHALL be in English, exactly as for the English app, built from the English card and spread text. In the local dev app, the Ask Claude buttons, their messages and the prompts they send SHALL likewise stay English. The one exception is the oracle's question box in the dev app: its label ("Ask about this card"), its "(optional)" hint and its placeholder ("What should I focus on today?") SHALL follow the language.

#### Scenario: Copy for Claude in the Chinese app
- **WHEN** a Yes / No reading is copied for Claude with the app in Chinese
- **THEN** the button reads "Copy for Claude", it confirms with "Prompt copied", and the copied prompt is identical to the one the English app copies for the same reading

#### Scenario: Oracle question box in the Chinese dev app
- **WHEN** the owner opens the oracle in the dev app with the app in Chinese
- **THEN** the question box's label, hint and placeholder are in Traditional Chinese, and the button still reads "Ask Claude"
