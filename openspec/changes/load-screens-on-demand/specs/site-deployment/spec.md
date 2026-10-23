## ADDED Requirements

### Requirement: Each screen loads its own content
The published site's first page load SHALL contain only what the home page needs. The tarot card text, the oracle card text and the oracle drawings SHALL NOT be part of it, and nor SHALL any later tarot card drawings. Each of these SHALL load with the screen that shows it. Once a screen is showing, drawing and redrawing on it SHALL NOT need any further download.

#### Scenario: Home loads alone
- **WHEN** a visitor opens the published home page with an empty cache
- **THEN** the home page shows with its two windows, and the script it ran before showing contains no tarot card meanings, no oracle card messages and no oracle drawings

#### Scenario: Screens are ready by the time they're chosen
- **WHEN** the home page has shown and the visitor then chooses Tarot reading or Animal oracle
- **THEN** that screen's file has already started loading in the background, and the screen shows as it does today

#### Scenario: Opening a screen directly
- **WHEN** a visitor opens a share link, `#/tarot` or `#/oracle` directly with an empty cache
- **THEN** the header shows at once, the screen shows as soon as its file has loaded, and it looks and behaves as it does today

#### Scenario: Drawing needs no network
- **WHEN** the tarot or oracle screen is showing and the network then goes offline
- **THEN** Draw, Draw again and New reading still show cards with their text and drawings
