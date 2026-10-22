## ADDED Requirements

### Requirement: Shared card back
Every deck SHALL use one card back: an original night-sky drawing in deep plum with a gold frame, a crescent moon and scattered stars, mirror-symmetric left to right. The back SHALL be the same size and shape as a card face, bundled with the app, and hidden from assistive technology.

#### Scenario: Same back for every deck
- **WHEN** a tarot reading, an oracle card and a Lenormand reading are each drawn
- **THEN** each card shows the same night-sky back before it turns over

#### Scenario: Back is not announced
- **WHEN** a screen reader reads a newly drawn reading
- **THEN** it announces each card's face as before, and nothing for the back

#### Scenario: No outside requests
- **WHEN** a card back is shown
- **THEN** the drawing needs no request to another origin

### Requirement: Drawn cards turn over on their own
On a newly drawn tarot reading, oracle card or Lenormand reading, each card SHALL first show its back and then flip face up without any input. Cards SHALL flip in reading order, each starting about 0.3 seconds after the one before, and each flip SHALL take about 0.6 seconds. A reversed card SHALL land upside down, as it shows today.

#### Scenario: Three-card reading
- **WHEN** a user draws a three-card tarot reading
- **THEN** all three cards show their backs, then turn face up one after another from first to last, and all are face up within about 1.5 seconds

#### Scenario: Reversed card
- **WHEN** a drawn card is reversed
- **THEN** it turns over and lands upside down

#### Scenario: Draw again
- **WHEN** a user activates "Draw again" on an oracle card
- **THEN** the new card shows its back and turns face up the same way

### Requirement: Card text appears with its card
While a reading's cards turn over, each card's title, keywords and meaning SHALL fade in as that card lands. On the Yes / No spread, the verdict SHALL fade in with the first card. On an oracle card, the message, reflection and affirmation SHALL fade in with the card. Headings, the question and buttons SHALL show at once.

#### Scenario: Meaning follows its card
- **WHEN** a user draws a three-card reading
- **THEN** the third card's meaning becomes visible as the third card lands, after the first card's meaning

#### Scenario: Verdict with the first card
- **WHEN** a user draws a Yes / No reading
- **THEN** the verdict becomes visible as the card lands, not before it starts turning

### Requirement: The reveal never blocks the reading
The whole reading SHALL be in the page from the moment it opens, whatever the animation is showing. Keyboard focus SHALL move to the reading's heading as before, assistive technology SHALL be able to read every card and meaning at once, and every button SHALL work immediately.

#### Scenario: Screen reader during the flip
- **WHEN** a screen reader reads a reading while its cards are still turning
- **THEN** it can read every card name, orientation and meaning

#### Scenario: Act before the flip ends
- **WHEN** a user activates "New reading" before the cards have finished turning
- **THEN** it works as it does today

### Requirement: Reduced motion skips the reveal
When the system asks for reduced motion, cards SHALL appear face up at once, with their text and verdict, with no flip and no fade.

#### Scenario: Reduced motion
- **WHEN** a user whose system asks for reduced motion draws a reading
- **THEN** every card is face up and every meaning is visible as soon as the reading opens, and no back is shown

## MODIFIED Requirements

### Requirement: Decoration stays out of the way
Flourishes, frames, and background texture SHALL be hidden from assistive technology, SHALL NOT be focusable, and SHALL NOT move. The card reveal is not decoration; it is covered by "Drawn cards turn over on their own".

#### Scenario: Screen reader on the home page
- **WHEN** a screen reader reads the home page
- **THEN** it announces the heading, subtitle, and two choices, and nothing for the decorations
