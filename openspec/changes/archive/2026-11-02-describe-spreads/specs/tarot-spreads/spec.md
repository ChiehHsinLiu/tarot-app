## RENAMED Requirements

- FROM: `### Requirement: Three cards spread positions`
- TO: `### Requirement: Past, Present, Future spread positions`

## MODIFIED Requirements

### Requirement: Available spreads
The app SHALL offer exactly four spreads, in this order: "Yes / No", "Past, Present, Future", "Situation, Action, Outcome", and "Choice". No spread SHALL be selected when the tarot screen is first opened after the page loads, and at most one spread SHALL be selected at a time.

#### Scenario: Spread choice on load
- **WHEN** a user opens the tarot screen for the first time after the page loads
- **THEN** all four spreads are offered in the order Yes / No, Past, Present, Future, Situation, Action, Outcome, Choice, and none is selected

#### Scenario: Switching spread before drawing
- **WHEN** a user selects "Yes / No" before drawing
- **THEN** "Yes / No" becomes the only selected spread

#### Scenario: Card count and question rule in the spread choice
- **WHEN** the tarot spread choice is shown
- **THEN** no option shows a card count, and only "Yes / No" and "Choice" say "Question required", on a line below their descriptions

### Requirement: Past, Present, Future spread positions
The "Past, Present, Future" spread SHALL draw exactly three cards into positions labeled, in order, "Past", "Present", and "Future". The question SHALL be optional. Its spread id SHALL remain `three-card`.

#### Scenario: Three-card draw without a question
- **WHEN** a user draws with "Past, Present, Future" selected and an empty question
- **THEN** three cards are shown in the order Past, Present, Future, under the heading "Past, Present, Future"

#### Scenario: Three-card reading has no verdict
- **WHEN** a "Past, Present, Future" reading is shown
- **THEN** no Yes / No / Maybe verdict is displayed

### Requirement: New spreads can be shared
A reading of either new spread SHALL be shareable as a link under the same rules as other tarot readings, with the spread id `situation-action-outcome` or `choice`, and opening that link SHALL show the same spread, cards, orientations and position labels. Links for Yes / No and Past, Present, Future SHALL be unchanged, and Past, Present, Future links SHALL keep the id `three-card`.

#### Scenario: Shared Choice reading
- **WHEN** a user shares a Choice reading and someone opens the link
- **THEN** the link starts with `#/r/v1/choice/` and shows the same three cards under Option A, Option B, and Advice

#### Scenario: Existing link still opens
- **WHEN** a `#/r/v1/three-card/` link created before the spread was renamed is opened
- **THEN** it shows the same cards and positions as before, under the heading "Shared reading · Past, Present, Future"

## ADDED Requirements

### Requirement: Each spread is described in the spread choice
Under each spread's name, the spread choice SHALL show a short description of what the spread is for instead of its card count, and, on its own line below the description, "Question required" when the spread requires a question. The tarot descriptions SHALL be: Yes / No "One card for a clear yes or no", Past, Present, Future "How things are unfolding", Situation, Action, Outcome "What to do, and where it leads", and Choice "Choose between A and B, with advice".

#### Scenario: Tarot spread choice
- **WHEN** the tarot spread choice is shown
- **THEN** it reads "One card for a clear yes or no", "How things are unfolding", "What to do, and where it leads", and "Choose between A and B, with advice" under the four spreads, with "Question required" on its own line under Yes / No and Choice only, and no card count is shown

#### Scenario: Description is part of the choice's name
- **WHEN** a screen reader reaches a spread option
- **THEN** it announces the spread name together with its description
