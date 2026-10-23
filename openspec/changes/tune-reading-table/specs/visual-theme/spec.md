## MODIFIED Requirements

### Requirement: Drawn cards lie on a reading mat
The cards of a tarot reading, a shared reading, a Lenormand reading and a drawn oracle card SHALL lie on a teal cloth mat with a gold edge, the same in both palettes. Each card's position label SHALL be on the mat with it. Card names, keywords, meanings, the verdict and the buttons SHALL stay off the mat, on the page background.

#### Scenario: Three-card reading on a wide screen
- **WHEN** a three-card reading is shown 1280 pixels wide
- **THEN** one mat spans all three cards and their position labels, and the card names and meanings are below the mat

#### Scenario: Oracle card
- **WHEN** an oracle card is drawn
- **THEN** the card lies on a mat, and its message, reflection and affirmation are below it on the page background

#### Scenario: Shared reading
- **WHEN** a user opens a valid share link
- **THEN** the face-up cards lie on the mat as in a drawn reading

#### Scenario: Teal cloth
- **WHEN** a reading or the tarot screen's preview is shown in either palette
- **THEN** the mat's cloth is teal, not green or purple

### Requirement: Face-down spread preview on the tarot screen
The tarot screen SHALL show a mat just above the Draw button. With no spread chosen, the mat SHALL be empty. With a spread chosen, it SHALL show one card back per position of that spread, in order, each with its position label. Changing the spread or the deck SHALL update the preview at once, without animation. The Draw button SHALL be centred under the mat, and its hint SHALL be shown centred on its own line under the button.

#### Scenario: No spread chosen
- **WHEN** the tarot screen opens fresh
- **THEN** an empty mat is shown above the Draw button, with no card backs

#### Scenario: Three cards chosen
- **WHEN** a user chooses the "Three cards" spread
- **THEN** the mat shows three card backs labelled Past, Present and Future

#### Scenario: Spread changed
- **WHEN** a user changes the spread from "Three cards" to "Yes / No"
- **THEN** the mat shows one card back labelled with the Yes / No position, and nothing moves

#### Scenario: Lenormand deck
- **WHEN** a user of the local dev app chooses the Lenormand deck and its "Yes / No" spread
- **THEN** the mat shows two card backs labelled with Lenormand's two positions

#### Scenario: Draw centred
- **WHEN** the tarot screen is shown 1280 or 320 pixels wide
- **THEN** the Draw button is horizontally centred under the mat, and the hint "Choose a spread to begin." is centred on the line below the button
