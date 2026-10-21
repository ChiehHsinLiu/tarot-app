## MODIFIED Requirements

### Requirement: Oracle reading display
The oracle reading SHALL show the card's theme, its illustration of the animal, and its animal name on its face, followed by its keywords, message, reflection question, and affirmation.

#### Scenario: Reading shown
- **WHEN** an oracle card has been drawn
- **THEN** the page shows the card's animal and theme, keywords, message, reflection question, and affirmation

#### Scenario: Illustration on the face
- **WHEN** the Dachshund card is drawn
- **THEN** its face shows the theme, a drawing of a dachshund, and the name "Dachshund", and no paw symbol

## ADDED Requirements

### Requirement: Every oracle card has its own illustration
Each of the 36 oracle cards SHALL have its own illustration of its named animal, distinct from every other card's, original to this project, and containing no text. Illustrations SHALL be drawn in the card's colour family and the card ink so they match their card in both colour schemes. Illustrations SHALL be decorative for assistive technology, since the card's accessible name already names the animal, and SHALL NOT require a network request once the page has loaded.

#### Scenario: One illustration per card
- **WHEN** the oracle deck is loaded
- **THEN** every card has an illustration, no two cards share the same illustration, and there are no illustrations for cards that do not exist

#### Scenario: Colours follow the card
- **WHEN** a card from the sky family and a card from the peach family are drawn
- **THEN** each illustration uses its own family's colours

#### Scenario: Screen reader
- **WHEN** a screen reader reaches a drawn oracle card
- **THEN** it announces the card as "<animal>, <theme>" and nothing further for the illustration

#### Scenario: Offline after load
- **WHEN** the network is disconnected after the page has loaded and the user draws an oracle card
- **THEN** the card's illustration is shown
