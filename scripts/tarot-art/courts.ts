// The 16 court cards: one pose per rank, so they read as a set, each holding
// its suit's symbol in front of a small scene of the suit's element.
import { face, hand, limb } from './shapes.ts'

const SUITS = ['wands', 'cups', 'swords', 'pentacles']

// Each suit's symbol, centred on 0,0 and about 26 units tall.
const SYMBOL: Record<string, string> = {
  wands: `<rect class="art-deep art-line" x="-2" y="-13" width="4" height="26" rx="2"/><ellipse class="art-fill art-line" cx="5" cy="-8" rx="4.5" ry="2.4" transform="rotate(-30 5 -8)"/><ellipse class="art-fill art-line" cx="-5" cy="-1" rx="4.5" ry="2.4" transform="rotate(30 -5 -1)"/>`,
  cups: `<path class="art-fill art-line" d="M-8 -11 H8 C8 -2 4 2 0 2 C-4 2 -8 -2 -8 -11 Z"/><ellipse class="art-light art-line" cx="0" cy="-11" rx="8" ry="2"/><rect class="art-deep art-line" x="-1.5" y="2" width="3" height="6"/><path class="art-deep art-line" d="M-6 12 C-6 8 6 8 6 12 Z"/>`,
  swords: `<path class="art-light art-line" d="M0 -15 L3 -10 V3 H-3 V-10 Z"/><rect class="art-deep art-line" x="-7" y="3" width="14" height="3" rx="1.5"/><rect class="art-deep art-line" x="-1.5" y="6" width="3" height="5"/><circle class="art-deep art-line" cx="0" cy="12.5" r="2"/>`,
  pentacles: `<circle class="art-fill art-line" r="10"/><polygon class="art-light art-line" points="0,-7 2,-2.4 6.7,-2.2 3.1,1 4.3,5.7 0,3 -4.3,5.7 -3.1,1 -6.7,-2.2 -2,-2.4"/>`,
}
// A small scene of the suit's element behind the figure.
const SCENE: Record<string, string> = {
  wands: `<path class="art-fill" d="M4 96 C20 84 38 86 52 90 C68 84 86 84 96 92 V96 Z"/><path class="art-line" d="M12 90 V82 M12 85 Q8 84 7 80 M12 85 Q16 84 17 80 M88 89 V82 M88 85 Q84 84 83 80"/>`,
  cups: `<path class="art-line" d="M4 90 Q9 86 14 90 T24 90 T34 90 T44 90 T54 90 T64 90 T74 90 T84 90 T94 90 M10 95 Q15 91 20 95 T30 95 T40 95 T50 95 T60 95 T70 95 T80 95 T90 95"/>`,
  swords: `<ellipse class="art-light art-line" cx="15" cy="15" rx="9" ry="4.5"/><ellipse class="art-light art-line" cx="22" cy="12" rx="6" ry="4.5"/><path class="art-line" d="M6 26 H16 M10 31 H22 M82 14 H92 M78 19 H88"/>`,
  pentacles: `<path class="art-fill" d="M4 91 H96 V96 H4 Z"/><path class="art-line" d="M11 91 V84 M89 91 V84"/><circle class="art-light art-line" cx="11" cy="82" r="2.6"/><circle class="art-light art-line" cx="89" cy="82" r="2.6"/>`,
}
const symbol = (suit: string, x: number, y: number, s: number) => `<g transform="translate(${x} ${y}) scale(${s})">${SYMBOL[suit]}</g>`

const RANK: Record<number, (suit: string) => string> = {
  // Page: stands with the symbol held up.
  11: (suit) =>
    `<rect class="art-deep art-line" x="39" y="72" width="7" height="14" rx="3.5"/><rect class="art-deep art-line" x="47" y="72" width="7" height="14" rx="3.5"/>` +
    limb('art-fill', 36, 53, 15, 18) + hand(31.4, 67.3) +
    `<path class="art-fill art-line" d="M33 78 C33 62 37 50 46.5 50 C56 50 60 62 60 78 C60 81 33 81 33 78 Z"/><path class="art-line" d="M35 66 Q46.5 69 58 66"/>` +
    limb('art-fill', 56.5, 53, 17, -145) + hand(66.3, 39) +
    `<circle class="art-light art-line" cx="46.5" cy="38" r="10"/>` +
    `<path class="art-deep art-line" d="M35.5 36 C34 23 59 23 57.5 36 C52 31.5 41 31.5 35.5 36 Z"/><ellipse class="art-fill art-line" cx="58" cy="25" rx="7" ry="2.6" transform="rotate(-35 58 25)"/>` +
    face(46.5, 38) + symbol(suit, 67, 25, 0.8) + hand(66.3, 39),
  // Knight: rides, the symbol held forward.
  12: (suit) =>
    `<path class="art-deep art-line" d="M26 60 C16 60 13 72 16 81 C20 74 24 70 28 69 Z"/>` +
    [29, 37, 53, 61].map((x) => `<rect class="art-light art-line" x="${x}" y="71" width="7" height="15" rx="3.5"/>`).join('') +
    `<ellipse class="art-light art-line" cx="46" cy="65" rx="22" ry="12"/>` +
    `<path class="art-light art-line" d="M57 64 C59 54 63 46 69 42 C73 38 82 39 85 44 C88 49 86 54 81 53 C78 52 75 52 73 55 C71 60 70 64 68 68 Z"/><ellipse class="art-light art-line" cx="73" cy="38" rx="2.4" ry="4" transform="rotate(-15 73 38)"/>` +
    `<path class="art-deep art-line" d="M66 44 C62 49 60 55 58 61 L62.5 63 C64 57 66 51 70 46 Z"/><circle class="art-ink" cx="78" cy="45" r="1.5"/>` +
    `<path class="art-fill art-line" d="M38 62 C38 49 42 42 48 42 C54 42 58 49 58 62 Z"/><rect class="art-deep art-line" x="44.5" y="58" width="7" height="15" rx="3.5"/>` +
    limb('art-fill', 55.5, 46, 16, -130) + hand(67.8, 35.7) +
    `<circle class="art-light art-line" cx="48" cy="32" r="9"/><path class="art-deep art-line" d="M39 31 C38 19 58 19 57 31 C52 27.5 44 27.5 39 31 Z"/><ellipse class="art-fill art-line" cx="50" cy="17" rx="2.6" ry="6" transform="rotate(25 50 17)"/>` +
    face(48, 32) + symbol(suit, 72, 23, 0.7) + hand(67.8, 35.7),
  // Queen: sits on a rounded throne, long hair, the symbol held at her side.
  13: (suit) =>
    `<path class="art-fill art-line" d="M28 88 V36 C28 13 72 13 72 36 V88 Z"/><rect class="art-deep art-line" x="24" y="66" width="52" height="8" rx="4"/>` +
    `<path class="art-deep art-line" d="M38.5 40 C36 23 64 23 61.5 40 C63 47 63 54 61 59 C55 56 45 56 39 59 C37 54 37 47 38.5 40 Z"/>` +
    `<path class="art-light art-line" d="M34 90 C34 72 38 54 44 50 C47 48 53 48 56 50 C62 54 66 72 66 90 Z"/><path class="art-deep art-line" d="M37.5 66 Q50 70 62.5 66 L63 70.5 Q50 74.5 37 70.5 Z"/>` +
    limb('art-light', 57, 51, 14, -40) + hand(66, 61.7) +
    `<circle class="art-light art-line" cx="50" cy="38" r="10"/><path class="art-light art-line" d="M42 29.5 L43.5 22 L47 26.5 L50 20 L53 26.5 L56.5 22 L58 29.5 Q50 31.5 42 29.5 Z"/>` +
    face(50, 38) + symbol(suit, 67, 49, 0.75) + hand(66, 61.7),
  // King: sits on a square throne, crowned and bearded, the symbol raised.
  14: (suit) =>
    `<rect class="art-fill art-line" x="27" y="22" width="46" height="66" rx="9"/><circle class="art-fill art-line" cx="28" cy="22" r="4"/><circle class="art-fill art-line" cx="72" cy="22" r="4"/><rect class="art-deep art-line" x="23" y="66" width="54" height="8" rx="4"/>` +
    `<path class="art-deep art-line" d="M33 90 C33 72 37 54 44 50 C47 48 53 48 56 50 C63 54 67 72 67 90 Z"/><path class="art-light art-line" d="M44 52 C47 55 53 55 56 52 L57 90 H43 Z"/>` +
    limb('art-deep', 58, 53, 15, -150) + hand(65.5, 40) +
    `<circle class="art-light art-line" cx="50" cy="37" r="10"/><path class="art-fill art-line" d="M40.5 39 C40.5 53 59.5 53 59.5 39 C55 44 45 44 40.5 39 Z"/>` +
    `<path class="art-fill art-line" d="M40 30 L40 18 L45 24 L50 15 L55 24 L60 18 L60 30 Q50 32.5 40 30 Z"/>` +
    face(50, 34) + symbol(suit, 68, 27, 0.75) + hand(65.5, 40),
}

// Each court card's shapes, by card id, such as cups-13 for the Queen of Cups.
export const COURTS: Record<string, string> = Object.fromEntries(
  SUITS.flatMap((suit) => [11, 12, 13, 14].map((rank) => [`${suit}-${rank}`, SCENE[suit] + RANK[rank](suit)])),
)
