# Spec Delta

## MODIFIED Requirements

### Requirement: Lenormand is available only in the local dev app
When the app is served by `npm run dev`, the tarot screen's deck choice SHALL also offer Lenormand. The production build SHALL contain no Lenormand option, no Lenormand card text, and no Lenormand code, and the public tarot screen SHALL behave exactly as without this capability.

#### Scenario: Local dev app
- **WHEN** the owner opens the tarot screen at the local dev server
- **THEN** a "Choose a deck" choice with "Classic", "Dachshund" and "Lenormand" is shown

#### Scenario: Public site
- **WHEN** anyone opens the tarot screen on the deployed site or in `npm run preview`
- **THEN** the deck choice shows only "Classic" and "Dachshund", and the production bundle contains no Lenormand text
