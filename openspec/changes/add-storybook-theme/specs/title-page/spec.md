## RENAMED Requirements

- FROM: `### Requirement: Landing page displays the Tarot title`
- TO: `### Requirement: Landing page displays the site name`

- FROM: `### Requirement: Document title is Tarot`
- TO: `### Requirement: Document title is the site name`

## MODIFIED Requirements

### Requirement: Landing page displays the site name
The app SHALL render, at its root URL, a page whose primary heading is the text "Little Oracle".

#### Scenario: User opens the app
- **WHEN** a user loads the app's root URL in a browser
- **THEN** the page shows a single top-level heading with the text "Little Oracle"

### Requirement: Document title is the site name
The browser document title SHALL be "Little Oracle".

#### Scenario: Browser tab label
- **WHEN** the app's root URL has loaded
- **THEN** the browser tab title reads "Little Oracle"

## ADDED Requirements

### Requirement: Home page subtitle
The home page SHALL show the subtitle "tarot & animal cards for today" directly below the main heading. Other screens SHALL NOT show the subtitle.

#### Scenario: Subtitle on home
- **WHEN** a user opens the app's root URL
- **THEN** the text "tarot & animal cards for today" appears below the "Little Oracle" heading

#### Scenario: No subtitle elsewhere
- **WHEN** a user opens the tarot screen
- **THEN** the subtitle is not shown
