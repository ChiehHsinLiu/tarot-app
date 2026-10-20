import { describe, expect, test } from 'vitest'
import { parseInline, parseMarkdown } from './markdown.ts'

describe('parseInline', () => {
  test('bold, italic with * and _', () => {
    expect(parseInline('a **bold** b *it* c _also_')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'bold', text: 'bold' },
      { kind: 'text', text: ' b ' },
      { kind: 'italic', text: 'it' },
      { kind: 'text', text: ' c ' },
      { kind: 'italic', text: 'also' },
    ])
  })

  test('bold containing the reading answer', () => {
    expect(parseInline('**Answer: Maybe**, from the **Page of Swords (upright)**')).toEqual([
      { kind: 'bold', text: 'Answer: Maybe' },
      { kind: 'text', text: ', from the ' },
      { kind: 'bold', text: 'Page of Swords (upright)' },
    ])
  })

  test.each(['**Ans', 'the *may', 'a * b * c', '2 * 3 = 6', 'snake_case_name'])(
    'unclosed or loose markers stay literal: %j',
    (text) => {
      expect(parseInline(text)).toEqual([{ kind: 'text', text }])
    },
  )

  test('HTML stays literal text', () => {
    const text = '<img src=x onerror="alert(1)"> <b>hi</b>'
    expect(parseInline(text)).toEqual([{ kind: 'text', text }])
  })
})

describe('parseMarkdown', () => {
  test('headings of any level', () => {
    expect(parseMarkdown('## Your Reading\n### Past')).toEqual([
      { kind: 'heading', level: 2, content: [{ kind: 'text', text: 'Your Reading' }] },
      { kind: 'heading', level: 3, content: [{ kind: 'text', text: 'Past' }] },
    ])
  })

  test('blank lines separate paragraphs; single newlines stay within one', () => {
    expect(parseMarkdown('One.\nStill one.\n\nTwo.')).toEqual([
      { kind: 'paragraph', lines: [[{ kind: 'text', text: 'One.' }], [{ kind: 'text', text: 'Still one.' }]] },
      { kind: 'paragraph', lines: [[{ kind: 'text', text: 'Two.' }]] },
    ])
  })

  test('bullet and numbered lists', () => {
    expect(parseMarkdown('- a\n* **b**\n\n1. one\n2) two')).toEqual([
      {
        kind: 'list',
        ordered: false,
        items: [[{ kind: 'text', text: 'a' }], [{ kind: 'bold', text: 'b' }]],
      },
      {
        kind: 'list',
        ordered: true,
        items: [[{ kind: 'text', text: 'one' }], [{ kind: 'text', text: 'two' }]],
      },
    ])
  })

  test.each(['---', '***', '___', '- - -'])('%j is a horizontal rule', (line) => {
    expect(parseMarkdown(`Before.\n\n${line}\n\nAfter.`).map((b) => b.kind)).toEqual(['paragraph', 'rule', 'paragraph'])
  })

  test('a list directly after a paragraph starts a new block', () => {
    expect(parseMarkdown('Intro:\n- item').map((b) => b.kind)).toEqual(['paragraph', 'list'])
  })

  test('a partial answer mid-stream parses without errors', () => {
    expect(parseMarkdown('## Your Re')).toEqual([
      { kind: 'heading', level: 2, content: [{ kind: 'text', text: 'Your Re' }] },
    ])
    expect(parseMarkdown('**Answer: May')).toEqual([
      { kind: 'paragraph', lines: [[{ kind: 'text', text: '**Answer: May' }]] },
    ])
  })

  test('HTML-looking lines stay literal paragraphs', () => {
    expect(parseMarkdown('<script>alert(1)</script>')).toEqual([
      { kind: 'paragraph', lines: [[{ kind: 'text', text: '<script>alert(1)</script>' }]] },
    ])
  })

  test('Windows line endings and empty input', () => {
    expect(parseMarkdown('a\r\n\r\nb').length).toBe(2)
    expect(parseMarkdown('')).toEqual([])
  })
})
