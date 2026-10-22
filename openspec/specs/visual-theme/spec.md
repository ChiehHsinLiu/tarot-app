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
Flourishes, frames, and background texture SHALL be hidden from assistive technology, SHALL NOT be focusable, and SHALL NOT move. The card reveal is not decoration; it is covered by "Drawn cards turn over on their own".

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

### Requirement: Shared card back
Every deck SHALL use one card back: an original night-sky drawing in deep plum with a gold frame, a crescent moon and scattered stars, mirror-symmetric left to right. The back SHALL be the same size and shape as a card face, bundled with the app, and hidden from assistive technology.

#### Scenario: Same back for every deck
- **WHEN** a tarot reading, an oracle card and a Lenormand reading are each drawn
- **THEN** each card shows the same night-sky back before it turns over

#### Scenario: Back is not announced
- **WHEN** a screen reader reads a newly drawn reading
- **THEN** it announces each card's face as before, and nothing for the back

#### Scenario: No outside requests
- **WHEN** a card back is shown
- **THEN** the drawing needs no request to another origin

### Requirement: Drawn cards turn over on their own
On a newly drawn tarot reading, oracle card or Lenormand reading, each card SHALL first show its back and then flip face up without any input. Cards SHALL flip in reading order, each starting about 0.3 seconds after the one before, and each flip SHALL take about 0.6 seconds. A reversed card SHALL land upside down, as it shows today.

#### Scenario: Three-card reading
- **WHEN** a user draws a three-card tarot reading
- **THEN** all three cards show their backs, then turn face up one after another from first to last, and all are face up within about 1.5 seconds

#### Scenario: Reversed card
- **WHEN** a drawn card is reversed
- **THEN** it turns over and lands upside down

#### Scenario: Draw again
- **WHEN** a user activates "Draw again" on an oracle card
- **THEN** the new card shows its back and turns face up the same way

### Requirement: Card text appears with its card
While a reading's cards turn over, each card's title, keywords and meaning SHALL fade in as that card lands. On the Yes / No spread, the verdict SHALL fade in with the first card. On an oracle card, the message, reflection and affirmation SHALL fade in with the card. Headings, the question and buttons SHALL show at once.

#### Scenario: Meaning follows its card
- **WHEN** a user draws a three-card reading
- **THEN** the third card's meaning becomes visible as the third card lands, after the first card's meaning

#### Scenario: Verdict with the first card
- **WHEN** a user draws a Yes / No reading
- **THEN** the verdict becomes visible as the card lands, not before it starts turning

### Requirement: The reveal never blocks the reading
The whole reading SHALL be in the page from the moment it opens, whatever the animation is showing. Keyboard focus SHALL move to the reading's heading as before, assistive technology SHALL be able to read every card and meaning at once, and every button SHALL work immediately.

#### Scenario: Screen reader during the flip
- **WHEN** a screen reader reads a reading while its cards are still turning
- **THEN** it can read every card name, orientation and meaning

#### Scenario: Act before the flip ends
- **WHEN** a user activates "New reading" before the cards have finished turning
- **THEN** it works as it does today

### Requirement: Reduced motion skips the reveal
When the system asks for reduced motion, cards SHALL appear face up at once, with their text and verdict, with no flip and no fade.

#### Scenario: Reduced motion
- **WHEN** a user whose system asks for reduced motion draws a reading
- **THEN** every card is face up and every meaning is visible as soon as the reading opens, and no back is shown
