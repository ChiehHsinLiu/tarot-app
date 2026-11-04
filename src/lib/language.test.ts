import { describe, expect, test } from 'vitest'
import { STORAGE_KEY, detectLanguage, initialLanguage, readSavedLanguage, saveLanguage } from './language.ts'

function memoryStore(initial: Record<string, string> = {}) {
  const data = { ...initial }
  return {
    data,
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => {
      data[k] = v
    },
  }
}
const throwing = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
}

describe('detectLanguage', () => {
  test.each(['zh-TW', 'zh-HK', 'zh-MO', 'zh-Hant', 'zh-Hant-TW', 'zh_TW', 'ZH-tw'])('%s is Chinese', (tag) => {
    expect(detectLanguage([tag])).toBe('zh-Hant')
  })

  test.each(['fr-FR', 'en-US', 'zh', 'zh-CN', 'zh-SG', 'zh-Hans', 'zh-Hans-HK', 'ja'])('%s is English', (tag) => {
    expect(detectLanguage([tag])).toBe('en')
  })

  test('only the first preferred language counts', () => {
    expect(detectLanguage(['en-US', 'zh-TW'])).toBe('en')
    expect(detectLanguage(['zh-TW', 'en-US'])).toBe('zh-Hant')
  })

  test('no languages is English', () => {
    expect(detectLanguage([])).toBe('en')
  })
})

describe('remembered choice', () => {
  test('a stored choice wins over the browser', () => {
    expect(initialLanguage(memoryStore({ [STORAGE_KEY]: 'en' }), ['zh-TW'])).toBe('en')
    expect(initialLanguage(memoryStore({ [STORAGE_KEY]: 'zh-Hant' }), ['fr-FR'])).toBe('zh-Hant')
  })

  test('a bad stored value is ignored', () => {
    expect(readSavedLanguage(memoryStore({ [STORAGE_KEY]: 'klingon' }))).toBeNull()
    expect(initialLanguage(memoryStore({ [STORAGE_KEY]: 'klingon' }), ['zh-TW'])).toBe('zh-Hant')
  })

  test('saving stores the id', () => {
    const store = memoryStore()
    saveLanguage(store, 'zh-Hant')
    expect(store.data[STORAGE_KEY]).toBe('zh-Hant')
    expect(readSavedLanguage(store)).toBe('zh-Hant')
  })

  test('storage that throws or is missing falls back to the browser', () => {
    expect(() => saveLanguage(throwing, 'zh-Hant')).not.toThrow()
    expect(readSavedLanguage(throwing)).toBeNull()
    expect(initialLanguage(throwing, ['zh-HK'])).toBe('zh-Hant')
    expect(initialLanguage(undefined, ['fr-FR'])).toBe('en')
  })
})
