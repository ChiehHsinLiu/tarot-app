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

### Requirement: Illustrated home windows
Each of the home page's two choices SHALL be shown as an arched window containing an original drawing, with the choice's title and one-line description below it, the window and text together forming a single link. The "Tarot reading" window SHALL show a fanned deck of cards on its sill, drawn as artwork without any card's face, number, or name. The "Animal oracle" window SHALL show a cat sitting on its sill. Both windows SHALL be the same size and given equal prominence.

#### Scenario: Home page windows
- **WHEN** a user opens the home page
- **THEN** "Tarot reading" is shown under an arched window with a fanned deck on the sill, and "Animal oracle" under an arched window with a cat on the sill, both the same size

#### Scenario: One link per window
- **WHEN** a user clicks the cat in the "Animal oracle" window
- **THEN** the animal oracle screen opens, as it does when clicking the title

### Requirement: Window skies follow the palette
In the light palette each home window SHALL show a day sky with a sun and clouds, and in the dusk palette a night sky with a moon and stars. The sky SHALL change with the system colour scheme without a reload.

#### Scenario: Night windows
- **WHEN** a user whose system prefers a dark colour scheme opens the home page
- **THEN** both windows show a moon and stars, and no sun

#### Scenario: Scheme changes while open
- **WHEN** the system colour scheme changes from light to dark while the home page is open
- **THEN** both windows switch from the day sky to the night sky without a reload

### Requirement: Home windows stay decorative
The window drawings SHALL be hidden from assistive technology, so each choice is announced by its title and description only. On hover or keyboard focus, a window's frame and sill SHALL take the accent colour, and keyboard focus SHALL also show a visible focus ring; the drawings SHALL NOT move. The drawings SHALL be bundled with the app, and at 320 pixels wide the windows SHALL fit without horizontal scrolling.

#### Scenario: Screen reader
- **WHEN** a screen reader reads the home page
- **THEN** it announces the heading, subtitle, and the two choices by title and description, and nothing for the drawings

#### Scenario: Keyboard focus
- **WHEN** a keyboard user tabs to the "Tarot reading" window
- **THEN** its frame and sill turn the accent colour and a focus ring is shown, and nothing moves

#### Scenario: Phone width
- **WHEN** the home page is shown 320 pixels wide in either palette
- **THEN** the two windows are stacked, fully visible, and the page has no horizontal scroll

#### Scenario: No outside requests
- **WHEN** the home page loads
- **THEN** the drawings need no request to another origin
