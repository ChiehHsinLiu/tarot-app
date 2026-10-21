## MODIFIED Requirements

### Requirement: The endpoint accepts only valid readings
The endpoint SHALL accept only one of:
- a tarot reading in share-link form that decodes successfully under the share-link rules (known spread and cards, correct card count, question at most 300 user-visible characters)
- an oracle request naming a known oracle card, with an optional question of at most 300 user-visible characters
- a Lenormand request naming a known spread and distinct known Lenormand cards, exactly as many as that spread's Lenormand positions, with a question of at most 300 user-visible characters that is non-empty for Yes / No

It SHALL reject anything else, including raw prompt text, without running Claude Code.

#### Scenario: Over-long question
- **WHEN** a request carries a question longer than 300 characters
- **THEN** the endpoint responds with an error and Claude Code is not run

#### Scenario: Raw prompt
- **WHEN** a request carries arbitrary prompt text instead of a reading
- **THEN** the endpoint rejects it and Claude Code is not run

#### Scenario: Unknown oracle card
- **WHEN** an oracle request names a card id that is not in the oracle deck
- **THEN** the endpoint rejects it and Claude Code is not run

#### Scenario: Invalid Lenormand request
- **WHEN** a Lenormand request names an unknown card, repeats a card, has the wrong number of cards for its spread, or is a Yes / No with an empty question
- **THEN** the endpoint rejects it and Claude Code is not run

### Requirement: Private journal
Each completed or stopped answer SHALL be appended to a journal under `~/.tarot/journal/` with the time, the reading (or, for an oracle answer, the oracle card and the question asked; for a Lenormand answer, the deck, spread, cards, and question), the answer text, and whether it completed or was stopped. The journal SHALL NOT be written inside the repository.

#### Scenario: Completed answer saved
- **WHEN** an answer completes
- **THEN** a journal entry with the reading, answer, and status "completed" is added under `~/.tarot/journal/`

#### Scenario: Stopped answer saved
- **WHEN** the owner stops an answer
- **THEN** a journal entry with the partial answer and status "stopped" is added

#### Scenario: Oracle answer saved
- **WHEN** an answer about an oracle card completes
- **THEN** a journal entry with the oracle card id, the question (possibly empty), the answer, and status "completed" is added

#### Scenario: Lenormand answer saved
- **WHEN** an answer about a Lenormand reading completes
- **THEN** a journal entry marked as the Lenormand deck, with the spread, card ids in order, question, answer, and status "completed" is added
