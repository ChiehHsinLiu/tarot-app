## MODIFIED Requirements

### Requirement: Reversed cards are visibly reversed and readable
A reversed card SHALL be displayed rotated 180 degrees, with an upright "(reversed)" marker after the card's name below the face, and the reversed state SHALL be conveyed to assistive technology.

#### Scenario: Reversed card display
- **WHEN** a card is drawn reversed
- **THEN** its face appears upside down, its name below the face is followed by an upright "(reversed)", and its accessible name includes "reversed"

#### Scenario: Upright card display
- **WHEN** a card is drawn upright
- **THEN** its face is not rotated and no "(reversed)" marker is shown
