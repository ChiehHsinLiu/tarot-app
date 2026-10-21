## MODIFIED Requirements

### Requirement: Share action on a reading
Every shown tarot reading SHALL offer a Share action that displays the reading's link and copies it to the clipboard on request, confirming when the copy succeeded. Readings with other decks SHALL NOT offer Share, and share links SHALL only ever describe tarot readings.

#### Scenario: Copying a link
- **WHEN** a user activates Share and then Copy link
- **THEN** the link is placed on the clipboard and a "Link copied" confirmation appears

#### Scenario: Clipboard unavailable
- **WHEN** copying to the clipboard fails
- **THEN** the link remains visible and selected so the user can copy it manually

#### Scenario: No Share for Lenormand
- **WHEN** a Lenormand reading is shown in the local dev app
- **THEN** no Share action is offered
