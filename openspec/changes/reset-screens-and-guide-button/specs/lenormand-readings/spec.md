## REMOVED Requirements

### Requirement: Choosing a deck
**Reason**: It placed the deck choice above the guide sections, which have moved behind a "?" button, and kept the deck across trips Home, which the owner no longer wants.
**Migration**: Replaced by "Choosing a deck on the tarot screen": same picker, default and switching rules, now under the heading and reset to Tarot when the screen is entered from elsewhere.

## ADDED Requirements

### Requirement: Choosing a deck on the tarot screen
The deck choice SHALL appear on the tarot screen below its heading and before the spread choice, with "Tarot" selected whenever the screen is entered from a different screen or the page loads, and exactly one deck selected at a time. Changing the deck SHALL keep the selected spread and the question. "New reading" SHALL keep the selected deck, like the spread.

#### Scenario: Default deck
- **WHEN** the owner opens the tarot screen for the first time after loading the dev app
- **THEN** "Tarot" is selected

#### Scenario: Switching deck keeps the spread and question
- **WHEN** the owner selects "Three cards", types a question, and then selects "Lenormand"
- **THEN** "Three cards" is still selected and the question is unchanged

#### Scenario: Deck resets after Home
- **WHEN** the owner selects "Lenormand", goes Home, and opens "Tarot reading" again
- **THEN** "Tarot" is selected

#### Scenario: Deck kept by New reading
- **WHEN** the owner draws a Lenormand reading and activates "New reading"
- **THEN** "Lenormand" is still selected
