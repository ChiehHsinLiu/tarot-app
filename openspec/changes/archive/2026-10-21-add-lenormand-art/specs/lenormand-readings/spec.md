## MODIFIED Requirements

### Requirement: Lenormand reading display
A Lenormand reading SHALL show the deck and spread name, the question as asked (if any), and for each card in position order its position label, a face showing its number, its drawing, and its name, followed by its keywords and its meaning. A Lenormand Yes / No reading SHALL NOT show a written verdict, and SHALL instead say that the answer comes from how the two cards combine and that Ask Claude gives it. A Lenormand reading SHALL offer "New reading", "Copy for Claude", and "Ask Claude", and SHALL NOT offer Share.

#### Scenario: Yes / No reading
- **WHEN** a Lenormand "Yes / No" reading is shown
- **THEN** it shows "Lenormand · Yes / No", the question, both cards with number, drawing, name, keywords, and meaning, a note pointing to Ask Claude for the answer, and no Yes, No, or Maybe verdict

#### Scenario: Actions
- **WHEN** a Lenormand reading is shown
- **THEN** "New reading", "Copy for Claude", and "Ask Claude" are offered and no Share action is shown

#### Scenario: New reading
- **WHEN** the owner activates "New reading" on a Lenormand reading
- **THEN** the tarot screen shows Lenormand and the same spread selected, with an empty question

#### Scenario: Accessible card
- **WHEN** a screen reader reaches a Lenormand card face
- **THEN** it announces the card's number and name, for example "2, Clover"

#### Scenario: Drawing on the face
- **WHEN** the Clover card is drawn
- **THEN** its face shows "2" at the top, a drawing of a clover, and "Clover" at the bottom

## ADDED Requirements

### Requirement: Every Lenormand card has its own illustration
Each of the 36 Lenormand cards SHALL have its own illustration of its traditional picture, distinct from every other card's, original to this project, and containing no text. Illustrations SHALL be coloured only by their card's colour family and the card ink. Illustrations SHALL be decorative for assistive technology, SHALL NOT require a network request once the page has loaded, and SHALL NOT be part of the production build.

#### Scenario: One illustration per card
- **WHEN** the Lenormand deck is loaded in the dev app
- **THEN** every card has an illustration, no two cards share one, and there are none for cards that do not exist

#### Scenario: Screen reader
- **WHEN** a screen reader reaches a drawn Lenormand card
- **THEN** it announces "<number>, <name>" and nothing further for the illustration

#### Scenario: Offline after load
- **WHEN** the network is disconnected after a Lenormand reading has been shown and the owner draws again
- **THEN** the new cards' illustrations are shown

#### Scenario: Public build
- **WHEN** the production bundle is inspected
- **THEN** it contains no Lenormand illustration

### Requirement: Lenormand cards use pastel colour families
Each Lenormand card SHALL belong to one of the six pastel colour families shared with the animal oracle (peach, sage, sky, lavender, butter, rose), chosen to suit its picture. Its face and illustration SHALL use that family's colours with the card ink, so they match in both colour schemes.

#### Scenario: Colours follow the card
- **WHEN** the Clover (sage) and the Ship (sky) are drawn
- **THEN** each face and illustration uses its own family's colours
