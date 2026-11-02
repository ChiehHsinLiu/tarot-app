// The Ace to Ten of each suit: a dachshund scene holding exactly as many of
// the suit's symbols as the card's number. Keyed by card id.
import { cloud, dog, ground, heart, moon, star, symbol } from './shapes.ts'
import type { Suit } from './shapes.ts'

// The smallest each suit's symbol may be drawn on a number card, so it is at
// least 9px wide on a phone and can be counted (e2e/dachshund-art.spec.ts).
// Cups and swords are narrow shapes, so they need the most room.
const MIN_SIZE: Record<Suit, number> = { wands: 15, cups: 17, swords: 19, pentacles: 12 }
const sym = (suit: Suit, x: number, y: number, size = 16, a = 0) => symbol(suit, x, y, Math.max(size, MIN_SIZE[suit]), a)

// A wand standing upright (the symbol is drawn on a slant).
const wand = (x: number, y: number, size = 18) => sym('wands', x, y, size, -27)

export const NUMBERS: Record<string, string> = {
  // Three of Cups: three dachshunds up on their hind legs, raising their cups together.
  'cups-03':
    `<path class="art-leaf art-line" d="M2 98V88Q50 85 98 88V98Z"/>` +
    sym('cups', 30, 24, 18, -20) + sym('cups', 50, 18, 18) + sym('cups', 70, 24, 18, 20) +
    dog({ x: 26, y: 88, size: 0.56, pose: 'beg' }) +
    dog({ x: 50, y: 88, size: 0.56, pose: 'beg' }) +
    dog({ x: 74, y: 88, size: 0.56, pose: 'beg', facing: -1 }) +
    `<circle class="art-rose" cx="16" cy="40" r="2.2"/><circle class="art-sun" cx="84" cy="42" r="2.2"/><circle class="art-plum" cx="50" cy="36" r="2.2"/>`,
  // Ace of Wands: a big budding wand held out of a cloud, the dachshund
  // looking up in wonder.
  'wands-01':
    cloud('art-sky', 76, 20) + sym('wands', 62, 40, 40, -10) + ground(86, 'art-sun') +
    `<path class="art-line" d="M82 52l2-4M88 58l4-2M78 60l1 4"/>` +
    dog({ x: 22, y: 86, size: 0.7, pose: 'sit' }),

  // Two of Wands: planning the next adventure between two wands, a globe at
  // its paws.
  'wands-02':
    `<circle class="art-sun art-line" cx="50" cy="14" r="6"/>` + ground(84, 'art-sun') +
    wand(14, 60, 34) + wand(86, 60, 34) +
    dog({ x: 36, y: 84, size: 0.62, pose: 'sit' }) +
    `<circle class="art-water art-line" cx="66" cy="76" r="8"/><path class="art-leaf" d="M62 72q4-2 6 2q-2 4-6 2Z"/>`,

  // Three of Wands: on a hilltop watching little boats sail out, three wands
  // planted beside it.
  'wands-03':
    `<path class="art-water art-line" d="M2 54H98V98H2Z"/><path class="art-light art-line" d="M66 50h10l-2 4h-6ZM71 50V42l5 6Z"/><path class="art-light art-line" d="M84 60h8l-1.5 3h-5ZM88 60V54l4 5Z"/>` +
    `<path class="art-sun art-line" d="M2 98V74Q30 64 58 80L62 98Z"/>` +
    wand(8, 58, 22) + wand(16, 56, 22) + wand(24, 60, 22) +
    dog({ x: 40, y: 78, size: 0.5 }),

  // Four of Wands: a party under a garland strung between four wands, the
  // dachshund dancing on its hind legs.
  'wands-04':
    wand(14, 52, 26) + wand(34, 52, 26) + wand(66, 52, 26) + wand(86, 52, 26) +
    `<path class="art-leaf art-line" d="M16 38Q50 52 84 38"/>` + [26, 42, 58, 74].map((x, i) => `<circle class="${i % 2 ? 'art-sun' : 'art-rose'}" cx="${x}" cy="${i === 0 || i === 3 ? 44 : 47}" r="2.4"/>`).join('') +
    ground(86) + dog({ x: 54, y: 86, size: 0.56, pose: 'beg' }),

  // Five of Wands: five wands tossed every which way and one dachshund
  // zooming happily through the mess.
  'wands-05':
    sym('wands', 18, 26, 22, 20) + sym('wands', 50, 18, 22, -60) + sym('wands', 82, 28, 22, 70) + sym('wands', 30, 52, 22, -100) + sym('wands', 74, 54, 22, 140) +
    ground(86, 'art-sun') + dog({ x: 28, y: 86, size: 0.62, pose: 'run' }),

  // Six of Wands: the victory lap, a laurel wreath on its head and six wands
  // raised behind.
  'wands-06':
    [12, 26, 40, 60, 74, 88].map((x, i) => wand(x, i === 2 || i === 3 ? 32 : 38, 22)).join('') +
    ground(86, 'art-sun') +
    dog({ x: 30, y: 86, size: 0.68, pose: 'run', wear: `<path class="art-leaf art-line" d="M15 -29Q24 -38 33 -29Q24 -33 15 -29Z"/>` }),

  // Seven of Wands: standing firm on a hilltop with one wand in its mouth,
  // six more poking up from below.
  'wands-07':
    `<path class="art-sun art-line" d="M2 98V66Q30 54 60 66L66 98Z"/>` +
    dog({ x: 20, y: 62, size: 0.6 }) + sym('wands', 48, 46, 20, 30) +
    [64, 74, 84, 93].map((x, i) => wand(x, i % 2 ? 72 : 68, 16)).join('') + wand(70, 87, 16) + wand(88, 87, 16),

  // Eight of Wands: eight wands flying across the sky, the dachshund racing
  // after them.
  'wands-08':
    [[16, 14], [34, 10], [52, 14], [70, 10], [24, 30], [42, 26], [60, 30], [78, 26]].map(([x, y]) => sym('wands', x, y, 18, 63)).join('') +
    ground(86) + dog({ x: 34, y: 86, size: 0.66, pose: 'run' }),

  // Nine of Wands: a little bandaged but not giving up, leaning on one wand,
  // eight more standing guard behind.
  'wands-09':
    [10, 21, 32, 43, 54, 65, 76, 87].map((x) => wand(x, 42, 22)).join('') +
    ground(86, 'art-sun') +
    dog({ x: 26, y: 86, size: 0.66, pose: 'sit', wear: `<path class="art-light art-line" d="M17 -31Q24 -34 31 -28L30 -25Q24 -30 17 -28Z"/>` }) + wand(70, 68, 30),

  // Ten of Wands: carrying a big bundle of ten wands home on its back, the
  // house just ahead.
  'wands-10':
    `<path class="art-light art-line" d="M78 60h16v24h-16Z"/><path class="art-rose art-line" d="M74 61L86 50L98 61Z"/>` +
    ground(86, 'art-sun') +
    [16, 22, 28, 34, 40, 46, 52].map((x) => wand(x, 48, 18)).join('') + [19, 37, 55].map((x) => wand(x, 34, 18)).join('') +
    `<path class="art-rose art-line" d="M14 58H58V62H14Z"/>` +
    dog({ x: 30, y: 86, size: 0.66 }),

  // Ace of Cups: one big cup overflowing like a fountain, the dachshund
  // gazing up at it.
  'cups-01':
    `<path class="art-water art-line" d="M50 22q-12-10-18 4M50 22q12-10 18 4"/>` + sym('cups', 50, 40, 40) +
    `<path class="art-water art-line" d="M2 98V86Q50 82 98 86V98Z"/>` + [24, 50, 76].map((x) => `<circle class="art-water" cx="${x}" cy="68" r="2"/>`).join('') +
    dog({ x: 18, y: 86, size: 0.55, pose: 'sit' }),

  // Two of Cups: two dachshunds trading cups, a little heart between them.
  'cups-02':
    heart('art-rose', 50, 22, 7) + ground(86) +
    sym('cups', 40, 44, 18, 15) + sym('cups', 60, 44, 18, -15) +
    dog({ x: 20, y: 86, size: 0.56, pose: 'sit' }) + dog({ x: 80, y: 86, size: 0.56, pose: 'sit', facing: -1 }),

  // Four of Cups: daydreaming under a tree with three cups in front, not yet
  // noticing the fourth offered from a cloud.
  'cups-04':
    `<path class="art-line" d="M20 30V82"/><circle class="art-leaf art-line" cx="20" cy="24" r="14"/>` +
    cloud('art-sky', 76, 18) + sym('cups', 70, 34, 16) +
    ground(84) + sym('cups', 52, 74, 16) + sym('cups', 68, 74, 16) + sym('cups', 84, 74, 16) +
    dog({ x: 30, y: 84, size: 0.62, pose: 'sleep' }),

  // Five of Cups: looking at three tipped-over cups, not yet seeing the two
  // still standing behind, a bridge home across the river.
  'cups-05':
    `<path class="art-water art-line" d="M2 36Q50 32 98 36V50H2Z"/><path class="art-light art-line" d="M60 36Q72 24 84 36"/>` +
    ground(86) + sym('cups', 70, 62, 15) + sym('cups', 86, 62, 15) +
    sym('cups', 46, 80, 15, -90) + sym('cups', 62, 81, 15, 100) + sym('cups', 78, 80, 15, -80) +
    dog({ x: 20, y: 86, size: 0.52, pose: 'sit' }),

  // Six of Cups: a puppy handing another puppy a cup of flowers, six cups of
  // flowers all around, the happy past.
  'cups-06':
    [14, 32, 50, 68, 86].map((x) => sym('cups', x, 22, 15) + `<circle class="art-rose" cx="${x}" cy="15" r="2.4"/>`).join('') +
    ground(86) + sym('cups', 50, 54, 16) + `<circle class="art-sun" cx="50" cy="47" r="2.4"/>` +
    dog({ x: 22, y: 86, size: 0.48, pose: 'beg' }) + dog({ x: 72, y: 86, size: 0.48, facing: -1 }),

  // Seven of Cups: dreaming, seven cups floating in the clouds above, each
  // holding a different wish.
  'cups-07':
    cloud('art-sky', 50, 30) +
    [[18, 14], [34, 10], [50, 8], [66, 10], [82, 14], [26, 30], [74, 30]].map(([x, y]) => sym('cups', x, y, 15)).join('') +
    star('art-sun', 34, 4, 2) + heart('art-rose', 66, 4, 2.4) +
    ground(84) + dog({ x: 38, y: 82, size: 0.7, pose: 'sleep' }),

  // Eight of Cups: setting off by moonlight, leaving a neat stack of eight
  // cups behind to look for something more.
  'cups-08':
    moon('art-sun', 82, 14, 8) +
    [[10, 74], [24, 74], [38, 74], [52, 74], [17, 60], [31, 60], [45, 60], [31, 46]].map(([x, y]) => sym('cups', x, y, 14)).join('') +
    ground(84, 'art-plum') + dog({ x: 76, y: 82, size: 0.5 }),

  // Nine of Cups: the wish come true, sitting proudly in front of nine cups
  // lined up on a shelf.
  'cups-09':
    `<path class="art-plum art-line" d="M6 44H94V50H6ZM56 70H94V76H56Z"/>` +
    [14, 28, 42, 56, 70, 84].map((x) => sym('cups', x, 36, 13)).join('') + [64, 76, 88].map((x) => sym('cups', x, 62, 13)).join('') +
    ground(90) + dog({ x: 20, y: 88, size: 0.6, pose: 'sit' }),

  // Ten of Cups: a dachshund family under a rainbow made of ten cups.
  'cups-10':
    [[10, 46], [16, 30], [26, 18], [38, 11], [50, 9], [62, 11], [74, 18], [84, 30], [90, 46], [50, 26]].map(([x, y]) => sym('cups', x, y, 13)).join('') +
    ground(86) + `<path class="art-light art-line" d="M70 70h14v14h-14ZM68 71l9-8l9 8Z"/>` +
    dog({ x: 24, y: 86, size: 0.5 }) + dog({ x: 54, y: 86, size: 0.36, pose: 'beg' }),
  // Ace of Swords: one shining sword rising from a cloud through a little
  // crown, the dachshund standing tall below.
  'swords-01':
    cloud('art-sky', 26, 50) + sym('swords', 52, 34, 40) + `<path class="art-sun art-line" d="M44 22l2-6l6 4l6-4l2 6Z"/>` +
    ground(86, 'art-light') + dog({ x: 50, y: 86, size: 0.56 }),

  // Two of Swords: sitting calmly by the sea under the moon, two swords
  // crossed in front, taking time to choose.
  'swords-02':
    moon('art-sun', 78, 16, 7) + `<path class="art-water art-line" d="M2 52H98V74H2Z"/>` + ground(86, 'art-light') +
    sym('swords', 48, 58, 26, -35) + sym('swords', 64, 58, 26, 35) +
    dog({ x: 22, y: 86, size: 0.56, pose: 'sit' }),

  // Three of Swords, gently: a little rain cloud passes over, three swords
  // stand by, and a heart with a plaster on it is already mending.
  'swords-03':
    cloud('art-sky', 50, 14) + `<path class="art-water art-line" d="M42 26l-2 5M50 26l-2 5M58 26l-2 5"/>` +
    sym('swords', 22, 46, 24) + sym('swords', 50, 50, 24) + sym('swords', 78, 46, 24) +
    ground(86, 'art-light') + heart('art-rose', 74, 74, 7) + `<rect class="art-light art-line" x="70" y="70" width="8" height="4" rx="1" transform="rotate(-30 74 72)"/>` +
    dog({ x: 20, y: 86, size: 0.52, pose: 'sit' }),

  // Four of Swords: a peaceful nap on a bench, three swords hung on the wall
  // and one resting underneath.
  'swords-04':
    sym('swords', 30, 26, 20, 90) + sym('swords', 50, 26, 20, 90) + sym('swords', 70, 26, 20, 90) +
    `<rect class="art-plum art-line" x="16" y="62" width="68" height="8" rx="2"/><path class="art-line" d="M22 70V86M78 70V86"/>` +
    sym('swords', 50, 80, 18, 90) + ground(86, 'art-light') +
    dog({ x: 40, y: 62, size: 0.62, pose: 'sleep' }),

  // Five of Swords: game over, the dachshund trots off with three swords and
  // leaves two lying on the grass.
  'swords-05':
    cloud('art-sky', 24, 16) + cloud('art-sky', 76, 24) + ground(86, 'art-light') +
    sym('swords', 14, 80, 18, 80) + sym('swords', 32, 82, 18, 100) +
    dog({ x: 54, y: 86, size: 0.56 }) + sym('swords', 52, 52, 18, -10) + sym('swords', 60, 50, 18) + sym('swords', 68, 52, 18, 10),

  // Six of Swords: drifting across calm water in a little boat, six swords
  // standing up in the bow, smooth sailing ahead.
  'swords-06':
    `<path class="art-water art-line" d="M2 70Q50 64 98 70V98H2Z"/>` +
    [52, 60, 68, 76, 84, 92].map((x) => sym('swords', x - 4, 54, 16)).join('') +
    `<path class="art-plum art-line" d="M14 66H94L84 80H24Z"/>` +
    dog({ x: 28, y: 66, size: 0.5, pose: 'sit' }),

  // Seven of Swords: tiptoeing off with five swords on its back, two still
  // stuck in the ground behind. Sneaky, but cute.
  'swords-07':
    `<path class="art-plum art-line" d="M6 40h20v26H6ZM4 41l12-10l12 10Z"/>` +
    sym('swords', 32, 70, 18) + sym('swords', 42, 72, 18) + ground(86, 'art-light') +
    [-24, -12, 0, 12, 24].map((a, i) => sym('swords', 62 + i * 6, 58, 15, a)).join('') +
    dog({ x: 62, y: 86, size: 0.56 }),

  // Eight of Swords: eyes closed, sitting in a ring of eight swords, with a
  // wide path out that it only has to open its eyes to see.
  'swords-08':
    [12, 24, 36, 48, 64, 76, 88].map((x) => sym('swords', x, 54, 18)).join('') + sym('swords', 30, 76, 16) +
    ground(86, 'art-light') +
    dog({ x: 58, y: 86, size: 0.5, pose: 'sit' }),

  // Nine of Swords: awake in bed at night, nine swords on the wall above,
  // the moon at the window saying it's only a worry.
  'swords-09':
    `<rect class="art-sky art-line" x="74" y="8" width="20" height="20"/>` + moon('art-sun', 84, 18, 6) +
    [10, 22, 34, 46, 58].map((x) => sym('swords', x, 18, 14)).join('') + [16, 28, 40, 52].map((x) => sym('swords', x, 38, 14)).join('') +
    `<rect class="art-rose art-line" x="10" y="64" width="80" height="12" rx="3"/><path class="art-line" d="M14 76V90M86 76V90"/><rect class="art-light art-line" x="12" y="56" width="14" height="8" rx="3"/>` +
    dog({ x: 62, y: 64, size: 0.56, pose: 'sit' }),

  // Ten of Swords, gently: the hard part is over. The dachshund sleeps
  // soundly at dawn while ten swords stand quietly in a row behind.
  'swords-10':
    `<circle class="art-sun art-line" cx="50" cy="26" r="13"/><path class="art-line" d="M50 8V5M32 14l-3-2M68 14l3-2M30 30h-4M70 30h4"/>` +
    [8, 17, 26, 35, 44, 56, 65, 74, 83, 92].map((x) => sym('swords', x, 64, 16)).join('') +
    ground(78, 'art-light') + dog({ x: 40, y: 92, size: 0.66, pose: 'sleep' }),

  // Ace of Pentacles: a big golden pentacle held out of a cloud above a
  // garden gate.
  'pentacles-01':
    cloud('art-sky', 76, 18) + sym('pentacles', 52, 34, 34) +
    `<path class="art-leaf art-line" d="M64 86V62Q76 50 88 62V86H82V64Q76 58 70 64V86Z"/>` + ground(86) +
    dog({ x: 22, y: 86, size: 0.58, pose: 'sit' }),

  // Two of Pentacles: up on its hind legs juggling two pentacles in a loop,
  // little boats bobbing on the waves behind.
  'pentacles-02':
    `<path class="art-water art-line" d="M2 56Q26 48 50 56T98 56V70H2Z"/>` +
    `<path class="art-line" d="M34 40Q40 20 54 22M74 36Q70 18 58 18"/>` +
    sym('pentacles', 32, 38, 18) + sym('pentacles', 72, 30, 18) +
    ground(86) + dog({ x: 54, y: 86, size: 0.58, pose: 'beg' }),

  // Three of Pentacles: building something together, the dachshund on a
  // stool carving three pentacles into a garden arch.
  'pentacles-03':
    `<path class="art-light art-line" d="M14 86V40Q50 6 86 40V86H72V44Q50 22 28 44V86Z"/>` +
    sym('pentacles', 34, 32, 14) + sym('pentacles', 50, 24, 14) + sym('pentacles', 66, 32, 14) +
    ground(86) + `<rect class="art-plum art-line" x="40" y="70" width="22" height="16" rx="2"/>` +
    dog({ x: 52, y: 70, size: 0.46, pose: 'beg' }),

  // Four of Pentacles: holding on tight, one pentacle on its head, one hugged
  // close and two tucked under its paws.
  'pentacles-04':
    ground(86) + `<path class="art-line" d="M86 50V84"/><circle class="art-leaf art-line" cx="86" cy="42" r="10"/>` +
    dog({ x: 38, y: 86, size: 0.7, pose: 'sit' }) +
    sym('pentacles', 52, 34, 16) + sym('pentacles', 66, 56, 16) + sym('pentacles', 20, 84, 14) + sym('pentacles', 60, 84, 14),

  // Five of Pentacles, gently: two dachshunds in scarves crossing the snow
  // toward a warm window glowing with five pentacles.
  'pentacles-05':
    `<path class="art-plum art-line" d="M54 8H96V64H54Z"/><path class="art-sun art-line" d="M60 56V28Q75 12 90 28V56Z"/>` +
    sym('pentacles', 75, 26, 11) + sym('pentacles', 67, 38, 11) + sym('pentacles', 83, 38, 11) + sym('pentacles', 67, 50, 11) + sym('pentacles', 83, 50, 11) +
    ground(80, 'art-light') + [12, 30, 44, 92].map((x, i) => `<circle class="art-light art-line" cx="${x}" cy="${10 + i * 7}" r="1.4"/>`).join('') +
    dog({ x: 10, y: 86, size: 0.42, wear: `<path class="art-rose art-line" d="M14 -16Q22 -12 28 -18L28 -14Q22 -9 14 -12Z"/>` }) +
    dog({ x: 34, y: 92, size: 0.42, wear: `<path class="art-water art-line" d="M14 -16Q22 -12 28 -18L28 -14Q22 -9 14 -12Z"/>` }),

  // Six of Pentacles: sharing, the dachshund drops a pentacle to a puppy from
  // a pile, the scales held level overhead.
  'pentacles-06':
    `<path class="art-line" d="M30 12V22M16 16H44"/><path class="art-sun art-line" d="M12 26H20L16 18ZM40 26H48L44 18Z"/>` +
    sym('pentacles', 58, 18, 14) + sym('pentacles', 74, 22, 14) + sym('pentacles', 90, 18, 14) +
    ground(86) + sym('pentacles', 52, 54, 14) +
    dog({ x: 22, y: 86, size: 0.6, pose: 'sit' }) + dog({ x: 80, y: 86, size: 0.4, pose: 'beg', facing: -1 }) +
    sym('pentacles', 44, 80, 12) + sym('pentacles', 56, 80, 12),

  // Seven of Pentacles: resting on its spade, waiting patiently for a bush of
  // seven pentacles to finish growing.
  'pentacles-07':
    `<path class="art-line" d="M70 86V58"/><circle class="art-leaf art-line" cx="70" cy="44" r="24"/>` +
    [[58, 34], [72, 28], [84, 40], [62, 50], [78, 54], [70, 42], [56, 42]].map(([x, y]) => sym('pentacles', x, y, 11)).join('') +
    ground(86) + `<path class="art-line" d="M40 86V58M36 86h8"/>` +
    dog({ x: 18, y: 86, size: 0.56, pose: 'sit' }),

  // Eight of Pentacles: a happy craftsdog at its bench, six finished
  // pentacles hung on a post, one on the bench and one being worked on.
  'pentacles-08':
    `<path class="art-line" d="M84 20V86"/>` + [22, 34, 46, 58, 70].map((y) => sym('pentacles', 84, y, 11)).join('') + sym('pentacles', 72, 22, 11) +
    `<rect class="art-plum art-line" x="26" y="62" width="40" height="7" rx="2"/><path class="art-line" d="M30 69V86M62 69V86"/>` +
    sym('pentacles', 36, 55, 12) + sym('pentacles', 56, 55, 12) +
    ground(86) + dog({ x: 12, y: 86, size: 0.5, pose: 'beg' }),

  // Nine of Pentacles: relaxing in its own lovely garden, nine pentacles
  // growing on the vines and a little bird on a post.
  'pentacles-09':
    [14, 26, 38, 50, 62, 74, 86].map((x, i) => sym('pentacles', x, i % 2 ? 22 : 16, 12)).join('') + sym('pentacles', 20, 40, 12) + sym('pentacles', 80, 40, 12) +
    `<path class="art-leaf art-line" d="M4 10Q50 34 96 10"/>` +
    ground(86) + `<path class="art-line" d="M84 64V86"/><path class="art-water art-line" d="M80 64q4-6 8 0Z"/><circle class="art-ink" cx="86" cy="61" r="1"/>` +
    dog({ x: 34, y: 86, size: 0.66, pose: 'sit' }),

  // Ten of Pentacles: a dachshund family home under an arch, ten pentacles in
  // a tree pattern above, everything settled and safe.
  'pentacles-10':
    [[50, 10], [36, 20], [64, 20], [50, 28], [36, 38], [64, 38], [50, 46], [36, 56], [64, 56], [50, 64]].map(([x, y]) => sym('pentacles', x, y, 11)).join('') +
    `<path class="art-light art-line" d="M6 86V30H18V86ZM82 86V30H94V86Z"/>` +
    ground(86) + dog({ x: 22, y: 86, size: 0.4 }) + dog({ x: 70, y: 86, size: 0.3, facing: -1 }),
}
