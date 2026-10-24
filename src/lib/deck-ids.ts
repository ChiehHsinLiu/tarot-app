// Card ids and spread shapes with no text, so the app shell can decode share
// links without pulling the card meanings into the first download.
import cardData from '../../data/cards.json' with { type: 'json' }
import spreadData from '../../data/spreads.json' with { type: 'json' }
import type { CardData, SpreadData } from './deck.ts'

export const rawCards = cardData as CardData[]
export const rawSpreads = spreadData as SpreadData[]
