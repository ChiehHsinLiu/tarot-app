// The 22 major arcana: each card's traditional symbols in a composition of
// its own.
import { arm, bell, crown, face, hand, head, infinity, limb, r1, star } from './shapes.ts'

const MAJOR: Record<number, string> = {
  // The Fool: steps toward the cliff edge with a bundle and a flower, a dog at his heels.
  0: `<circle class="art-fill art-line" cx="18" cy="18" r="7"/><path class="art-line" d="M18 5 V8 M18 28 V31 M5 18 H8 M28 18 H31 M9 9 L11 11 M25 25 L27 27 M27 9 L25 11 M9 27 L11 25"/>` +
    `<path class="art-fill art-line" d="M4 96 V84 C24 79 52 79 68 84 C70 88 70 92 72 96 Z"/>` +
    limb('art-deep', 43, 70, 15, 25) + limb('art-deep', 50, 70, 15, -30) +
    bell('art-fill', 47, 47, 74, 12) + `<path class="art-line" d="M37 64 Q47 67 57 64"/>` +
    `<path class="art-line" d="M38 56 L68 33"/><circle class="art-deep art-line" cx="70" cy="31" r="6"/>` +
    arm('art-fill', 52, 52, 13, -120) + arm('art-fill', 40, 52, 13, 60) +
    `<path class="art-line" d="M28 46 V40"/><circle class="art-blush" cx="28" cy="38" r="3"/>` +
    head(47, 37, 9.5) + `<path class="art-deep art-line" d="M37.5 34 C37 24 57 24 56.5 34 C54 30 41 30 37.5 34 Z"/><ellipse class="art-light art-line" cx="57" cy="25" rx="2.4" ry="6" transform="rotate(50 57 25)"/>` +
    `<ellipse class="art-light art-line" cx="22" cy="78" rx="9" ry="5.5"/><circle class="art-light art-line" cx="15" cy="70" r="5"/><path class="art-deep art-line" d="M12 66 C9 68 9 72 11 74 C13 72 13 69 12 66 Z"/><path class="art-line" d="M31 76 L35 72 M17 83 V88 M26 83 V88"/><circle class="art-ink" cx="16" cy="69.5" r="1.2"/><circle class="art-ink" cx="11.5" cy="71" r="0.9"/>`,

  // The Magician: one hand up with a wand, the other down, the four suits on his table.
  1: infinity(50, 11) +
    bell('art-deep', 50, 40, 70, 15) + `<path class="art-light art-line" d="M46 42 L50 70 L54 42 Z"/>` +
    arm('art-deep', 57, 44, 14, -160) + `<rect class="art-light art-line" x="60" y="15" width="3.5" height="17" rx="1.75"/>` +
    arm('art-deep', 43, 44, 15, 30) +
    head(50, 29, 9.5) + `<path class="art-deep art-line" d="M40.5 27 C40 18 60 18 59.5 27 C56 23 44 23 40.5 27 Z"/>` +
    `<rect class="art-fill art-line" x="14" y="66" width="72" height="9" rx="4"/><rect class="art-fill art-line" x="20" y="75" width="6" height="18" rx="3"/><rect class="art-fill art-line" x="74" y="75" width="6" height="18" rx="3"/>` +
    `<path class="art-light art-line" d="M20 55 H30 C30 61 28 63 25 63 C22 63 20 61 20 55 Z"/><path class="art-line" d="M25 63 V66"/>` +
    `<circle class="art-light art-line" cx="75" cy="60" r="5.5"/>` + star('art-fill', 75, 60, 3.6) +
    `<path class="art-line" d="M32 63 L42 60 M64 64 L70 56"/><circle class="art-blush" cx="40" cy="88" r="3"/><circle class="art-blush" cx="50" cy="90" r="3"/><circle class="art-blush" cx="60" cy="88" r="3"/>`,

  // The High Priestess: seated between a dark and a light pillar, a scroll and the moon.
  2: `<rect class="art-fill art-line" x="26" y="20" width="48" height="70" rx="4"/>` +
    [[36, 32], [64, 32], [36, 52], [64, 52], [50, 22]].map(([x, y]) => `<circle class="art-blush" cx="${x}" cy="${y}" r="2.6"/>`).join('') +
    `<rect class="art-deep art-line" x="10" y="18" width="13" height="74" rx="3"/><rect class="art-light art-line" x="77" y="18" width="13" height="74" rx="3"/><rect class="art-deep art-line" x="8" y="14" width="17" height="6" rx="3"/><rect class="art-light art-line" x="75" y="14" width="17" height="6" rx="3"/>` +
    bell('art-light', 50, 46, 88, 17) + `<path class="art-fill art-line" d="M44 47 L50 54 L56 47"/>` +
    `<rect class="art-light art-line" x="42" y="60" width="16" height="9" rx="4.5"/><path class="art-line" d="M45 64.5 H55"/>` +
    hand(41, 64) + hand(59, 64) +
    head(50, 36, 9.5) + `<path class="art-deep art-line" d="M40 38 C38 24 62 24 60 38 C59 32 41 32 40 38 Z"/>` +
    `<circle class="art-fill art-line" cx="50" cy="21" r="3.6"/><path class="art-fill art-line" d="M43 18 C44 22 46 23 47 23 C45 21 45 19 46 17 Z M57 18 C56 22 54 23 53 23 C55 21 55 19 54 17 Z"/>` +
    `<path class="art-fill art-line" d="M38 92 C44 86 56 86 62 92 C56 89 44 89 38 92 Z"/>`,

  // The Empress: on a round cushion with a crown of stars, a heart shield, and wheat.
  3: [24, 38, 50, 62, 76].map((x, i) => star('art-fill art-line', x, i % 2 ? 12 : 9, 4)).slice(1, 4).join('') +
    `<ellipse class="art-deep art-line" cx="50" cy="80" rx="30" ry="10"/>` +
    bell('art-fill', 50, 44, 82, 18) + [[44, 60], [56, 60], [50, 70], [42, 76], [58, 76]].map(([x, y]) => `<circle class="art-light" cx="${x}" cy="${y}" r="2"/>`).join('') +
    `<path class="art-fill art-line" d="M76 56 C76 50 84 50 84 56 C84 50 92 50 92 56 C92 64 84 68 84 72 C84 68 76 64 76 56 Z"/>` +
    arm('art-fill', 58, 48, 13, -50) + `<rect class="art-light art-line" x="25" y="34" width="3.5" height="26" rx="1.75"/><circle class="art-fill art-line" cx="26.75" cy="33" r="3.6"/>` + arm('art-fill', 42, 48, 14, 75) +
    head(50, 35, 9.5) + `<path class="art-deep art-line" d="M40 38 C37 22 63 22 60 38 C62 44 61 49 58 52 C58 44 57 36 50 32 C43 36 42 44 42 52 C39 49 38 44 40 38 Z"/>` +
    [10, 18, 84, 92].map((x) => `<path class="art-line" d="M${x} 96 V76"/><ellipse class="art-fill art-line" cx="${x}" cy="74" rx="2.4" ry="4.5"/><ellipse class="art-fill art-line" cx="${x - 3}" cy="81" rx="2" ry="3.6" transform="rotate(-30 ${x - 3} 81)"/>`).join(''),

  // The Emperor: on a ram-horned stone throne before mountains, holding an orb and an ankh.
  4: `<path class="art-light art-line" d="M4 78 L12 44 Q15 37 18 44 L30 78 Z"/><path class="art-light art-line" d="M70 78 L82 40 Q85 33 88 40 L96 78 Z"/><path class="art-line" d="M10 52 L15 49 L20 52 M80 48 L85 45 L90 48"/>` +
    `<rect class="art-fill art-line" x="24" y="30" width="52" height="60" rx="5"/>` +
    [28, 72].map((x) => `<circle class="art-light art-line" cx="${x}" cy="30" r="5.5"/><path class="art-line" d="M${x - 4} 29 C${x - 8} 24 ${x - 2} 20 ${x} 25 M${x + 4} 29 C${x + 8} 24 ${x + 2} 20 ${x} 25"/>`).join('') +
    `<rect class="art-deep art-line" x="20" y="68" width="60" height="8" rx="4"/>` +
    bell('art-deep', 50, 48, 90, 17) + `<path class="art-fill art-line" d="M44 50 C47 53 53 53 56 50 L57 90 H43 Z"/>` +
    arm('art-deep', 58, 54, 14, -150) + `<rect class="art-light art-line" x="63.5" y="22" width="4" height="22" rx="2"/><circle class="art-light art-line" cx="65.5" cy="19" r="4"/><path class="art-line" d="M60 27 H71"/>` +
    arm('art-deep', 42, 54, 12, 60) + `<circle class="art-fill art-line" cx="30" cy="54" r="4.5"/><path class="art-line" d="M30 49.5 V46 M28 47.5 H32"/>` +
    head(50, 37, 10) + `<path class="art-light art-line" d="M40.5 40 C40 56 60 56 59.5 40 C55 45 45 45 40.5 40 Z"/>` + crown(50, 29),

  // The Hierophant: in a triple crown, one hand blessing, a triple cross, crossed keys below.
  5: `<rect class="art-fill art-line" x="10" y="16" width="12" height="72" rx="3"/><rect class="art-fill art-line" x="78" y="16" width="12" height="72" rx="3"/>` +
    bell('art-deep', 50, 46, 84, 19) + `<path class="art-light art-line" d="M45 48 L44 84 H56 L55 48 Z"/><path class="art-line" d="M47 60 H53 M50 57 V63"/>` +
    `<rect class="art-light art-line" x="29" y="14" width="3.5" height="60" rx="1.75"/><path class="art-line" d="M24 22 H38 M25.5 28 H36.5 M27 34 H35"/>` +
    arm('art-deep', 41, 52, 12, 55) + arm('art-deep', 59, 52, 14, -150) +
    head(50, 38, 10) +
    `<rect class="art-fill art-line" x="42" y="25" width="16" height="6" rx="3"/><rect class="art-fill art-line" x="43.5" y="19" width="13" height="6" rx="3"/><rect class="art-fill art-line" x="45" y="13" width="10" height="6" rx="3"/><circle class="art-fill art-line" cx="50" cy="10" r="2.4"/>` +
    [-35, 35].map((a) => `<g transform="rotate(${a} 50 90)"><rect class="art-fill art-line" x="48.5" y="80" width="3" height="16" rx="1.5"/><circle class="art-light art-line" cx="50" cy="80" r="3.5"/><path class="art-line" d="M51.5 92 H55 M51.5 95 H54"/></g>`).join(''),

  // The Lovers: two figures hand in hand under a bright sun, a tree beside each.
  6: `<circle class="art-fill art-line" cx="50" cy="16" r="9"/><path class="art-line" d="M50 2 V4 M36 16 H38 M62 16 H64 M40 6 L41.5 7.5 M60 6 L58.5 7.5"/><path class="art-blush" d="M50 36 C47 32 42 34 44 38 C45 40 50 43 50 43 C50 43 55 40 56 38 C58 34 53 32 50 36 Z"/>` +
    `<rect class="art-deep art-line" x="12" y="54" width="5" height="40" rx="2.5"/><ellipse class="art-deep art-line" cx="14.5" cy="48" rx="9" ry="13"/>` +
    `<rect class="art-deep art-line" x="83" y="54" width="5" height="40" rx="2.5"/><circle class="art-fill art-line" cx="85.5" cy="48" r="11"/><circle class="art-blush" cx="82" cy="45" r="2.4"/><circle class="art-blush" cx="89" cy="50" r="2.4"/>` +
    bell('art-fill', 36, 58, 90, 11) + bell('art-light', 64, 58, 90, 11) +
    arm('art-fill', 42, 63, 10, -60) + arm('art-light', 58, 63, 10, 60) +
    head(36, 48, 9) + `<path class="art-deep art-line" d="M27 46 C26 36 46 36 45 46 C43 42 29 42 27 46 Z"/>` +
    head(64, 48, 9) + `<path class="art-deep art-line" d="M55 48 C52 34 76 34 73 48 C74 54 73 58 71 60 C71 52 70 45 64 41 C58 45 57 52 57 60 C55 58 54 54 55 48 Z"/>`,

  // The Chariot: a crowned driver under a starry canopy, a light and a dark sphinx in front.
  7: `<path class="art-deep art-line" d="M24 26 C34 14 66 14 76 26 Z"/>` + star('art-light', 40, 21, 2.6) + star('art-light', 50, 19, 2.6) + star('art-light', 60, 21, 2.6) +
    `<path class="art-line" d="M27 26 V52 M73 26 V52"/>` +
    bell('art-fill', 50, 46, 60, 12) + head(50, 38, 9) + crown(50, 30) +
    `<rect class="art-fill art-line" x="24" y="52" width="52" height="22" rx="4"/>` + star('art-light art-line', 50, 63, 6) +
    `<circle class="art-light art-line" cx="22" cy="74" r="6"/><circle class="art-light art-line" cx="78" cy="74" r="6"/>` +
    ([[28, 'art-light'], [72, 'art-deep']] as const).map(([x, c]) => `<ellipse class="${c} art-line" cx="${x}" cy="88" rx="12" ry="6"/><circle class="${c} art-line" cx="${x}" cy="80" r="6.5"/><circle class="art-ink" cx="${x - 2.4}" cy="80" r="1.1"/><circle class="art-ink" cx="${x + 2.4}" cy="80" r="1.1"/><path class="art-line" d="M${x - 6} 77 L${x - 7} 72 M${x + 6} 77 L${x + 7} 72"/>`).join(''),

  // Strength: a figure crowned with flowers gently holds a lion, infinity above.
  8: infinity(66, 12) +
    `<path class="art-deep art-line" d="M60 78 C66 76 70 82 68 88"/>` +
    `<ellipse class="art-fill art-line" cx="42" cy="80" rx="24" ry="10"/><rect class="art-fill art-line" x="24" y="82" width="7" height="12" rx="3.5"/><rect class="art-fill art-line" x="52" y="82" width="7" height="12" rx="3.5"/>` +
    bell('art-light', 68, 46, 92, 14) +
    `<circle class="art-deep art-line" cx="28" cy="64" r="14"/><circle class="art-fill art-line" cx="28" cy="65" r="9"/><circle class="art-ink" cx="25" cy="63" r="1.3"/><circle class="art-ink" cx="31" cy="63" r="1.3"/><ellipse class="art-ink" cx="28" cy="67" rx="2" ry="1.4"/><path class="art-line" d="M26 70 Q28 71.5 30 70"/>` +
    arm('art-light', 62, 52, 26, 73) +
    head(68, 36, 9.5) + `<path class="art-deep art-line" d="M58.5 34 C57 23 79 23 77.5 34 C75 29 61 29 58.5 34 Z"/>` + [60, 65, 71, 76].map((x) => `<circle class="art-blush" cx="${x}" cy="${x < 68 ? 27 : 27}" r="2.4"/>`).join(''),

  // The Hermit: hooded on a peak, a starlit lantern raised, a staff in hand.
  9: [[16, 14], [30, 24], [84, 12], [78, 30]].map(([x, y]) => star('art-fill', x, y, 3)).join('') +
    `<polygon class="art-fill art-line" points="4,96 24,78 38,84 58,72 96,92 96,96"/>` +
    `<rect class="art-light art-line" x="28" y="36" width="4" height="54" rx="2"/>` +
    bell('art-deep', 46, 30, 86, 17) +
    `<path class="art-deep art-line" d="M34 50 C30 26 62 26 58 50 Z"/>` +
    `<circle class="art-light art-line" cx="46" cy="41" r="8.5"/><path class="art-light art-line" d="M39 45 C39 60 53 60 53 45 C50 48 42 48 39 45 Z"/>` + face(46, 39) +
    hand(30, 56) + arm('art-deep', 58, 52, 14, -140) +
    `<path class="art-line" d="M67 41 V45"/><rect class="art-light art-line" x="62" y="45" width="10" height="13" rx="3"/>` + star('art-fill', 67, 51.5, 4),

  // Wheel of Fortune: a turning wheel among clouds, a little sphinx on top.
  10: [[12, 12], [88, 12], [12, 90], [88, 90]].map(([x, y]) => `<ellipse class="art-light art-line" cx="${x}" cy="${y}" rx="9" ry="5"/><ellipse class="art-light art-line" cx="${x + (x < 50 ? 5 : -5)}" cy="${y - 3}" rx="5.5" ry="4"/>`).join('') +
    `<circle class="art-fill art-line" cx="50" cy="56" r="30"/><circle class="art-light art-line" cx="50" cy="56" r="21"/>` +
    `<path class="art-line" d="M50 35 V77 M29 56 H71 M35 41 L65 71 M65 41 L35 71"/><circle class="art-deep art-line" cx="50" cy="56" r="6"/>` +
    [0, 90, 180, 270].map((a) => { const t = (a * Math.PI) / 180; return `<circle class="art-deep" cx="${r1(50 + 25.5 * Math.sin(t))}" cy="${r1(56 - 25.5 * Math.cos(t))}" r="2"/>` }).join('') +
    `<path class="art-line" d="M18 46 C14 54 22 60 18 68 C15 74 20 78 24 80"/>` +
    `<ellipse class="art-deep art-line" cx="50" cy="24" rx="9" ry="5"/><circle class="art-deep art-line" cx="50" cy="16" r="6"/><circle class="art-ink" cx="48" cy="16" r="1.1"/><circle class="art-ink" cx="52" cy="16" r="1.1"/><path class="art-line" d="M45 12 L44 8 M55 12 L56 8"/>`,
  // Justice: crowned and seated, a sword held upright and scales held out.
  11: `<rect class="art-fill art-line" x="22" y="18" width="56" height="72" rx="5"/><rect class="art-deep art-line" x="24" y="66" width="52" height="8" rx="4"/>` +
    bell('art-deep', 50, 46, 90, 17) + `<path class="art-light art-line" d="M44 48 C47 51 53 51 56 48 L57 90 H43 Z"/>` +
    `<path class="art-light art-line" d="M60.4 6 L63 11 V33 H57.8 V11 Z"/><rect class="art-deep art-line" x="54.5" y="33" width="12" height="3.4" rx="1.7"/>` +
    arm('art-deep', 58, 52, 14, -170) +
    `<path class="art-line" d="M29.8 53 V44 M14 44 H40 M14 44 L10 53 M14 44 L18 53 M40 44 L36 53 M40 44 L44 53"/><path class="art-light art-line" d="M8.5 53 H19.5 Q14 59 8.5 53 Z M34.5 53 H45.5 Q40 59 34.5 53 Z"/>` +
    arm('art-deep', 42, 52, 13, 70) +
    `<path class="art-deep art-line" d="M40 40 C38 26 62 26 60 40 L61 50 C57 47 43 47 39 50 Z"/>` + head(50, 37, 10) +
    `<path class="art-fill art-line" d="M41 29 V21 H59 V29 Q50 31 41 29 Z"/><circle class="art-light art-line" cx="50" cy="25" r="2"/>`,

  // The Hanged Man: hangs by one foot from a living beam, calm, with a halo.
  12: `<rect class="art-deep art-line" x="14" y="14" width="6" height="82" rx="3"/><rect class="art-deep art-line" x="80" y="14" width="6" height="82" rx="3"/><rect class="art-deep art-line" x="10" y="10" width="80" height="7" rx="3.5"/>` +
    [[24, 8], [40, 7], [62, 8], [78, 7]].map(([x, y]) => `<ellipse class="art-fill art-line" cx="${x}" cy="${y}" rx="4.5" ry="2.4"/>`).join('') +
    `<path class="art-line" d="M50 17 V25"/>` +
    limb('art-deep', 59.2, 41.6, 12, 123.4) + `<rect class="art-deep art-line" x="46.5" y="24" width="7" height="24" rx="3.5"/>` + limb('art-deep', 47, 46, 13, -110) +
    `<path class="art-fill art-line" d="M37 46 C37 58 42 70 50 70 C58 70 63 58 63 46 Z"/>` + hand(39, 62) + hand(61, 62) +
    `<circle class="art-fill art-line" cx="50" cy="80" r="14"/><path class="art-deep art-line" d="M41 82 C40 92 60 92 59 82 Z"/>` +
    `<circle class="art-light art-line" cx="50" cy="79" r="9.5"/><g transform="rotate(180 50 79)">${face(50, 79)}</g>`,

  // Death: a gentle cloaked skeleton with a white-rose banner, a sun rising between two towers.
  13: `<rect class="art-fill art-line" x="66" y="50" width="8" height="24" rx="1"/><rect class="art-fill art-line" x="86" y="50" width="8" height="24" rx="1"/><path class="art-fill art-line" d="M73 74 A7 7 0 0 1 87 74 Z"/><path class="art-line" d="M80 62 V58 M73.5 66 L71 63.5 M86.5 66 L89 63.5"/>` +
    `<path class="art-fill" d="M4 74 H96 V96 H4 Z"/>` +
    `<rect class="art-light art-line" x="58" y="14" width="3.5" height="76" rx="1.75"/><path class="art-light art-line" d="M61.5 16 H86 L81 25 L86 34 H61.5 Z"/>` +
    [0, 72, 144, 216, 288].map((a) => { const t = (a * Math.PI) / 180; return `<circle class="art-light art-line" cx="${r1(72 + 3.4 * Math.sin(t))}" cy="${r1(25 - 3.4 * Math.cos(t))}" r="2.6"/>` }).join('') + `<circle class="art-fill art-line" cx="72" cy="25" r="2"/>` +
    bell('art-deep', 40, 26, 92, 19) +
    `<circle class="art-light art-line" cx="40" cy="42" r="9"/><ellipse class="art-ink" cx="36.6" cy="41" rx="2.2" ry="2.6"/><ellipse class="art-ink" cx="43.4" cy="41" rx="2.2" ry="2.6"/><path class="art-ink" d="M40 44.5 L41.3 47 H38.7 Z"/><path class="art-line" d="M36 49 H44 M38 48 V50 M40 48 V50 M42 48 V50"/>` +
    arm('art-deep', 48, 56, 12, -80),

  // Temperance: a winged angel pours water from one cup to another, a path to the sun behind.
  14: `<circle class="art-fill art-line" cx="85" cy="18" r="6"/><path class="art-line" d="M74 92 C80 78 72 64 82 50 C86 42 84 32 85 26"/>` +
    `<ellipse class="art-light art-line" cx="32" cy="44" rx="10" ry="24" transform="rotate(-22 32 44)"/><ellipse class="art-light art-line" cx="68" cy="44" rx="10" ry="24" transform="rotate(22 68 44)"/>` +
    bell('art-light', 50, 40, 90, 15) + `<polygon class="art-fill art-line" points="50,47 54.5,55 45.5,55"/>` +
    `<path class="art-deep art-line" d="M40 34 C38 20 62 20 60 34 C59 28 41 28 40 34 Z"/>` + head(50, 31, 9.5) + `<circle class="art-fill art-line" cx="50" cy="20" r="2.6"/>` +
    `<path class="art-line" d="M39 47 C47 47 58 52 62 61"/>` +
    `<path class="art-fill art-line" d="M30 44 H41 C41 50 39 53 35.5 53 C32 53 30 50 30 44 Z M58.5 60 H69.5 C69.5 66 67.5 69 64 69 C60.5 69 58.5 66 58.5 60 Z"/>` +
    arm('art-light', 44, 46, 12, 55) + arm('art-light', 56, 46, 22, -20) +
    `<path class="art-line" d="M4 92 Q9 88 14 92 T24 92 T34 92 T44 92"/><path class="art-line" d="M16 88 V78 M24 88 V80"/><ellipse class="art-blush" cx="16" cy="76" rx="2.6" ry="3.4"/><ellipse class="art-blush" cx="24" cy="78" rx="2.6" ry="3.4"/>`,

  // The Devil: a horned, bat-winged figure on a block, two small figures loosely chained to it.
  15: `<path class="art-deep art-line" d="M39 40 C28 28 14 32 8 44 C14 42 17 46 21 46 C23 43 27 45 30 48 Z"/><path class="art-deep art-line" d="M61 40 C72 28 86 32 92 44 C86 42 83 46 79 46 C77 43 73 45 70 48 Z"/>` +
    `<rect class="art-deep art-line" x="34" y="60" width="32" height="14" rx="3"/><circle class="art-light art-line" cx="50" cy="67" r="3"/>` +
    bell('art-deep', 50, 34, 62, 13) +
    arm('art-deep', 40, 40, 12, 40) + `<rect class="art-fill art-line" x="30.5" y="50" width="3.5" height="11" rx="1.75"/><ellipse class="art-blush" cx="32.25" cy="63" rx="2.6" ry="3.6"/>` +
    arm('art-deep', 60, 40, 12, -150) +
    `<path class="art-fill art-line" d="M43 21 C39 19 38 15 39.5 12 C41 15 44 16 46.5 18 Z M57 21 C61 19 62 15 60.5 12 C59 15 56 16 53.5 18 Z"/>` +
    `<circle class="art-fill art-line" cx="50" cy="27" r="9.5"/>` + face(50, 27) +
    `<path class="art-line" d="M50 70 C40 74 32 72 28 76 M50 70 C60 74 68 72 72 76"/>` +
    bell('art-light', 26, 80, 96, 9) + bell('art-light', 74, 80, 96, 9) +
    head(26, 73, 7.5) + head(74, 73, 7.5) + `<path class="art-line" d="M22 66 L21 62 M30 66 L31 62 M70 66 L69 62 M78 66 L79 62"/>`,

  // The Tower: struck by lightning, its crown knocked loose, flames at the windows.
  16: `<ellipse class="art-deep art-line" cx="20" cy="14" rx="14" ry="7"/><ellipse class="art-deep art-line" cx="32" cy="10" rx="9" ry="6"/>` +
    `<polygon class="art-fill art-line" points="80,4 66,20 73,21 61,36 78,18 71,17 84,4"/>` +
    `<path class="art-fill art-line" d="M22 96 C24 86 35 82 50 82 C65 82 76 86 78 96 Z"/>` +
    `<rect class="art-light art-line" x="37" y="30" width="26" height="56" rx="2"/><path class="art-line" d="M37 30 H63"/>` +
    `<rect class="art-ink" x="44" y="40" width="4.5" height="8" rx="2.25"/><rect class="art-ink" x="52" y="54" width="4.5" height="8" rx="2.25"/><rect class="art-ink" x="44" y="66" width="4.5" height="8" rx="2.25"/><path class="art-ink" d="M46 86 V80 C46 76 54 76 54 80 V86 Z"/>` +
    `<path class="art-blush" d="M44 40 C42 34 46 32 46 28 C49 32 50 35 48.5 40 Z M52 54 C50 48 54 46 54 42 C57 46 58 49 56.5 54 Z"/>` +
    `<g transform="rotate(28 66 22)"><path class="art-fill art-line" d="M54 28 L54 19 L59 23.5 L64 16 L69 23.5 L74 19 L74 28 Z"/></g>` +
    `<rect class="art-light art-line" x="20" y="44" width="5" height="5" rx="1" transform="rotate(20 22 46)"/><rect class="art-light art-line" x="76" y="58" width="5" height="5" rx="1" transform="rotate(-25 78 60)"/><path class="art-blush" d="M30 30 C28 25 32 23 32 19 C35 23 36 26 34 30 Z"/>`,

  // The Star: one great star and seven small ones; a figure pours water on the land and into a pool.
  17: `<polygon class="art-fill art-line" points="${Array.from({ length: 16 }, (_, i) => { const a = (Math.PI / 8) * i - Math.PI / 2, d = i % 2 ? 5 : 13; return `${r1(50 + d * Math.cos(a))},${r1(17 + d * Math.sin(a))}` }).join(' ')}"/>` +
    [[16, 10], [28, 22], [84, 10], [72, 22], [12, 28], [88, 28], [62, 6]].map(([x, y]) => star('art-fill', x, y, 3.4)).join('') +
    `<path class="art-fill art-line" d="M4 96 V80 C16 76 28 76 40 80 V96 Z"/><path class="art-light art-line" d="M40 96 V84 C56 80 80 80 96 84 V96 Z"/><path class="art-line" d="M50 90 Q55 87 60 90 T70 90 T80 90"/>` +
    `<path class="art-deep art-line" d="M38 44 C36 30 56 30 54 44 C55 52 54 58 52 62 C50 54 50 48 46 44 C42 48 42 54 40 62 C38 58 37 52 38 44 Z"/>` +
    bell('art-light', 46, 50, 82, 13) + head(46, 42, 9) +
    `<path class="art-line" d="M26 62 C22 68 20 74 22 80 M68 64 C70 72 70 78 68 84"/>` +
    `<ellipse class="art-fill art-line" cx="29" cy="60" rx="4.5" ry="5.5" transform="rotate(-40 29 60)"/><ellipse class="art-fill art-line" cx="65" cy="62" rx="4.5" ry="5.5" transform="rotate(40 65 62)"/>` +
    arm('art-light', 38, 54, 9, 70) + arm('art-light', 54, 54, 10, -70),

  // The Moon: a moon with a face between two towers, a dog and a wolf below, a crayfish in the pool.
  18: `<circle class="art-fill art-line" cx="50" cy="22" r="14"/><path class="art-light art-line" d="M44 10 C34 16 34 30 44 35 C38 28 38 16 44 10 Z"/>` + face(53, 21) +
    [8, 80].map((x) => `<rect class="art-light art-line" x="${x}" y="40" width="12" height="38" rx="1"/><path class="art-light art-line" d="M${x} 40 V35 H${x + 4} V38 H${x + 8} V35 H${x + 12} V40"/><rect class="art-ink" x="${x + 4.5}" y="48" width="3" height="6" rx="1.5"/>`).join('') +
    `<path class="art-line" d="M50 84 C44 76 56 68 48 60 C44 56 50 50 50 46"/>` +
    ([[30, 'art-light', -1], [70, 'art-deep', 1]] as const).map(([x, c, s]) => `<ellipse class="${c} art-line" cx="${x}" cy="74" rx="7" ry="6"/><circle class="${c} art-line" cx="${x}" cy="64" r="6"/><ellipse class="${c} art-line" cx="${x - s * 3}" cy="57" rx="2.6" ry="4" transform="rotate(${s * -25} ${x - s * 3} 57)"/><path class="${c} art-line" d="M${x - 4} 60 L${x - 5} 54 L${x - 1} 58 M${x + 4} 60 L${x + 5} 54 L${x + 1} 58"/><circle class="art-ink" cx="${x - 2.2}" cy="64" r="1.1"/><circle class="art-ink" cx="${x + 2.2}" cy="64" r="1.1"/>`).join('') +
    `<path class="art-fill art-line" d="M4 96 V86 C20 82 80 82 96 86 V96 Z"/><ellipse class="art-deep art-line" cx="50" cy="89" rx="5" ry="3"/><circle class="art-deep art-line" cx="44" cy="85" r="2"/><circle class="art-deep art-line" cx="56" cy="85" r="2"/>`,

  // The Sun: a smiling sun over a wall of sunflowers, a child riding a white horse.
  19: `<path class="art-line" d="${Array.from({ length: 12 }, (_, i) => { const t = (Math.PI / 6) * i; return `M${r1(50 + 18 * Math.sin(t))} ${r1(23 - 18 * Math.cos(t))} L${r1(50 + 23 * Math.sin(t))} ${r1(23 - 23 * Math.cos(t))}` }).join(' ')}"/>` +
    `<circle class="art-fill art-line" cx="50" cy="23" r="14"/>` + face(50, 22) +
    `<path class="art-line" d="M13 50 V60 M25 47 V60 M75 47 V60 M87 50 V60"/>` +
    [[13, 50], [25, 47], [75, 47], [87, 50]].map(([x, y]) => `<circle class="art-fill art-line" cx="${x}" cy="${y}" r="5"/><circle class="art-deep" cx="${x}" cy="${y}" r="2.6"/>`).join('') +
    `<rect class="art-light art-line" x="6" y="58" width="88" height="14" rx="2"/><path class="art-line" d="M6 65 H94 M20 58 V65 M36 65 V72 M52 58 V65 M68 65 V72 M84 58 V65"/>` +
    [36, 43, 57, 64].map((x) => `<rect class="art-light art-line" x="${x}" y="80" width="5.5" height="14" rx="2.75"/>`).join('') +
    `<ellipse class="art-light art-line" cx="50" cy="80" rx="18" ry="7.5"/><path class="art-light art-line" d="M62 78 C64 72 70 68 74 70 C77 72 77 76 74 77 L68 79 Z"/><circle class="art-ink" cx="72" cy="72" r="1.1"/>` +
    arm('art-fill', 46, 64, 11, 100) + arm('art-fill', 54, 64, 11, -100) +
    bell('art-fill', 50, 60, 78, 8) + head(50, 54, 8),

  // Judgement: an angel in the clouds sounds a trumpet; three figures rise with open arms.
  20: `<ellipse class="art-light art-line" cx="42" cy="16" rx="10" ry="6" transform="rotate(-25 42 16)"/><ellipse class="art-light art-line" cx="58" cy="16" rx="10" ry="6" transform="rotate(25 58 16)"/>` +
    [[12, 28], [26, 24], [74, 24], [88, 28]].map(([x, y]) => `<ellipse class="art-light art-line" cx="${x}" cy="${y}" rx="10" ry="5.5"/>`).join('') +
    head(50, 18, 7.5) + `<path class="art-deep art-line" d="M43 16 C42 8 58 8 57 16 C55 13 45 13 43 16 Z"/>` +
    `<path class="art-fill art-line" d="M55 24 L74 38 L80 33 L78 45 L71 41 L53 27 Z"/><rect class="art-light art-line" x="62" y="33" width="9" height="10" rx="1" transform="rotate(36 66 38)"/><path class="art-line" d="M64 36 L68 41 M68 36 L64 41"/>` +
    [21, 50, 79].map((x) => `<rect class="art-deep art-line" x="${x - 11}" y="80" width="22" height="13" rx="2"/>` + limb('art-light', x - 4, 70, 9, 150) + limb('art-light', x + 4, 70, 9, -150) + bell('art-light', x, 68, 84, 6.5) + `<circle class="art-light art-line" cx="${x}" cy="62" r="6.5"/><circle class="art-ink" cx="${x - 2.4}" cy="62.5" r="1.1"/><circle class="art-ink" cx="${x + 2.4}" cy="62.5" r="1.1"/>`).join(''),

  // The World: a dancer inside a wreath, the four creatures in the corners.
  21: `<ellipse class="art-fill art-line" cx="50" cy="54" rx="24" ry="36"/><ellipse class="art-light art-line" cx="50" cy="54" rx="17" ry="29"/>` +
    [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const t = (a * Math.PI) / 180; return `<circle class="art-deep" cx="${r1(50 + 20.5 * Math.sin(t))}" cy="${r1(54 - 32.5 * Math.cos(t))}" r="2.4"/>` }).join('') +
    limb('art-light', 48, 64, 14, 10) + limb('art-light', 52, 64, 12, -60) +
    `<path class="art-fill art-line" d="M43 66 C43 54 45 46 50 46 C55 46 57 54 57 66 Z"/><path class="art-deep art-line" d="M44 52 C50 56 54 62 58 70 L55 71 C52 64 48 59 43 56 Z"/>` +
    arm('art-light', 45, 48, 9, 60) + arm('art-light', 55, 48, 9, -60) + `<path class="art-line" d="M37 47 V37 M63 47 V37"/>` + head(50, 38, 7.5) +
    `<circle class="art-light art-line" cx="11" cy="12" r="6.5"/>` + face(11, 11) + `<ellipse class="art-light art-line" cx="3.5" cy="10" rx="2" ry="4.5"/>` +
    `<circle class="art-deep art-line" cx="89" cy="12" r="6.5"/><polygon class="art-fill art-line" points="83,13 79,15 83,17"/><circle class="art-ink" cx="87" cy="11" r="1.2"/>` +
    `<path class="art-light art-line" d="M5 85 C3 81 4 78 6 77 M17 85 C19 81 18 78 16 77"/><circle class="art-fill art-line" cx="11" cy="89" r="6.5"/><circle class="art-ink" cx="8.6" cy="88" r="1.1"/><circle class="art-ink" cx="13.4" cy="88" r="1.1"/>` +
    `<circle class="art-deep art-line" cx="89" cy="89" r="8"/><circle class="art-fill art-line" cx="89" cy="89" r="5"/><circle class="art-ink" cx="87" cy="88" r="1"/><circle class="art-ink" cx="91" cy="88" r="1"/>`,
}

// Each major card's shapes, by card id, such as major-16 for The Tower.
export const MAJORS: Record<string, string> = Object.fromEntries(
  Object.entries(MAJOR).map(([rank, shapes]) => [`major-${rank.padStart(2, '0')}`, shapes]),
)
