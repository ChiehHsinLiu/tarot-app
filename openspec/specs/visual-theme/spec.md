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
- **THEN** the card shows its framed face with the name "The Tower", the numeral XVI, and its drawing

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

### Requirement: Drawn cards lie on a reading mat
The cards of a tarot reading, a shared reading, a Lenormand reading and a drawn oracle card SHALL lie on a teal cloth mat with a gold edge, the same in both palettes. Each card's position label SHALL be on the mat with it. Card names, keywords, meanings, the verdict and the buttons SHALL stay off the mat, on the page background.

#### Scenario: Three-card reading on a wide screen
- **WHEN** a three-card reading is shown 1280 pixels wide
- **THEN** one mat spans all three cards and their position labels, and the card names and meanings are below the mat

#### Scenario: Oracle card
- **WHEN** an oracle card is drawn
- **THEN** the card lies on a mat, and its message, reflection and affirmation are below it on the page background

#### Scenario: Shared reading
- **WHEN** a user opens a valid share link
- **THEN** the face-up cards lie on the mat as in a drawn reading

#### Scenario: Teal cloth
- **WHEN** a reading or the tarot screen's preview is shown in either palette
- **THEN** the mat's cloth is teal, not green or purple

### Requirement: Each stacked card has its own mat on a phone
When a reading's cards are stacked in one column, each card and its position label SHALL lie on its own mat, with that card's name and meaning below its mat. At 320 pixels wide the mats SHALL fit without horizontal scrolling.

#### Scenario: Three-card reading on a phone
- **WHEN** a three-card reading is shown 375 pixels wide
- **THEN** each of the three cards lies on its own mat, followed by its name and meaning

#### Scenario: Narrowest phone
- **WHEN** a reading is shown 320 pixels wide in either palette
- **THEN** every mat is fully visible and the page has no horizontal scroll

### Requirement: Position labels are readable on the mat
Position labels on the mat SHALL have a contrast ratio of at least 4.5:1 against every colour of the mat's cloth.

#### Scenario: Label contrast
- **WHEN** the mat colours and the position label colour are compared
- **THEN** the label's contrast against each cloth colour is at least 4.5:1

### Requirement: The mat stays out of the way
The mat SHALL be hidden from assistive technology, SHALL NOT be focusable, and SHALL NOT move. It SHALL NOT change what a screen reader announces for a reading or the order it announces it in. The mat SHALL be drawn with the app's own styles, with no request to another origin.

#### Scenario: Screen reader on a reading
- **WHEN** a screen reader reads a drawn three-card reading
- **THEN** it announces each position, card and meaning in the same order as before, and nothing for the mat

### Requirement: Face-down spread preview on the tarot screen
The tarot screen SHALL show a mat just above the Draw button. With no spread chosen, the mat SHALL be empty. With a spread chosen, it SHALL show one card back per position of that spread, in order, each with its position label. Changing the spread or the deck SHALL update the preview at once, without animation. The Draw button SHALL be centred under the mat, and its hint SHALL be shown centred on its own line under the button.

#### Scenario: No spread chosen
- **WHEN** the tarot screen opens fresh
- **THEN** an empty mat is shown above the Draw button, with no card backs

#### Scenario: Three cards chosen
- **WHEN** a user chooses the "Three cards" spread
- **THEN** the mat shows three card backs labelled Past, Present and Future

#### Scenario: Spread changed
- **WHEN** a user changes the spread from "Three cards" to "Yes / No"
- **THEN** the mat shows one card back labelled with the Yes / No position, and nothing moves

#### Scenario: Lenormand deck
- **WHEN** a user of the local dev app chooses the Lenormand deck and its "Yes / No" spread
- **THEN** the mat shows two card backs labelled with Lenormand's two positions

#### Scenario: Draw centred
- **WHEN** the tarot screen is shown 1280 or 320 pixels wide
- **THEN** the Draw button is horizontally centred under the mat, and the hint "Choose a spread to begin." is centred on the line below the button

### Requirement: The preview is decorative
The spread preview SHALL be hidden from assistive technology and SHALL NOT be focusable, since the spread choice already states the same information. At 320 pixels wide, the preview of the largest spread SHALL fit without horizontal scrolling.

#### Scenario: Screen reader on the tarot screen
- **WHEN** a screen reader reads the tarot screen with "Three cards" chosen
- **THEN** it announces the heading, the deck and spread choices, the question box and the Draw button, and nothing for the preview

#### Scenario: Preview on a phone
- **WHEN** the tarot screen is shown 320 pixels wide with "Three cards" chosen
- **THEN** all three backs are side by side on the mat and the page has no horizontal scroll

### Requirement: Tarot suits have their own colours
Every tarot card SHALL belong to one of five colour families: one for each suit (wands, cups, swords, pentacles) and one for the major arcana. Tarot faces SHALL stay cream in both palettes. A card's inner frame, corner flourishes and picture SHALL use its family's colours, and each family's colours SHALL be distinguishable from the cream face (at least 3:1 contrast for the frame and outlines).

#### Scenario: Suits look different
- **WHEN** a three-card reading shows a wands, a cups and a swords card
- **THEN** the three cards have cream faces with frames and pictures in three different colours

#### Scenario: Both palettes
- **WHEN** a reading is shown in light mode and again in dark mode
- **THEN** each card keeps its cream face and its family's colours, and its name stays readable

### Requirement: Tarot pictures are original and decorative
Every tarot card's drawing and symbol layout SHALL be original to this project, SHALL contain no text, and SHALL be coloured only by the card's colour family and the card ink. A drawing MAY use a card's traditional symbols, such as a tower struck by lightning for The Tower, in its own composition. Pictures SHALL be decorative for assistive technology, so a card is still announced only by its name and orientation.

#### Scenario: One drawing per drawn card
- **WHEN** the tarot deck is loaded
- **THEN** each of the 22 major arcana and 16 court cards has exactly one drawing, no two share a drawing, and there are no drawings for cards that don't exist

#### Scenario: Screen reader
- **WHEN** a screen reader reaches a drawn Queen of Cups, reversed
- **THEN** it announces "Queen of Cups, reversed" and nothing further for the picture

### Requirement: Tarot pictures work wherever a card is shown
Tarot pictures SHALL turn with a reversed card, stay recognisable at every size a face-up card is shown (including on a phone mat at 320 pixels wide), and SHALL NOT require a network request once the tarot screen has shown.

#### Scenario: Reversed picture
- **WHEN** a card with a drawing is drawn reversed
- **THEN** its whole face, picture included, is upside down, and its name below the face is upright with "(reversed)"

#### Scenario: Phone width
- **WHEN** a three-card reading is shown at 320 pixels wide
- **THEN** each card's picture is fully visible inside its frame, and a number card's symbols can be counted

#### Scenario: Offline after the screen has shown
- **WHEN** the tarot screen has shown, the network is then disconnected, and the user draws
- **THEN** every card's picture is shown
