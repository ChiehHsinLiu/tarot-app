## MODIFIED Requirements

### Requirement: Face-down spread preview on the tarot screen
The tarot screen SHALL show a mat just above the Draw button. With no spread chosen, the mat SHALL be empty. With a spread chosen, it SHALL show one card back per position of that spread, in order, each with its position label. Changing the spread or the deck SHALL update the preview at once, without animation. The Draw button SHALL be centred under the mat, and its hint SHALL be shown centred on its own line under the button.

#### Scenario: No spread chosen
- **WHEN** the tarot screen opens fresh
- **THEN** an empty mat is shown above the Draw button, with no card backs

#### Scenario: Three cards chosen
- **WHEN** a user chooses the "Past, Present, Future" spread
- **THEN** the mat shows three card backs labelled Past, Present and Future

#### Scenario: Spread changed
- **WHEN** a user changes the spread from "Past, Present, Future" to "Yes / No"
- **THEN** the mat shows one card back labelled with the Yes / No position, and nothing moves

#### Scenario: Lenormand deck
- **WHEN** a user of the local dev app chooses the Lenormand deck and its "Yes / No" spread
- **THEN** the mat shows two card backs labelled with Lenormand's two positions

#### Scenario: Draw centred
- **WHEN** the tarot screen is shown 1280 or 320 pixels wide
- **THEN** the Draw button is horizontally centred under the mat, and the hint "Choose a spread to begin." is centred on the line below the button

### Requirement: The preview is decorative
The spread preview SHALL be hidden from assistive technology and SHALL NOT be focusable, since the spread choice already states the same information. At 320 pixels wide, the preview of the largest spread SHALL fit without horizontal scrolling.

#### Scenario: Screen reader on the tarot screen
- **WHEN** a screen reader reads the tarot screen with "Past, Present, Future" chosen
- **THEN** it announces the heading, the deck and spread choices, the question box and the Draw button, and nothing for the preview

#### Scenario: Preview on a phone
- **WHEN** the tarot screen is shown 320 pixels wide with "Past, Present, Future" chosen
- **THEN** all three backs are side by side on the mat and the page has no horizontal scroll
