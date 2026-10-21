## MODIFIED Requirements

### Requirement: Yes / No spread has one position
With the tarot deck, the "Yes / No" spread SHALL draw exactly one card into a single position labeled "Answer". Other decks define their own Yes / No positions.

#### Scenario: Yes / No draw
- **WHEN** a user draws with the tarot deck and "Yes / No" selected
- **THEN** exactly one card is shown, labeled "Answer"

### Requirement: Yes / No spread shows a verdict
A tarot "Yes / No" reading SHALL prominently show the verdict (Yes, No, or Maybe) for the drawn card in its drawn orientation, together with that orientation's yes/no note.

#### Scenario: Reversed card verdict
- **WHEN** a tarot "Yes / No" reading draws a card reversed
- **THEN** the verdict and note shown are the card's reversed verdict and reversed note
