import { Editor, Path, Range, Text } from 'slate'

import { ReactEditor } from '../../'
import { DOMNode } from '../../utils/dom'

export type Diff = {
  start: number
  end: number
  insertText: string
  removeText: string
}

export interface TextInsertion {
  text: Diff
  path: Path
}

type TextRange = {
  start: number
  end: number
}

/**
 * Returns the number of characters that are the same at the beginning of the
 * String.
 *
 * @param prev  the previous text
 * @param next  the next text
 * @returns the offset of the start of the difference; null if there is no difference
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
 * @param prev  the previous text
 * @param next  the next text
 * @param max  the max length to test.
 * @returns number of characters that are the same at the end of the string
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

/**
 * Takes two strings and returns an object representing two offsets. The
 * first, `start` represents the number of characters that are the same at
 * the front of the String. The `end` represents the number of characters
 * that are the same at the end of the String.
 *
 * Returns null if they are identical.
 *
 * @param prev  the previous text
 * @param next  the next text
 * @returns the difference text range; null if there are no differences.
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
 * @param text  the text
 * @param offsets  the text range
 * @returns the text slice at text range
 */
function sliceText(text: string, offsets: TextRange): string {
  return text.slice(offsets.start, text.length - offsets.end)
}

/**
 * Takes two strings and returns a smart diff that can be used to describe the
 * change in a way that can be used as operations like inserting, removing or
 * replacing text.
 *
 * @param prev the previous text
 * @param next the next text
 * @returns the text difference
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

export function combineInsertedText(insertedText: TextInsertion[]): string {
  return insertedText.reduce((acc, { text }) => `${acc}${text.insertText}`, '')
}

export function getTextInsertion<T extends Editor>(
  editor: T,
  domNode: DOMNode
): TextInsertion | undefined {
  const node = ReactEditor.toSlateNode(editor, domNode)

  if (!Text.isText(node)) {
    return undefined
  }

  const prevText = node.text
  let nextText = domNode.textContent!

  // textContent will pad an extra \n when the textContent ends with an \n
  if (nextText.endsWith('\n')) {
    nextText = nextText.slice(0, nextText.length - 1)
  }

  // If the text is no different, there is no diff.
  if (nextText !== prevText) {
    const textDiff = diffText(prevText, nextText)
    if (textDiff !== null) {
      const textPath = ReactEditor.findPath(editor, node)

      return {
        text: textDiff,
        path: textPath,
      }
    }
  }

  return undefined
}

export function normalizeTextInsertionRange(
  editor: Editor,
  range: Range | null,
  { path, text }: TextInsertion
) {
  const insertionRange = {
    anchor: { path, offset: text.start },
    focus: { path, offset: text.end },
  }

  if (!range || !Range.isCollapsed(range)) {
    return insertionRange
  }

  const { insertText, removeText } = text
  const isSingleCharacterInsertion =
    insertText.length === 1 || removeText.length === 1

  /**
   * This code handles edge cases that arise from text diffing when the
   * inserted or removed character is a single character, and the character
   * right before or after the anchor is the same as the one being inserted or
   * removed.
   *
   * Take this example: hello|o
   *
   * If another `o` is inserted at the selection's anchor in the example above,
   * it should be inserted at the anchor, but using text diffing, we actually
   * detect that the character was inserted after the second `o`:
   *
   * helloo[o]|
   *
   * Instead, in these very specific edge cases, we assume that the character
   * needs to be inserted after the anchor rather than where the diff was found:
   *
   * hello[o]|o
   */
  if (isSingleCharacterInsertion && Path.equals(range.anchor.path, path)) {
    const [text] = Array.from(
      Editor.nodes(editor, { at: range, match: Text.isText })
    )

    if (text) {
      const [node] = text
      const { anchor } = range
      const characterBeforeAnchor = node.text[anchor.offset - 1]
      const characterAfterAnchor = node.text[anchor.offset]

      if (insertText.length === 1 && insertText === characterAfterAnchor) {
        // Assume text should be inserted at the anchor
        return range
      }

      if (removeText.length === 1 && removeText === characterBeforeAnchor) {
        // Assume text should be removed right before the anchor
        return {
          anchor: { path, offset: anchor.offset - 1 },
          focus: { path, offset: anchor.offset },
        }
      }
    }
  }

  return insertionRange
}
