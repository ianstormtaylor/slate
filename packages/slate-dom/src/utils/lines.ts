/**
 * Utilities for single-line deletion
 */

import { Editor, Range } from 'slate'
import { DOMEditor } from '../plugin/dom-editor'

const doRectsIntersect = (rect: DOMRect, compareRect: DOMRect) => {
  const middle = (compareRect.top + compareRect.bottom) / 2

  return rect.top <= middle && rect.bottom >= middle
}

const areRangesSameLine = (editor: DOMEditor, range1: Range, range2: Range) => {
  const rect1 = DOMEditor.toDOMRange(editor, range1).getBoundingClientRect()
  const rect2 = DOMEditor.toDOMRange(editor, range2).getBoundingClientRect()

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
  editor: DOMEditor,
  parentRange: Range
): Range => {
  const parentRangeBoundary = Editor.range(editor, Range.end(parentRange))
  const positions = Array.from(Editor.positions(editor, { at: parentRange }))

  let left = 0
  let right = positions.length
  let middle = Math.floor(right / 2)

  if (
    areRangesSameLine(
      editor,
      Editor.range(editor, positions[left]),
      parentRangeBoundary
    )
  ) {
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
    if (
      areRangesSameLine(
        editor,
        Editor.range(editor, positions[middle]),
        parentRangeBoundary
      )
    ) {
      right = middle
    } else {
      left = middle
    }

    middle = Math.floor((left + right) / 2)
  }

  return Editor.range(editor, positions[right], parentRangeBoundary)
}
