// The 16 court cards: a dachshund Page, Knight, Queen and King for each suit.
// Keyed by card id. Each rank has its own pose and each suit its own setting:
// wands in sunny dunes, cups by the water, swords among windy clouds and
// pentacles in a garden.
import { cloud, dog, ground, star, symbol } from './shapes.ts'
import type { Suit } from './shapes.ts'

const crown = `<path class="art-sun art-line" d="M17 -31L17 -38L21 -34L24 -40L27 -34L31 -38L31 -31Z"/>`
const kingCrown = `<path class="art-sun art-line" d="M15 -31L15 -42L20 -36L24 -45L28 -36L33 -42L33 -31Z"/><circle class="art-rose" cx="24" cy="-34" r="1.8"/>`
const beret = `<path class="art-rose art-line" d="M14 -30Q22 -40 32 -31Q24 -28 14 -30Z"/><circle class="art-rose art-line" cx="23" cy="-37" r="1.6"/>`
const helmet = `<path class="art-light art-line" d="M15 -27Q16 -38 26 -37Q33 -35 32 -27Z"/><path class="art-rose art-line" d="M22 -37Q16 -48 8 -44Q16 -42 20 -36Z"/>`
const cape = `<path class="art-rose art-line" d="M17 -29Q0 -30 -24 -8L-6 -7Q8 -16 19 -22Z"/>`

// The setting behind each suit's cards.
function scene(suit: Suit, open = true) {
  switch (suit) {
    case 'wands':
      return `<circle class="art-sun art-line" cx="86" cy="14" r="7"/>` + 
        `<path class="art-sun art-line" d="M2 98V82Q26 72 52 82T98 78V98Z"/>`
    case 'cups':
      return `<path class="art-water art-line" d="M2 98V86Q50 82 98 86V98Z"/><path class="art-line" d="M10 93q4-3 8 0q4 3 8 0M60 92q4-3 8 0q4 3 8 0"/>`
    case 'swords':
      return cloud('art-sky', 20, 14) + (open ? cloud('art-sky', 80, 24) : '') + `<path class="art-line" d="M54 10q3-3 6 0q3-3 6 0M4 40h12M8 46h10"/>` + ground(88, 'art-light')
    case 'pentacles':
      return (open ? `<path class="art-line" d="M88 48V82"/><circle class="art-leaf art-line" cx="88" cy="40" r="10"/><circle class="art-sun" cx="85" cy="38" r="2"/><circle class="art-sun" cx="91" cy="43" r="2"/>` : '') +
        ground(86) + [10, 46, 60].map((x) => `<circle class="art-rose" cx="${x}" cy="93" r="2.4"/>`).join('')
  }
}

// Page: a young dachshund in a beret, gazing at its suit's symbol.
const page = (suit: Suit) =>
  scene(suit) + dog({ x: 26, y: 87, size: 0.62, wear: beret }) +
  `<path class="art-line" d="M58 40l-3-3M74 40l3-3M66 36v-4"/>` + symbol(suit, 66, 52, 22)

// Knight: charging ahead in a plumed helmet, the symbol held high in front.
const knight = (suit: Suit) =>
  scene(suit) + dog({ x: 28, y: 86, size: 0.72, pose: 'run', wear: helmet }) +
  `<path class="art-line" d="M8 70h10M4 76h12"/>` + symbol(suit, 76, 50, 24, 25)

// Queen: crowned on a rounded throne, her symbol on a pedestal beside her.
const queen = (suit: Suit, mark: string) =>
  scene(suit, false) +
  `<path class="art-light art-line" d="M8 86V42Q8 24 26 24Q44 24 44 42V86Z"/>` + mark +
  dog({ x: 34, y: 87, size: 0.95, pose: 'sit', wear: crown }) +
  `<rect class="art-light art-line" x="74" y="64" width="6" height="23" rx="2"/>` + symbol(suit, 77, 52, 22)

// King: in a red cape and a tall crown on a square throne, holding his symbol up like a sceptre.
const king = (suit: Suit, mark: string) =>
  scene(suit, false) +
  `<rect class="art-plum art-line" x="6" y="22" width="44" height="66" rx="4"/>` + mark +
  dog({ x: 32, y: 87, size: 0.95, pose: 'sit', wear: kingCrown + cape }) +
  `<path class="art-line" d="M80 60V88"/>` + symbol(suit, 80, 46, 26)

// A small decoration on each suit's throne.
const MARK: Record<Suit, string> = {
  wands: `<circle class="art-sun art-line" cx="26" cy="36" r="5"/><circle class="art-ear" cx="26" cy="36" r="2"/>`,
  cups: `<path class="art-plum art-line" d="M14 36Q26 28 38 36Z"/><path class="art-rose art-line" d="M14 46Q26 38 38 46Z"/>`,
  swords: `<path class="art-sky art-line" d="M26 36l-8-6v12ZM26 36l8-6v12Z"/>`,
  pentacles: star('art-sun art-line', 26, 36, 6),
}

export const COURTS: Record<string, string> = {
  'wands-11': page('wands'),
  'wands-12': knight('wands'),
  'wands-13': queen('wands', MARK.wands),
  'wands-14': king('wands', MARK.wands),
  'cups-11': page('cups'),
  'cups-12': knight('cups'),
  // Queen of Cups: seated on a shell throne by the water, crowned, gazing at her cup.
  'cups-13': queen('cups', MARK.cups),
  'cups-14': king('cups', MARK.cups),
  'swords-11': page('swords'),
  'swords-12': knight('swords'),
  'swords-13': queen('swords', MARK.swords),
  'swords-14': king('swords', MARK.swords),
  'pentacles-11': page('pentacles'),
  'pentacles-12': knight('pentacles'),
  'pentacles-13': queen('pentacles', MARK.pentacles),
  'pentacles-14': king('pentacles', MARK.pentacles),
}
