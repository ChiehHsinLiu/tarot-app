# Spec Delta

## Purpose

Defines the landing page users see when they open the Tarot web app, including its visible heading and document title.

## ADDED Requirements

### Requirement: Landing page displays the Tarot title
The app SHALL render, at its root URL, a page whose primary heading is the text "Tarot".

#### Scenario: User opens the app
- **WHEN** a user loads the app's root URL in a browser
- **THEN** the page shows a single top-level heading with the text "Tarot"

### Requirement: Document title is Tarot
The browser document title SHALL be "Tarot".

#### Scenario: Browser tab label
- **WHEN** the app's root URL has loaded
- **THEN** the browser tab title reads "Tarot"

### Requirement: Title page renders without errors
The landing page SHALL load with all of its script and style assets resolving successfully and without uncaught runtime errors in the browser console.

#### Scenario: Assets load cleanly
- **WHEN** a user loads the app's root URL
- **THEN** no script or stylesheet request returns a 404 and the console shows no uncaught errors
