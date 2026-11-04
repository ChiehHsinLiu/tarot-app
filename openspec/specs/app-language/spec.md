# app-language Specification

## Purpose

Lets a visitor read Little Oracle in English or Traditional Chinese, remembers that choice on their device, and defines which text follows it and which stays the same.

## Requirements

### Requirement: Switch language from every screen
Every screen's header SHALL show a language switch. While the app is in English, the switch SHALL read "中文", and activating it SHALL show the app in Traditional Chinese. While the app is in Chinese, it SHALL read "English", and activating it SHALL show the app in English. Switching SHALL keep the current screen, and on the tarot screen it SHALL keep the shown reading, or the chosen deck, spread and question, without drawing again.

#### Scenario: Switch to Chinese
- **WHEN** a user on the English home page activates "中文"
- **THEN** the home page is shown in Traditional Chinese and the switch reads "English"

#### Scenario: Switching keeps the reading
- **WHEN** a user has drawn a Three cards reading and switches language
- **THEN** the same cards in the same positions and orientations are shown, with their text in the new language

### Requirement: The language choice is remembered
The app SHALL remember the chosen language on the device and use it on later visits. On a visit with no remembered choice, the app SHALL start in Traditional Chinese when the browser's preferred language is Traditional Chinese (`zh-TW`, `zh-HK`, `zh-MO` or any `zh-Hant` tag), and in English otherwise. If the device can't store the choice, the switch SHALL still work for the current visit.

#### Scenario: Remembered after reload
- **WHEN** a user switches to Chinese and reloads the page
- **THEN** the app is shown in Chinese

#### Scenario: First visit follows the browser
- **WHEN** a browser preferring `zh-TW` opens the app for the first time
- **THEN** the app is shown in Chinese

#### Scenario: Other browsers start in English
- **WHEN** a browser preferring `fr-FR` opens the app for the first time
- **THEN** the app is shown in English

### Requirement: Everything a visitor reads follows the language
In Chinese, every visible text and every accessible name SHALL be in Traditional Chinese, and the document's language tag SHALL be `zh-Hant`. Wherever another capability quotes an English text, such as "New reading" or "Prompt copied", the Chinese app SHALL show its Chinese version in the same place.

#### Scenario: Interface in Chinese
- **WHEN** the tarot screen is shown in Chinese
- **THEN** its heading, How it works link, deck and spread choice labels, question label and Draw button are in Traditional Chinese, while the spread names stay "Yes / No" and "Three cards"

### Requirement: Card and animal text follows the language
In Chinese, the tarot card names, keywords, meanings and yes/no notes, and the oracle animal names, themes, keywords, messages, reflections and affirmations SHALL be shown in Traditional Chinese.

#### Scenario: Card text in Chinese
- **WHEN** The Star is drawn upright with the app in Chinese
- **THEN** the card's name, keywords, meaning, and in Yes / No its note, are shown in Traditional Chinese, its answer word stays "Yes", "No" or "Maybe", and its numeral is XVII

#### Scenario: Screen reader in Chinese
- **WHEN** a screen reader reaches a reversed Queen of Cups with the app in Chinese
- **THEN** it announces the card's Chinese name and the Chinese word for reversed, and the page's language is `zh-Hant`

### Requirement: Some things stay the same in both languages
The app name "Little Oracle", the tarot Roman numerals, the card drawings, the tarot spread names ("Yes / No", "Three cards"), their position labels ("Answer", "Past", "Present", "Future") and the Yes / No answer words ("Yes", "No", "Maybe") SHALL be the same, in English, in both languages.

#### Scenario: No English left
- **WHEN** each public screen (home, tarot composer, a Yes / No and a Three cards reading, a shared reading, the oracle) is shown in Chinese
- **THEN** the only English shown is "Little Oracle", Roman numerals, the spread names, position labels and answer words, and "Copy for Claude" with its messages

### Requirement: Chinese text follows the same rules as English
The Traditional Chinese text SHALL cover exactly the same interface text, tarot cards, guides and oracle animals as the English text, with nothing missing and nothing extra. It SHALL follow the same length limits: tarot meanings at most 400 characters and yes/no notes at most 140 characters. It SHALL keep each card's yes/no verdict, use Traditional characters (not Simplified), be original to this project, and keep the deck's gentle tone.

#### Scenario: Text coverage
- **WHEN** the Chinese text is checked against the English text
- **THEN** every key in English has non-empty Chinese text, no extra keys exist, and every limit holds

### Requirement: Everything for Claude stays English
In both languages, the "Copy for Claude" button, its messages, and the prompt it copies SHALL be in English, exactly as for the English app, built from the English card and spread text. In the local dev app, Ask Claude, its messages and the prompts it sends SHALL likewise stay English.

#### Scenario: Copy for Claude in the Chinese app
- **WHEN** a Yes / No reading is copied for Claude with the app in Chinese
- **THEN** the button reads "Copy for Claude", it confirms with "Prompt copied", and the copied prompt is identical to the one the English app copies for the same reading

### Requirement: Share links open in the viewer's language
A share link SHALL NOT carry a language. Opening any share link SHALL show the reading in the viewer's current language, and links shared before this change SHALL keep working.

#### Scenario: English link, Chinese viewer
- **WHEN** a reading shared from the English app is opened by a viewer whose app is in Chinese
- **THEN** the same cards are shown face up with Chinese text

### Requirement: Lenormand stays English
In the local dev app, the Lenormand deck's cards, spreads, guide and prompt SHALL stay in English in both languages. The deck picker SHALL still show the option "Lenormand". The public build SHALL still contain no Lenormand option, text or code.

#### Scenario: Lenormand in the Chinese dev app
- **WHEN** the owner draws a Lenormand reading with the dev app in Chinese
- **THEN** the Lenormand cards and their meanings are in English

### Requirement: No new downloads for Chinese
Chinese text SHALL use the device's installed fonts. Switching language SHALL NOT download fonts or other files from any origin other than the site's own. Each screen's Chinese card or animal text SHALL load with that screen, as the English does, and SHALL NOT be part of the home page's first load. After a screen has shown, switching language on it SHALL need no network request.

#### Scenario: Switch while offline
- **WHEN** the tarot screen has shown, the network is disconnected, and the user switches to Chinese and draws
- **THEN** the cards are shown with their Chinese text
