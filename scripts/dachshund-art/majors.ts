// The 22 major arcana, starring dachshunds: each card's traditional symbols in
// a composition of its own. Keyed by card id.
import { cloud, dog, ground, heart, infinity, moon, star, symbol } from './shapes.ts'

export const MAJORS: Record<string, string> = {
  // The Fool: a puppy trotting happily toward the cliff edge, bundle on a stick
  // in its mouth, the sun behind and a flower left behind.
  'major-00':
    `<circle class="art-sun art-line" cx="17" cy="17" r="7"/><path class="art-line" d="M17 4V7M17 27V30M4 17H7M27 17H30M8 8L10 10M24 24L26 26M26 8L24 10M8 26L10 24"/>` +
    `<path class="art-sky art-line" d="M58 22q2-6 8-5q3-5 9-2q6-1 7 5q4 3 0 6H59q-4-1-1-4Z"/>` +
    `<path class="art-leaf art-line" d="M2 98V82Q36 77 72 80L78 98Z"/><path class="art-line" d="M78 98L84 88"/>` +
    `<path class="art-line" d="M10 81V72"/><circle class="art-rose" cx="10" cy="70" r="3.4"/><circle class="art-light art-line" cx="10" cy="70" r="1.4"/>` +
    dog({ x: 34, y: 80, size: 0.85, pose: 'run', wear: `<path class="art-line" d="M38 -19L50 -42"/><circle class="art-rose art-line" cx="52" cy="-46" r="7"/><path class="art-line" d="M49 -51l3 -4 3 4"/>` }) +
    `<path class="art-line" d="M86 52q3-4 6 0M80 60q2-3 4 0"/>`,
  // The Magician: up on his hind legs with a wand in his mouth, the infinity
  // sign overhead and the four suits laid out on his table.
  'major-01':
    infinity(30, 22) +
    `<path class="art-rose art-line" d="M8 92q4-8 8 0M84 92q4-8 8 0"/>` + ground(90) +
    dog({ x: 34, y: 89, size: 0.8, pose: 'beg', wear: `<rect class="art-light art-line" x="39" y="-23" width="17" height="4.5" rx="2.2"/><circle class="art-sun" cx="57" cy="-20.7" r="2.5"/>` }) +
    `<rect class="art-plum art-line" x="54" y="66" width="42" height="7" rx="3"/><path class="art-line" d="M60 73V89M90 73V89"/>` +
    symbol('cups', 60, 59, 11) + symbol('wands', 70, 59, 11) + symbol('swords', 80, 59, 11) + symbol('pentacles', 90, 59, 11),

  // The High Priestess: sitting calmly between a dark and a light pillar, a
  // moon crown on her head and a crescent moon at her feet.
  'major-02':
    `<rect class="art-sky art-line" x="16" y="18" width="68" height="70"/>` +
    [[26, 30], [74, 30], [50, 24], [30, 50], [70, 50]].map(([x, y]) => `<circle class="art-rose" cx="${x}" cy="${y}" r="3"/>`).join('') +
    `<rect class="art-ink art-line" x="5" y="14" width="11" height="76" rx="2"/><rect class="art-light art-line" x="84" y="14" width="11" height="76" rx="2"/>` +
    ground(90, 'art-plum') +
    dog({ x: 38, y: 88, size: 0.78, pose: 'sit', wear: moon('art-sun', 23, -39, 6.5) }) +
    moon('art-sun', 72, 82, 6),

  // The Empress: resting on a big cushion in a wheat field, a crown of stars
  // above and a heart shield beside her.
  'major-03':
    [22, 36, 50, 64, 78].map((x, i) => star('art-sun art-line', x, i % 2 ? 14 : 10, 4.5)).join('') +
    `<path class="art-leaf art-line" d="M2 70Q20 60 40 68Q60 58 98 66V98H2Z"/>` +
    [12, 20, 82, 90].map((x) => `<path class="art-line" d="M${x} 92V76"/><ellipse class="art-sun art-line" cx="${x}" cy="74" rx="2.2" ry="4.5"/>`).join('') +
    `<ellipse class="art-rose art-line" cx="46" cy="84" rx="30" ry="8"/>` +
    dog({ x: 36, y: 82, size: 0.7, pose: 'sit' }) +
    heart('art-rose', 80, 56, 8),

  // The Emperor: on his stone throne with ram's horns, a crown and an orb,
  // red mountains behind.
  'major-04':
    `<path class="art-rose art-line" d="M2 60L22 30L40 56L60 24L84 58L98 44V90H2Z"/>` +
    `<rect class="art-light art-line" x="16" y="38" width="40" height="52" rx="3"/>` +
    `<path class="art-line" d="M16 42q-8 0-6 8q4 2 6-2M56 42q8 0 6 8q-4 2-6-2"/>` +
    ground(90, 'art-plum') +
    dog({ x: 30, y: 88, size: 0.85, pose: 'sit', wear: `<path class="art-sun art-line" d="M17 -31V-38L21 -34L24 -40L27 -34L31 -38V-31Z"/>` }) +
    `<circle class="art-sun art-line" cx="82" cy="72" r="6"/><path class="art-line" d="M82 66V60M79 62H85"/>`,

  // The Hierophant: a tall triple crown, two small dachshunds listening at his
  // feet, and crossed keys.
  'major-05':
    `<rect class="art-light art-line" x="6" y="16" width="10" height="74" rx="2"/><rect class="art-light art-line" x="84" y="16" width="10" height="74" rx="2"/>` +
    ground(90, 'art-plum') +
    dog({ x: 24, y: 72, size: 0.7, pose: 'sit', wear: `<path class="art-sun art-line" d="M18 -31Q24 -56 30 -31Z"/><path class="art-line" d="M19.5 -37H28.5M21 -43H27M22.5 -49H25.5"/>` }) +
    `<rect class="art-plum art-line" x="10" y="72" width="36" height="18" rx="3"/>` +
    dog({ x: 74, y: 90, size: 0.42, pose: 'sit', facing: -1 }) + dog({ x: 60, y: 90, size: 0.42, pose: 'sit', facing: -1 }) +
    `<path class="art-sun art-line" d="M24 80L36 86M36 80L24 86"/><circle class="art-sun art-line" cx="23" cy="79" r="2.4"/><circle class="art-sun art-line" cx="37" cy="79" r="2.4"/>`,

  // The Lovers: two dachshunds nose to nose under a heart and a bright sun,
  // an apple tree and a flowering tree behind.
  'major-06':
    `<circle class="art-sun art-line" cx="50" cy="14" r="7"/><path class="art-line" d="M50 2V4M38 14H40M60 14H62M42 6L43.5 7.5M58 6L56.5 7.5"/>` +
    `<circle class="art-leaf art-line" cx="12" cy="40" r="10"/><path class="art-line" d="M12 50V82"/><circle class="art-rose" cx="9" cy="38" r="2"/><circle class="art-rose" cx="15" cy="43" r="2"/>` +
    `<circle class="art-leaf art-line" cx="88" cy="40" r="10"/><path class="art-line" d="M88 50V82"/><circle class="art-sun" cx="85" cy="37" r="2"/><circle class="art-sun" cx="91" cy="42" r="2"/>` +
    ground(86) +
    heart('art-rose', 50, 40, 9) +
    dog({ x: 26.5, y: 84, size: 0.64 }) + dog({ x: 73.5, y: 84, size: 0.64, facing: -1 }),

  // The Chariot: riding proudly in a star-canopied wagon, pulled by nothing
  // but willpower.
  'major-07':
    `<path class="art-sky art-line" d="M22 26H86L80 18H28Z"/>` + star('art-sun', 40, 22, 2.6) + star('art-sun', 54, 22, 2.6) + star('art-sun', 68, 22, 2.6) +
    `<path class="art-line" d="M26 26V52M82 26V52"/>` +
    ground(90, 'art-plum') +
    dog({ x: 38, y: 66, size: 0.8, pose: 'sit', wear: `<path class="art-sun art-line" d="M18 -31V-37L24 -40L30 -37V-31Z"/>` }) +
    `<rect class="art-rose art-line" x="20" y="52" width="68" height="22" rx="4"/>` + star('art-sun art-line', 54, 63, 6) +
    `<circle class="art-light art-line" cx="32" cy="78" r="9"/><circle class="art-light art-line" cx="76" cy="78" r="9"/><path class="art-line" d="M26 72L38 84M38 72L26 84M70 72L82 84M82 72L70 84"/>`,

  // Strength: a small dachshund gently booping a big lion's nose, the
  // infinity sign above and flowers all around.
  'major-08':
    infinity(33, 18) + ground(88) +
    `<ellipse class="art-sun art-line" cx="81" cy="74" rx="17" ry="11"/><path class="art-line" d="M97 70q4-8 0-12"/><rect class="art-sun art-line" x="67" y="76" width="7" height="12" rx="3.5"/><rect class="art-sun art-line" x="87" y="76" width="7" height="12" rx="3.5"/>` +
    `<circle class="art-ear art-line" cx="63" cy="57" r="15"/><circle class="art-sun art-line" cx="62" cy="58" r="10"/>` +
    `<circle class="art-ink" cx="58" cy="55" r="1.7"/><circle class="art-ink" cx="66" cy="55" r="1.7"/><path class="art-ink" d="M60 60h4l-2 2.4Z"/><path class="art-line" d="M59 64q3 2 6 0"/>` +
    dog({ x: 28, y: 88, size: 0.75, pose: 'sit' }) +
    [10, 44, 54].map((x) => `<circle class="art-rose" cx="${x}" cy="93" r="2.6"/>`).join(''),

  // The Hermit: alone on a snowy peak at night, holding up a lantern with a
  // star inside.
  'major-09':
    `<rect class="art-plum art-line" x="2" y="2" width="96" height="96"/>` +
    star('art-sun', 14, 16, 2.4) + star('art-sun', 30, 10, 1.8) + star('art-sun', 84, 22, 2) + moon('art-sun', 86, 10, 4) +
    `<path class="art-light art-line" d="M2 98L48 46L98 98Z"/><path class="art-sky art-line" d="M38 58L48 46L58 58L53 55L48 60L43 55Z"/>` +
    dog({ x: 64, y: 62, size: 0.75, facing: -1, pose: 'stand', wear: `<path class="art-line" d="M38 -19V-29"/><rect class="art-sun art-line" x="31" y="-41" width="14" height="12" rx="3"/>` + star('art-light', 38, -35, 3.5) }),

  // Wheel of Fortune: running happily inside a big turning wheel, clouds in
  // the corners.
  'major-10':
    cloud('art-sky', 14, 12) + cloud('art-sky', 86, 12) + cloud('art-sky', 14, 88) + cloud('art-sky', 86, 88) +
    `<circle class="art-sun art-line" cx="50" cy="50" r="36"/><circle class="art-light art-line" cx="50" cy="50" r="29"/>` +
    `<path class="art-line" d="M50 21V79M21 50H79M29.5 29.5L70.5 70.5M70.5 29.5L29.5 70.5"/><circle class="art-rose art-line" cx="50" cy="50" r="5"/>` +
    dog({ x: 42, y: 78, size: 0.5, pose: 'run' }),
  // Justice: sitting upright between red curtains with balanced scales and an
  // upright sword.
  'major-11':
    `<path class="art-rose art-line" d="M2 4H24V90H2ZM76 4H98V90H76Z"/>` + ground(90, 'art-plum') +
    `<path class="art-line" d="M64 18V62M50 22H78"/><path class="art-sun art-line" d="M46 34H56L51 24ZM72 34H82L77 24Z"/><path class="art-line" d="M51 22V24M77 22V24"/>` +
    dog({ x: 38, y: 88, size: 0.7, pose: 'sit', wear: `<path class="art-sun art-line" d="M18 -31V-37L24 -40L30 -37V-31Z"/>` }) +
    `<rect class="art-light art-line" x="82" y="44" width="4" height="34" rx="2"/><path class="art-sun art-line" d="M78 78H90M84 78V86"/>`,

  // The Hanged Man, as a pause and a new point of view: a dachshund rolls
  // happily on its back in the grass, paws in the air, seeing the world upside
  // down, a golden halo round its head under a leafy tree.
  'major-12':
    `<path class="art-line" d="M12 30V80"/><circle class="art-leaf art-line" cx="14" cy="22" r="12"/><circle class="art-rose" cx="10" cy="19" r="2.2"/><circle class="art-rose" cx="18" cy="26" r="2.2"/>` +
    cloud('art-sky', 78, 18) + ground(80) +
    `<circle class="art-sun art-line" cx="34" cy="74" r="12"/>` +
    `<g transform="translate(56 56) rotate(180)">${dog({ x: 0, y: 0, size: 0.88, pose: 'stand' })}</g>` +
    [12, 60, 92].map((x) => `<circle class="art-rose" cx="${x}" cy="90" r="2.4"/>`).join(''),

  // Death, as change rather than an ending: at sunrise a dachshund sits
  // peacefully watching a butterfly flutter by, an autumn leaf falling and a
  // new sprout coming up.
  'major-13':
    `<circle class="art-sun art-line" cx="78" cy="70" r="14"/><path class="art-line" d="M78 50V46M60 58l-3-2M96 58l3-2"/>` +
    ground(78) +
        `<path class="art-plum art-line" d="M50 30q-10-10-12 2q4 4 12-2ZM50 30q10-10 12 2q-4 4-12-2ZM50 30q-8 8-2 10q4-2 2-10ZM50 30q8 8 2 10q-4-2-2-10Z"/><path class="art-line" d="M50 26V36M48 24l-2-3M52 24l2-3"/>` +
    `<path class="art-sun art-line" d="M14 40q6-2 8 4q-6 2-8-4Z"/><path class="art-line" d="M12 48q4 2 2 6"/>` +
    dog({ x: 26, y: 80, size: 0.66, pose: 'sit' }) +
    `<path class="art-line" d="M60 80V72"/><path class="art-leaf art-line" d="M60 74q-6-2-6-7q6 1 6 7ZM60 74q6-2 6-7q-6 1-6 7Z"/>` +
    `<path class="art-water art-line" d="M2 92Q30 86 60 92T98 90V98H2Z"/>`,

  // Temperance: an angel-winged dachshund with one paw in the water, pouring
  // between two jugs, a path winding to the sunrise.
  'major-14':
    `<circle class="art-sun art-line" cx="86" cy="16" r="8"/><path class="art-leaf art-line" d="M2 70Q40 58 98 66V98H2Z"/>` +
    `<path class="art-water art-line" d="M2 82Q24 78 46 84V98H2Z"/>` +
    dog({ x: 38, y: 84, size: 0.72, pose: 'stand', wear: `<path class="art-light art-line" d="M-6 -21Q-22 -40 2 -54Q2 -46 8 -44Q2 -38 8 -35Q2 -30 6 -26Q2 -24 4 -21Z"/>` }) +
    `<path class="art-sun art-line" d="M48 34h9l-1.5 11h-6Z"/><path class="art-sun art-line" d="M66 46h9l-1.5 11h-6Z"/><path class="art-water art-line" d="M56 36Q66 36 70 48"/>`,

  // The Devil: a little dachshund in red horns perched on a block, two others
  // below in loose chains they could slip at any moment.
  'major-15':
    `<rect class="art-plum art-line" x="2" y="2" width="96" height="96"/>` + star('art-sun', 50, 12, 6) +
    `<rect class="art-ink art-line" x="34" y="48" width="32" height="16"/>` +
    dog({ x: 44, y: 48, size: 0.5, pose: 'sit', wear: `<path class="art-rose art-line" d="M19 -30L15 -40L23 -32ZM27 -32L31 -41L30 -30Z"/>` }) +
    `<path class="art-light art-line" d="M38 64Q30 74 24 78M62 64Q70 74 76 78"/>` +
    dog({ x: 24, y: 94, size: 0.4, pose: 'sit' }) + dog({ x: 76, y: 94, size: 0.4, pose: 'sit', facing: -1 }),

  // The Tower: lightning knocks the crown off a tall tower, and one sensible
  // dachshund is already running for it.
  'major-16':
    `<rect class="art-plum art-line" x="2" y="2" width="96" height="62"/>` + ground(86) +
    `<rect class="art-light art-line" x="56" y="22" width="22" height="66"/><rect class="art-ink" x="63" y="40" width="8" height="10" rx="4"/><rect class="art-ink" x="63" y="62" width="8" height="10" rx="4"/>` +
    `<path class="art-sun art-line" d="M60 14L69 6L76 12L72 18Z"/><path class="art-sun art-line" d="M90 2L74 22H84L70 40L92 16H82Z"/>` +
    `<path class="art-rose art-line" d="M54 30q-6-6 0-12q2 6 4 4ZM80 34q6-6 2-12q-2 6-4 4Z"/>` +
    dog({ x: 34, y: 86, size: 0.6, facing: -1, pose: 'run' }),

  // The Star: under one big star and seven small ones, a dachshund kneels by a
  // pool, a bird in the tree behind.
  'major-17':
    `<rect class="art-plum art-line" x="2" y="2" width="96" height="64"/>` + star('art-sun art-line', 50, 20, 11) +
    [[16, 12], [84, 12], [12, 34], [88, 34], [30, 44], [70, 44], [50, 52]].map(([x, y]) => star('art-light', x, y, 3.2)).join('') +
    ground(72) + `<path class="art-water art-line" d="M50 84Q74 76 98 82V98H50Z"/>` +
    dog({ x: 26, y: 84, size: 0.62, pose: 'sit', wear: `<path class="art-sun art-line" d="M38 -24l6 4l-4 4Z"/>` }) +
    `<path class="art-light art-line" d="M56 82q2-8 6-4"/>`,

  // The Moon: up on his hind legs howling at the moon, two towers far off and a
  // little crayfish climbing out of the pool.
  'major-18':
    moon('art-sun', 60, 20, 12) + `<path class="art-line" d="M32 30l-4-4M26 36l-5-1M36 26l-1-5"/>` +
    `<rect class="art-light art-line" x="6" y="44" width="10" height="34"/><rect class="art-light art-line" x="84" y="44" width="10" height="34"/>` +
    ground(78) + `<path class="art-water art-line" d="M2 90Q50 84 98 90V98H2Z"/><path class="art-rose art-line" d="M64 92q4-6 8 0q-4 2-8 0ZM66 88l-3-4M70 88l3-4"/>` +
    dog({ x: 42, y: 80, size: 0.68, pose: 'beg' }),

  // The Sun: a big smiling sun, sunflowers along the wall, and a puppy running
  // for joy with a red banner.
  'major-19':
    `<circle class="art-sun art-line" cx="50" cy="26" r="15"/><path class="art-line" d="M50 4V8M28 26H32M68 26H72M34 10L37 13M66 10L63 13M34 42L37 39M66 42L63 39"/>` +
    `<circle class="art-ink" cx="45" cy="24" r="1.8"/><circle class="art-ink" cx="55" cy="24" r="1.8"/><path class="art-line" d="M44 31q6 5 12 0"/>` +
    `<rect class="art-light art-line" x="2" y="56" width="96" height="14"/>` +
    [12, 30, 70, 88].map((x) => `<circle class="art-sun art-line" cx="${x}" cy="52" r="5"/><circle class="art-ear" cx="${x}" cy="52" r="2"/>`).join('') +
    ground(84) +
    `<path class="art-line" d="M58 46V84"/><path class="art-rose art-line" d="M58 46H82L76 54L82 62H58Z"/>` +
    dog({ x: 20, y: 84, size: 0.62, pose: 'run' }),

  // Judgement: a trumpet sounds from the clouds and three dachshunds pop up
  // out of their boxes to answer.
  'major-20':
    cloud('art-sky', 30, 14) + cloud('art-sky', 62, 10) +
    `<path class="art-sun art-line" d="M40 22L74 34L72 40L40 26Z"/><path class="art-light art-line" d="M54 30V44H64L60 38L64 34Z"/>` +
    `<path class="art-water art-line" d="M2 76Q50 70 98 76V98H2Z"/>` +
    dog({ x: 14, y: 84, size: 0.42, pose: 'beg' }) + dog({ x: 46, y: 84, size: 0.42, pose: 'beg' }) + dog({ x: 78, y: 84, size: 0.42, pose: 'beg' }) +
    [8, 40, 72].map((x) => `<rect class="art-light art-line" x="${x}" y="76" width="20" height="14" rx="2"/>`).join(''),

  // The World: dancing inside a green laurel wreath tied with red ribbons, a
  // cloud in each corner.
  'major-21':
    cloud('art-sky', 14, 10) + cloud('art-sky', 86, 10) + cloud('art-sky', 14, 90) + cloud('art-sky', 86, 90) +
    `<ellipse class="art-leaf art-line" cx="50" cy="50" rx="27" ry="40"/><ellipse class="art-light art-line" cx="50" cy="50" rx="19" ry="32"/>` +
    `<path class="art-rose art-line" d="M44 10l6 6l6-6ZM44 90l6-6l6 6Z"/>` +
    dog({ x: 55, y: 78, size: 0.56, pose: 'beg' }),
}
