## MODIFIED Requirements

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
- **WHEN** a user selects "Past, Present, Future" on the tarot screen, goes Home, draws an oracle card, goes Home, and opens "Tarot reading"
- **THEN** no spread is selected and the question box is empty
