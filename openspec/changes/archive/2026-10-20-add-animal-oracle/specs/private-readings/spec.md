# Spec Delta

## ADDED Requirements

### Requirement: Oracle cards are interpreted by the owner's Claude Code
When the app is served by `npm run dev`, an oracle reading SHALL offer "Ask Claude" with an optional question box that accepts at most 300 user-visible characters and shows a live count. Asking SHALL send the card and the box's text to the local endpoint, which SHALL build an oracle prompt from the card's written text and run Claude Code the same way as for tarot readings.

#### Scenario: Asking without a question
- **WHEN** the owner activates "Ask Claude" on an oracle card with the box empty
- **THEN** Claude Code is run with no tools and no saved session, and its explanation of the card for today streams into the page

#### Scenario: Asking a specific question
- **WHEN** the owner types "What should I focus on today?" and activates "Ask Claude"
- **THEN** the streamed answer addresses that question, grounded in the drawn card

### Requirement: The oracle question stays editable
The oracle question box SHALL be editable before and after each answer and disabled only while an answer is streaming. Drawing a different card SHALL clear the box and any answer.

#### Scenario: New question about the same card
- **WHEN** an answer has ended and the owner edits the box and activates "Ask again"
- **THEN** a new answer streams for the same card using the edited question

#### Scenario: Drawing again
- **WHEN** the owner activates "Draw again"
- **THEN** the new card is shown with an empty question box and no answer

## MODIFIED Requirements

### Requirement: Ask Claude is available only in the local dev app
When the app is served by `npm run dev`, every shown reading (own or shared) and every shown oracle card SHALL offer an "Ask Claude" action. The production build SHALL contain neither the action, the oracle question box, nor the endpoint they call.

#### Scenario: Local dev app
- **WHEN** the owner views a reading at the local dev server
- **THEN** an "Ask Claude" button is shown beside the other reading actions

#### Scenario: Oracle card in the local dev app
- **WHEN** the owner views an oracle card at the local dev server
- **THEN** an "Ask Claude" button and an optional question box are shown below the card's reading

#### Scenario: Public site
- **WHEN** anyone views a reading or an oracle card on the deployed site or in `npm run preview`
- **THEN** no "Ask Claude" button or oracle question box is shown and the production bundle contains no Ask Claude code

### Requirement: Stop and ask again
While an answer is streaming, a "Stop" action SHALL end the request and the Claude Code process, keeping the text received so far marked as stopped. After an answer ends, an "Ask again" action SHALL request a new answer without drawing new cards: for a tarot reading, of the same cards and question; for an oracle card, of the same card with the question currently in its box.

#### Scenario: Stopping
- **WHEN** the owner activates "Stop" during streaming
- **THEN** streaming ends, the Claude Code process exits, and the partial answer stays visible labeled as stopped

#### Scenario: Asking again
- **WHEN** the owner activates "Ask again" after an answer
- **THEN** a new answer streams for the same reading and the cards on the page do not change

### Requirement: The endpoint accepts only valid readings
The endpoint SHALL accept only either a reading in share-link form that decodes successfully under the share-link rules (known spread and cards, correct card count, question at most 300 user-visible characters), or an oracle request naming a known oracle card with an optional question of at most 300 user-visible characters. It SHALL reject anything else, including raw prompt text, without running Claude Code.

#### Scenario: Over-long question
- **WHEN** a request carries a question longer than 300 characters
- **THEN** the endpoint responds with an error and Claude Code is not run

#### Scenario: Raw prompt
- **WHEN** a request carries arbitrary prompt text instead of a reading
- **THEN** the endpoint rejects it and Claude Code is not run

#### Scenario: Unknown oracle card
- **WHEN** an oracle request names a card id that is not in the oracle deck
- **THEN** the endpoint rejects it and Claude Code is not run

### Requirement: Private journal
Each completed or stopped answer SHALL be appended to a journal under `~/.tarot/journal/` with the time, the reading (or, for an oracle answer, the oracle card and the question asked), the answer text, and whether it completed or was stopped. The journal SHALL NOT be written inside the repository.

#### Scenario: Completed answer saved
- **WHEN** an answer completes
- **THEN** a journal entry with the reading, answer, and status "completed" is added under `~/.tarot/journal/`

#### Scenario: Stopped answer saved
- **WHEN** the owner stops an answer
- **THEN** a journal entry with the partial answer and status "stopped" is added

#### Scenario: Oracle answer saved
- **WHEN** an answer about an oracle card completes
- **THEN** a journal entry with the oracle card id, the question (possibly empty), the answer, and status "completed" is added
