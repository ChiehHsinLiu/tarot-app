import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import type { Reading } from '../src/lib/draw.ts'
import { appendJournal, journalDir } from './journal.ts'
import type { JournalEntry } from './journal.ts'

const reading: Reading = {
  spreadId: 'yes-no',
  question: 'Should I take the new job offer?',
  cards: [{ cardId: 'major-07', positionId: 'answer', reversed: true }],
}
const link = '#/r/v1/yes-no/major-07r?q=Should%20I%20take%20the%20new%20job%20offer%3F'

let tmp: string
beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tarot-journal-'))
})
afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true })
})

const readEntries = (file: string): JournalEntry[] =>
  fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => JSON.parse(l))

describe('appendJournal', () => {
  test('writes completed and stopped entries to one file per local day', () => {
    const dir = path.join(tmp, 'journal')
    const now = new Date(2026, 9, 20, 15, 30)
    const file = appendJournal({ link, reading, answer: 'Full answer.', status: 'completed' }, { dir, now })
    appendJournal({ link, reading, answer: 'Partial', status: 'stopped' }, { dir, now })

    expect(file).toBe(path.join(dir, '2026-10-20.jsonl'))
    const entries = readEntries(file)
    expect(entries).toHaveLength(2)
    expect(entries[0]).toEqual({
      time: now.toISOString(),
      link,
      spreadId: 'yes-no',
      question: 'Should I take the new job offer?',
      cards: reading.cards,
      answer: 'Full answer.',
      status: 'completed',
    })
    expect(entries[1]).toMatchObject({ answer: 'Partial', status: 'stopped' })
  })

  test('creates the directory owner-only and the file owner-read/write', () => {
    const dir = path.join(tmp, 'nested', 'journal')
    const file = appendJournal({ link, reading, answer: 'x', status: 'completed' }, { dir })
    expect(fs.statSync(dir).mode & 0o777).toBe(0o700)
    expect(fs.statSync(file).mode & 0o777).toBe(0o600)
  })

  test('answers with newlines stay on one line per entry', () => {
    const dir = path.join(tmp, 'journal')
    const file = appendJournal({ link, reading, answer: 'Line one.\n\nLine two.', status: 'completed' }, { dir })
    const entries = readEntries(file)
    expect(entries).toHaveLength(1)
    expect(entries[0].answer).toBe('Line one.\n\nLine two.')
  })
})

describe('journalDir', () => {
  test('defaults to ~/.tarot/journal, outside the repository', () => {
    const dir = journalDir({})
    expect(dir).toBe(path.join(os.homedir(), '.tarot', 'journal'))
    const repo = path.resolve(import.meta.dirname, '..')
    expect(path.relative(repo, dir).startsWith('..')).toBe(true)
  })

  test('TAROT_JOURNAL_DIR overrides the default', () => {
    expect(journalDir({ TAROT_JOURNAL_DIR: '/tmp/x' })).toBe('/tmp/x')
  })
})
