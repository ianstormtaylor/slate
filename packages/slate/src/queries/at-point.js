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
 * Get the active marks of the current selection.
 *
 * @param {Editor} editor
 * @return {Set<Mark>}
 */

Queries.getActiveMarks = editor => {
  const { document, selection } = editor.value
  return selection.isUnset
    ? new Set()
    : selection.marks || editor.getActiveMarksAtRange(selection, document)
}

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
  range = editor.getInsertRange(range, node)

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
 * Get the fragment of the current selection.
 *
 * @param {Editor} editor
 * @return {Document}
 */

Queries.getFragment = editor => {
  const { document, selection } = editor.value
  return selection.isUnset
    ? Document.create()
    : editor.getFragmentAtRange(selection, document)
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
  range = editor.getInsertRange(range, node)

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
 * Get a set of marks that would occur on the next insert at a `point` in the
 * node. This mimics expected rich text editing behaviors of mark contiuation.
 *
 * @param {Editor} editor
 * @param {Point} point
 * @param {Node} node
 * @return {Set<Mark>}
 */

Queries.getInsertMarksAtPoint = (editor, point, node) => {
  point = editor.getInsertPoint(point, node)
  const { path, offset } = point
  const text = node.getDescendant(path)

  // PERF: we can exit early if the offset isn't at the start of the node.
  if (offset !== 0) {
    return text.marks
  }

  let blockNode
  let blockPath

  for (const entry of node.ancestors(path)) {
    const [n, p] = entry

    if (n.object === 'block') {
      blockNode = n
      blockPath = p
    }
  }

  const relativePath = PathUtils.drop(path, blockPath.size)
  const [previous] = blockNode.texts({
    path: relativePath,
    direction: 'backward',
  })

  // If there's no previous text, we're at the start of the block, so use
  // the current text nodes marks.
  if (!previous) {
    return text.marks
  }

  // Otherwise, continue with the previous text node's marks instead.
  const [previousText] = previous
  return previousText.marks
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
  range = editor.getInsertRange(range, node)
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
 * Returns the point closest to a point, under a node, where text can
 * be inserted. When the point is ambiguous (for example, in between
 * two nodes), it will be normalized to the beginning of the following
 * node.
 *
 * @param {Editor} editor
 * @param {Point} point
 * @param {Node} node
 * @return {Point}
 */

Queries.getInsertPoint = (editor, point, node) => {
  let resolvedPoint = point.resolveToTextNode(node)
  if (resolvedPoint.path == null) return resolvedPoint

  let closestInline = node.getClosestInline(resolvedPoint.path)
  let resolvedNode = node.getNode(resolvedPoint.path)

  // COMPAT: There is an ambiguity, since a point can exist at the end of a
  // text node, or at the start of the following one. To eliminate it we
  // enforce that if there is a following text node, we always move it there.
  while (
    resolvedPoint.offset === resolvedNode.text.length &&
    (!closestInline || !editor.isVoid(closestInline))
  ) {
    const block = node.getClosestBlock(resolvedPoint.path)
    const depth = node.getDepth(block.key)
    const relativePath = PathUtils.drop(resolvedPoint.path, depth)
    const [next] = block.texts({ path: relativePath })

    if (!next) break

    const [nextText, nextPath] = next
    const absolutePath = resolvedPoint.path.slice(0, depth).concat(nextPath)
    closestInline = node.getClosestInline(absolutePath)

    // If we would move the cursor into a void node, leave it
    // alone. Otherwise, it becomes impossible to navigate left
    // across voids, since the cursor will always move back into
    // the void.
    if (closestInline && editor.isVoid(closestInline)) break

    resolvedNode = node.getNode(absolutePath)

    resolvedPoint = resolvedPoint.merge({
      key: nextText.key,
      path: absolutePath,
      offset: 0,
    })
  }

  return resolvedPoint
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

/**
 * Get the marks of the current selection.
 *
 * @param {Editor} editor
 * @return {Set<Mark>}
 */

Queries.getMarks = editor => {
  const { document, selection } = editor.value
  return selection.isUnset
    ? new Set()
    : selection.marks || document.getMarksAtRange(selection, editor)
}

export default Queries
