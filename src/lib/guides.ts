// The "How it works" and "About this deck" text shown on each reading screen.
// No React imports, so Node scripts can read it too.
import guidesEn from '../../data/i18n/en/guides.json' with { type: 'json' }

export type GuideScreen = 'tarot' | 'oracle'
export type ScreenGuideText = { howItWorks: string[]; about: string[] }
export type GuidesData = { note: string; screens: Record<GuideScreen, ScreenGuideText> }

export const GUIDE_SCREENS: GuideScreen[] = ['tarot', 'oracle']
export const guides = guidesEn as GuidesData
