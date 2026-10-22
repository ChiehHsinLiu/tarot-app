# Little Oracle

Tarot and animal oracle cards for today: a card-drawing web app built with React, Vite, and TypeScript.

Live site: https://chiehhsinliu.github.io/tarot-app/

## Development

```sh
npm install
npm run dev       # http://localhost:5173/tarot-app/
npm run build     # type-check and build into dist/
npm run preview   # serve dist/ at http://localhost:4173/tarot-app/
```

The app is served under `/tarot-app/` because GitHub Pages hosts it as a project site. If the repository is renamed, update `base` in `vite.config.ts` to match.

## Using the app

The home page offers two choices, each drawn as an arched window (a fanned tarot deck on one sill, a cat on the other) with its own screen and address. The windows show a day sky in light mode and a night sky in dark mode; the drawings are in `src/assets/home/`.

- **Tarot reading** (`#/tarot`): choose the Yes / No or Three cards spread, optionally ask a question, and draw. **Share** turns a reading into a link (`#/r/v1/...`) that anyone can open.
- **Animal oracle** (`#/oracle`): draw one card for a little guidance today.

Drawn cards land face down, showing a night-sky back, and turn over one after another, each card's meaning appearing as it lands. A shared link opens with its cards already face up, and if your system asks for reduced motion, cards appear face up at once.

Cards lie on a forest-green reading mat, one mat across the row on wider screens and one per card on a phone, with their names and meanings below it. Above **Draw**, the tarot screen shows the mat with your chosen spread laid out face down, one back for each position.

The **How it works** link under each screen's heading opens **How it works**, with steps for that screen, and **About this deck**. Close it with **Close** or Escape. The text lives in `data/i18n/en/guides.json`, one entry per screen.

A tarot reading or a shared one has its start-over button both under the heading and at the bottom: **New reading** for a tarot reading and **Draw your own** for a shared one. **New reading** keeps your spread. An oracle card is short, so it has one **Draw again**, at the bottom.

Each screen has a **Home** link, and the browser's Back button works too. Opening a screen from elsewhere always starts it fresh, with no reading or card, no spread selected and an empty question. That includes Home, a home choice, Back or Forward, and a typed address.

## Animal oracle

The animal oracle draws one card from an original deck of 36 animal cards, such as the Dachshund · Small but Mighty or the Alpaca · Gentle Boundaries. Each card has its own drawing of its animal and shows a message, a question to reflect on, and an affirmation. There's no question to type and no daily limit: use **Draw again** for a different card and **Home** to return.

The deck lives in `data/oracle/animal.json` (card ids and colour families) and `data/i18n/en/oracle/animal.json` (the text).

Each card's drawing is a hand-written SVG in `src/assets/oracle/animal/<card-id>.svg`, for example `animal-01.svg` for the Dachshund. To redraw a card, edit or replace its file, keeping to the format that `src/lib/oracle-art.test.ts` checks:

- The root is `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" focusable="false">`.
- Only simple shapes are allowed (`g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`). There's no text, and no scripts, links or styles.
- Colours come only from the classes `art-fill`, `art-deep`, `art-light`, `art-ink` (eyes and noses, required), `art-blush` and `art-line` (outlines). These follow the card's colour family, so never write a colour into the file.
- Each file is at most 3 KB, and every card needs exactly one drawing.

## Private readings

When you run the app locally with `npm run dev`, each reading also has an **Ask Claude** button. It sends the reading to your own [Claude Code](https://claude.com/claude-code) on this computer and streams Claude's interpretation into the page. This feature exists only in `npm run dev`; the public site and `npm run build` don't include it.

Requirements:

- Claude Code installed and logged in. Check with `claude --version`, and run `claude` then `/login` if needed. Each reading uses your Claude plan.

Use it:

1. Run `npm run dev` and open http://localhost:5173/tarot-app/.
2. Choose **Tarot reading** and draw, or open a share link, then click **Ask Claude**. Use **Stop** to end an answer early and **Ask again** for a new interpretation of the same cards.
3. On the **Animal oracle** screen, draw a card. You can also type a question in **Ask about this card**, such as "What should I focus on today?", before clicking **Ask Claude**. Leave it empty for a fuller explanation of the card. The box stays editable, so you can change the question and use **Ask again** on the same card.

Claude Code runs with all tools turned off and without saving the session, from a temporary directory.

### Lenormand (dev only)

In `npm run dev`, the tarot screen also has **Choose a deck**: Tarot or Lenormand. Lenormand is a 36-card deck read by combining neighbouring cards, and it uses the same spreads:

- **Yes / No** draws two cards ("First card" and "Second card") and needs a question. There's no written verdict: click **Ask Claude**, and Claude answers Yes, No or Maybe from how the two cards combine.
- **Three cards** draws Past, Present and Future. Lenormand cards are never reversed.

Lenormand readings have **New reading**, **Copy for Claude** and **Ask Claude**, but no **Share**, since the public site doesn't include the deck. The deck lives in `data/lenormand/` (ids, numbers and spread positions) and `data/i18n/en/lenormand/` (card text, position labels and the screen guide), and Claude's instructions are in `prompts/lenormand.md`. None of it is part of `npm run build`.

Each Lenormand card has its own original drawing of its traditional picture in `src/assets/lenormand/<card-id>.svg`, for example `lenormand-02.svg` for the Clover. Each card also has one of the animal oracle's six pastel colour families, set as `palette` in `data/lenormand/deck.json`. The drawings follow the same format rules as the animal oracle's, which `src/lib/art-format.ts` defines and the tests check for both decks. Lenormand answers are saved to the journal with `"deck": "lenormand"`, the spread, the card ids in order and the question.

Each finished or stopped answer, tarot or oracle, is saved to your private journal in `~/.tarot/journal/`, one `YYYY-MM-DD.jsonl` file per day. The journal is outside this repository and readable only by you. Set `TAROT_JOURNAL_DIR` to store it somewhere else.

Don't start the dev server with `--host`. The Ask Claude endpoint only answers requests from this computer, but there's no reason to expose it on your network.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages. It can also be run manually from the Actions tab.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
