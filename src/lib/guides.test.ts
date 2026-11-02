// Content checks for the screen guides, tied to the screen-instructions spec.
import { describe, expect, test } from 'vitest'
import { GUIDE_SCREENS, guides } from './guides.ts'

const allText = (screen: (typeof GUIDE_SCREENS)[number]) => [...guides.screens[screen].howItWorks, ...guides.screens[screen].about]

describe('guides', () => {
  test('every screen has a guide and no extra screens exist', () => {
    expect(Object.keys(guides.screens).sort()).toEqual([...GUIDE_SCREENS].sort())
    expect(guides.note.trim()).toBeTruthy()
  })

  test.each(GUIDE_SCREENS)('%s guide is complete plain text', (screen) => {
    const { howItWorks, about } = guides.screens[screen]
    expect(howItWorks.length).toBeGreaterThan(0)
    expect(about.length).toBeGreaterThan(0)
    for (const s of [...allText(screen), guides.note]) {
      expect(s.trim(), screen).toBeTruthy()
      // Plain text only: no markup, no Markdown, and nothing about dev-only features.
      expect(s).not.toMatch(/[<>*#`]/)
      expect(s).not.toMatch(/claude/i)
    }
  })

  test('tarot instructions cover spreads, questions, reversals, the answer and sharing', () => {
    const steps = guides.screens.tarot.howItWorks.join(' ')
    for (const phrase of ['Yes / No', 'Three cards', 'question', 'reversed', 'upside down', 'answer', 'Share']) {
      expect(steps).toContain(phrase)
    }
  })

  test('tarot deck explanation covers the arcana and suits', () => {
    const about = guides.screens.tarot.about.join(' ')
    for (const phrase of ['78', '22 Major Arcana', '56 Minor Arcana', 'Wands', 'Cups', 'Swords', 'Pentacles', 'written for this app']) {
      expect(about).toContain(phrase)
    }
  })

  test('oracle guide covers drawing, the card text, Draw again and the deck', () => {
    const steps = guides.screens.oracle.howItWorks.join(' ')
    for (const phrase of ['no question', 'message', 'reflection question', 'affirmation', 'Draw again']) {
      expect(steps).toContain(phrase)
    }
    const about = guides.screens.oracle.about.join(' ')
    for (const phrase of ['48', 'original', 'theme', 'six colour families']) {
      expect(about).toContain(phrase)
    }
  })
})
