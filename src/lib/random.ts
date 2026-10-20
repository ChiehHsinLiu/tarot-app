// Returns a uniformly distributed integer in [0, maxExclusive).
export type RandomInt = (maxExclusive: number) => number

const UINT32_RANGE = 2 ** 32

// Crypto-backed source. Rejection sampling discards values from the incomplete
// top bucket so every result is equally likely (no modulo bias).
export const cryptoRandomInt: RandomInt = (maxExclusive) => {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
    throw new RangeError(`maxExclusive must be an integer in [1, 2^32], got ${maxExclusive}`)
  }
  const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive)
  const buf = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    if (buf[0] < limit) return buf[0] % maxExclusive
  }
}

// Deterministic source for tests (mulberry32). Not for real draws.
export function seededRandomInt(seed: number): RandomInt {
  let state = seed >>> 0
  return (maxExclusive) => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    const value = ((t ^ (t >>> 14)) >>> 0) / UINT32_RANGE
    return Math.floor(value * maxExclusive)
  }
}
