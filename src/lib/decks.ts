// The tarot deck, its spreads and the animal oracle, built once from data/ for
// both the app and the dev-only Ask Claude endpoint. No React imports, so Node
// can load it too. The app's screens import tarot-deck.ts or oracle-deck.ts
// directly, so each screen's file holds only its own deck. Lenormand is not
// here on purpose: TarotScreens.tsx builds it behind import.meta.env.DEV, which
// keeps it out of the public bundle.
export * from './tarot-deck.ts'
export * from './oracle-deck.ts'
