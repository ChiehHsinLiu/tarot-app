## MODIFIED Requirements

### Requirement: Oracle cards have their own colours
Every oracle card SHALL belong to exactly one of six pastel colour families (peach, sage, sky, lavender, butter, rose), with each family used by eight cards. A drawn oracle card's face and reading accents SHALL use its family's colours in both palettes.

#### Scenario: Deck colours
- **WHEN** the oracle deck data is loaded
- **THEN** every card has one of the six colour families and each family is used by exactly eight cards

#### Scenario: Different families look different
- **WHEN** two oracle cards from different colour families are drawn one after the other
- **THEN** their card faces have different background colours
