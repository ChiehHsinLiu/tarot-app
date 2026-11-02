## MODIFIED Requirements

### Requirement: Prompts carry a reading guide for themed spreads
A tarot prompt for "Situation, Action, Outcome" or "Choice" SHALL include one short guide, written for that spread, telling Claude how to read its three positions. Prompts for "Yes / No" and "Past, Present, Future" SHALL NOT include a spread guide.

#### Scenario: Situation, Action, Outcome prompt
- **WHEN** the prompt is built for a "Situation, Action, Outcome" reading
- **THEN** it lists Situation, Action, and Outcome in order and includes a guide reading the first card as where the querent stands, the second as the approach the cards advise, and the third as the likely outcome of taking it

#### Scenario: Choice prompt
- **WHEN** the prompt is built for a "Choice" reading with the question "Stay or move?"
- **THEN** it lists Option A, Option B, and Advice in order and includes a guide to compare the two options named in the question fairly and let the Advice card suggest which way to lean, without making the decision for the querent

#### Scenario: Existing spreads unchanged
- **WHEN** the prompt is built for a "Yes / No" or "Past, Present, Future" reading
- **THEN** it contains no spread guide, and its text is what it was before the new spreads were added except that the Past, Present, Future prompt names its spread "Past, Present, Future"

#### Scenario: No verdict for themed spreads
- **WHEN** the prompt is built for a "Choice" or "Situation, Action, Outcome" reading
- **THEN** the prompt contains no Yes / No / Maybe verdict
