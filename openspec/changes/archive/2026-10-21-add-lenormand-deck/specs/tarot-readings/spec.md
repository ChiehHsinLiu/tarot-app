## MODIFIED Requirements

### Requirement: Fair draw
Each tarot draw SHALL select cards uniformly at random without replacement from the full 78-card deck, using a cryptographically secure random source, so that every ordered combination of distinct cards is equally likely.

#### Scenario: No repeated cards
- **WHEN** a tarot three-card reading is drawn
- **THEN** the three cards are all different

#### Scenario: Statistical uniformity
- **WHEN** a large number of single-card tarot draws are simulated in tests
- **THEN** each of the 78 cards appears with a frequency consistent with 1/78 within statistical tolerance

### Requirement: Independent 50/50 reversals
Each drawn tarot card SHALL be independently reversed with probability 1/2, using the same cryptographically secure random source.

#### Scenario: Reversal frequency
- **WHEN** a large number of tarot draws are simulated in tests
- **THEN** the share of reversed cards is consistent with 1/2 within statistical tolerance
