## REMOVED Requirements

### Requirement: Screens keep their state during a visit
**Reason**: The owner found remembered readings confusing: going Home and back brought back the same reading or card, which made it feel impossible to draw again or switch deck.
**Migration**: Replaced by "Screens start fresh when opened". Within a screen, "New reading" still keeps the selected spread.

## ADDED Requirements

### Requirement: Screens start fresh when opened
Whenever the tarot screen or the oracle screen is entered from a different screen, whether by the Home link, a home choice, the browser's Back or Forward buttons, or a typed address, it SHALL start fresh. The tarot screen SHALL show no reading, no selected spread, an empty question, and the Tarot deck. The oracle screen SHALL show its intro and no card. Reloading the page SHALL also start fresh.

#### Scenario: Tarot after Home
- **WHEN** a user selects "Yes / No", types "Will it rain?", goes Home, and opens "Tarot reading" again
- **THEN** no spread is selected and the question box is empty

#### Scenario: Tarot reading after Home
- **WHEN** a user draws a tarot reading, goes Home, and opens "Tarot reading" again
- **THEN** the spread choice and question box are shown, with no reading

#### Scenario: Oracle after Home
- **WHEN** a user draws an oracle card, goes Home, and opens "Animal oracle" again
- **THEN** the oracle intro with its "Draw" button is shown and no card

#### Scenario: Browser Back and Forward
- **WHEN** a user draws an oracle card, presses Back to the home page, and then presses Forward
- **THEN** the oracle intro is shown and no card

#### Scenario: Reload starts fresh
- **WHEN** a user has drawn an oracle card and reloads the page at `#/oracle`
- **THEN** the oracle intro with its "Draw" button is shown and no card

### Requirement: Start over from the top of a reading
Every drawn reading SHALL show its start-over action directly below its heading, in addition to the one at the bottom: "New reading" on a user's own tarot or Lenormand reading, "Draw your own" on a shared reading, and "Draw again" on an oracle card. Both copies SHALL do the same thing, and the top one SHALL use the secondary button style.

#### Scenario: New reading at the top
- **WHEN** a user draws a tarot reading
- **THEN** a "New reading" button is shown right under the reading's heading, and activating it returns to the spread choice as the bottom one does

#### Scenario: Draw again at the top
- **WHEN** a user draws an oracle card
- **THEN** a "Draw again" button is shown right under the heading, and activating it shows a different card

#### Scenario: Shared reading
- **WHEN** a user opens a valid share link
- **THEN** a "Draw your own" button is shown right under the heading
