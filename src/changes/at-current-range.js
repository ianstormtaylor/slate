
import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Mix in the changes that just pass through to their at-range equivalents
 * because they don't have any effect on the selection.
 */

const PROXY_TRANSFORMS = [
  'deleteBackward',
  'deleteCharBackward',
  'deleteLineBackward',
  'deleteWordBackward',
  'deleteForward',
  'deleteCharForward',
  'deleteWordForward',
  'deleteLineForward',
  'setBlock',
  'setInline',
  'splitInline',
  'unwrapBlock',
  'unwrapInline',
  'wrapBlock',
  'wrapInline',
]

PROXY_TRANSFORMS.forEach((method) => {
  Changes[method] = (change, ...args) => {
    const { state } = change
    const { selection } = state
    const methodAtRange = `${method}AtRange`
    change[methodAtRange](selection, ...args)
  }
})

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMark = (change, mark) => {
  mark = Mark.create(mark)
  const { state } = change
  const { document, selection } = state

  if (selection.isExpanded) {
    change.addMarkAtRange(selection, mark)
  }

  else if (selection.marks) {
    const marks = selection.marks.add(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  }

  else {
    const marks = document.getActiveMarksAtRange(selection).add(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  }
}

/**
 * Delete at the current selection.
 *
 * @param {Change} change
 */

Changes.delete = (change) => {
  const { state } = change
  const { selection } = state
  change.deleteAtRange(selection)

  // Ensure that the selection is collapsed to the start, because in certain
  // cases when deleting across inline nodes, when splitting the inline node the
  // end point of the selection will end up after the split point.
  change.collapseToStart()
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Block} block
 */

Changes.insertBlock = (change, block) => {
  block = Block.create(block)
  const { state } = change
  const { selection } = state
  change.insertBlockAtRange(selection, block)

  // If the node was successfully inserted, update the selection.
  const node = change.state.document.getNode(block.key)
  if (node) change.collapseToEndOf(node)
}

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Change} change
 * @param {Document} fragment
 */

Changes.insertFragment = (change, fragment) => {
  if (!fragment.nodes.size) return

  let { state } = change
  let { document, selection } = state
  const { startText, endText, startInline } = state
  const lastText = fragment.getLastText()
  const lastInline = fragment.getClosestInline(lastText.key)
  const keys = document.getTexts().map(text => text.key)
  const isAppending = (
    !startInline ||
    selection.hasEdgeAtStartOf(startText) ||
    selection.hasEdgeAtEndOf(endText)
  )

  change.insertFragmentAtRange(selection, fragment)
  state = change.state
  document = state.document

  const newTexts = document.getTexts().filter(n => !keys.includes(n.key))
  const newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first()

  if (newText && lastInline) {
    change.select(selection.collapseToEndOf(newText))
  }

  else if (newText) {
    change.select(selection.collapseToStartOf(newText).move(lastText.text.length))
  }

  else {
    change.select(selection.collapseToStart().move(lastText.text.length))
  }
}

/**
 * Insert an `inline` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Inline} inline
 */

Changes.insertInline = (change, inline) => {
  inline = Inline.create(inline)
  const { state } = change
  const { selection } = state
  change.insertInlineAtRange(selection, inline)

  // If the node was successfully inserted, update the selection.
  const node = change.state.document.getNode(inline.key)
  if (node) change.collapseToEndOf(node)
}

/**
 * Insert a string of `text` with optional `marks` at the current selection.
 *
 * @param {Change} change
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Changes.insertText = (change, text, marks) => {
  const { state } = change
  const { document, selection } = state
  marks = marks || selection.marks
  change.insertTextAtRange(selection, text, marks)

  // If the text was successfully inserted, and the selection had marks on it,
  // unset the selection's marks.
  if (selection.marks && document != change.state.document) {
    change.select({ marks: null })
  }
}

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Change} change
 * @param {Number} depth (optional)
 */

Changes.splitBlock = (change, depth = 1) => {
  const { state } = change
  const { selection } = state
  change
    .splitBlockAtRange(selection, depth)
    .collapseToEnd()
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.removeMark = (change, mark) => {
  mark = Mark.create(mark)
  const { state } = change
  const { document, selection } = state

  if (selection.isExpanded) {
    change.removeMarkAtRange(selection, mark)
  }

  else if (selection.marks) {
    const marks = selection.marks.remove(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  }

  else {
    const marks = document.getActiveMarksAtRange(selection).remove(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  }
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.toggleMark = (change, mark) => {
  mark = Mark.create(mark)
  const { state } = change
  const exists = state.activeMarks.has(mark)

  if (exists) {
    change.removeMark(mark)
  } else {
    change.addMark(mark)
  }
}

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {Change} change
 * @param {String} prefix
 * @param {String} suffix
 */

Changes.wrapText = (change, prefix, suffix = prefix) => {
  const { state } = change
  const { selection } = state
  change.wrapTextAtRange(selection, prefix, suffix)

  // If the selection was collapsed, it will have moved the start offset too.
  if (selection.isCollapsed) {
    change.moveStart(0 - prefix.length)
  }

  // Adding the suffix will have pushed the end of the selection further on, so
  // we need to move it back to account for this.
  change.moveEnd(0 - suffix.length)

  // There's a chance that the selection points moved "through" each other,
  // resulting in a now-incorrect selection direction.
  if (selection.isForward != change.state.selection.isForward) {
    change.flip()
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
