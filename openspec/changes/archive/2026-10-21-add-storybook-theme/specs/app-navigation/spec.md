## MODIFIED Requirements

### Requirement: Home page offers two equal choices
The home page SHALL show two choices of equal prominence, "Tarot reading" and "Animal oracle", each with a one-line description. Each choice SHALL open its own screen. The home page SHALL NOT show a spread choice, question box, draw action, or card.

#### Scenario: Opening the root URL
- **WHEN** a user loads the app's root URL with no fragment
- **THEN** the page shows the heading "Little Oracle" and the "Tarot reading" and "Animal oracle" choices, and no spread choice, question box, draw button, or card

#### Scenario: Choosing tarot
- **WHEN** a user activates "Tarot reading" on the home page
- **THEN** the tarot screen opens

#### Scenario: Choosing the oracle
- **WHEN** a user activates "Animal oracle" on the home page
- **THEN** the oracle screen opens
