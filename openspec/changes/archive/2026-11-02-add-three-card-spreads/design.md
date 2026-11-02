# Design

## Context

Spreads are already data: `data/spreads.json` holds each spread's id, question rule, verdict flag and position ids, and `data/i18n/en/spreads.json` holds its name and position labels. The spread choice, the card-count line, the draw, share-link encoding and decoding, the Copy for Claude prompt and the dev Ask Claude endpoint all loop over that data. The mat layout picks `.spread-N` by card count, and `.spread-3` already works on a wide screen and stacked on a phone. So two more 3-card spreads need no new layout.

Three places don't follow the data automatically:

- `buildLenormandSpreads` maps **every** tarot spread and looks up `data[spread.id]` in the Lenormand spread data, so a tarot spread with no Lenormand positions would crash the dev build.
- The question box hint is chosen only by `required` ("Ask a yes or no question" or "What would you like to know?"). Choice is required but isn't a yes/no question.
- `prompts/reading.md` has no slot for spread-specific guidance (the Lenormand template does, as `GUIDANCE` in `lenormand.ts`).

## Goals / Non-Goals

**Goals:**
- Add the spreads by adding data. Code changes only where the three points above need them.
- Keep the Yes / No and Three cards prompts byte-for-byte the same, proven by the existing snapshot.

**Non-Goals:**
- A description line per spread in the picker. The name plus "3 cards" is enough for four options.
- Changing the reading view, mats or flip.

## Decisions

### 1. Spread ids and labels

| id | name | positions (id: label) | question |
|---|---|---|---|
| `situation-action-outcome` | Situation, Action, Outcome | `situation`: Situation, `action`: Action, `outcome`: Outcome | optional |
| `choice` | Choice | `option-a`: Option A, `option-b`: Option B, `advice`: Advice | required |

The ids are spelled out rather than shortened (`sao`) so share links stay readable. They're appended after `yes-no` and `three-card`, so the picker order follows the file. `showsVerdict` is false for both.

### 2. Per-spread text lives in the i18n spread text, as optional fields

`SpreadText` gains two optional fields:

- `questionHint`: Choice sets "Name your two options, e.g. Stay or move?".
- `guide`: the prompt line. Both new spreads set it, and Yes / No and Three cards don't.

`buildSpreads` copies both onto `Spread`. `QuestionBox` takes a `placeholder` prop. `Composer` passes `spread.questionHint`, falling back to today's two hints, so the existing spreads look the same.

*Alternative:* hard-code the hint and guide in components or `prompt.ts`, keyed by id, as Lenormand does with `GUIDANCE`. That was rejected because all other tarot spread wording is already in the i18n data, and keeping it there keeps the code free of spread ids.

### 3. Prompt slot `{{guidance}}`

`prompts/reading.md` gets a `{{guidance}}` line directly after `Spread: {{spread}}`. The builder already drops an empty value together with the blank lines after it, so a spread without a `guide` produces exactly today's text. `{{guidance}}` joins the required placeholders so a template edit can't lose it silently.

The guides as written:

- **Situation, Action, Outcome:** "Read the Situation card as where the querent stands now, the Action card as the approach the cards advise, and the Outcome card as where that approach is likely to lead."
- **Choice:** "The querent is choosing between two options, named in their question if they gave names. Read Option A and Option B as how each path is likely to unfold, and compare them fairly. Then let the Advice card suggest which way to lean, without making the decision for them."

The dev Ask Claude endpoint builds its prompt with the same builder and the same `spreads`, so it gets the guide with no extra work.

### 4. Lenormand builds only the spreads it defines

`buildLenormandSpreads` filters the tarot spreads to those with an entry in `data/lenormand/spreads.json` before mapping. When the deck changes, `Composer` keeps `spreadId` only if the new deck's spreads include it, and otherwise sets it to `null`. The same rule would cover any future deck with fewer spreads.

*Alternative:* give Lenormand positions for the new spreads too. That was rejected because the owner chose tarot only.

### 5. Share links need no format change

`decodeReading` already looks a spread up by id and checks the card count against its positions. New ids just become valid. The unit tests add a round trip for each new spread and confirm that a Three cards link from before the change still decodes.

## Risks / Trade-offs

- [The long name "Situation, Action, Outcome" wraps on a 320 px phone in the picker or the reading heading] → check at 320 px in light and dark during apply. If it looks wrong, shorten only the visible name (for example "Situation · Action · Outcome" or "What to do"); the id and labels stay the same.
- [The composer screenshot changes (four options instead of two), so `npm run e2e:same -- main` reports a diff there] → this is expected. Check that the other screens still match.
- [Someone reading a Choice spread without naming options] → the question is required and the hint asks for both options. The guide also tells Claude to work with or without names.

## Migration Plan

Static site: the usual push to `main` runs CI and deploys. Rolling back means reverting the commit. Old share links never depended on the new ids, so a rollback only breaks links made for the two new spreads, and those then show the existing "This reading link isn't valid." notice.

## As built

- **A third optional text field, `missingQuestion`.** The note under Draw was hard-coded as "A yes / no reading needs a question.", which is wrong for Choice. Choice sets "A choice reading needs a question naming your two options." Spreads without it keep the old note. The hint and note are chosen by `questionPlaceholder` and `missingQuestionNote` in `src/lib/question.ts`, which are unit-tested.
- **Entry chunk +0.46 kB** (239.39 → 239.85 kB, 73.68 → 73.85 gz), not "unchanged" as task 4.2 expected. The added bytes are the two new spread shapes (ids and positions), which the shell needs to decode share links, plus the two small hint functions. All new wording (names, labels, hints, guides) is in the TarotScreens chunk only.
- **Layout:** at 320 px the picker name fits on one line, and the preview mat's "SITUATION" label fits its column (an overflow check over all 16 screenshots found nothing). The reading heading wraps after "Situation, Action," and still reads well, so the shorter-name fallback wasn't used.
- **`npm run e2e:same -- main`:** 16/20 identical. The 4 differences are the tarot composer in each scheme and width, where only the height changed because of the two extra options.
- Mutation: renaming "Option A" in the data makes `e2e/spreads.spec.ts` fail.
