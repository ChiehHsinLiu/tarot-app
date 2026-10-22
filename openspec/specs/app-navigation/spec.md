# app-navigation Specification

## Purpose

Defines how users move around the app: a home page offering the tarot reading and the animal oracle as two equal choices, a separate screen with its own address for each, and how Home, browser Back, refresh, and returning to a screen behave.

## Requirements

### Requirement: Home page offers two equal choices
The home page SHALL show two choices of equal prominence, "Tarot reading" and "Animal oracle", each with a one-line description. Each choice SHALL open its own screen. The home page SHALL NOT show a spread choice, question box, draw action, or card.

#### Scenario: Opening the root URL
- **WHEN** a user loads the app's root URL with no fragment
- **THEN** the page shows the heading "Little Oracle" and the "Tarot reading" and "Animal oracle" choices, and no spread choice, question box, draw button, or card

#### Scenario: Choosing tarot
- **WHEN** a user activates "Tarot reading" on the home page
- **THEN** the tarot screen opens

#### Scenario: Choosing the oracle
- **WHEN** a user activates "Animal oracle" on the home page
- **THEN** the oracle screen opens

### Requirement: Each screen has its own address
The home page SHALL be at the app URL with no fragment or with `#/`, the tarot screen at `#/tarot`, and the oracle screen at `#/oracle`. Opening a screen from within the app SHALL add a browser history entry. A fragment that is not one of these and does not start with `#/r/` SHALL show the home page.

#### Scenario: Address after choosing
- **WHEN** a user activates "Animal oracle" on the home page
- **THEN** the address bar ends with `#/oracle`

#### Scenario: Browser Back returns home
- **WHEN** a user opens the tarot screen from the home page and then presses the browser's Back button
- **THEN** the home page is shown

#### Scenario: Opening a screen address directly
- **WHEN** a user loads the app URL ending in `#/tarot`
- **THEN** the tarot screen is shown with no spread selected and an empty question

#### Scenario: Unknown fragment
- **WHEN** a user loads the app URL ending in `#/nowhere`
- **THEN** the home page is shown

### Requirement: Home link on every screen
The tarot screen, the oracle screen, and a shared reading SHALL each show a "Home" link that opens the home page.

#### Scenario: Going home from the oracle
- **WHEN** a user on the oracle screen activates "Home"
- **THEN** the home page is shown and the address no longer ends with `#/oracle`

#### Scenario: Going home from a shared reading
- **WHEN** a user viewing a shared reading activates "Home"
- **THEN** the home page is shown and the address no longer contains the share fragment

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

### Requirement: Focus moves to the new screen
When a screen opens from within the app, keyboard focus SHALL move to that screen's main heading.

#### Scenario: Keyboard user opens the oracle
- **WHEN** a keyboard user activates "Animal oracle" on the home page
- **THEN** focus is on the oracle screen's heading
