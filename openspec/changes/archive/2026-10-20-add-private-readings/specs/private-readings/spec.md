# Spec Delta

## Purpose

Lets the owner get an AI-written interpretation of a reading from their own Claude Code while running the app locally, without any deployed server and without exposing the feature or its data on the public site.

## ADDED Requirements

### Requirement: Ask Claude is available only in the local dev app
When the app is served by `npm run dev`, every shown reading (own or shared) SHALL offer an "Ask Claude" action. The production build SHALL contain neither the action nor the endpoint it calls.

#### Scenario: Local dev app
- **WHEN** the owner views a reading at the local dev server
- **THEN** an "Ask Claude" button is shown beside the other reading actions

#### Scenario: Public site
- **WHEN** anyone views a reading on the deployed site or in `npm run preview`
- **THEN** no "Ask Claude" button is shown and the production bundle contains no Ask Claude code

### Requirement: Readings are interpreted by the owner's Claude Code
Activating "Ask Claude" SHALL send the reading to a local endpoint, which SHALL build the prompt with the same template and builder as "Copy for Claude" and run Claude Code non-interactively with all tools disabled and without saving the session.

#### Scenario: Asking
- **WHEN** the owner activates "Ask Claude" on a reading
- **THEN** Claude Code is run with the reading's prompt, no tools, and session persistence disabled

### Requirement: The answer streams into the page
Claude's interpretation SHALL appear progressively in the page while it is being written, and the page SHALL indicate when it is complete.

#### Scenario: Streaming
- **WHEN** Claude starts producing text
- **THEN** the text appears in the reading view before the full answer has finished

### Requirement: Stop and ask again
While an answer is streaming, a "Stop" action SHALL end the request and the Claude Code process, keeping the text received so far marked as stopped. After an answer ends, an "Ask again" action SHALL request a new interpretation of the same cards and question without drawing new cards.

#### Scenario: Stopping
- **WHEN** the owner activates "Stop" during streaming
- **THEN** streaming ends, the Claude Code process exits, and the partial answer stays visible labeled as stopped

#### Scenario: Asking again
- **WHEN** the owner activates "Ask again" after an answer
- **THEN** a new answer streams for the same reading and the cards on the page do not change

### Requirement: The endpoint accepts only valid readings
The endpoint SHALL accept only a reading in share-link form that decodes successfully under the share-link rules (known spread and cards, correct card count, question at most 300 user-visible characters), and SHALL reject anything else, including raw prompt text, without running Claude Code.

#### Scenario: Over-long question
- **WHEN** a request carries a question longer than 300 characters
- **THEN** the endpoint responds with an error and Claude Code is not run

#### Scenario: Raw prompt
- **WHEN** a request carries arbitrary prompt text instead of a reading
- **THEN** the endpoint rejects it and Claude Code is not run

### Requirement: The endpoint answers only the local app
The endpoint SHALL accept only POST requests whose `Host` is `localhost` or `127.0.0.1` on the dev server's port and whose `Origin` matches that host, and SHALL reject all others without running Claude Code.

#### Scenario: Request from another website
- **WHEN** a page from another origin sends a request to the endpoint
- **THEN** the request is rejected and Claude Code is not run

#### Scenario: Rebound hostname
- **WHEN** a request arrives with a `Host` header other than `localhost` or `127.0.0.1`
- **THEN** the request is rejected and Claude Code is not run

### Requirement: Clear errors
The page SHALL show a specific message when Claude Code is not installed, when it is not logged in, when it fails for another reason, and when no answer completes within 2 minutes; in the timeout case the Claude Code process SHALL be ended.

#### Scenario: Claude Code not installed
- **WHEN** the `claude` command cannot be found
- **THEN** the page says Claude Code is not installed and how to install it

#### Scenario: Not logged in
- **WHEN** Claude Code reports that it is not authenticated
- **THEN** the page says to log in to Claude Code

#### Scenario: Timeout
- **WHEN** an answer has not completed after 2 minutes
- **THEN** the Claude Code process is ended and the page says the request timed out

### Requirement: Private journal
Each completed or stopped answer SHALL be appended to a journal under `~/.tarot/journal/` with the time, the reading, the answer text, and whether it completed or was stopped. The journal SHALL NOT be written inside the repository.

#### Scenario: Completed answer saved
- **WHEN** an answer completes
- **THEN** a journal entry with the reading, answer, and status "completed" is added under `~/.tarot/journal/`

#### Scenario: Stopped answer saved
- **WHEN** the owner stops an answer
- **THEN** a journal entry with the partial answer and status "stopped" is added
