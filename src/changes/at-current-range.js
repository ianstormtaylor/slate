
import Normalize from '../utils/normalize'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMark = (change, mark) => {
  mark = Normalize.mark(mark)

  const { state } = change
  const { document, selection } = state

  if (selection.isExpanded) {
    change.addMarkAtRange(selection, mark)
    return
  }

  if (selection.marks) {
    const marks = selection.marks.add(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
    return
  }

  const marks = document.getActiveMarksAtRange(selection).add(mark)
  const sel = selection.set('marks', marks)
  change.select(sel)
}

/**
 * Delete at the current selection.
 *
 * @param {Change} change
 */

Changes.delete = (change) => {
  const { state } = change
  const { selection } = state
  if (selection.isCollapsed) return

  change
    .deleteAtRange(selection)
    // Ensure that the selection is collapsed to the start, because in certain
    // cases when deleting across inline nodes this isn't guaranteed.
    .collapseToStart()
}

/**
 * Delete backward `n` characters at the current selection.
 *
 * @param {Change} change
 * @param {Number} n (optional)
 */

Changes.deleteBackward = (change, n = 1) => {
  const { state } = change
  const { selection } = state
  change.deleteBackwardAtRange(selection, n)
}

/**
 * Delete backward until the character boundary at the current selection.
 *
 * @param {Change} change
 */

Changes.deleteCharBackward = (change) => {
  const { state } = change
  const { selection } = state
  change.deleteCharBackwardAtRange(selection)
}

/**
 * Delete backward until the line boundary at the current selection.
 *
 * @param {Change} change
 */

Changes.deleteLineBackward = (change) => {
  const { state } = change
  const { selection } = state
  change.deleteLineBackwardAtRange(selection)
}

/**
 * Delete backward until the word boundary at the current selection.
 *
 * @param {Change} change
 */

Changes.deleteWordBackward = (change) => {
  const { state } = change
  const { selection } = state
  change.deleteWordBackwardAtRange(selection)
}

/**
 * Delete forward `n` characters at the current selection.
 *
 * @param {Change} change
 * @param {Number} n (optional)
 */

Changes.deleteForward = (change, n = 1) => {
  const { state } = change
  const { selection } = state
  change.deleteForwardAtRange(selection, n)
}

/**
 * Delete forward until the character boundary at the current selection.
 *
 * @param {Change} change
 */

Changes.deleteCharForward = (change) => {
  const { state } = change
  const { selection } = state
  change.deleteCharForwardAtRange(selection)
}

/**
 * Delete forward until the line boundary at the current selection.
 *
 * @param {Change} change
 */

Changes.deleteLineForward = (change) => {
  const { state } = change
  const { selection } = state
  change.deleteLineForwardAtRange(selection)
}

/**
 * Delete forward until the word boundary at the current selection.
 *
 * @param {Change} change
 */

Changes.deleteWordForward = (change) => {
  const { state } = change
  const { selection } = state
  change.deleteWordForwardAtRange(selection)
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Block} block
 */

Changes.insertBlock = (change, block) => {
  block = Normalize.block(block)
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
  let { state } = change
  let { document, selection } = state

  if (!fragment.nodes.size) return

  const { startText, endText } = state
  const lastText = fragment.getLastText()
  const lastInline = fragment.getClosestInline(lastText.key)
  const keys = document.getTexts().map(text => text.key)
  const isAppending = (
    selection.hasEdgeAtEndOf(endText) ||
    selection.hasEdgeAtStartOf(startText)
  )

  change.insertFragmentAtRange(selection, fragment)
  state = change.state
  document = state.document

  const newTexts = document.getTexts().filter(n => !keys.includes(n.key))
  const newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first()
  let after

  if (newText && lastInline) {
    after = selection.collapseToEndOf(newText)
  }

  else if (newText) {
    after = selection
      .collapseToStartOf(newText)
      .move(lastText.text.length)
  }

  else {
    after = selection
      .collapseToStart()
      .move(lastText.text.length)
  }

  change.select(after)
}

/**
 * Insert a `inline` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Block} inline
 */

Changes.insertInline = (change, inline) => {
  inline = Normalize.inline(inline)
  const { state } = change
  const { selection } = state
  change.insertInlineAtRange(selection, inline)

  // If the node was successfully inserted, update the selection.
  const node = change.state.document.getNode(inline.key)
  if (node) change.collapseToEndOf(node)
}

/**
 * Insert a `text` string at the current selection.
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
 * Set `properties` of the block nodes in the current selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.setBlock = (change, properties) => {
  const { state } = change
  const { selection } = state
  change.setBlockAtRange(selection, properties)
}

/**
 * Set `properties` of the inline nodes in the current selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.setInline = (change, properties) => {
  const { state } = change
  const { selection } = state
  change.setInlineAtRange(selection, properties)
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
 * Split the inline nodes at the current selection, to optional `depth`.
 *
 * @param {Change} change
 * @param {Number} depth (optional)
 */

Changes.splitInline = (change, depth = Infinity) => {
  const { state } = change
  const { selection } = state
  change
    .splitInlineAtRange(selection, depth)
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.removeMark = (change, mark) => {
  mark = Normalize.mark(mark)
  const { state } = change
  const { document, selection } = state

  if (selection.isExpanded) {
    change.removeMarkAtRange(selection, mark)
    return
  }

  if (selection.marks) {
    const marks = selection.marks.remove(mark)
    const sel = selection.set('marks', marks)
    change.select(sel)
    return
  }

  const marks = document.getActiveMarksAtRange(selection).remove(mark)
  const sel = selection.set('marks', marks)
  change.select(sel)
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.toggleMark = (change, mark) => {
  mark = Normalize.mark(mark)
  const { state } = change
  const exists = state.activeMarks.some(m => m.equals(mark))

  if (exists) {
    change.removeMark(mark)
  } else {
    change.addMark(mark)
  }
}

/**
 * Unwrap the current selection from a block parent with `properties`.
 *
 * @param {Change} change
 * @param {Object|String} properties
 */

Changes.unwrapBlock = (change, properties) => {
  const { state } = change
  const { selection } = state
  change.unwrapBlockAtRange(selection, properties)
}

/**
 * Unwrap the current selection from an inline parent with `properties`.
 *
 * @param {Change} change
 * @param {Object|String} properties
 */

Changes.unwrapInline = (change, properties) => {
  const { state } = change
  const { selection } = state
  change.unwrapInlineAtRange(selection, properties)
}

/**
 * Wrap the block nodes in the current selection with a new block node with
 * `properties`.
 *
 * @param {Change} change
 * @param {Object|String} properties
 */

Changes.wrapBlock = (change, properties) => {
  const { state } = change
  const { selection } = state
  change.wrapBlockAtRange(selection, properties)
}

/**
 * Wrap the current selection in new inline nodes with `properties`.
 *
 * @param {Change} change
 * @param {Object|String} properties
 */

Changes.wrapInline = (change, properties) => {
  const { state } = change
  const { selection } = state
  change.wrapInlineAtRange(selection, properties)
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
