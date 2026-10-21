# visual-theme Specification

## Purpose

Defines the cozy storybook look shared by every screen: the light and dark palettes, the bundled heading font, the card frame, the per-card colours of the animal oracle, and the accessibility limits the decoration must respect.

## Requirements

### Requirement: Light and dark palettes follow the system
The app SHALL use a warm light palette when the system prefers a light colour scheme and a dark "dusk" palette when it prefers dark, switching without a reload.

#### Scenario: Dark system setting
- **WHEN** a user whose system prefers a dark colour scheme opens the app
- **THEN** the page uses the dark palette, with light text on a dark background

#### Scenario: Setting changes while open
- **WHEN** the system colour scheme changes while the app is open
- **THEN** the page switches palettes without being reloaded

### Requirement: Heading font is bundled
Headings, card names, and oracle affirmations SHALL use the app's storybook serif font, served from the app's own origin. Loading any screen SHALL NOT request fonts or stylesheets from another origin.

#### Scenario: Font origin
- **WHEN** a user opens the home page, the tarot screen, and the oracle screen
- **THEN** every font file requested comes from the app's own origin, and no request goes to a font service

#### Scenario: Offline after load
- **WHEN** the network is disconnected after the page has loaded and the user draws a reading
- **THEN** headings and card names still render in the storybook font

### Requirement: Storybook card face
Every face-up tarot and oracle card SHALL be shown as a cream card with an inner frame and corner flourishes, keeping the content required by the deck specs.

#### Scenario: Tarot face in the frame
- **WHEN** The Tower is shown face up
- **THEN** the card shows its framed face with the name "The Tower", the numeral XVI, and the major arcana symbol

#### Scenario: Oracle face in the frame
- **WHEN** an oracle card is drawn
- **THEN** the card shows its framed face with the animal name and theme

### Requirement: Oracle cards have their own colours
Every oracle card SHALL belong to exactly one of six pastel colour families (peach, sage, sky, lavender, butter, rose), with each family used by six cards. A drawn oracle card's face and reading accents SHALL use its family's colours in both palettes.

#### Scenario: Deck colours
- **WHEN** the oracle deck data is loaded
- **THEN** every card has one of the six colour families and each family is used by exactly six cards

#### Scenario: Different families look different
- **WHEN** two oracle cards from different colour families are drawn one after the other
- **THEN** their card faces have different background colours

### Requirement: Decoration stays out of the way
Flourishes, frames, and background texture SHALL be hidden from assistive technology, SHALL NOT be focusable, and SHALL NOT move.

#### Scenario: Screen reader on the home page
- **WHEN** a screen reader reads the home page
- **THEN** it announces the heading, subtitle, and two choices, and nothing for the decorations

### Requirement: Text stays readable
Body text, muted text, button labels, and card text SHALL have a contrast ratio of at least 4.5:1 against their backgrounds, and large headings at least 3:1, in both palettes and on every oracle colour family.

#### Scenario: Muted text on paper
- **WHEN** the keywords under a card are shown in the light palette
- **THEN** their contrast against the page background is at least 4.5:1

#### Scenario: Card name on a pastel face
- **WHEN** an oracle card from any colour family is shown in either palette
- **THEN** its animal name and theme have a contrast of at least 4.5:1 against the card face
