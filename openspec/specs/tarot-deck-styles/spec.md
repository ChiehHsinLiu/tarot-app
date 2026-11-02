# tarot-deck-styles Specification

## Purpose

Lets a visitor choose how the tarot cards look, either the Classic deck or the Dachshund deck, without changing which cards exist or what they mean, and carries that choice into the reading and its share link.

## Requirements

### Requirement: Choose a deck on the tarot screen
The tarot screen SHALL show a "Choose a deck" choice above the spreads with "Classic" and "Dachshund", on the public site and in the local dev app. Classic SHALL be selected whenever the tarot screen is entered from elsewhere. Draw and New reading SHALL keep the chosen deck.

#### Scenario: Public tarot screen
- **WHEN** anyone opens the tarot screen on the deployed site
- **THEN** a "Choose a deck" choice with "Classic" and "Dachshund" is shown, and Classic is selected

#### Scenario: New reading keeps the deck
- **WHEN** a user chooses Dachshund, draws, and then activates New reading
- **THEN** the composer still has Dachshund selected

#### Scenario: Entering again resets the deck
- **WHEN** a user chooses Dachshund, goes Home, and opens Tarot reading again
- **THEN** Classic is selected

### Requirement: Both decks share the cards and their meanings
The Dachshund deck SHALL use the same 78 cards, names, keywords, meanings, yes/no verdicts, spreads and Copy for Claude prompt as Classic, and SHALL be drawn with the same fair draw and 50/50 reversals. Only the card pictures SHALL differ.

#### Scenario: Same text
- **WHEN** The Star is drawn upright once with Classic and once with Dachshund
- **THEN** both readings show the same name, numeral, meaning and verdict text

#### Scenario: Same prompt
- **WHEN** the same cards in the same positions are copied for Claude from a Classic and a Dachshund reading
- **THEN** the two copied prompts are identical

### Requirement: Every Dachshund card has its own drawing
With Dachshund chosen, every face-up card SHALL show its own original drawing featuring one or more dachshunds, in place of the Classic picture: all 22 major arcana, the 16 court cards and the 40 Ace to Ten cards. No two cards SHALL share a drawing. The card keeps its cream face, its suit's colour family, its name and, for the major arcana, its numeral.

#### Scenario: Major card face
- **WHEN** The Moon is shown face up with Dachshund chosen
- **THEN** the card shows the name "The Moon", the numeral XVIII and its dachshund drawing, which differs from every other card's drawing and from the Classic picture

#### Scenario: Deck coverage
- **WHEN** the Dachshund drawings are loaded
- **THEN** there is exactly one drawing for each of the 78 cards and none for a card that doesn't exist

### Requirement: Dachshund number cards can be counted
Each Ace to Ten Dachshund drawing SHALL show its suit's symbol exactly as many times as the card's number (once for the Ace), clearly enough to count on a phone mat at 320 pixels wide.

#### Scenario: Counting cups
- **WHEN** the Three of Cups is shown face up with Dachshund chosen at 320 pixels wide
- **THEN** exactly three cups can be counted in its drawing

### Requirement: Dachshund pictures follow the tarot picture rules
Dachshund drawings SHALL contain no text, SHALL be coloured only by the card's colour family, the card ink and the Dachshund deck's fixed scene colours (dog coat and ears, sun, sky, leaf, water, rose and plum), with the suit symbols in the card's colour family, SHALL be decorative for assistive technology, SHALL turn with a reversed card, and SHALL need no network request once the tarot screen has shown. Every deck SHALL keep the shared night-sky card back.

#### Scenario: Colourful, suit still clear
- **WHEN** a Dachshund Three of Cups and Three of Wands are shown side by side
- **THEN** both show brown dachshunds in coloured scenes, and their frames and suit symbols are in two different suit colours

#### Scenario: Screen reader
- **WHEN** a screen reader reaches a Dachshund Queen of Cups, reversed
- **THEN** it announces "Queen of Cups, reversed" and nothing further for the picture

#### Scenario: Reversed picture
- **WHEN** a Dachshund card is drawn reversed
- **THEN** its whole face, picture included, is upside down, and its name below the face is upright with "(reversed)"

#### Scenario: Offline after the screen has shown
- **WHEN** the tarot screen has shown, the network is then disconnected, and the user draws with Dachshund chosen
- **THEN** every card's dachshund drawing is shown

#### Scenario: Same back
- **WHEN** a Dachshund reading is drawn
- **THEN** each card shows the shared night-sky back before it turns over

### Requirement: Share links keep the deck
Sharing a Dachshund reading SHALL produce a link that opens with the Dachshund drawings. Opening a link without a deck marker SHALL show Classic drawings, so links shared before this change look as they did.

#### Scenario: Dachshund round trip
- **WHEN** a user shares a Dachshund reading and opens the link in a new tab
- **THEN** the new tab shows the same cards, face up, with their dachshund drawings

#### Scenario: Older link
- **WHEN** a user opens `#/r/v1/three-card/swords-03.major-13r.cups-01`
- **THEN** the reading shows the Classic pictures

#### Scenario: Draw your own after a Dachshund link
- **WHEN** a user viewing a shared Dachshund reading activates "Draw your own"
- **THEN** the composer shows with Classic selected, no spread selected and an empty question
