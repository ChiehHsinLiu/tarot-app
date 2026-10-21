// Screen addresses: #/ (home), #/tarot, #/oracle, and share links under #/r/.
// No React imports, so it can be tested in Node like share.ts.

export type Route = 'home' | 'tarot' | 'oracle' | 'share'

export const ROUTE_HASH = { home: '#/', tarot: '#/tarot', oracle: '#/oracle' } as const

export function parseRoute(hash: string): Route {
  if (hash.startsWith('#/r/')) return 'share'
  if (hash === ROUTE_HASH.tarot) return 'tarot'
  if (hash === ROUTE_HASH.oracle) return 'oracle'
  // Empty, "#", "#/" and anything unknown show the home page.
  return 'home'
}
