# title-page Specification

## Purpose

Defines the landing page users see when they open the Little Oracle web app, including its visible heading and document title.

## Requirements

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

### Requirement: Title page renders without errors
The landing page SHALL load with all of its script and style assets resolving successfully and without uncaught runtime errors in the browser console.

#### Scenario: Assets load cleanly
- **WHEN** a user loads the app's root URL
- **THEN** no script or stylesheet request returns a 404 and the console shows no uncaught errors

### Requirement: Home page subtitle
The home page SHALL show the subtitle "tarot & animal cards for today" directly below the main heading. Other screens SHALL NOT show the subtitle.

#### Scenario: Subtitle on home
- **WHEN** a user opens the app's root URL
- **THEN** the text "tarot & animal cards for today" appears below the "Little Oracle" heading

#### Scenario: No subtitle elsewhere
- **WHEN** a user opens the tarot screen
- **THEN** the subtitle is not shown
