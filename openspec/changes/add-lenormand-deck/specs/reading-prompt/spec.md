## MODIFIED Requirements

### Requirement: Prompt describes the whole reading
A tarot reading's prompt SHALL state the spread name and, for each card in position order, its position label, name, orientation (upright or reversed), keywords, and the written meaning for that orientation. Lenormand prompts follow the `lenormand-readings` capability.

#### Scenario: Three-card prompt
- **WHEN** the prompt is built for a tarot three-card reading with Death reversed in the Present position
- **THEN** the prompt lists Past, Present, and Future in order, and the Present entry names Death, says reversed, and includes Death's reversed meaning

### Requirement: Yes / No prompts carry the written answer
For a tarot Yes / No reading, the prompt SHALL include the written verdict and note for the drawn card's orientation and SHALL instruct Claude to explain that answer rather than contradict it. Prompts for other tarot spreads, and all Lenormand prompts, SHALL NOT include a written verdict.

#### Scenario: Yes / No prompt
- **WHEN** the prompt is built for a tarot Yes / No reading whose card's verdict for its orientation is No
- **THEN** the prompt states the answer is No, includes that orientation's note, and asks Claude not to contradict it

#### Scenario: Three-card prompt has no verdict
- **WHEN** the prompt is built for a tarot three-card reading
- **THEN** the prompt contains no Yes / No / Maybe verdict
