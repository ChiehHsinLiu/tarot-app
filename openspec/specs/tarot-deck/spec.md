# tarot-deck Specification

## Purpose

Defines the 78-card tarot deck the app reads from: which cards exist, the written meanings and yes/no verdicts for each orientation, and how a drawn card is presented.

## Requirements

### Requirement: Deck contains the 78 standard cards
The deck SHALL contain exactly 78 unique cards: 22 major arcana numbered 0 (The Fool) through 21 (The World), and 14 cards in each of the suits Wands, Cups, Swords, and Pentacles (Ace, Two through Ten, Page, Knight, Queen, King).

#### Scenario: Deck integrity
- **WHEN** the deck data is loaded
- **THEN** it contains 78 cards with no duplicate identities, 22 major arcana, and 14 cards per minor suit

### Requirement: Major arcana use Rider-Waite-Smith numbering
Strength SHALL be numbered 8 and Justice SHALL be numbered 11.

#### Scenario: Strength and Justice numbers
- **WHEN** Strength or Justice is displayed
- **THEN** Strength shows numeral VIII and Justice shows numeral XI

### Requirement: Every card has English text for both orientations
Each card SHALL have an English name, at least one keyword, an upright meaning, and a reversed meaning. Each meaning SHALL be at most 400 characters.

#### Scenario: Complete text
- **WHEN** the English deck text is checked against the deck
- **THEN** every card has a non-empty name, keywords, upright meaning, and reversed meaning, each meaning at most 400 characters

### Requirement: Every card has a yes/no verdict per orientation
Each card SHALL have a verdict of exactly one of Yes, No, or Maybe for its upright orientation and for its reversed orientation, plus a short English note (at most 140 characters) for each orientation explaining the verdict.

#### Scenario: Verdict coverage
- **WHEN** the deck data is checked
- **THEN** every card has a verdict in {Yes, No, Maybe} and a non-empty note of at most 140 characters for both upright and reversed

### Requirement: Illustrated card face
A face-up card SHALL display its name and a picture for the card. Major arcana SHALL also display their Roman numeral (0 for The Fool).
- **Major arcana and the 16 court cards (Page, Knight, Queen and King of each suit):** each card's picture SHALL be its own drawing.
- **Ace to Ten of each suit:** the picture SHALL be its suit's symbol repeated as many times as the card's number (one large symbol for the Ace), laid out in one fixed arrangement per number that is the same in every suit.

#### Scenario: Minor card face
- **WHEN** the Three of Cups is shown face up
- **THEN** the card shows the name "Three of Cups" and exactly three cups symbols

#### Scenario: Same number, same layout
- **WHEN** the Seven of Wands and the Seven of Pentacles are shown face up
- **THEN** each shows seven of its own suit's symbols, in the same arrangement

#### Scenario: Ace face
- **WHEN** the Ace of Swords is shown face up
- **THEN** the card shows the name "Ace of Swords" and one large swords symbol

#### Scenario: Court card face
- **WHEN** the Queen of Cups is shown face up
- **THEN** the card shows the name "Queen of Cups" and its own drawing, different from every other card's

#### Scenario: Major card face
- **WHEN** The Tower is shown face up
- **THEN** the card shows the name "The Tower", the numeral XVI, and its own drawing, different from every other card's

### Requirement: Reversed cards are visibly reversed and readable
A reversed card SHALL be displayed rotated 180 degrees, with an upright "(reversed)" marker after the card's name below the face, and the reversed state SHALL be conveyed to assistive technology.

#### Scenario: Reversed card display
- **WHEN** a card is drawn reversed
- **THEN** its face appears upside down, its name below the face is followed by an upright "(reversed)", and its accessible name includes "reversed"

#### Scenario: Upright card display
- **WHEN** a card is drawn upright
- **THEN** its face is not rotated and no "(reversed)" marker is shown
