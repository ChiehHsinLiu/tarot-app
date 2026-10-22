// The drawing format every inlined SVG must follow: the animal oracle and
// Lenormand card drawings, and the home page windows. The drawings are inlined
// into the page, so this allow-list is what keeps them safe and lets their
// colours come only from CSS. Only tests import this module.

export const ROOT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" focusable="false">'
export const WINDOW_ROOT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180" focusable="false">'
const ELEMENTS = new Set(['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon'])
const ATTRIBUTES = new Set([
  'xmlns', 'viewBox', 'focusable', 'class', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y',
  'width', 'height', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
])
const CLASSES = new Set(['art-fill', 'art-deep', 'art-light', 'art-ink', 'art-blush', 'art-line'])
const WINDOW_CLASSES = new Set([...CLASSES, 'win-sky', 'win-glow', 'win-cloud', 'win-frame', 'win-sill', 'win-day', 'win-night'])
export const MAX_BYTES = 3072
export const WINDOW_MAX_BYTES = 6144

// Returns every way the drawing breaks the format; empty when it is valid.
export function formatProblems(svg: string): string[] {
  return problemsFor(svg, ROOT, CLASSES, MAX_BYTES, true)
}

// The home windows: a wider scene with its own classes, and both a day and a
// night sky so CSS can show the one that matches the palette.
export function windowProblems(svg: string): string[] {
  const problems = problemsFor(svg, WINDOW_ROOT, WINDOW_CLASSES, WINDOW_MAX_BYTES, false)
  for (const sky of ['win-day', 'win-night']) {
    if (!new RegExp(`<g class="${sky}">`).test(svg)) problems.push(`no <g class="${sky}"> group`)
  }
  return problems
}

function problemsFor(svg: string, root: string, classes: Set<string>, maxBytes: number, needsInk: boolean): string[] {
  const problems: string[] = []
  const text = svg.trim()
  if (!text.startsWith(root)) problems.push('root <svg> is not the standard one')
  if (!text.endsWith('</svg>')) problems.push('does not end with </svg>')
  if (new TextEncoder().encode(svg).length > maxBytes) problems.push(`larger than ${maxBytes} bytes`)
  // Anything between tags must be whitespace: no text content, comments, or CDATA.
  if (/>[^<]*[^\s<][^<]*</.test(text) || /<!/.test(text)) problems.push('has text, a comment, or CDATA')
  let hasInk = false
  for (const [, name, attrs] of text.matchAll(/<([A-Za-z][\w:-]*)([^>]*)>/g)) {
    if (!ELEMENTS.has(name)) problems.push(`element <${name}>`)
    const leftover = attrs.replace(/\s*\/?$/, '').replace(/\s+([\w:-]+)="([^"]*)"/g, (_, attr: string, value: string) => {
      if (!ATTRIBUTES.has(attr)) problems.push(`attribute ${attr}`)
      if (attr === 'class') {
        for (const c of value.split(/\s+/)) {
          if (!classes.has(c)) problems.push(`class ${c}`)
          if (c === 'art-ink') hasInk = true
        }
      }
      return ''
    })
    if (leftover.trim()) problems.push(`unparsed attributes on <${name}>: ${leftover.trim()}`)
  }
  // Eyes on the animals; on Lenormand objects, any dark accent such as a keyhole.
  if (needsInk && !hasInk) problems.push('no art-ink shape (eyes)')
  return problems
}
