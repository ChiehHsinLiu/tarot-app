// The "How it works" and "About this deck" text shown on each reading screen.
// No React imports, so Node scripts can read it too.
import guidesEn from '../../data/i18n/en/guides.json' with { type: 'json' }
import guidesZh from '../../data/i18n/zh-Hant/guides.json' with { type: 'json' }
import type { Language } from './language.ts'

export type GuideScreen = 'tarot' | 'oracle'
export type ScreenGuideText = { howItWorks: string[]; about: string[] }
export type GuidesData = { note: string; screens: Record<GuideScreen, ScreenGuideText> }

export const GUIDE_SCREENS: GuideScreen[] = ['tarot', 'oracle']
export const guides = guidesEn as GuidesData

const GUIDES: Record<Language, GuidesData> = { en: guides, 'zh-Hant': guidesZh }
export const guidesFor = (lang: Language): GuidesData => GUIDES[lang]
