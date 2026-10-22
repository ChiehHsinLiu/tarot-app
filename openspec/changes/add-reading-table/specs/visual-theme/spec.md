## ADDED Requirements

### Requirement: Drawn cards lie on a reading mat
The cards of a tarot reading, a shared reading, a Lenormand reading and a drawn oracle card SHALL lie on a forest-green cloth mat with a gold edge, the same in both palettes. Each card's position label SHALL be on the mat with it. Card names, keywords, meanings, the verdict and the buttons SHALL stay off the mat, on the page background.

#### Scenario: Three-card reading on a wide screen
- **WHEN** a three-card reading is shown 1280 pixels wide
- **THEN** one mat spans all three cards and their position labels, and the card names and meanings are below the mat

#### Scenario: Oracle card
- **WHEN** an oracle card is drawn
- **THEN** the card lies on a mat, and its message, reflection and affirmation are below it on the page background

#### Scenario: Shared reading
- **WHEN** a user opens a valid share link
- **THEN** the face-up cards lie on the mat as in a drawn reading

### Requirement: Each stacked card has its own mat on a phone
When a reading's cards are stacked in one column, each card and its position label SHALL lie on its own mat, with that card's name and meaning below its mat. At 320 pixels wide the mats SHALL fit without horizontal scrolling.

#### Scenario: Three-card reading on a phone
- **WHEN** a three-card reading is shown 375 pixels wide
- **THEN** each of the three cards lies on its own mat, followed by its name and meaning

#### Scenario: Narrowest phone
- **WHEN** a reading is shown 320 pixels wide in either palette
- **THEN** every mat is fully visible and the page has no horizontal scroll

### Requirement: Position labels are readable on the mat
Position labels on the mat SHALL have a contrast ratio of at least 4.5:1 against every colour of the mat's cloth.

#### Scenario: Label contrast
- **WHEN** the mat colours and the position label colour are compared
- **THEN** the label's contrast against each cloth colour is at least 4.5:1

### Requirement: The mat stays out of the way
The mat SHALL be hidden from assistive technology, SHALL NOT be focusable, and SHALL NOT move. It SHALL NOT change what a screen reader announces for a reading or the order it announces it in. The mat SHALL be drawn with the app's own styles, with no request to another origin.

#### Scenario: Screen reader on a reading
- **WHEN** a screen reader reads a drawn three-card reading
- **THEN** it announces each position, card and meaning in the same order as before, and nothing for the mat

### Requirement: Face-down spread preview on the tarot screen
The tarot screen SHALL show a mat just above the Draw button. With no spread chosen, the mat SHALL be empty. With a spread chosen, it SHALL show one card back per position of that spread, in order, each with its position label. Changing the spread or the deck SHALL update the preview at once, without animation.

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

### Requirement: The preview is decorative
The spread preview SHALL be hidden from assistive technology and SHALL NOT be focusable, since the spread choice already states the same information. At 320 pixels wide, the preview of the largest spread SHALL fit without horizontal scrolling.

#### Scenario: Screen reader on the tarot screen
- **WHEN** a screen reader reads the tarot screen with "Three cards" chosen
- **THEN** it announces the heading, the deck and spread choices, the question box and the Draw button, and nothing for the preview

#### Scenario: Preview on a phone
- **WHEN** the tarot screen is shown 320 pixels wide with "Three cards" chosen
- **THEN** all three backs are side by side on the mat and the page has no horizontal scroll
