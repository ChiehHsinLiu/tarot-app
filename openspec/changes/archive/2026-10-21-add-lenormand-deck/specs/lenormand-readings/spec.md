# Spec Delta

## Purpose

Lets the owner read with a 36-card Lenormand deck on the tarot screen of the local dev app, using the same spreads as tarot, with Claude interpreting how the cards combine. None of it is part of the public site.

## ADDED Requirements

### Requirement: Lenormand is available only in the local dev app
When the app is served by `npm run dev`, the tarot screen SHALL offer a deck choice. The production build SHALL contain no deck choice, no Lenormand card text, and no Lenormand code, and the public tarot screen SHALL behave exactly as without this capability.

#### Scenario: Local dev app
- **WHEN** the owner opens the tarot screen at the local dev server
- **THEN** a "Choose a deck" choice with "Tarot" and "Lenormand" is shown

#### Scenario: Public site
- **WHEN** anyone opens the tarot screen on the deployed site or in `npm run preview`
- **THEN** no deck choice is shown and the production bundle contains no Lenormand text

### Requirement: Lenormand deck
The Lenormand deck SHALL contain exactly 36 cards numbered 1 to 36 in the traditional order: Rider, Clover, Ship, House, Tree, Clouds, Snake, Coffin, Bouquet, Scythe, Whip, Birds, Child, Fox, Bear, Stars, Stork, Dog, Tower, Garden, Mountain, Crossroads, Mice, Heart, Ring, Book, Letter, Gentleman, Lady, Lily, Sun, Moon, Key, Fish, Anchor, Cross. Each card SHALL have its name, at least one keyword, and a meaning of at most 400 characters written for this project.

#### Scenario: Deck completeness
- **WHEN** the Lenormand deck data is loaded
- **THEN** it has 36 cards with distinct ids, numbered 1 to 36 in the traditional order, each with a name, keywords, and a meaning of at most 400 characters

### Requirement: Choosing a deck
The deck choice SHALL appear on the tarot screen above the "How it works" and "About this deck" sections, with "Tarot" selected when the screen is first opened after the page loads, and exactly one deck selected at a time. Changing the deck SHALL keep the selected spread and the question. The selected deck SHALL be kept, like the spread and question, when the owner goes Home and returns to the tarot screen, and after "New reading".

#### Scenario: Default deck
- **WHEN** the owner opens the tarot screen for the first time after loading the dev app
- **THEN** "Tarot" is selected

#### Scenario: Switching deck keeps the spread and question
- **WHEN** the owner selects "Three cards", types a question, and then selects "Lenormand"
- **THEN** "Three cards" is still selected and the question is unchanged

#### Scenario: Deck kept across Home
- **WHEN** the owner selects "Lenormand", goes Home, and opens "Tarot reading" again
- **THEN** "Lenormand" is still selected

### Requirement: Lenormand spreads
With Lenormand selected, the tarot screen SHALL offer the same two spreads, "Yes / No" and "Three cards", under the same rules for choosing a spread and requiring a question. "Yes / No" SHALL draw exactly two cards into positions labeled "First card" and "Second card". "Three cards" SHALL draw exactly three cards into positions labeled "Past", "Present", and "Future". The spread choice SHALL show each spread's card count for the selected deck.

#### Scenario: Lenormand Yes / No
- **WHEN** the owner draws "Yes / No" with Lenormand selected and a question typed
- **THEN** two Lenormand cards are shown, labeled "First card" and "Second card"

#### Scenario: Card count in the spread choice
- **WHEN** Lenormand is selected
- **THEN** the "Yes / No" option says "2 cards, question required" and "Three cards" says "3 cards"

#### Scenario: Question still required
- **WHEN** Lenormand and "Yes / No" are selected and the question is empty
- **THEN** the draw action is disabled and the owner is told a question is required

### Requirement: Fair Lenormand draw
Each Lenormand draw SHALL select cards uniformly at random without replacement from the 36 cards, using a cryptographically secure random source. Lenormand cards SHALL always be upright.

#### Scenario: No repeats and no reversals
- **WHEN** a Lenormand three-card reading is drawn
- **THEN** the three cards are all different and none is reversed

#### Scenario: Statistical uniformity
- **WHEN** a large number of single-card Lenormand draws are simulated in tests
- **THEN** each of the 36 cards appears with a frequency consistent with 1/36 within statistical tolerance

### Requirement: Lenormand reading display
A Lenormand reading SHALL show the deck and spread name, the question as asked (if any), and for each card in position order its position label, a face showing its number and name, its keywords, and its meaning. A Lenormand Yes / No reading SHALL NOT show a written verdict, and SHALL instead say that the answer comes from how the two cards combine and that Ask Claude gives it. A Lenormand reading SHALL offer "New reading", "Copy for Claude", and "Ask Claude", and SHALL NOT offer Share.

#### Scenario: Yes / No reading
- **WHEN** a Lenormand "Yes / No" reading is shown
- **THEN** it shows "Lenormand · Yes / No", the question, both cards with number, name, keywords, and meaning, a note pointing to Ask Claude for the answer, and no Yes, No, or Maybe verdict

#### Scenario: Actions
- **WHEN** a Lenormand reading is shown
- **THEN** "New reading", "Copy for Claude", and "Ask Claude" are offered and no Share action is shown

#### Scenario: New reading
- **WHEN** the owner activates "New reading" on a Lenormand reading
- **THEN** the tarot screen shows Lenormand and the same spread selected, with an empty question

#### Scenario: Accessible card
- **WHEN** a screen reader reaches a Lenormand card face
- **THEN** it announces the card's number and name, for example "2, Clover"

### Requirement: Lenormand prompt
The prompt for a Lenormand reading, used by both "Copy for Claude" and "Ask Claude", SHALL come from a Lenormand template that tells Claude to read the cards as combinations rather than one by one. It SHALL list the spread name and, for each card in position order, its position label, number and name, keywords, and meaning, with no orientation. The question SHALL be delimited as data under the same rules as tarot prompts, and building the prompt SHALL be deterministic and local.

#### Scenario: Three-card prompt
- **WHEN** the prompt is built for a Lenormand three-card reading
- **THEN** it lists Past, Present, and Future in order with each card's number, name, keywords, and meaning, and says nothing about upright or reversed

#### Scenario: Question cannot break out
- **WHEN** the question contains "</question>"
- **THEN** the prompt's question block is not closed early

### Requirement: Lenormand Yes / No prompt asks for the answer
For a Lenormand Yes / No reading, the prompt SHALL ask Claude to begin with a clear Yes, No, or Maybe, drawn from how the two cards combine, reading the first card as the subject and the second as what describes it. It SHALL NOT contain a written verdict.

#### Scenario: Yes / No prompt
- **WHEN** the prompt is built for a Lenormand Yes / No reading of Ship then Sun
- **THEN** it lists First card: 3 Ship and Second card: 31 Sun, asks for a Yes, No, or Maybe first, and contains no written verdict

### Requirement: Lenormand instructions
While Lenormand is selected, the tarot screen's "How it works" SHALL explain that Yes / No draws two cards and needs a question, that Three cards draws Past, Present, and Future, that cards are always upright and read together, that Ask Claude gives the Yes / No answer, and that Lenormand readings cannot be shared as links.

#### Scenario: Lenormand instructions
- **WHEN** the owner selects Lenormand and opens "How it works"
- **THEN** it explains the two-card Yes / No, upright cards read together, Ask Claude for the answer, and that there is no share link

### Requirement: Lenormand deck explanation
While Lenormand is selected, the tarot screen's "About this deck" SHALL describe the 36-card deck, named after the Parisian fortune-teller Marie Anne Lenormand, whose everyday pictures are read together like words in a sentence, and SHALL say the meanings are written for this app, ending with the shared reflection note.

#### Scenario: Lenormand deck explanation
- **WHEN** the owner selects Lenormand and opens "About this deck"
- **THEN** it describes the 36 cards and Marie Anne Lenormand, and ends with the reflection note
