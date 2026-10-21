# tarot-spreads Specification

## Purpose

Defines the spreads a user can choose for a reading, the positions each spread has, and the rules that differ between spreads.

## Requirements

### Requirement: Available spreads
The app SHALL offer exactly two spreads: "Yes / No" and "Three cards". No spread SHALL be selected when the tarot screen is first opened after the page loads, and at most one spread SHALL be selected at a time.

#### Scenario: Spread choice on load
- **WHEN** a user opens the tarot screen for the first time after the page loads
- **THEN** both spreads are offered and neither is selected

#### Scenario: Switching spread before drawing
- **WHEN** a user selects "Yes / No" before drawing
- **THEN** "Yes / No" becomes the only selected spread

### Requirement: A spread must be chosen before drawing
The app SHALL NOT allow drawing until the user has selected a spread.

#### Scenario: No spread selected
- **WHEN** no spread is selected
- **THEN** the draw action is disabled and the user is prompted to choose a spread

### Requirement: Yes / No spread has one position
With the tarot deck, the "Yes / No" spread SHALL draw exactly one card into a single position labeled "Answer". Other decks define their own Yes / No positions.

#### Scenario: Yes / No draw
- **WHEN** a user draws with the tarot deck and "Yes / No" selected
- **THEN** exactly one card is shown, labeled "Answer"

### Requirement: Yes / No spread requires a question
The "Yes / No" spread SHALL NOT allow drawing until the question contains at least one non-whitespace character.

#### Scenario: Empty question
- **WHEN** "Yes / No" is selected and the question is empty or only whitespace
- **THEN** the draw action is disabled and the user is told a question is required

### Requirement: Yes / No spread shows a verdict
A tarot "Yes / No" reading SHALL prominently show the verdict (Yes, No, or Maybe) for the drawn card in its drawn orientation, together with that orientation's yes/no note.

#### Scenario: Reversed card verdict
- **WHEN** a tarot "Yes / No" reading draws a card reversed
- **THEN** the verdict and note shown are the card's reversed verdict and reversed note

### Requirement: Three cards spread positions
The "Three cards" spread SHALL draw exactly three cards into positions labeled, in order, "Past", "Present", and "Future". The question SHALL be optional.

#### Scenario: Three-card draw without a question
- **WHEN** a user draws with "Three cards" selected and an empty question
- **THEN** three cards are shown in the order Past, Present, Future

#### Scenario: Three-card reading has no verdict
- **WHEN** a "Three cards" reading is shown
- **THEN** no Yes / No / Maybe verdict is displayed
