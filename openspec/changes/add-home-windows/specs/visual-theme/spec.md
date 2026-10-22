## ADDED Requirements

### Requirement: Illustrated home windows
Each of the home page's two choices SHALL be shown as an arched window containing an original drawing, with the choice's title and one-line description below it, the window and text together forming a single link. The "Tarot reading" window SHALL show a fanned deck of cards on its sill, drawn as artwork without any card's face, number, or name. The "Animal oracle" window SHALL show a cat sitting on its sill. Both windows SHALL be the same size and given equal prominence.

#### Scenario: Home page windows
- **WHEN** a user opens the home page
- **THEN** "Tarot reading" is shown under an arched window with a fanned deck on the sill, and "Animal oracle" under an arched window with a cat on the sill, both the same size

#### Scenario: One link per window
- **WHEN** a user clicks the cat in the "Animal oracle" window
- **THEN** the animal oracle screen opens, as it does when clicking the title

### Requirement: Window skies follow the palette
In the light palette each home window SHALL show a day sky with a sun and clouds, and in the dusk palette a night sky with a moon and stars. The sky SHALL change with the system colour scheme without a reload.

#### Scenario: Night windows
- **WHEN** a user whose system prefers a dark colour scheme opens the home page
- **THEN** both windows show a moon and stars, and no sun

#### Scenario: Scheme changes while open
- **WHEN** the system colour scheme changes from light to dark while the home page is open
- **THEN** both windows switch from the day sky to the night sky without a reload

### Requirement: Home windows stay decorative
The window drawings SHALL be hidden from assistive technology, so each choice is announced by its title and description only. On hover or keyboard focus, a window's frame and sill SHALL take the accent colour, and keyboard focus SHALL also show a visible focus ring; the drawings SHALL NOT move. The drawings SHALL be bundled with the app, and at 320 pixels wide the windows SHALL fit without horizontal scrolling.

#### Scenario: Screen reader
- **WHEN** a screen reader reads the home page
- **THEN** it announces the heading, subtitle, and the two choices by title and description, and nothing for the drawings

#### Scenario: Keyboard focus
- **WHEN** a keyboard user tabs to the "Tarot reading" window
- **THEN** its frame and sill turn the accent colour and a focus ring is shown, and nothing moves

#### Scenario: Phone width
- **WHEN** the home page is shown 320 pixels wide in either palette
- **THEN** the two windows are stacked, fully visible, and the page has no horizontal scroll

#### Scenario: No outside requests
- **WHEN** the home page loads
- **THEN** the drawings need no request to another origin
