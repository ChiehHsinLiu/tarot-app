## MODIFIED Requirements

### Requirement: Opening a share link shows the same reading
Loading the app with a valid share link SHALL display the encoded reading with the same spread, cards, orientations, positions, meanings, and (for Yes / No) verdict, labeled as a shared reading, without drawing new cards. The shared reading's cards SHALL be face up from the start, with no card back and no flip.

#### Scenario: Round trip
- **WHEN** a user copies a reading's link and opens it in a new tab
- **THEN** the new tab shows the same cards in the same positions and orientations, with the same meanings and verdict

#### Scenario: Shared question shown
- **WHEN** a link includes a question
- **THEN** the shared reading shows that question as text

#### Scenario: Link changed in the same tab
- **WHEN** a user pastes a different valid share link into the address bar of an open tab
- **THEN** the page shows the reading from the new link

#### Scenario: Opens face up
- **WHEN** a user opens a valid share link
- **THEN** every card and meaning is visible at once, and no card back is shown
