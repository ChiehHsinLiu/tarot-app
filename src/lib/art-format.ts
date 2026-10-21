// The drawing format every inlined SVG must follow, for the animal oracle and
// Lenormand decks alike. The drawings are inlined into the page, so this
// allow-list is what keeps them safe and lets their colours come only from
// CSS. Only tests import this module.

export const ROOT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" focusable="false">'
const ELEMENTS = new Set(['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon'])
const ATTRIBUTES = new Set([
  'xmlns', 'viewBox', 'focusable', 'class', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y',
  'width', 'height', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
])
const CLASSES = new Set(['art-fill', 'art-deep', 'art-light', 'art-ink', 'art-blush', 'art-line'])
export const MAX_BYTES = 3072

// Returns every way the drawing breaks the format; empty when it is valid.
export function formatProblems(svg: string): string[] {
  const problems: string[] = []
  const text = svg.trim()
  if (!text.startsWith(ROOT)) problems.push('root <svg> is not the standard one')
  if (!text.endsWith('</svg>')) problems.push('does not end with </svg>')
  if (new TextEncoder().encode(svg).length > MAX_BYTES) problems.push(`larger than ${MAX_BYTES} bytes`)
  // Anything between tags must be whitespace: no text content, comments, or CDATA.
  if (/>[^<]*[^\s<][^<]*</.test(text) || /<!/.test(text)) problems.push('has text, a comment, or CDATA')
  let hasInk = false
  for (const [, name, attrs] of text.matchAll(/<([A-Za-z][\w:-]*)([^>]*)>/g)) {
    if (!ELEMENTS.has(name)) problems.push(`element <${name}>`)
    const leftover = attrs.replace(/\s*\/?$/, '').replace(/\s+([\w:-]+)="([^"]*)"/g, (_, attr: string, value: string) => {
      if (!ATTRIBUTES.has(attr)) problems.push(`attribute ${attr}`)
      if (attr === 'class') {
        for (const c of value.split(/\s+/)) {
          if (!CLASSES.has(c)) problems.push(`class ${c}`)
          if (c === 'art-ink') hasInk = true
        }
      }
      return ''
    })
    if (leftover.trim()) problems.push(`unparsed attributes on <${name}>: ${leftover.trim()}`)
  }
  // Eyes on the animals; on Lenormand objects, any dark accent such as a keyhole.
  if (!hasInk) problems.push('no art-ink shape (eyes)')
  return problems
}
