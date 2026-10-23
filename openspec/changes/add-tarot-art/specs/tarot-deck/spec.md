## RENAMED Requirements

- FROM: `### Requirement: Minimal card face`
- TO: `### Requirement: Illustrated card face`

## MODIFIED Requirements

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
