## MODIFIED Requirements

### Requirement: Animal oracle deck
The app SHALL include an original oracle deck of exactly 48 cards. Each card SHALL be one distinct animal, none of them insects or spiders, paired with a theme. Each card SHALL have an animal name, a theme, keywords, a message, a reflection question, and an affirmation. Every card's text SHALL be original to this project.

#### Scenario: Deck completeness
- **WHEN** the deck data is loaded
- **THEN** it contains 48 cards with distinct ids and distinct animals, and every card has a non-empty animal name, theme, at least one keyword, message, reflection question, and affirmation

#### Scenario: Requested animals are present
- **WHEN** the deck data is loaded
- **THEN** it includes the Dachshund, Alpaca, Honey Badger, Flying Squirrel, and Magpie cards

#### Scenario: Added animals are present
- **WHEN** the deck data is loaded
- **THEN** it includes Quokka · Look on the Bright Side, Hamster · Prepare, Pangolin · Soft Inside, Chameleon · See Both Sides, Puffin · Belonging, Narwhal · Be Unusual, Octopus · Curiosity, Hippo · Take Up Space, Lion · Lead with Heart, Giraffe · Look Ahead, Flamingo · Balance, and Axolotl · Healing

### Requirement: Drawing an oracle card
Activating the oracle "Draw" SHALL show exactly one card from the 48, chosen uniformly at random with a cryptographically secure random source. The card SHALL always be shown upright. Drawing SHALL be possible any number of times, at any time, and SHALL NOT require a network request once the page has loaded.

#### Scenario: Draw
- **WHEN** the user activates "Draw" in the oracle section
- **THEN** one oracle card is shown upright, with no question asked beforehand

#### Scenario: Uniform choice
- **WHEN** many oracle draws are made from the full deck
- **THEN** each of the 48 cards is equally likely to be chosen

### Requirement: Every oracle card has its own illustration
Each of the 48 oracle cards SHALL have its own illustration of its named animal, distinct from every other card's, original to this project, and containing no text. Illustrations SHALL be drawn in the card's colour family and the card ink so they match their card in both colour schemes. Illustrations SHALL be decorative for assistive technology, since the card's accessible name already names the animal, and SHALL NOT require a network request once the page has loaded.

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

### Requirement: Draw again and going home
An oracle reading SHALL offer a "Draw again" action that replaces the shown card with a different card chosen uniformly at random from the other 47. The oracle screen's "Home" link SHALL return to the home page. Opening the tarot screen afterwards SHALL start it fresh, as for any screen entered from elsewhere.

#### Scenario: Draw again
- **WHEN** the user activates "Draw again"
- **THEN** a different oracle card replaces the current one

#### Scenario: Draw again reaches the added animals
- **WHEN** the user keeps activating "Draw again"
- **THEN** every one of the 48 cards, including the 12 added animals, can appear

#### Scenario: Back to home
- **WHEN** the user activates "Home" while an oracle card is shown
- **THEN** the home page is shown with the "Tarot reading" and "Animal oracle" choices

#### Scenario: Tarot starts fresh after the oracle
- **WHEN** a user selects "Three cards" on the tarot screen, goes Home, draws an oracle card, goes Home, and opens "Tarot reading"
- **THEN** no spread is selected and the question box is empty
