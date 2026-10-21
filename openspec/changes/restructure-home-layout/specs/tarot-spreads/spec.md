## MODIFIED Requirements

### Requirement: Available spreads
The app SHALL offer exactly two spreads: "Yes / No" and "Three cards". No spread SHALL be selected when the tarot screen is first opened after the page loads, and at most one spread SHALL be selected at a time.

#### Scenario: Spread choice on load
- **WHEN** a user opens the tarot screen for the first time after the page loads
- **THEN** both spreads are offered and neither is selected

#### Scenario: Switching spread before drawing
- **WHEN** a user selects "Yes / No" before drawing
- **THEN** "Yes / No" becomes the only selected spread
