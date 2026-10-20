import { Fragment } from 'react'
import type { Inline } from '../lib/markdown.ts'
import { parseMarkdown } from '../lib/markdown.ts'

function InlineText({ parts }: { parts: Inline[] }) {
  return parts.map((part, i) =>
    part.kind === 'bold' ? (
      <strong key={i}>{part.text}</strong>
    ) : part.kind === 'italic' ? (
      <em key={i}>{part.text}</em>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    ),
  )
}

// Renders the Markdown subset from lib/markdown.ts as React elements only.
// Headings start at h3 so they sit below the page's own h1 and reading h2.
export function MarkdownText({ source, className }: { source: string; className?: string }) {
  return (
    <div className={className}>
      {parseMarkdown(source).map((block, i) => {
        if (block.kind === 'heading') {
          const Heading = block.level <= 2 ? 'h3' : 'h4'
          return (
            <Heading key={i}>
              <InlineText parts={block.content} />
            </Heading>
          )
        }
        if (block.kind === 'rule') return <hr key={i} />
        if (block.kind === 'list') {
          const List = block.ordered ? 'ol' : 'ul'
          return (
            <List key={i}>
              {block.items.map((item, j) => (
                <li key={j}>
                  <InlineText parts={item} />
                </li>
              ))}
            </List>
          )
        }
        return (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <InlineText parts={line} />
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
