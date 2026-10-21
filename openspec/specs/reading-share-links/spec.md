# reading-share-links Specification

## Purpose

Lets a visitor turn a reading into a link and lets anyone with that link see the same reading, with the question included only when its author chooses.

## Requirements

### Requirement: Share link format
A share link SHALL encode a reading in the URL fragment as `#/r/v1/<spread-id>/<cards>`, optionally followed by `?q=<percent-encoded question>`. `<cards>` SHALL list the drawn card ids in position order separated by `.`, each followed by `r` when that card is reversed.

#### Scenario: Three-card link
- **WHEN** a three-card reading of Three of Swords (upright), Death (reversed), and Ace of Cups (upright) is shared without its question
- **THEN** the link ends with `#/r/v1/three-card/swords-03.major-13r.cups-01`

#### Scenario: Link with question
- **WHEN** a reading with the question "Will it work?" is shared with the question included
- **THEN** the link fragment ends with `?q=Will%20it%20work%3F`

### Requirement: Share action on a reading
Every shown reading SHALL offer a Share action that displays the reading's link and copies it to the clipboard on request, confirming when the copy succeeded.

#### Scenario: Copying a link
- **WHEN** a user activates Share and then Copy link
- **THEN** the link is placed on the clipboard and a "Link copied" confirmation appears

#### Scenario: Clipboard unavailable
- **WHEN** copying to the clipboard fails
- **THEN** the link remains visible and selected so the user can copy it manually

### Requirement: Question excluded by default
The Share action SHALL include the question in the link only when the user ticks "Include my question". The checkbox SHALL be unticked each time Share is opened, and SHALL NOT be shown when the reading has no question.

#### Scenario: Default share omits the question
- **WHEN** a user shares a reading that has a question without ticking the checkbox
- **THEN** the link contains no `q` parameter

#### Scenario: Opting in
- **WHEN** the user ticks "Include my question"
- **THEN** the displayed and copied link includes the question

#### Scenario: Reading without a question
- **WHEN** a user shares a reading that has no question
- **THEN** no "Include my question" checkbox is shown

### Requirement: Opening a share link shows the same reading
Loading the app with a valid share link SHALL display the encoded reading with the same spread, cards, orientations, positions, meanings, and (for Yes / No) verdict, labeled as a shared reading, without drawing new cards.

#### Scenario: Round trip
- **WHEN** a user copies a reading's link and opens it in a new tab
- **THEN** the new tab shows the same cards in the same positions and orientations, with the same meanings and verdict

#### Scenario: Shared question shown
- **WHEN** a link includes a question
- **THEN** the shared reading shows that question as text

#### Scenario: Link changed in the same tab
- **WHEN** a user pastes a different valid share link into the address bar of an open tab
- **THEN** the page shows the reading from the new link

### Requirement: Shared readings are read-only
A shared reading SHALL NOT be editable or redrawable, and SHALL offer a "Draw your own" action that replaces the share link in the address bar with the tarot screen address `#/tarot` and shows the composer with no spread selected and an empty question.

#### Scenario: Draw your own
- **WHEN** a user viewing a shared reading activates "Draw your own"
- **THEN** the address bar ends with `#/tarot` and no longer contains the share fragment, no spread is selected, and the question box is empty

#### Scenario: Back after Draw your own
- **WHEN** a user who opened a share link activates "Draw your own" and then presses the browser's Back button
- **THEN** the shared reading is not shown again

### Requirement: Invalid links are handled gracefully
A link fragment starting with `#/r/` that does not decode to a valid reading SHALL show the notice "This reading link isn't valid." above an empty composer. A link is invalid when its version is not `v1`, its spread is unknown, its card count differs from the spread's positions, any card id is unknown or repeated, or its question exceeds 300 user-visible characters.

#### Scenario: Unknown card
- **WHEN** a user opens `#/r/v1/yes-no/major-99`
- **THEN** the notice is shown with an empty composer and no cards

#### Scenario: Unsupported version
- **WHEN** a user opens `#/r/v2/yes-no/major-01`
- **THEN** the notice is shown with an empty composer

### Requirement: Drawing does not change the address
Drawing a reading SHALL NOT change the page URL; only the Share action produces a link.

#### Scenario: Draw keeps a clean URL
- **WHEN** a user draws a reading on the tarot screen
- **THEN** the address bar still ends with `#/tarot` and contains no reading fragment
