## MODIFIED Requirements

### Requirement: Choosing a deck on the tarot screen
The deck choice SHALL appear on the tarot screen below its heading and before the spread choice, with "Tarot" selected whenever the screen is entered from a different screen or the page loads, and exactly one deck selected at a time. Changing the deck SHALL keep the selected spread and the question, except that a spread the newly chosen deck does not offer SHALL be cleared, leaving no spread selected. "New reading" SHALL keep the selected deck, like the spread.

#### Scenario: Default deck
- **WHEN** the owner opens the tarot screen for the first time after loading the dev app
- **THEN** "Tarot" is selected

#### Scenario: Switching deck keeps the spread and question
- **WHEN** the owner selects "Three cards", types a question, and then selects "Lenormand"
- **THEN** "Three cards" is still selected and the question is unchanged

#### Scenario: Switching to Lenormand clears a tarot-only spread
- **WHEN** the owner selects "Choice", types a question, and then selects "Lenormand"
- **THEN** no spread is selected, Draw is disabled with the prompt to choose a spread, and the question is unchanged

#### Scenario: Deck resets after Home
- **WHEN** the owner selects "Lenormand", goes Home, and opens "Tarot reading" again
- **THEN** "Tarot" is selected

#### Scenario: Deck kept by New reading
- **WHEN** the owner draws a Lenormand reading and activates "New reading"
- **THEN** "Lenormand" is still selected

### Requirement: Lenormand spreads
With Lenormand selected, the tarot screen SHALL offer only two spreads, "Yes / No" and "Three cards", under the same rules for choosing a spread and requiring a question as the tarot spreads of the same name. The tarot-only spreads "Situation, Action, Outcome" and "Choice" SHALL NOT be offered. "Yes / No" SHALL draw exactly two cards into positions labeled "First card" and "Second card". "Three cards" SHALL draw exactly three cards into positions labeled "Past", "Present", and "Future". The spread choice SHALL show each spread's card count for the selected deck.

#### Scenario: Lenormand Yes / No
- **WHEN** the owner draws "Yes / No" with Lenormand selected and a question typed
- **THEN** two Lenormand cards are shown, labeled "First card" and "Second card"

#### Scenario: Card count in the spread choice
- **WHEN** Lenormand is selected
- **THEN** the "Yes / No" option says "2 cards, question required" and "Three cards" says "3 cards"

#### Scenario: Tarot-only spreads not offered
- **WHEN** Lenormand is selected
- **THEN** the spread choice lists only "Yes / No" and "Three cards"

#### Scenario: Question still required
- **WHEN** Lenormand and "Yes / No" are selected and the question is empty
- **THEN** the draw action is disabled and the owner is told a question is required
