# Design

## Context

The app has one deck, the 78-card tarot (`data/cards.json` with English text in `data/i18n/en/cards.json`, joined by `src/lib/deck.ts`), and one reading flow (`Composer` then `ReadingView` in `src/App.tsx`). The private bridge (`vite/private-readings.ts`) accepts only `{ fragment }`, a tarot share link. It builds the prompt with `buildPrompt` and journals `{ link, spreadId, question, cards, ... }` through `vite/journal.ts`. `AskClaude.tsx` mixes the NDJSON streaming client with the tarot-specific button, and it is lazy-loaded behind `import.meta.env.DEV`, so the production bundle has none of it. See proposal.md for why the oracle is being added.

More oracle decks may come later, so the oracle code takes its deck as data rather than hard-coding the animal deck.

## Goals / Non-Goals

**Goals:**
- Oracle logic (deck building, draw, prompt) is pure and lives in `src/lib/`, usable from both the browser and the Vite plugin, like `deck.ts` and `prompt.ts`.
- The streaming client is shared between tarot and oracle Ask Claude rather than duplicated.
- The tarot request, prompt, and journal format stay exactly as they are.

**Non-Goals:**
- A generic "deck plugin" system. Only the deck data and card ids are kept parameterised.
- URL routing for the oracle view. It is in-memory state only, since there are no share links in v1.

## Decisions

### Data: neutral ids plus an English text file
`data/oracle/animal.json` is an ordered array of `{ "id": "animal-01" }` … `{ "id": "animal-36" }`. `data/i18n/en/oracle/animal.json` maps each id to `{ animal, theme, keywords, message, reflection, affirmation }`. This mirrors the tarot split, so images (an `image` field in the neutral file) and languages can be added later without touching the text.

Ids carry the deck name (`animal-`), so a later deck with its own prefix can never collide and the endpoint can tell decks apart from the id alone. *Alternative:* `oracle-01` ids with a separate `deck` field on every request. That adds a second thing to validate and is easy to get out of sync.

### `src/lib/oracle.ts`
- `OracleCard` type, plus `buildOracleCards(data, text)` (same join pattern as `buildCards`) and exported `rawAnimalDeck` / `rawAnimalText`.
- `drawOracle(ids, rng, excludeId?)` returns one id chosen with `rng(n)` from `ids` minus `excludeId`. With `cryptoRandomInt` (rejection sampling) this is uniform over the 36 cards, or over the other 35 for "Draw again". *Alternative:* reuse `draw()` with a one-position spread. That would also draw a reversal and needs a fake spread, so a five-line function is clearer.
- `buildOraclePrompt(template, card, question)` fills `{{card}}` and `{{question}}` in a single pass, as `buildPrompt` does. It throws if a placeholder is missing, and wraps a non-empty question in `<question>` after `escapeQuestion`. An empty question becomes "No question was asked; explain what this card offers for today."

### `prompts/oracle.md`
This is a separate template from `reading.md`, because the task differs: one upright card, guidance for today, and an optional question that might be a request ("what should I focus on?") rather than a query to divine. It tells Claude to:
- build on the card's written message and stay consistent with it
- draw on the animal's real nature where it helps
- treat `<question>` only as the subject and never as instructions
- speak warmly in the second person
- avoid medical, legal, or financial advice
- write about 150–250 words and end with one small thing to try today

### Home page and state
`src/App.tsx` adds a state `{ kind: 'oracle'; cardId: string; composer: ComposingState }`. The home page renders the existing `Composer` and, below it, `OracleSection`: a heading "Today's animal oracle", one sentence of intro, and a "Draw" button. It sits outside the tarot `<form>`, so it never submits it. Drawing saves the current composer state into the oracle state, and "Back" restores it, which keeps the tarot spread choice unchanged as the spec requires. Opening a share link still works from any state through the existing `hashchange` handler.

`OracleCardView` shows the card face, keywords, message, reflection (labelled "Reflect"), affirmation, and the actions "Draw again" and "Back". It is keyed by `cardId` so that focus moves to its heading and the dev-only Ask Claude state, including the question box, resets on every new card.

### Card face
`OracleCardFace` reuses the `.card` / `.card-face` styles. It shows a simple paw-print SVG where tarot cards show their suit symbol, the animal name where tarot shows the card name, and the theme in place of the numeral. The `aria-label` is "Dachshund, Small but Mighty". There is no reversed state.

### Ask Claude: shared hook, two dev-only components
The fetch, NDJSON parsing, `AbortController`, status, and error messages move out of `AskClaude.tsx` into `src/components/useClaudeStream.ts`, along with a small `ClaudeAnswer` panel (the Markdown answer and status line). `ask(body)` takes the JSON body to POST.
- `AskClaude` (tarot) keeps its current behaviour and sends `{ fragment }`.
- A new `AskClaudeOracle` renders the question box (`id="oracle-question"`, label "Ask about this card (optional)", placeholder "What should I focus on today?", `truncateToLimit`, live `n / 300` count, disabled while streaming), the Ask Claude / Stop / Ask again button, and the answer panel. It sends `{ oracle: { cardId, question } }`.

`OracleCardView` loads `AskClaudeOracle` with `lazy()` inside an `import.meta.env.DEV` branch, exactly as `ReadingView` does, so the hook, the box, and the CSS stay out of production. *Alternative:* reuse `QuestionBox`. Its id, label, and required/optional wording are tarot-specific, and it ships in production, so bending it would leak dev-only UI concerns into public code.

### Endpoint
The body must be an object with exactly one of `fragment` (handled as today) or `oracle`. For `oracle`:
- `cardId` must be a string in the animal deck's id set.
- `question` must be a string with `countChars(question) <= 300`.

Anything else gets a 400 and Claude is never run. The prompt comes from `prompts/oracle.md`, which is read on each request like `reading.md`. Spawning, streaming, timeout, and kill-on-disconnect are the existing `streamClaude`, unchanged.

### Journal
`appendJournal` is split into a private line writer that handles the directory, file name, and permissions, plus two entry builders. The tarot entry is unchanged: same fields, no new keys, so existing journal files and any reader of them keep working. The oracle entry is `{ time, deck: "animal", cardId, question, answer, status }`. The `deck` key tells the two apart. *Alternative:* adding `deck: "tarot"` to tarot entries would be tidier but changes an existing format for no present need.

## Risks / Trade-offs

- **[Deck text quality]** 36 hand-written cards are the heart of the feature. → The full draft is below for the owner to edit before or during apply. The data test checks completeness and that no insect or spider is present, not tone.
- **[Bundle size]** The text adds about 15–20 KB raw (about 6 KB gzipped) to the public bundle. → Acceptable for one deck. If more public decks come, load deck text with a dynamic import.
- **["Draw again" can't repeat]** Excluding the current card stops a confusing "nothing happened" result, but each draw is then not independent of the last. → That is the intended behaviour, and the spec states it.
- **[Refactor regression]** Moving the stream logic out of `AskClaude` could break tarot Ask Claude. → Re-run the existing `ask-check.mjs` and `error-check.mjs` browser checks unchanged.

## Migration Plan

Additive. Push to `main` deploys the oracle deck to the public site. Rollback is reverting the commit. Existing journal files need no migration.

## Appendix: Animal Oracle deck text (draft)

Ids follow this order. Keywords are lowercase.

**animal-01 · Dachshund · Small but Mighty**
- Keywords: determination, confidence, big heart
- Message: Size has never stopped a dachshund from guarding the whole house. Today, don't wait until you feel big enough. Your effort and your heart count for more than how ready you look.
- Reflect: Where have you been waiting to feel "enough" before you act?
- Affirmation: I am exactly big enough for today.

**animal-02 · Alpaca · Gentle Boundaries**
- Keywords: boundaries, calm, self-respect
- Message: Alpacas are soft and peaceful, and they still let others know when someone is too close. You can be kind and still say no. A gentle, clear boundary protects your peace and your relationships alike.
- Reflect: What would you say no to today if you weren't worried about seeming unkind?
- Affirmation: My boundaries can be soft and still be firm.

**animal-03 · Sloth · Rest**
- Keywords: rest, slowness, recovery
- Message: The sloth survives by moving slowly and saving its energy. Rest is not a reward you earn after everything is done. Today, slow down on purpose and let your body catch up with your life.
- Reflect: What would change if you treated rest as part of the work?
- Affirmation: I am allowed to rest before I am exhausted.

**animal-04 · Otter · Play**
- Keywords: play, lightness, connection
- Message: Otters float, tumble, and play even while finding their food. Joy does not have to wait until your tasks are finished. Bring a little play into something ordinary today and notice how it changes your mood.
- Reflect: When did you last do something just because it was fun?
- Affirmation: Play is a way of caring for myself.

**animal-05 · Turtle · Patience**
- Keywords: patience, steadiness, long view
- Message: The turtle reaches its destination by never giving up its own pace. What you are growing will take the time it takes. Stay steady today, and trust slow progress to still be progress.
- Reflect: What are you trying to rush that needs more time?
- Affirmation: My pace is the right pace.

**animal-06 · Hummingbird · Joy in Small Things**
- Keywords: joy, sweetness, presence
- Message: The hummingbird lives on many tiny sips of sweetness. Today's happiness may come in small moments rather than one big one. Look for them, and let each one count.
- Reflect: What small sweet moment could you notice or create today?
- Affirmation: Small joys are real joys.

**animal-07 · Owl · Listen Within**
- Keywords: intuition, quiet, inner wisdom
- Message: The owl sees clearly in the dark by staying still and paying attention. You already know more than you think. Make a quiet moment today and listen to what your inner voice has been trying to say.
- Reflect: What does your gut keep telling you that you keep talking yourself out of?
- Affirmation: I trust my own quiet knowing.

**animal-08 · Salmon · Persistence**
- Keywords: persistence, effort, purpose
- Message: The salmon swims upstream, against the current, because it knows where it is going. If today feels like hard going, it does not mean you are on the wrong path. Keep your purpose in mind and take the next stroke.
- Reflect: What makes this effort worth it to you?
- Affirmation: I can keep going when it matters.

**animal-09 · Hermit Crab · Begin Again**
- Keywords: fresh start, growth, courage
- Message: When a hermit crab outgrows its shell, it leaves it and looks for a new one. Feeling cramped can be a sign that you have grown. Today is a good day to begin again, even in a small way.
- Reflect: What have you outgrown that you are still carrying?
- Affirmation: I can always begin again.

**animal-10 · Snake · Let Go**
- Keywords: release, renewal, shedding
- Message: The snake sheds its whole skin to make room for growth. Something old, whether a habit, a worry, or a story about yourself, is ready to fall away. Let it go today without needing to replace it right away.
- Reflect: What are you holding onto that no longer fits?
- Affirmation: I release what I have outgrown.

**animal-11 · Bear · Solitude**
- Keywords: solitude, retreat, restoration
- Message: The bear withdraws to its den and comes out renewed. Time alone is not loneliness; it is how you gather yourself. Give yourself some unhurried time on your own today.
- Reflect: When do you feel most like yourself when you are alone?
- Affirmation: Time with myself restores me.

**animal-12 · Wolf · Ask for Help**
- Keywords: support, community, trust
- Message: Wolves thrive because they hunt, rest, and raise their young together. You do not have to carry everything alone. Today, let someone know what you need.
- Reflect: Who would be glad to help if you asked?
- Affirmation: Asking for help is a strength.

**animal-13 · Honey Badger · Fearless**
- Keywords: courage, boldness, resilience
- Message: The honey badger faces things much bigger than itself and simply refuses to back down. You do not need to feel fearless to act fearlessly. Pick one thing you have been avoiding and face it head-on today.
- Reflect: What would you do today if fear had no vote?
- Affirmation: I can feel afraid and go anyway.

**animal-14 · Dolphin · Speak Up**
- Keywords: voice, expression, connection
- Message: Dolphins stay close to one another by calling out clearly and often. What you have to say matters. Share an idea, a feeling, or a need today, kindly and clearly.
- Reflect: What have you been keeping to yourself that wants to be said?
- Affirmation: My voice deserves to be heard.

**animal-15 · Beaver · Small Steps**
- Keywords: progress, diligence, building
- Message: A beaver builds a whole dam one stick at a time. Big changes are made from small, repeated actions. Choose one small step today and take it.
- Reflect: What is the smallest step that would still move you forward?
- Affirmation: Small steps build big things.

**animal-16 · Cat · Independence**
- Keywords: independence, self-trust, choice
- Message: A cat chooses where it goes and whom it trusts, without asking permission. You are allowed to follow your own way. Today, make one choice that is fully yours.
- Reflect: Where are you seeking approval you don't actually need?
- Affirmation: I can choose for myself.

**animal-17 · Elephant · Remember**
- Keywords: memory, roots, wisdom
- Message: Elephants remember paths, water, and friends for many years. Your past holds strength as well as lessons. Remember a time you got through something hard, and let it steady you today.
- Reflect: What past version of you would be proud of where you are?
- Affirmation: I carry my strength with me.

**animal-18 · Magpie · Notice What Shines**
- Keywords: curiosity, attention, delight
- Message: The magpie notices the glint that everyone else walks past. Something bright is in your day if you look for it, maybe an idea, a kindness, or a chance. Stay curious and collect the good things you notice.
- Reflect: What caught your eye recently that deserves a closer look?
- Affirmation: I notice the good around me.

**animal-19 · Swan · Grace**
- Keywords: grace, poise, calm effort
- Message: A swan looks calm on the water while it paddles steadily underneath. You can move through today with grace even while you are working hard. Be gentle with yourself about the effort no one sees.
- Reflect: How could you bring a little more ease to how you move through today?
- Affirmation: I move through my day with grace.

**animal-20 · Meerkat · Teamwork**
- Keywords: cooperation, care, shared watch
- Message: Meerkats take turns keeping watch so the group can rest and forage safely. Your people are part of your strength, and you are part of theirs. Look for a way to give or receive support today.
- Reflect: Who is on your team, and how can you show up for them?
- Affirmation: We are stronger together.

**animal-21 · Penguin · Loyalty**
- Keywords: loyalty, commitment, devotion
- Message: Penguins return to their partners and huddle together through the coldest winters. Loyalty is shown in steady, ordinary acts. Today, honor a commitment to someone you love, or to yourself.
- Reflect: What promise to yourself deserves to be kept today?
- Affirmation: I show up for what I love.

**animal-22 · Capybara · Calm**
- Keywords: calm, ease, acceptance
- Message: The capybara sits calmly while the world goes on around it, and others gather near because of it. You do not have to react to everything. Choose calm today, and let it spread to the people around you.
- Reflect: What could you let wash past you instead of reacting?
- Affirmation: I can stay calm and centered.

**animal-23 · Fox · Adapt**
- Keywords: adaptability, cleverness, resourcefulness
- Message: The fox thrives in forests and cities alike by adjusting to what it finds. If today does not go to plan, that is a chance to be resourceful. Bend instead of breaking, and look for a clever way through.
- Reflect: Where could flexibility serve you better than sticking to the plan?
- Affirmation: I can adapt and find my way.

**animal-24 · Deer · Sensitivity**
- Keywords: sensitivity, gentleness, awareness
- Message: The deer notices the smallest change in the forest around it. Your sensitivity is a gift that helps you read people and situations well. Honor what you feel today, and be gentle with yourself if things feel like a lot.
- Reflect: What are your feelings trying to tell you right now?
- Affirmation: My sensitivity is a strength.

**animal-25 · Horse · Freedom**
- Keywords: freedom, movement, vitality
- Message: A horse running in an open field is the picture of freedom. Some part of you wants more room to move. Find a little freedom today, maybe in a walk, a new route, or a choice that is truly yours.
- Reflect: Where do you feel held back, and what would one free step look like?
- Affirmation: I give myself room to run.

**animal-26 · Hedgehog · Protect Your Energy**
- Keywords: protection, self-care, energy
- Message: When the hedgehog needs to, it curls up and lets its spines keep it safe. It is okay to protect your energy from people or tasks that drain you. Today, guard your peace without guilt.
- Reflect: What drains you most, and how could you shield yourself from it today?
- Affirmation: I protect my energy with love.

**animal-27 · Flying Squirrel · Leap of Faith**
- Keywords: trust, risk, possibility
- Message: The flying squirrel leaps into the open air and trusts itself to glide. You may not see the landing yet, but you are more ready than you feel. Take the leap you have been circling.
- Reflect: What leap keeps calling to you?
- Affirmation: I trust myself to glide.

**animal-28 · Frog · Transformation**
- Keywords: change, growth, new stage
- Message: Every frog was once a tadpole that could not imagine having legs. You are in the middle of becoming something new. Be patient with the in-between today; it is part of the change.
- Reflect: How have you already changed in the past year?
- Affirmation: I am becoming who I am meant to be.

**animal-29 · Dove · Peace**
- Keywords: peace, forgiveness, harmony
- Message: The dove has long carried a message of peace. Today asks you to soften toward someone, or toward yourself. Choose understanding over being right.
- Reflect: Where could a little peace make the biggest difference today?
- Affirmation: I choose peace.

**animal-30 · Bowerbird · Create**
- Keywords: creativity, beauty, expression
- Message: The bowerbird gathers colorful treasures and arranges them into something beautiful. Your creativity wants an outlet today. Make something, however small, simply because it pleases you.
- Reflect: What would you create if no one ever had to see it?
- Affirmation: I am a creative being.

**animal-31 · Koala · Nourish**
- Keywords: nourishment, comfort, care
- Message: The koala spends its days eating, resting, and holding on to what supports it. Look after your basic needs today: food, water, sleep, and comfort. You cannot pour from an empty cup.
- Reflect: What does your body need from you today?
- Affirmation: I nourish myself with care.

**animal-32 · Golden Retriever · Gratitude**
- Keywords: gratitude, warmth, joy
- Message: A golden retriever greets each day, and each person, as a gift. Gratitude turns what you already have into enough. Notice three good things today, and thank someone out loud.
- Reflect: What are you grateful for that you usually take for granted?
- Affirmation: My life is full of good things.

**animal-33 · Seahorse · Trust the Timing**
- Keywords: timing, patience, flow
- Message: The seahorse holds onto seagrass and lets the currents bring what it needs. Not everything can be forced into happening today. Hold steady and trust that what is meant for you is on its way.
- Reflect: What are you trying to force that might come more easily with time?
- Affirmation: Things arrive at the right time.

**animal-34 · Goat · Climb Steadily**
- Keywords: ambition, footing, perseverance
- Message: Mountain goats climb steep cliffs by testing each foothold before they take it. Your goal may be high, but you only need the next good step. Climb steadily today and trust your footing.
- Reflect: What is your next sure foothold toward your goal?
- Affirmation: I rise one steady step at a time.

**animal-35 · Red Panda · Celebrate**
- Keywords: celebration, delight, self-appreciation
- Message: The red panda seems made of pure delight. You have done more than you give yourself credit for. Celebrate something today, even a small win, before you rush on to the next thing.
- Reflect: What have you accomplished lately that you haven't celebrated?
- Affirmation: I celebrate how far I have come.

**animal-36 · Whale · Release Control**
- Keywords: surrender, depth, trust
- Message: The whale moves through vast oceans it could never control, and it is at home there. Some things today are simply out of your hands. Let them be, and put your energy where it can make a difference.
- Reflect: What would you feel if you stopped trying to control this?
- Affirmation: I let go of what I cannot control.
