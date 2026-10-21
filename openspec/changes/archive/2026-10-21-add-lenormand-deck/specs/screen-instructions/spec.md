## ADDED Requirements

### Requirement: Guides follow the selected deck
When the tarot screen offers a deck choice, its "How it works" and "About this deck" SHALL show the selected deck's guide. Changing the deck SHALL replace the text in place, without closing an open section or moving focus. Guide text for a dev-only deck SHALL NOT be part of the production build.

#### Scenario: Switching to Lenormand
- **WHEN** the owner opens "About this deck" on the tarot screen and then selects "Lenormand"
- **THEN** "About this deck" stays open and now describes the Lenormand deck

#### Scenario: Public build
- **WHEN** the production bundle is inspected
- **THEN** it contains the tarot and oracle guides and no Lenormand guide text
