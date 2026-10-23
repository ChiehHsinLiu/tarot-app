// Content Security Policy for the published site. GitHub Pages can't send
// headers, so it goes into the built index.html as a meta tag. Build only: the
// dev server needs inline scripts for hot reload.
import type { Plugin } from 'vite'

// Everything from the site itself; images may also be data: URLs (the favicon).
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
].join('; ')

// First in <head>, so the policy covers every resource the page loads.
export function addPolicy(html: string): string {
  return html.replace(
    /<head>/,
    `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`,
  )
}

export function contentSecurityPolicy(): Plugin {
  return {
    name: 'tarot-content-security-policy',
    apply: 'build',
    transformIndexHtml: addPolicy,
  }
}
