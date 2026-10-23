// The animal oracle drawings: one hand-written SVG per card, bundled at build
// time so draws never need the network. Each file is named by its card id and
// coloured only through the art classes in styles/oracle.css (see
// oracle-art.test.ts).

const files = import.meta.glob('../assets/oracle/animal/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const ORACLE_ART: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), svg]),
)
