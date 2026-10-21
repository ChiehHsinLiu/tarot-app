## MODIFIED Requirements

### Requirement: Oracle entry point on the home page
The home page SHALL offer an "Animal oracle" choice, separate from the "Tarot reading" choice, that opens the oracle screen. The oracle screen SHALL first show the heading "Today's animal oracle", a short intro, and an enabled "Draw" action. The oracle draw SHALL NOT require a spread or a question, and the tarot spread choice and question SHALL behave as before.

#### Scenario: Opening the app
- **WHEN** a user opens the app's root URL
- **THEN** the page shows the "Animal oracle" choice alongside the "Tarot reading" choice

#### Scenario: Opening the oracle screen
- **WHEN** a user activates "Animal oracle" on the home page for the first time in a visit
- **THEN** the oracle screen shows "Today's animal oracle", a short intro, and an enabled "Draw" button, and no card

### Requirement: Draw again and back
An oracle reading SHALL offer a "Draw again" action that replaces the shown card with a different card chosen uniformly at random from the other 35. The oracle screen's "Home" link SHALL return to the home page, and the tarot spread choice and question SHALL be unchanged when the user next opens the tarot screen.

#### Scenario: Draw again
- **WHEN** the user activates "Draw again"
- **THEN** a different oracle card replaces the current one

#### Scenario: Back to home
- **WHEN** the user activates "Home" while an oracle card is shown
- **THEN** the home page is shown with the "Tarot reading" and "Animal oracle" choices

#### Scenario: Tarot choice unchanged
- **WHEN** a user selects "Three cards" on the tarot screen, goes Home, draws an oracle card, goes Home, and opens "Tarot reading"
- **THEN** "Three cards" is still selected
