import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

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
  Commands[method] = (change, ...args) => {
    const { value } = change
    const { selection } = value
    const methodAtRange = `${method}AtRange`
    change[methodAtRange](selection, ...args)

    if (method.match(/Backward$/)) {
      change.moveToStart()
    } else if (method.match(/Forward$/)) {
      change.moveToEnd()
    }
  }
})

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Commands.addMark = (change, mark) => {
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

Commands.addMarks = (change, marks) => {
  marks.forEach(mark => change.addMark(mark))
}

/**
 * Delete at the current selection.
 *
 * @param {Change} change
 */

Commands.delete = change => {
  const { value } = change
  const { selection } = value
  change.deleteAtRange(selection)

  // Ensure that the selection is collapsed to the start, because in certain
  // cases when deleting across inline nodes, when splitting the inline node the
  // end point of the selection will end up after the split point.
  change.moveToStart()
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Block} block
 */

Commands.insertBlock = (change, block) => {
  block = Block.create(block)
  const { value } = change
  const { selection } = value
  change.insertBlockAtRange(selection, block)

  // If the node was successfully inserted, update the selection.
  const node = change.value.document.getNode(block.key)
  if (node) change.moveToEndOfNode(node)
}

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Change} change
 * @param {Document} fragment
 */

Commands.insertFragment = (change, fragment) => {
  if (!fragment.nodes.size) return

  let { value } = change
  let { document, selection } = value
  const { start, end } = selection
  const { startText, endText, startInline } = value
  const lastText = fragment.getLastText()
  const lastInline = fragment.getClosestInline(lastText.key)
  const firstChild = fragment.nodes.first()
  const lastChild = fragment.nodes.last()
  const keys = document.getTexts().map(text => text.key)
  const isAppending =
    !startInline ||
    (start.isAtStartOfNode(startText) || end.isAtStartOfNode(startText)) ||
    (start.isAtEndOfNode(endText) || end.isAtEndOfNode(endText))

  const isInserting =
    firstChild.hasBlockChildren() || lastChild.hasBlockChildren()

  change.insertFragmentAtRange(selection, fragment)
  value = change.value
  document = value.document

  const newTexts = document.getTexts().filter(n => !keys.includes(n.key))
  const newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first()

  if (newText && (lastInline || isInserting)) {
    change.select(selection.moveToEndOfNode(newText))
  } else if (newText) {
    change.select(
      selection.moveToStartOfNode(newText).moveForward(lastText.text.length)
    )
  } else {
    change.select(selection.moveToStart().moveForward(lastText.text.length))
  }
}

/**
 * Insert an `inline` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Inline} inline
 */

Commands.insertInline = (change, inline) => {
  inline = Inline.create(inline)
  const { value } = change
  const { selection } = value
  change.insertInlineAtRange(selection, inline)

  // If the node was successfully inserted, update the selection.
  const node = change.value.document.getNode(inline.key)
  if (node) change.moveToEndOfNode(node)
}

/**
 * Insert a string of `text` with optional `marks` at the current selection.
 *
 * @param {Change} change
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.insertText = (change, text, marks) => {
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
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Commands.removeMark = (change, mark) => {
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

Commands.replaceMark = (change, oldMark, newMark) => {
  change.removeMark(oldMark)
  change.addMark(newMark)
}

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Change} change
 * @param {Number} depth (optional)
 */

Commands.splitBlock = (change, depth = 1) => {
  const { value } = change
  const { selection, document } = value
  const marks = selection.marks || document.getInsertMarksAtRange(selection)
  change.splitBlockAtRange(selection, depth).moveToEnd()

  if (marks && marks.size !== 0) {
    change.select({ marks })
  }
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Commands.toggleMark = (change, mark) => {
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

Commands.wrapText = (change, prefix, suffix = prefix) => {
  const { value } = change
  const { selection } = value
  change.wrapTextAtRange(selection, prefix, suffix)

  // If the selection was collapsed, it will have moved the start offset too.
  if (selection.isCollapsed) {
    change.moveStartBackward(prefix.length)
  }

  // Adding the suffix will have pushed the end of the selection further on, so
  // we need to move it back to account for this.
  change.moveEndBackward(suffix.length)

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

export default Commands
