## MODIFIED Requirements

### Requirement: Shared readings are read-only
A shared reading SHALL NOT be editable or redrawable, and SHALL offer a "Draw your own" action that replaces the share link in the address bar with the tarot screen address `#/tarot` and shows the composer with no spread selected and an empty question.

#### Scenario: Draw your own
- **WHEN** a user viewing a shared reading activates "Draw your own"
- **THEN** the address bar ends with `#/tarot` and no longer contains the share fragment, no spread is selected, and the question box is empty

#### Scenario: Back after Draw your own
- **WHEN** a user who opened a share link activates "Draw your own" and then presses the browser's Back button
- **THEN** the shared reading is not shown again

### Requirement: Drawing does not change the address
Drawing a reading SHALL NOT change the page URL; only the Share action produces a link.

#### Scenario: Draw keeps a clean URL
- **WHEN** a user draws a reading on the tarot screen
- **THEN** the address bar still ends with `#/tarot` and contains no reading fragment
