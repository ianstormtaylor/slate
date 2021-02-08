import { Path } from 'slate'

/**
 * Returns the number of characters that are the same at the beginning of the
 * String.
 *
 * @param {String} prev
 * @param {String} next
 */

function getDiffStart(prev: string, next: string): number | null {
  const length = Math.min(prev.length, next.length)

  for (let i = 0; i < length; i++) {
    if (prev.charAt(i) !== next.charAt(i)) return i
  }

  if (prev.length !== next.length) return length
  return null
}

/**
 * Returns the number of characters that are the same at the end of the String
 * up to `max`. Max prevents double-counting characters when there are
 * multiple duplicate characters around the diff area.
 *
 * @param {String} prev
 * @param {String} next
 * @param {Number} max
 */

function getDiffEnd(prev: string, next: string, max: number): number | null {
  const prevLength = prev.length
  const nextLength = next.length
  const length = Math.min(prevLength, nextLength, max)

  for (let i = 0; i < length; i++) {
    const prevChar = prev.charAt(prevLength - i - 1)
    const nextChar = next.charAt(nextLength - i - 1)
    if (prevChar !== nextChar) return i
  }

  if (prev.length !== next.length) return length
  return null
}

type Offsets = {
  start: number
  end: number
}

/**
 * Takes two strings and returns an object representing two offsets. The
 * first, `start` represents the number of characters that are the same at
 * the front of the String. The `end` represents the number of characters
 * that are the same at the end of the String.
 *
 * Returns null if they are identical.
 *
 * @param {String} prev
 * @param {String} next
 */

function getDiffOffsets(prev: string, next: string): Offsets | null {
  if (prev === next) return null
  const start = getDiffStart(prev, next)
  if (start === null) return null
  const maxEnd = Math.min(prev.length - start, next.length - start)
  const end = getDiffEnd(prev, next, maxEnd)!
  if (end === null) return null
  return { start, end }
}

/**
 * Takes a text string and returns a slice from the string at the given offses
 *
 * @param {String} text
 * @param {Object} offsets
 */

function sliceText(text: string, offsets: Offsets): string {
  return text.slice(offsets.start, text.length - offsets.end)
}

export type Diff = {
  start: number
  end: number
  insertText: string
  removeText: string
}

/**
 * Takes two strings and returns a smart diff that can be used to describe the
 * change in a way that can be used as operations like inserting, removing or
 * replacing text.
 *
 * @param {String} prev
 * @param {String} next
 */

export function diffText(prev: string, next: string): Diff | null {
  const offsets = getDiffOffsets(prev, next)
  if (offsets == null) return null
  const insertText = sliceText(next, offsets)
  const removeText = sliceText(prev, offsets)
  return {
    start: offsets.start,
    end: prev.length - offsets.end,
    insertText,
    removeText,
  }
}

export interface InsertedText {
  text: Diff
  path: Path
}

export function getInsertedText(insertedText: InsertedText[]): string {
  return insertedText.reduce((acc, { text }) => `${acc}${text.insertText}`, '')
}
