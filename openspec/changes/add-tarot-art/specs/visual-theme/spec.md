## MODIFIED Requirements

### Requirement: Storybook card face
Every face-up tarot and oracle card SHALL be shown as a cream card with an inner frame and corner flourishes, keeping the content required by the deck specs.

#### Scenario: Tarot face in the frame
- **WHEN** The Tower is shown face up
- **THEN** the card shows its framed face with the name "The Tower", the numeral XVI, and its drawing

#### Scenario: Oracle face in the frame
- **WHEN** an oracle card is drawn
- **THEN** the card shows its framed face with the animal name and theme

## ADDED Requirements

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
