# Spec Delta

## Purpose

Defines how a user asks a question, draws cards for the selected spread, reads the result, and starts over, including the fairness guarantees of the draw.

## ADDED Requirements

### Requirement: Question input
The app SHALL provide a single text box for the user's question that accepts at most 300 user-visible characters and shows a live count of characters used out of 300.

#### Scenario: Typing a question
- **WHEN** a user types a 32-character question
- **THEN** the counter shows "32 / 300"

#### Scenario: Reaching the limit
- **WHEN** a user tries to type or paste beyond 300 user-visible characters
- **THEN** the question is limited to 300 user-visible characters and no character is split

#### Scenario: Non-English characters count once each
- **WHEN** a user enters an emoji or an accented letter
- **THEN** each counts as one character toward the limit

### Requirement: Drawing produces a reading
Activating "Draw" SHALL produce a reading with one card per position of the selected spread, each card face up in its drawn orientation with its position label, name, and the meaning for that orientation.

#### Scenario: Reading contents
- **WHEN** a user draws a three-card reading
- **THEN** each of the three cards shows its position label, name, and its upright or reversed meaning matching its orientation

### Requirement: Question is shown and locked after drawing
After drawing, the reading SHALL display the question as asked (if any), and the question and spread SHALL NOT be editable until a new reading is started.

#### Scenario: Attempting to edit after drawing
- **WHEN** a reading is shown
- **THEN** the question text and spread choice cannot be changed and the draw action is not available

### Requirement: New reading
A "New reading" action SHALL clear the current reading and question and return to the question and spread choice, keeping the previously selected spread.

#### Scenario: Starting over
- **WHEN** a user activates "New reading"
- **THEN** the cards are cleared, the question box is empty and editable, and the previously selected spread remains selected

### Requirement: Fair draw
Each draw SHALL select cards uniformly at random without replacement from the full 78-card deck, using a cryptographically secure random source, so that every ordered combination of distinct cards is equally likely.

#### Scenario: No repeated cards
- **WHEN** a three-card reading is drawn
- **THEN** the three cards are all different

#### Scenario: Statistical uniformity
- **WHEN** a large number of single-card draws are simulated in tests
- **THEN** each of the 78 cards appears with a frequency consistent with 1/78 within statistical tolerance

### Requirement: Independent 50/50 reversals
Each drawn card SHALL be independently reversed with probability 1/2, using the same cryptographically secure random source.

#### Scenario: Reversal frequency
- **WHEN** a large number of draws are simulated in tests
- **THEN** the share of reversed cards is consistent with 1/2 within statistical tolerance

### Requirement: Readings work without a network after load
Drawing and displaying a reading SHALL NOT require any network request once the page has loaded.

#### Scenario: Offline draw
- **WHEN** the network is disconnected after the page has loaded and the user draws
- **THEN** the reading is produced and displayed normally
