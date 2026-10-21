# screen-instructions Specification

## Purpose

Gives each reading screen its own built-in guide: "How it works" instructions for using the screen and "About this deck" for the deck it draws from, so first-time visitors can read without prior knowledge.

## Requirements

### Requirement: Guides on each reading screen
The tarot screen's spread choice and the animal oracle screen's intro SHALL each show two expandable sections, "How it works" and "About this deck", below the screen's heading and before its "Draw" button. Both sections SHALL start closed whenever the screen is shown. Opening or closing a section SHALL NOT change the selected spread, the question, or what "Draw" does. The sections SHALL NOT appear on a drawn reading, a drawn oracle card, an opened share link, or the home page.

#### Scenario: Tarot screen opened
- **WHEN** a user opens the tarot screen
- **THEN** "How it works" and "About this deck" are shown closed, between the "Tarot reading" heading and the "Draw" button

#### Scenario: Oracle screen opened
- **WHEN** a user opens the animal oracle screen before drawing
- **THEN** "How it works" and "About this deck" are shown closed, between the "Today's animal oracle" heading and the "Draw" button

#### Scenario: Opening a section
- **WHEN** the user activates "How it works" on the tarot screen
- **THEN** its instructions are shown, and the spread choice, question, and Draw button are unchanged

#### Scenario: Not on readings
- **WHEN** a tarot reading is drawn, an oracle card is drawn, or a share link is opened
- **THEN** no "How it works" or "About this deck" section is shown

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
Each section SHALL be operable with the keyboard alone, SHALL convey whether it is open or closed to assistive technology, and SHALL be readable in both colour schemes and at phone width without horizontal scrolling. The guide text SHALL be plain text, SHALL contain nothing available only in development, and SHALL be shown without any network request once the page has loaded.

#### Scenario: Keyboard
- **WHEN** a keyboard user tabs to "About this deck" and presses Enter or Space
- **THEN** the section opens, and pressing it again closes it

#### Scenario: Screen reader
- **WHEN** a screen reader reaches a closed "How it works"
- **THEN** it announces it as collapsed, and as expanded once opened

#### Scenario: Phone width
- **WHEN** the tarot screen is shown 320 pixels wide with both sections open
- **THEN** all guide text is readable without horizontal scrolling

### Requirement: Guides follow the selected deck
When the tarot screen offers a deck choice, its "How it works" and "About this deck" SHALL show the selected deck's guide. Changing the deck SHALL replace the text in place, without closing an open section or moving focus. Guide text for a dev-only deck SHALL NOT be part of the production build.

#### Scenario: Switching to Lenormand
- **WHEN** the owner opens "About this deck" on the tarot screen and then selects "Lenormand"
- **THEN** "About this deck" stays open and now describes the Lenormand deck

#### Scenario: Public build
- **WHEN** the production bundle is inspected
- **THEN** it contains the tarot and oracle guides and no Lenormand guide text
