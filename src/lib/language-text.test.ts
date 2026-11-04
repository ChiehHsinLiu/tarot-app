// Covers app-language: Chinese text follows the same rules as English, and the
// words kept in English stay English.
import { describe, expect, test } from 'vitest'
import uiEn from '../../data/i18n/en/ui.json' with { type: 'json' }
import uiZh from '../../data/i18n/zh-Hant/ui.json' with { type: 'json' }
import cardsZhJson from '../../data/i18n/zh-Hant/cards.json' with { type: 'json' }
import spreadsZh from '../../data/i18n/zh-Hant/spreads.json' with { type: 'json' }
import guidesZhJson from '../../data/i18n/zh-Hant/guides.json' with { type: 'json' }
import animalsZhJson from '../../data/i18n/zh-Hant/oracle/animal.json' with { type: 'json' }
import { rawCardText, rawSpreadText } from './deck.ts'
import type { CardText } from './deck.ts'
import { guides } from './guides.ts'
import type { GuidesData } from './guides.ts'
import { rawAnimalText } from './oracle.ts'
import type { OracleCardText } from './oracle.ts'

const cardsZh = cardsZhJson as Record<string, CardText>
const animalsZh = animalsZhJson as Record<string, OracleCardText>
const guidesZh = guidesZhJson as GuidesData

// Characters that exist only in Simplified Chinese; their Traditional forms are
// in brackets. (Shared forms such as 后 in 皇后 or 里 in 里程碑 are not listed.)
const SIMPLIFIED_ONLY = '这[這]们[們]说[說]时[時]会[會]来[來]对[對]为[為]发[發]现[現]开[開]关[關]点[點]头[頭]见[見]问[問]让[讓]还[還]过[過]东[東]车[車]门[門]长[長]书[書]认[認]应[應]爱[愛]觉[覺]动[動]实[實]与[與]业[業]欢[歡]乐[樂]帮[幫]边[邊]从[從]两[兩]样[樣]经[經]给[給]听[聽]写[寫]钱[錢]龙[龍]鸟[鳥]马[馬]鱼[魚]岁[歲]万[萬]际[際]线[線]纪[紀]运[運]战[戰]际[際]轮[輪]义[義]审[審]节[節]恶[惡]隐[隱]恋[戀]权[權]杯[杯]宝[寶]剑[劍]币[幣]骑[騎]国[國]'
  .replace(/\[.\]/g, '')
  .replace('杯', '')
const simplifiedIn = (text: string) => [...text].filter((ch) => SIMPLIFIED_ONLY.includes(ch))

// Every string inside a value, however deeply nested.
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}
const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe('interface text', () => {
  test('Chinese has exactly the English keys, none empty', () => {
    expect(Object.keys(uiZh).sort()).toEqual(Object.keys(uiEn).sort())
    for (const [key, text] of Object.entries(uiZh)) expect(text.trim(), key).not.toBe('')
  })

  test('the same {placeholders} in both languages', () => {
    for (const key of Object.keys(uiEn) as (keyof typeof uiEn)[]) {
      expect(placeholders(uiZh[key]), key).toEqual(placeholders(uiEn[key]))
    }
  })

  test('answer words and everything for Claude stay English', () => {
    for (const key of ['verdict.yes', 'verdict.no', 'verdict.maybe', 'copy.button', 'copy.copied', 'copy.manual', 'copy.fallbackLabel'] as const) {
      expect(uiZh[key], key).toBe(uiEn[key])
    }
  })

  test('everything else is translated', () => {
    const kept = new Set(['verdict.yes', 'verdict.no', 'verdict.maybe', 'copy.button', 'copy.copied', 'copy.manual', 'copy.fallbackLabel'])
    for (const key of Object.keys(uiEn) as (keyof typeof uiEn)[]) {
      if (!kept.has(key)) expect(uiZh[key], key).not.toBe(uiEn[key])
    }
  })
})

describe('tarot text', () => {
  test('one Chinese entry for each card, and no extra', () => {
    expect(Object.keys(cardsZh).sort()).toEqual(Object.keys(rawCardText).sort())
  })

  test.each(Object.keys(rawCardText))('%s: complete and within the limits', (id) => {
    const t = cardsZh[id]
    expect(t.name).toMatch(/\p{Script=Han}/u)
    expect(t.keywords.length).toBeGreaterThan(0)
    for (const k of t.keywords) expect(k.trim()).not.toBe('')
    for (const o of ['upright', 'reversed'] as const) {
      expect(t[o].trim()).not.toBe('')
      expect([...t[o]].length).toBeLessThanOrEqual(400)
      expect(t.yesNoNote[o].trim()).not.toBe('')
      expect([...t.yesNoNote[o]].length).toBeLessThanOrEqual(140)
    }
  })

  test('card names are distinct', () => {
    expect(new Set(Object.values(cardsZh).map((t) => t.name)).size).toBe(78)
  })

  test('spread names and position labels stay English', () => {
    expect(spreadsZh).toEqual(rawSpreadText)
  })
})

describe('guides', () => {
  test('the same screens, steps and paragraphs as English, all translated', () => {
    expect(Object.keys(guidesZh.screens).sort()).toEqual(Object.keys(guides.screens).sort())
    for (const screen of Object.keys(guides.screens) as (keyof GuidesData['screens'])[]) {
      expect(guidesZh.screens[screen].howItWorks.length, screen).toBe(guides.screens[screen].howItWorks.length)
      expect(guidesZh.screens[screen].about.length, screen).toBe(guides.screens[screen].about.length)
    }
    for (const text of strings(guidesZh)) expect(text).toMatch(/\p{Script=Han}/u)
  })
})

describe('oracle text', () => {
  test('one Chinese entry for each animal, and no extra', () => {
    expect(Object.keys(animalsZh).sort()).toEqual(Object.keys(rawAnimalText).sort())
  })

  test.each(Object.keys(rawAnimalText))('%s: every field filled in', (id) => {
    const t = animalsZh[id]
    for (const field of ['animal', 'theme', 'message', 'reflection', 'affirmation'] as const) {
      expect(t[field], field).toMatch(/\p{Script=Han}/u)
    }
    expect(t.keywords.length).toBeGreaterThan(0)
  })

  test('animal names are distinct', () => {
    expect(new Set(Object.values(animalsZh).map((t) => t.animal)).size).toBe(48)
  })

  test('the guide names the dachshund card as it is written', () => {
    const d = animalsZh['animal-01']
    expect(guidesZh.screens.oracle.about.join('')).toContain(`${d.animal} · ${d.theme}`)
  })
})

test('all Chinese text is Traditional', () => {
  const all = strings([uiZh, cardsZh, guidesZh, animalsZh])
  const found = all.flatMap(simplifiedIn)
  expect(found).toEqual([])
})
