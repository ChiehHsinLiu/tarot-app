// Share-link encoding: #/r/v1/<spread-id>/<card-id>[r].<card-id>[r]...[?q=<question>]
// No React imports, so Node scripts can decode links too.
import type { SpreadData } from './deck.ts'
import type { DrawnCard, Reading } from './draw.ts'
import { QUESTION_MAX_CHARS, countChars } from './question.ts'

const PREFIX = '#/r/'
const VERSION = 'v1'
const CARD_TOKEN = /^([a-z]+-\d{2})(r?)$/

export type DecodeResult =
  | { kind: 'none' }
  | { kind: 'reading'; reading: Reading }
  | { kind: 'invalid' }

export function encodeReading(reading: Reading, opts: { includeQuestion: boolean }): string {
  const cards = reading.cards.map((c) => c.cardId + (c.reversed ? 'r' : '')).join('.')
  const query = opts.includeQuestion && reading.question ? `?q=${encodeURIComponent(reading.question)}` : ''
  return `${PREFIX}${VERSION}/${reading.spreadId}/${cards}${query}`
}

export function shareUrl(fragment: string, location: { origin: string; pathname: string }): string {
  return location.origin + location.pathname + fragment
}

export function decodeReading(fragment: string, spreads: SpreadData[], cardIds: Set<string>): DecodeResult {
  if (!fragment.startsWith(PREFIX)) return { kind: 'none' }
  const invalid: DecodeResult = { kind: 'invalid' }

  const queryStart = fragment.indexOf('?')
  const path = fragment.slice(PREFIX.length, queryStart === -1 ? undefined : queryStart)
  const query = queryStart === -1 ? '' : fragment.slice(queryStart + 1)

  const parts = path.split('/')
  if (parts.length !== 3) return invalid
  const [version, spreadId, cardList] = parts
  if (version !== VERSION) return invalid

  const spread = spreads.find((s) => s.id === spreadId)
  if (!spread) return invalid

  const tokens = cardList.split('.')
  if (tokens.length !== spread.positions.length) return invalid

  const seen = new Set<string>()
  const cards: DrawnCard[] = []
  for (const [i, token] of tokens.entries()) {
    const match = CARD_TOKEN.exec(token)
    if (!match) return invalid
    const [, cardId, reversed] = match
    if (!cardIds.has(cardId) || seen.has(cardId)) return invalid
    seen.add(cardId)
    cards.push({ cardId, positionId: spread.positions[i].id, reversed: reversed === 'r' })
  }

  const question = new URLSearchParams(query).get('q') ?? ''
  if (countChars(question) > QUESTION_MAX_CHARS) return invalid

  return { kind: 'reading', reading: { spreadId, question, cards } }
}
