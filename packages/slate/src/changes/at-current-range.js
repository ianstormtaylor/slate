import logger from '@gitbook/slate-dev-logger'
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
 * Mix in the changes that pass through to their at-range equivalents because
 * they don't have any effect on the selection.
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
  'setBlocks',
  'setInlines',
  'splitInline',
  'unwrapBlock',
  'unwrapInline',
  'wrapBlock',
  'wrapInline',
]

PROXY_TRANSFORMS.forEach(method => {
  Changes[method] = (change, ...args) => {
    const { value } = change
    const { selection } = value
    const methodAtRange = `${method}AtRange`
    change[methodAtRange](selection, ...args)

    if (method.match(/Backward$/)) {
      change.collapseToStart()
    } else if (method.match(/Forward$/)) {
      change.collapseToEnd()
    }
  }
})

Changes.setBlock = (...args) => {
  logger.deprecate(
    'slate@0.33.0',
    'The `setBlock` method of Slate changes has been renamed to `setBlocks`.'
  )

  Changes.setBlocks(...args)
}

Changes.setInline = (...args) => {
  logger.deprecate(
    'slate@0.33.0',
    'The `setInline` method of Slate changes has been renamed to `setInlines`.'
  )

  Changes.setInlines(...args)
}

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMark = (change, mark) => {
  mark = Mark.create(mark)
  const { value } = change
  const { document, selection } = value

  if (selection.isExpanded) {
    change.addMarkAtRange(selection, mark)
  } else if (selection.marks) {
    const marks = selection.marks.add(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  } else {
    const marks = document.getActiveMarksAtRange(selection).add(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  }
}

/**
 * Add a list of `marks` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMarks = (change, marks) => {
  marks.forEach(mark => change.addMark(mark))
}

/**
 * Delete at the current selection.
 *
 * @param {Change} change
 */

Changes.delete = change => {
  const { value } = change
  const { selection } = value
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
  const { value } = change
  const { selection } = value
  change.insertBlockAtRange(selection, block)

  // If the node was successfully inserted, update the selection.
  const node = change.value.document.getNode(block.key)
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

  let { value } = change
  let { document, selection } = value
  const { startText, endText, startInline } = value
  const lastText = fragment.getLastText()
  const lastInline = fragment.getClosestInline(lastText.key)
  const firstChild = fragment.nodes.first()
  const lastChild = fragment.nodes.last()
  const keys = document.getTexts().map(text => text.key)
  const isAppending =
    !startInline ||
    selection.hasEdgeAtStartOf(startText) ||
    selection.hasEdgeAtEndOf(endText)

  const isInserting =
    fragment.hasBlocks(firstChild.key) || fragment.hasBlocks(lastChild.key)

  change.insertFragmentAtRange(selection, fragment)
  value = change.value
  document = value.document

  const newTexts = document.getTexts().filter(n => !keys.includes(n.key))
  const newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first()

  if (newText && (lastInline || isInserting)) {
    change.select(selection.collapseToEndOf(newText))
  } else if (newText) {
    change.select(
      selection.collapseToStartOf(newText).move(lastText.text.length)
    )
  } else {
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
  const { value } = change
  const { selection } = value
  change.insertInlineAtRange(selection, inline)

  // If the node was successfully inserted, update the selection.
  const node = change.value.document.getNode(inline.key)
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
  const { value } = change
  const { document, selection } = value
  marks = marks || selection.marks || document.getInsertMarksAtRange(selection)
  change.insertTextAtRange(selection, text, marks)

  // If the text was successfully inserted, and the selection had marks on it,
  // unset the selection's marks.
  if (selection.marks && document != change.value.document) {
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
  const { value } = change
  const { selection, document } = value
  const marks = selection.marks || document.getInsertMarksAtRange(selection)
  change.splitBlockAtRange(selection, depth).collapseToEnd()

  if (marks && marks.size !== 0) {
    change.select({ marks })
  }
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.removeMark = (change, mark) => {
  mark = Mark.create(mark)
  const { value } = change
  const { document, selection } = value

  if (selection.isExpanded) {
    change.removeMarkAtRange(selection, mark)
  } else if (selection.marks) {
    const marks = selection.marks.remove(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  } else {
    const marks = document.getActiveMarksAtRange(selection).remove(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
  }
}

/**
 * Replace an `oldMark` with a `newMark` in the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} oldMark
 * @param {Mark} newMark
 */

Changes.replaceMark = (change, oldMark, newMark) => {
  change.removeMark(oldMark)
  change.addMark(newMark)
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
  const { value } = change
  const exists = value.activeMarks.has(mark)

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
  const { value } = change
  const { selection } = value
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
  if (selection.isForward != change.value.selection.isForward) {
    change.flip()
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
