# Spec Delta

## Purpose

Offers a light daily-guidance reading from an original 36-card animal oracle deck: the user draws one card whenever they like and reads its written message, separate from the tarot spreads.

## ADDED Requirements

### Requirement: Animal oracle deck
The app SHALL include an original oracle deck of exactly 36 cards. Each card SHALL be one distinct animal, none of them insects or spiders, paired with a theme. Each card SHALL have an animal name, a theme, keywords, a message, a reflection question, and an affirmation. Every card's text SHALL be original to this project.

#### Scenario: Deck completeness
- **WHEN** the deck data is loaded
- **THEN** it contains 36 cards with distinct ids and distinct animals, and every card has a non-empty animal name, theme, at least one keyword, message, reflection question, and affirmation

#### Scenario: Requested animals are present
- **WHEN** the deck data is loaded
- **THEN** it includes the Dachshund, Alpaca, Honey Badger, Flying Squirrel, and Magpie cards

### Requirement: Oracle entry point on the home page
The home page SHALL offer a "Today's animal oracle" section with a "Draw" action, separate from the tarot spread choice. The oracle draw SHALL NOT require a spread or a question, and the tarot spread choice and question SHALL behave as before.

#### Scenario: Opening the app
- **WHEN** a user opens the app's root URL
- **THEN** the page shows the tarot spread choice and a separate "Today's animal oracle" section with a "Draw" button that is enabled

### Requirement: Drawing an oracle card
Activating the oracle "Draw" SHALL show exactly one card from the 36, chosen uniformly at random with a cryptographically secure random source. The card SHALL always be shown upright. Drawing SHALL be possible any number of times, at any time, and SHALL NOT require a network request once the page has loaded.

#### Scenario: Draw
- **WHEN** the user activates "Draw" in the oracle section
- **THEN** one oracle card is shown upright, with no question asked beforehand

#### Scenario: Uniform choice
- **WHEN** many oracle draws are made from the full deck
- **THEN** each of the 36 cards is equally likely to be chosen

### Requirement: Oracle reading display
The oracle reading SHALL show the card's animal name and theme on its face, followed by its keywords, message, reflection question, and affirmation.

#### Scenario: Reading shown
- **WHEN** an oracle card has been drawn
- **THEN** the page shows the card's animal and theme, keywords, message, reflection question, and affirmation

### Requirement: Draw again and back
An oracle reading SHALL offer a "Draw again" action that replaces the shown card with a different card chosen uniformly at random from the other 35, and a "Back" action that returns to the home page with the tarot spread choice unchanged.

#### Scenario: Draw again
- **WHEN** the user activates "Draw again"
- **THEN** a different oracle card replaces the current one

#### Scenario: Back to home
- **WHEN** the user activates "Back"
- **THEN** the home page is shown with the tarot spread choice and the oracle section
