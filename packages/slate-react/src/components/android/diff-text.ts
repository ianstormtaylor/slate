/**
 * Returns the number of characters that are the same at the beginning of the
 * String.
 *
 * @param {String} prev  the previous text
 * @param {String} next  the next text
 * @returns {Number | null} the offset of the start of the difference; null if there is no difference
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
 * @param {String} prev  the previous text
 * @param {String} next  the next text
 * @param {Number} max  the max length to test.
 * @returns {Number} number of characters that are the same at the end of the string
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

type TextRange = {
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
 * @param {String} prev  the previous text
 * @param {String} next  the next text
 * @returns {TextRange | null} the difference text range; null if there are no differences.
 */
function getDiffOffsets(prev: string, next: string): TextRange | null {
  if (prev === next) return null
  const start = getDiffStart(prev, next)
  if (start === null) return null
  const maxEnd = Math.min(prev.length - start, next.length - start)
  const end = getDiffEnd(prev, next, maxEnd)!
  if (end === null) return null
  return { start, end }
}

/**
 * Takes a text string and returns a slice from the string at the given text range
 *
 * @param {String} text  the text
 * @param {Object} offsets  the text range
 * @returns {String} the text slice at text range
 */
function sliceText(text: string, offsets: TextRange): string {
  return text.slice(offsets.start, text.length - offsets.end)
}

/**
 * Takes two strings and returns a smart diff that can be used to describe the
 * change in a way that can be used as operations like inserting, removing or
 * replacing text.
 *
 * @param {String | undefined} prev the previous text
 * @param {String | undefined} next the next text
 * @returns {Diff | null} the text difference
 */
export function diffText(prev?: string, next?: string): Diff | null {
  if (prev === undefined || next === undefined) return null
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

export type Diff = {
  start: number
  end: number
  insertText: string
  removeText: string
}
