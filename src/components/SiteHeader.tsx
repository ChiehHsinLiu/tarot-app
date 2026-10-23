import { useEffect, useRef } from 'react'
import { ROUTE_HASH } from '../lib/route.ts'
import { Flourish } from './Flourish.tsx'

// The full title on home; elsewhere a Home link beside a small title.
export function SiteHeader({ home, focus }: { home: boolean; focus: boolean }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (focus) headingRef.current?.focus()
  }, [focus])

  if (!home) {
    return (
      <header className="site-header compact">
        <a className="home-link" href={ROUTE_HASH.home}>
          <span aria-hidden="true">← </span>Home
        </a>
        <h1>Little Oracle</h1>
      </header>
    )
  }
  return (
    <header className="site-header">
      <div className="site-title">
        <Flourish />
        <h1 ref={headingRef} tabIndex={-1}>
          Little Oracle
        </h1>
        <Flourish mirrored />
      </div>
      <p className="subtitle">tarot &amp; animal cards for today</p>
    </header>
  )
}
