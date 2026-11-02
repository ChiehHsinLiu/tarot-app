# tarot-spreads Specification

## Purpose

Defines the spreads a user can choose for a reading, the positions each spread has, and the rules that differ between spreads.

## Requirements

### Requirement: Available spreads
The app SHALL offer exactly four spreads, in this order: "Yes / No", "Three cards", "Situation, Action, Outcome", and "Choice". No spread SHALL be selected when the tarot screen is first opened after the page loads, and at most one spread SHALL be selected at a time.

#### Scenario: Spread choice on load
- **WHEN** a user opens the tarot screen for the first time after the page loads
- **THEN** all four spreads are offered in the order Yes / No, Three cards, Situation, Action, Outcome, Choice, and none is selected

#### Scenario: Switching spread before drawing
- **WHEN** a user selects "Yes / No" before drawing
- **THEN** "Yes / No" becomes the only selected spread

#### Scenario: Card count and question rule in the spread choice
- **WHEN** the tarot spread choice is shown
- **THEN** "Situation, Action, Outcome" says "3 cards" and "Choice" says "3 cards, question required"

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

### Requirement: Situation, Action, Outcome spread positions
The "Situation, Action, Outcome" spread SHALL draw exactly three cards into positions labeled, in order, "Situation", "Action", and "Outcome". The question SHALL be optional, and the reading SHALL NOT show a Yes / No / Maybe verdict.

#### Scenario: Draw without a question
- **WHEN** a user draws with "Situation, Action, Outcome" selected and an empty question
- **THEN** three cards are shown in the order Situation, Action, Outcome, with no verdict

### Requirement: Choice spread positions
The "Choice" spread SHALL draw exactly three cards into positions labeled, in order, "Option A", "Option B", and "Advice". The reading SHALL NOT show a Yes / No / Maybe verdict.

#### Scenario: Choice draw
- **WHEN** a user draws with "Choice" selected and the question "Stay or move?"
- **THEN** three cards are shown in the order Option A, Option B, Advice, with no verdict

### Requirement: Choice spread requires a question
The "Choice" spread SHALL NOT allow drawing until the question contains at least one non-whitespace character, and while "Choice" is selected the question box SHALL show a hint asking the user to name the two options, with an example.

#### Scenario: Empty question
- **WHEN** "Choice" is selected and the question is empty or only whitespace
- **THEN** the draw action is disabled and the user is told a question is required

#### Scenario: Question hint
- **WHEN** "Choice" is selected and the question box is empty
- **THEN** the box's hint asks the user to name their two options, for example "Stay or move?"

#### Scenario: Other spreads keep their hints
- **WHEN** "Yes / No" is selected, or any other spread whose question is optional
- **THEN** the box shows "Ask a yes or no question" for Yes / No and "What would you like to know?" otherwise

### Requirement: New spreads can be shared
A reading of either new spread SHALL be shareable as a link under the same rules as other tarot readings, with the spread id `situation-action-outcome` or `choice`, and opening that link SHALL show the same spread, cards, orientations and position labels. Links for Yes / No and Three cards SHALL be unchanged.

#### Scenario: Shared Choice reading
- **WHEN** a user shares a Choice reading and someone opens the link
- **THEN** the link starts with `#/r/v1/choice/` and shows the same three cards under Option A, Option B, and Advice

#### Scenario: Existing link still opens
- **WHEN** a Three cards link created before this change is opened
- **THEN** it shows the same reading as before
