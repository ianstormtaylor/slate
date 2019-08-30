import { Set } from 'immutable'

import Document from '../models/document'
import PathUtils from '../utils/path-utils'

/**
 * Queries.
 *
 * @type {Object}
 */

const Queries = {}

/**
 * Get a set of the active marks in a `range`. Active marks are marks that are
 * on every text node in a given range. This is a common distinction for
 * highlighting toolbar buttons for example.
 *
 * TODO: this method needs to be cleaned up, it's very hard to follow and
 * probably doing unnecessary work.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Node} node
 * @return {Set<Mark>}
 */

Queries.getActiveMarksAtRange = (editor, range, node) => {
  if (range.isUnset) {
    return Set()
  }

  if (range.isCollapsed) {
    const { start } = range
    return editor.getInsertMarksAtPoint(start, node)
  }

  const { start, end } = range
  let startPath = start.path
  let startOffset = start.offset
  let endPath = end.path
  let endOffset = end.offset
  let startText = node.getDescendant(startPath)
  let endText = node.getDescendant(endPath)

  if (!startPath.equals(endPath)) {
    while (!startPath.equals(endPath) && endOffset === 0) {
      ;[[endText, endPath]] = node.texts({
        path: endPath,
        direction: 'backward',
      })

      endOffset = endText.text.length
    }

    while (
      !startPath.equals(endPath) &&
      startOffset === startText.text.length
    ) {
      ;[[startText, startPath]] = node.texts({ path: startPath })
      startOffset = 0
    }
  }

  if (startPath.equals(endPath)) {
    return startText.marks
  }

  const startMarks = startText.marks

  // PERF: if start marks is empty we can return early.
  if (startMarks.size === 0) {
    return Set()
  }

  const endMarks = endText.marks
  let marks = startMarks.intersect(endMarks)

  // If marks is already empty, the active marks is empty
  if (marks.size === 0) {
    return marks
  }

  ;[[startText, startPath]] = node.texts({ path: startPath })

  while (!startPath.equals(endPath)) {
    if (startText.text.length !== 0) {
      marks = marks.intersect(startText.marks)

      if (marks.size === 0) {
        return Set()
      }
    }

    ;[[startText, startPath]] = node.texts({ path: startPath })
  }

  return marks
}

/**
 * Get a fragment of the node at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Range} node
 * @return {Document}
 */

Queries.getFragmentAtRange = (editor, range, node) => {
  if (range.isUnset) {
    return Document.create()
  }

  const { start, end } = range
  let targetPath = end.path
  let targetPosition = end.offset
  let side = 'end'

  while (targetPath.size) {
    const index = targetPath.last()
    node = node.splitNode(targetPath, targetPosition)
    targetPosition = index + 1
    targetPath = PathUtils.lift(targetPath)

    if (!targetPath.size && side === 'end') {
      targetPath = start.path
      targetPosition = start.offset
      side = 'start'
    }
  }

  const startIndex = start.path.first() + 1
  const endIndex = end.path.first() + 2
  const nodes = node.nodes.slice(startIndex, endIndex)
  const fragment = Document.create({ nodes })
  return fragment
}

/**
 * Get a set of marks that would occur on the next insert at a `range`.
 * This mimics expected rich text editing behaviors of mark contiuation.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Node} node
 * @return {Set<Mark>}
 */

Queries.getInsertMarksAtRange = (editor, range, node) => {
  const { start } = range

  if (range.isUnset) {
    return Set()
  }

  if (range.isCollapsed) {
    return editor.getInsertMarksAtPoint(start, node)
  }

  const text = node.getDescendant(start.path)
  return text.marks
}

/**
 * Resolve a `range`, relative to the node, ensuring that the keys and
 * offsets in the range exist and that they are synced with the paths.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Node} node
 * @return {Range}
 */

Queries.getInsertRange = (editor, range, node) => {
  return range.updatePoints(point => editor.getInsertPoint(point, node))
}

export default Queries
