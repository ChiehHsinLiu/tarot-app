// The tarot drawings: one hand-written SVG per major arcana and court card,
// bundled with the tarot screens so draws never need the network. The Ace to
// Ten have no file; their pips are laid out by pips.ts. Each file is named by
// its card id and coloured only through the art classes in styles/card.css
// (see tarot-art.test.ts).

const files = import.meta.glob('../assets/tarot/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const TAROT_ART: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), svg]),
)
