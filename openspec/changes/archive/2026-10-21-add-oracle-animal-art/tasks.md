# Tasks

## 1. Loading and safety checks

- [x] 1.1 Add `src/lib/oracle-art.ts`, which loads `src/assets/oracle/animal/*.svg` as raw strings into `ORACLE_ART` by card id, and `src/lib/oracle-art.test.ts`. The test enforces the drawing format from the design:
  - the root `<svg>`
  - the element, attribute and class allow-lists
  - an `art-ink` shape
  - at most 3,072 bytes
  - ids exactly matching the deck
  - distinct contents

  Verify the test passes for the files present and fails on deliberately bad samples: a `<script>`, an `onload`, a `fill=` attribute, a `<text>`, an unknown class, and an oversized file. Use in-test strings for the bad samples; don't commit bad files.
- [x] 1.2 Render the drawing on the card face. `OracleCardFace` shows `<span class="oracle-art" aria-hidden="true">` with the card's SVG instead of the paw, and `src/index.css` gets the `.oracle-art` size and the six art classes. Keep `PAW` for `HomeChoices`. Verify in the browser that the face shows theme, drawing and name, with no paw, and that the card's accessible name is still "<animal>, <theme>".
- [x] 1.3 Build the scratchpad contact-sheet generator: every drawing on its family face at card size and 2×, in light and dark, using the real `.oracle-art` CSS. Verify it renders the drawings present without console errors.

## 2. Style samples (check-in with the user)

- [x] 2.1 Draw `animal-01` (Dachshund), `animal-22` (Capybara) and `animal-07` (Owl) following the style rules. Verify:
  - the format test passes for them
  - the contact sheet shows all three, recognisable at card size, in both schemes
  - the user approves the style, or the requested adjustments are made and approved

  Pause here until the user approves.

## 3. The remaining 33 drawings, family by family

Each task is verified when the format test passes for its files and the contact sheet shows the batch, recognisable at card size, in both schemes, with the batch reviewed against the style rules.

- [x] 3.1 Peach: Hermit Crab (09), Fox (23), Golden Retriever (32), Red Panda (35). The Dachshund and Capybara are already done in 2.1.
- [x] 3.2 Sage: Sloth (03), Turtle (05), Snake (10), Hedgehog (26), Frog (28), Koala (31).
- [x] 3.3 Sky: Otter (04), Salmon (08), Dolphin (14), Penguin (21), Seahorse (33), Whale (36).
- [x] 3.4 Lavender: Wolf (12), Cat (16), Elephant (17), Magpie (18), Swan (19). The Owl is already done in 2.1.
- [x] 3.5 Butter: Alpaca (02), Bear (11), Beaver (15), Meerkat (20), Horse (25), Goat (34).
- [x] 3.6 Rose: Hummingbird (06), Honey Badger (13), Deer (24), Flying Squirrel (27), Dove (29), Bowerbird (30).
- [x] 3.7 With all 36 present, verify:
  - the format test passes with ids exactly matching the deck
  - the full contact sheet shows no two drawings alike
  - easily confused pairs are clearly distinct: otter and beaver, dove and magpie, wolf and fox, deer and goat

## 4. Docs and integration

- [x] 4.1 Update the animal oracle section of `README.md` to describe the drawings and where they live (`src/assets/oracle/animal/<card-id>.svg`, with the format the test enforces). Verify the paths and rules match the code.
- [x] 4.2 Extend the scratchpad oracle and theme checks with the animal-oracle scenarios:
  - every drawn card shows an `.oracle-art` drawing and no paw
  - its accessible name is unchanged and the drawing is hidden from assistive technology
  - drawings from two families use different colours
  - offline draws (`--public`) show the drawing

  Then run `npm test && npm run build`, every check against `npm run dev` (with the Ask Claude ones on a scratchpad journal), and the `--public` checks against `npm run preview`. Verify:
  - everything passes with no console errors
  - no request goes to another origin
  - `dist/` contains no dev-only strings
- [x] 4.3 After pushing to `main` (with approval), verify the deploy succeeds and the live site passes the oracle and theme `--public` checks, the navigation check and the share-link check.

## Workflow follow-up

- Archive with `/opsx:archive` once the live site is verified.
