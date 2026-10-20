// Private journal of Claude readings, kept in the owner's home directory and
// never in the repository. One JSON line per answer, one file per local day.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { Reading } from '../src/lib/draw.ts'

export type JournalEntry = {
  time: string
  link: string
  spreadId: string
  question: string
  cards: Reading['cards']
  answer: string
  status: 'completed' | 'stopped'
}

export function journalDir(env: Record<string, string | undefined> = process.env): string {
  return env.TAROT_JOURNAL_DIR || path.join(os.homedir(), '.tarot', 'journal')
}

function localDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Returns the file the entry was written to.
export function appendJournal(
  entry: { link: string; reading: Reading; answer: string; status: JournalEntry['status'] },
  options: { dir?: string; now?: Date } = {},
): string {
  const dir = options.dir ?? journalDir()
  const now = options.now ?? new Date()
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
  const file = path.join(dir, `${localDate(now)}.jsonl`)
  const line: JournalEntry = {
    time: now.toISOString(),
    link: entry.link,
    spreadId: entry.reading.spreadId,
    question: entry.reading.question,
    cards: entry.reading.cards,
    answer: entry.answer,
    status: entry.status,
  }
  fs.appendFileSync(file, JSON.stringify(line) + '\n', { mode: 0o600 })
  return file
}
