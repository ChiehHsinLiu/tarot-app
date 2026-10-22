## REMOVED Requirements

### Requirement: Start over from the top of a reading
**Reason**: An oracle reading is short enough that a second "Draw again" under the heading shows at the same time as the bottom one and looks like a duplicate.
**Migration**: Replaced by "Start over from the top of a longer reading", which keeps the top button for tarot, shared and Lenormand readings and leaves oracle cards with only the bottom "Draw again".

## ADDED Requirements

### Requirement: Start over from the top of a longer reading
A drawn tarot or Lenormand reading, and an opened share link, SHALL show its start-over action directly below its heading, in addition to the one at the bottom: "New reading" on a user's own tarot or Lenormand reading, and "Draw your own" on a shared reading. Both copies SHALL do the same thing, and the top one SHALL use the secondary button style. A drawn oracle card SHALL show "Draw again" only once, below the reading.

#### Scenario: New reading at the top
- **WHEN** a user draws a tarot reading
- **THEN** a "New reading" button is shown right under the reading's heading, and activating it returns to the spread choice as the bottom one does

#### Scenario: Shared reading
- **WHEN** a user opens a valid share link
- **THEN** a "Draw your own" button is shown right under the heading

#### Scenario: One Draw again on an oracle card
- **WHEN** a user draws an oracle card
- **THEN** exactly one "Draw again" button is shown, below the card's message, reflection and affirmation, and nothing is shown between the heading and the card
