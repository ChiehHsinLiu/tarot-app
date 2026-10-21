// The Lenormand drawings: one hand-written SVG per card, bundled at build time
// so draws never need the network. Only LenormandCardFace imports this, inside
// the dev-only Lenormand chunk, so the production build never includes them.
// Coloured only through the shared art classes (see art-format.ts).

const files = import.meta.glob('../assets/lenormand/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const LENORMAND_ART: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), svg]),
)
