# Spec Delta

## MODIFIED Requirements

### Requirement: Share link format
A share link SHALL encode a reading in the URL fragment as `#/r/v1/<spread-id>/<cards>`, optionally followed by a query. `<cards>` SHALL list the drawn card ids in position order separated by `.`, each followed by `r` when that card is reversed. The query SHALL hold `d=dachshund` when the reading used the Dachshund deck, then `q=<percent-encoded question>` when the question is included, joined by `&` after one `?`. A Classic reading's link SHALL have no `d` parameter.

#### Scenario: Three-card link
- **WHEN** a three-card reading of Three of Swords (upright), Death (reversed), and Ace of Cups (upright) is shared without its question
- **THEN** the link ends with `#/r/v1/three-card/swords-03.major-13r.cups-01`

#### Scenario: Link with question
- **WHEN** a reading with the question "Will it work?" is shared with the question included
- **THEN** the link fragment ends with `?q=Will%20it%20work%3F`

#### Scenario: Dachshund link
- **WHEN** a Dachshund three-card reading of Three of Swords (upright), Death (reversed), and Ace of Cups (upright) is shared with the question "Will it work?" included
- **THEN** the link ends with `#/r/v1/three-card/swords-03.major-13r.cups-01?d=dachshund&q=Will%20it%20work%3F`

### Requirement: Invalid links are handled gracefully
A link fragment starting with `#/r/` that does not decode to a valid reading SHALL show the notice "This reading link isn't valid." above an empty composer. A link is invalid when its version is not `v1`, its spread is unknown, its card count differs from the spread's positions, any card id is unknown or repeated, its question exceeds 300 user-visible characters, or it has a `d` parameter whose value is not `dachshund`.

#### Scenario: Unknown card
- **WHEN** a user opens `#/r/v1/yes-no/major-99`
- **THEN** the notice is shown with an empty composer and no cards

#### Scenario: Unsupported version
- **WHEN** a user opens `#/r/v2/yes-no/major-01`
- **THEN** the notice is shown with an empty composer

#### Scenario: Unknown deck
- **WHEN** a user opens `#/r/v1/yes-no/major-01?d=poodle`
- **THEN** the notice is shown with an empty composer
