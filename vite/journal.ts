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

// Oracle answers carry a deck key so they can be told apart from tarot entries,
// which keep their original shape.
export type OracleJournalEntry = {
  time: string
  deck: 'animal'
  cardId: string
  question: string
  answer: string
  status: JournalEntry['status']
}

type Options = { dir?: string; now?: Date }

export function journalDir(env: Record<string, string | undefined> = process.env): string {
  return env.TAROT_JOURNAL_DIR || path.join(os.homedir(), '.tarot', 'journal')
}

function localDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Appends one JSON line to the day's file and returns the file's path.
function writeLine(build: (time: string) => JournalEntry | OracleJournalEntry, options: Options): string {
  const dir = options.dir ?? journalDir()
  const now = options.now ?? new Date()
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
  const file = path.join(dir, `${localDate(now)}.jsonl`)
  fs.appendFileSync(file, JSON.stringify(build(now.toISOString())) + '\n', { mode: 0o600 })
  return file
}

// Returns the file the entry was written to.
export function appendJournal(
  entry: { link: string; reading: Reading; answer: string; status: JournalEntry['status'] },
  options: Options = {},
): string {
  return writeLine(
    (time) => ({
      time,
      link: entry.link,
      spreadId: entry.reading.spreadId,
      question: entry.reading.question,
      cards: entry.reading.cards,
      answer: entry.answer,
      status: entry.status,
    }),
    options,
  )
}

// Returns the file the entry was written to.
export function appendOracleJournal(
  entry: { cardId: string; question: string; answer: string; status: JournalEntry['status'] },
  options: Options = {},
): string {
  return writeLine(
    (time) => ({
      time,
      deck: 'animal',
      cardId: entry.cardId,
      question: entry.question,
      answer: entry.answer,
      status: entry.status,
    }),
    options,
  )
}
