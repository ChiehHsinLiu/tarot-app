// A deliberately tiny Markdown subset for Claude's answers: headings,
// paragraphs, bullet and numbered lists, horizontal rules, bold and italics.
// It returns a plain data tree that the UI turns into React elements, so text
// can never become HTML. Anything outside the subset stays literal text.

export type Inline = { kind: 'text' | 'bold' | 'italic'; text: string }
export type Block =
  | { kind: 'heading'; level: number; content: Inline[] }
  | { kind: 'paragraph'; lines: Inline[][] }
  | { kind: 'list'; ordered: boolean; items: Inline[][] }
  | { kind: 'rule' }

// Bold first so "**x**" is not read as two italics. Markers must hug the text,
// so "a * b * c" and unclosed markers mid-stream stay literal. Underscores
// inside words (snake_case) are not emphasis.
const INLINE =
  /\*\*(\S(?:[^*]*?\S)?)\*\*|\*(\S(?:[^*]*?\S)?)\*|(?<![\p{L}\p{N}])_(\S(?:[^_]*?\S)?)_(?![\p{L}\p{N}])/gu

export function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  let last = 0
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) out.push({ kind: 'text', text: text.slice(last, match.index) })
    if (match[1] !== undefined) out.push({ kind: 'bold', text: match[1] })
    else out.push({ kind: 'italic', text: match[2] ?? match[3] })
    last = match.index + match[0].length
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) })
  return out
}

const HEADING = /^(#{1,6})\s+(.*)$/
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/
const BULLET = /^\s*[-*]\s+(.*)$/
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = []
  let paragraph: Inline[][] | null = null
  let list: Extract<Block, { kind: 'list' }> | null = null

  const close = () => {
    paragraph = null
    list = null
  }

  for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      close()
      continue
    }
    if (RULE.test(line)) {
      close()
      blocks.push({ kind: 'rule' })
      continue
    }
    const heading = HEADING.exec(line)
    if (heading) {
      close()
      blocks.push({ kind: 'heading', level: heading[1].length, content: parseInline(heading[2]) })
      continue
    }
    const bullet = BULLET.exec(line)
    const numbered = bullet ? null : NUMBERED.exec(line)
    if (bullet || numbered) {
      const ordered = numbered !== null
      if (!list || list.ordered !== ordered) {
        paragraph = null
        list = { kind: 'list', ordered, items: [] }
        blocks.push(list)
      }
      list.items.push(parseInline((bullet ?? numbered)![1]))
      continue
    }
    if (!paragraph) {
      list = null
      paragraph = []
      blocks.push({ kind: 'paragraph', lines: paragraph })
    }
    paragraph.push(parseInline(line))
  }
  return blocks
}
