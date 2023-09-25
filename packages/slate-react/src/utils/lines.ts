/**
 * Utilities for single-line deletion
 */

import { Editor, Range } from 'slate'
import { ReactEditor } from '../plugin/react-editor'

const doRectsIntersect = (rect: DOMRect, compareRect: DOMRect) => {
  const middle = (compareRect.top + compareRect.bottom) / 2

  return rect.top <= middle && rect.bottom >= middle
}

const areRangesSameLine = (
  editor: ReactEditor,
  range1: Range,
  range2: Range
) => {
  const rect1 = ReactEditor.toDOMRange(editor, range1)?.getBoundingClientRect()
  if (!rect1) return false

  const rect2 = ReactEditor.toDOMRange(editor, range2)?.getBoundingClientRect()
  if (!rect2) return false

  return doRectsIntersect(rect1, rect2) && doRectsIntersect(rect2, rect1)
}

/**
 * A helper utility that returns the end portion of a `Range`
 * which is located on a single line.
 *
 * @param {Editor} editor The editor object to compare against
 * @param {Range} parentRange The parent range to compare against
 * @returns {Range} A valid portion of the parentRange which is one a single line
 */
export const findCurrentLineRange = (
  editor: ReactEditor,
  parentRange: Range
): Range | undefined => {
  const parentRangeBoundary = Editor.range(editor, Range.end(parentRange))
  if (!parentRangeBoundary) return

  const positions = Array.from(Editor.positions(editor, { at: parentRange }))

  let left = 0
  let right = positions.length
  let middle = Math.floor(right / 2)

  const leftRange = Editor.range(editor, positions[left])
  if (!leftRange) return

  if (areRangesSameLine(editor, leftRange, parentRangeBoundary)) {
    return Editor.range(editor, positions[left], parentRangeBoundary)
  }

  if (positions.length < 2) {
    return Editor.range(
      editor,
      positions[positions.length - 1],
      parentRangeBoundary
    )
  }

  while (middle !== positions.length && middle !== left) {
    const middleRange = Editor.range(editor, positions[middle])
    if (!middleRange) return

    if (areRangesSameLine(editor, middleRange, parentRangeBoundary)) {
      right = middle
    } else {
      left = middle
    }

    middle = Math.floor((left + right) / 2)
  }

  return Editor.range(editor, positions[right], parentRangeBoundary)
}
