// Content checks for the dev-only Lenormand guide (lenormand-readings spec).
import { expect, test } from 'vitest'
import { lenormandGuide } from './lenormand.ts'

test('Lenormand guide is complete plain text', () => {
  expect(lenormandGuide.howItWorks.length).toBeGreaterThan(0)
  expect(lenormandGuide.about.length).toBeGreaterThan(0)
  for (const s of [...lenormandGuide.howItWorks, ...lenormandGuide.about]) {
    expect(s.trim()).toBeTruthy()
    // Plain text only. Unlike the public guides it may name Ask Claude: it is dev-only.
    expect(s).not.toMatch(/[<>*#`]/)
  }
})

test('Lenormand instructions cover the two-card Yes / No, upright cards read together, Ask Claude and no share link', () => {
  const steps = lenormandGuide.howItWorks.join(' ')
  for (const phrase of ['Yes / No draws two cards', 'needs one', 'Three cards', 'always upright', 'read together', 'Ask Claude', "can't be shared"]) {
    expect(steps).toContain(phrase)
  }
})

test('Lenormand deck explanation covers the 36 cards and Marie Anne Lenormand', () => {
  const about = lenormandGuide.about.join(' ')
  for (const phrase of ['36-card', 'Marie Anne Lenormand', 'Parisian', 'like words in a sentence', 'written for this app']) {
    expect(about).toContain(phrase)
  }
})
