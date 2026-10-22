// The home page windows: one hand-written SVG per home choice, bundled at build
// time and coloured only through the art and window classes in index.css (see
// home-art.test.ts). Each holds a day and a night sky; CSS shows the one that
// matches the palette.

const files = import.meta.glob('../assets/home/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const HOME_ART: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), svg]),
)
