# Spec Delta

## MODIFIED Requirements

### Requirement: Home page subtitle
The home page SHALL show a subtitle directly below the main heading: "tarot & animal cards for today" in English, and its Traditional Chinese version in Chinese. Other screens SHALL NOT show the subtitle.

#### Scenario: Subtitle on home
- **WHEN** a user opens the app's root URL in English
- **THEN** the text "tarot & animal cards for today" appears below the "Little Oracle" heading

#### Scenario: Subtitle in Chinese
- **WHEN** a user opens the app's root URL in Chinese
- **THEN** the Chinese subtitle appears below the "Little Oracle" heading

#### Scenario: No subtitle elsewhere
- **WHEN** a user opens the tarot screen
- **THEN** the subtitle is not shown
