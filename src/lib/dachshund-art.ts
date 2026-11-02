// The Dachshund deck's drawings: one hand-written SVG per card, all 78,
// bundled with the tarot screens so draws never need the network. Each file is
// named by its card id, drawn by scripts/dachshund-art/ and coloured only
// through the art classes in styles/card.css (see dachshund-art.test.ts).

const files = import.meta.glob('../assets/dachshund/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const DACHSHUND_ART: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), svg]),
)
