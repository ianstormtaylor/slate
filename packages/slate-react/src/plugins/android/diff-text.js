/**
 * Returns the number of characters that are the same at the beginning of the
 * String.
 *
 * @param {String} prev
 * @param {String} next
 */

function getDiffStart(prev, next) {
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

function getDiffEnd(prev, next, max) {
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

function getDiffOffsets(prev, next) {
  if (prev === next) return null
  const start = getDiffStart(prev, next)
  const maxEnd = Math.min(prev.length - start, next.length - start)
  const end = getDiffEnd(prev, next, maxEnd)
  return { start, end, total: start + end }
}

/**
 * Takes a text string and returns a slice from the string at the given offses
 *
 * @param {String} text
 * @param {Object} offsets
 */

function sliceText(text, offsets) {
  return text.slice(offsets.start, text.length - offsets.end)
}

/**
 * Takes two strings and returns a smart diff that can be used to describe the
 * change in a way that can be used as operations like inserting, removing or
 * replacing text.
 *
 * @param {String} prev
 * @param {String} next
 */

export default function diff(prev, next) {
  const offsets = getDiffOffsets(prev, next)
  if (offsets == null) return null
  const insertText = sliceText(next, offsets)
  const removeText = sliceText(prev, offsets)
  return {
    start: offsets.start,
    end: prev.length - offsets.end,
    cursor: offsets.start + insertText.length,
    insertText,
    removeText,
  }
}
