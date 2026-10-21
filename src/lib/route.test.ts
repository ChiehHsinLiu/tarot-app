import { describe, expect, test } from 'vitest'
import { parseRoute } from './route.ts'

describe('parseRoute', () => {
  test.each(['', '#', '#/'])('%j is home', (hash) => {
    expect(parseRoute(hash)).toBe('home')
  })

  test('screen addresses', () => {
    expect(parseRoute('#/tarot')).toBe('tarot')
    expect(parseRoute('#/oracle')).toBe('oracle')
  })

  test('share links, valid or not, are share', () => {
    expect(parseRoute('#/r/v1/yes-no/major-01')).toBe('share')
    expect(parseRoute('#/r/v1/three-card/swords-03.major-13r.cups-01?q=Hi')).toBe('share')
    expect(parseRoute('#/r/v2/x')).toBe('share')
  })

  test.each(['#/nowhere', '#/tarotx', '#/oracle/extra', '#tarot', '#/r'])('unknown %j is home', (hash) => {
    expect(parseRoute(hash)).toBe('home')
  })
})
