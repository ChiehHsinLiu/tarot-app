# screen-instructions Specification

## Purpose

Gives each reading screen its own built-in guide: "How it works" instructions for using the screen and "About this deck" for the deck it draws from, so first-time visitors can read without prior knowledge.

## Requirements

### Requirement: Guides on each reading screen
The tarot screen's spread choice and the animal oracle screen's intro SHALL each show a small "?" button next to the screen's heading that opens a panel containing "How it works" and "About this deck". The panel SHALL be closed whenever the screen is shown, and SHALL offer a "Close" button. Opening or closing it SHALL NOT change the selected deck, spread, question, or what "Draw" does. Neither the button nor the panel SHALL appear on a drawn reading, a drawn oracle card, an opened share link, or the home page.

#### Scenario: Tarot screen opened
- **WHEN** a user opens the tarot screen
- **THEN** a "?" button is shown beside the "Tarot reading" heading, no guide text is shown, and the spread choice follows the heading directly (after the deck choice in the dev app)

#### Scenario: Oracle screen opened
- **WHEN** a user opens the animal oracle screen before drawing
- **THEN** a "?" button is shown beside the "Today's animal oracle" heading and no guide text is shown

#### Scenario: Opening a section
- **WHEN** the user activates the "?" button on the tarot screen
- **THEN** a panel with "How it works" and "About this deck" is shown, and the spread choice, question, and Draw button are unchanged

#### Scenario: Not on readings
- **WHEN** a tarot reading is drawn, an oracle card is drawn, or a share link is opened
- **THEN** no "?" button or guide panel is shown

### Requirement: Tarot instructions
The tarot screen's "How it works" SHALL explain choosing a spread and what each spread draws, when a question is needed, upright and reversed cards, where the Yes / No answer comes from, and sharing a reading as a link.

#### Scenario: Tarot instructions
- **WHEN** the user opens "How it works" on the tarot screen
- **THEN** it explains that Yes / No draws one card and needs a question, and that Three cards draws Past, Present, and Future with an optional question
- **AND** it explains that a reversed card is shown upside down and read with its reversed meaning, that the Yes / No answer comes from the drawn card and its orientation, and that Share turns a reading into a link

### Requirement: Tarot deck explanation
The tarot screen's "About this deck" SHALL describe the 78-card deck, with 22 Major Arcana and 56 Minor Arcana in the suits Wands, Cups, Swords, and Pentacles, and SHALL say the card meanings are written for this app.

#### Scenario: Tarot deck explanation
- **WHEN** the user opens "About this deck" on the tarot screen
- **THEN** it describes 78 cards, 22 Major and 56 Minor Arcana, and the four suits

### Requirement: Animal oracle guide content
The animal oracle screen's "How it works" SHALL explain drawing one card with no question, reading its message, reflection question, and affirmation, and using "Draw again" for a different card. Its "About this deck" SHALL describe the 36 original animal cards, each pairing an animal with a theme, in six colour families.

#### Scenario: Oracle instructions
- **WHEN** the user opens "How it works" on the animal oracle screen
- **THEN** it explains drawing with no question, the message, reflection question, and affirmation, and "Draw again"

#### Scenario: Oracle deck explanation
- **WHEN** the user opens "About this deck" on the animal oracle screen
- **THEN** it describes 36 original animal cards, each with a theme, in six colour families

### Requirement: Reflection note
Every screen's "About this deck" SHALL end with the same short note that readings are for reflection and fun, and are not professional advice.

#### Scenario: Note shown
- **WHEN** the user opens "About this deck" on any screen
- **THEN** it ends with the reflection-and-fun note

### Requirement: Accessible and offline guides
The "?" button SHALL have the accessible name "How it works and about this deck", SHALL be operable with the keyboard alone, and SHALL convey whether its panel is open. Escape or "Close" SHALL close the panel and return focus to the "?" button. The panel SHALL be readable in both colour schemes and at phone width without horizontal scrolling. The guide text SHALL be plain text, contain nothing development-only, and need no network request once the page has loaded.

#### Scenario: Keyboard
- **WHEN** a keyboard user tabs to the "?" button and presses Enter or Space
- **THEN** the panel opens, and pressing Escape closes it and returns focus to the "?" button

#### Scenario: Screen reader
- **WHEN** a screen reader reaches the "?" button with the panel closed
- **THEN** it announces "How it works and about this deck" as a collapsed button, and as expanded once the panel is open

#### Scenario: Phone width
- **WHEN** the tarot screen is shown 320 pixels wide with the panel open
- **THEN** all guide text is readable without horizontal scrolling

### Requirement: Guides follow the selected deck
When the tarot screen offers a deck choice, its guide panel SHALL show the selected deck's "How it works" and "About this deck". Changing the deck SHALL replace the text in place, without closing an open panel or moving focus. Guide text for a dev-only deck SHALL NOT be part of the production build.

#### Scenario: Switching to Lenormand
- **WHEN** the owner opens the guide panel on the tarot screen and then selects "Lenormand"
- **THEN** the panel stays open and its "About this deck" now describes the Lenormand deck

#### Scenario: Public build
- **WHEN** the production bundle is inspected
- **THEN** it contains the tarot and oracle guides and no Lenormand guide text
