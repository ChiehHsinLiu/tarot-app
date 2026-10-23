import fs from 'node:fs'
import { expect, test } from 'vitest'
import { CONTENT_SECURITY_POLICY, addPolicy, contentSecurityPolicy } from './csp.ts'

test('the policy allows only the site itself, plus data: images', () => {
  expect(CONTENT_SECURITY_POLICY.split('; ')).toEqual([
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
  ])
})

test('the plugin runs on build only', () => {
  expect(contentSecurityPolicy().apply).toBe('build')
})

test('the meta tag comes first in <head>, before any script', () => {
  const page = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const html = addPolicy(page)
  const meta = html.indexOf('http-equiv="Content-Security-Policy"')
  expect(meta).toBeGreaterThan(html.indexOf('<head>'))
  expect(meta).toBeLessThan(html.indexOf('<script'))
  expect(html).toContain(`content="${CONTENT_SECURITY_POLICY}"`)
  expect(html.match(/Content-Security-Policy/g)).toHaveLength(1)
})
