import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'

/**
 * Ensure that an expanded selection is deleted first using the `editor.delete`
 * command. This guarantees that it uses the proper semantic "intent" instead of
 * using `deleteAtRange` under the covers and skipping `delete`.
 *
 * @param {Editor}
 */

function deleteExpanded(editor) {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  }
}

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Editor} editor
 * @param {Mark} mark
 */

Commands.addMark = (editor, mark) => {
  mark = Mark.create(mark)
  const { value } = editor
  const { document, selection } = value

  if (selection.isExpanded) {
    editor.addMarkAtRange(selection, mark)
  } else if (selection.marks) {
    const marks = selection.marks.add(mark)
    const sel = selection.set('marks', marks)
    editor.select(sel)
  } else {
    const marks = document.getActiveMarksAtRange(selection).add(mark)
    const sel = selection.set('marks', marks)
    editor.select(sel)
  }
}

/**
 * Add a list of `marks` to the characters in the current selection.
 *
 * @param {Editor} editor
 * @param {Set<Mark>|Array<Object>} marks
 */

Commands.addMarks = (editor, marks) => {
  marks.forEach(mark => editor.addMark(mark))
}

/**
 * Delete at the current selection.
 *
 * @param {Editor} editor
 */

Commands.delete = editor => {
  const { value } = editor
  const { selection } = value
  editor.deleteAtRange(selection)

  // COMPAT: Ensure that the selection is collapsed, because in certain cases
  // when deleting across inline nodes, when splitting the inline node the end
  // point of the selection will end up after the split point.
  editor.moveToFocus()
}

/**
 * Delete backward `n` characters.
 *
 * @param {Editor} editor
 * @param {Number} n (optional)
 */

Commands.deleteBackward = (editor, n = 1) => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteBackwardAtRange(selection, n)
  }
}

/**
 * Delete backward one character.
 *
 * @param {Editor} editor
 */

Commands.deleteCharBackward = editor => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteCharBackwardAtRange(selection)
  }
}

/**
 * Delete backward one line.
 *
 * @param {Editor} editor
 */

Commands.deleteLineBackward = editor => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteLineBackwardAtRange(selection)
  }
}

/**
 * Delete backward one word.
 *
 * @param {Editor} editor
 */

Commands.deleteWordBackward = editor => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteWordBackwardAtRange(selection)
  }
}

/**
 * Delete backward `n` characters.
 *
 * @param {Editor} editor
 * @param {Number} n (optional)
 */

Commands.deleteForward = (editor, n = 1) => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteForwardAtRange(selection, n)
  }
}

/**
 * Delete backward one character.
 *
 * @param {Editor} editor
 */

Commands.deleteCharForward = editor => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteCharForwardAtRange(selection)
  }
}

/**
 * Delete backward one line.
 *
 * @param {Editor} editor
 */

Commands.deleteLineForward = editor => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteLineForwardAtRange(selection)
  }
}

/**
 * Delete backward one word.
 *
 * @param {Editor} editor
 */

Commands.deleteWordForward = editor => {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) {
    editor.delete()
  } else {
    editor.deleteWordForwardAtRange(selection)
  }
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Editor} editor
 * @param {String|Object|Block} block
 */

Commands.insertBlock = (editor, block) => {
  deleteExpanded(editor)

  block = Block.create(block)
  const { value } = editor
  const { selection } = value
  editor.insertBlockAtRange(selection, block)

  // If the node was successfully inserted, update the selection.
  const node = editor.value.document.getNode(block.key)
  if (node) editor.moveToEndOfNode(node)
}

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Editor} editor
 * @param {Document} fragment
 */

Commands.insertFragment = (editor, fragment) => {
  if (!fragment.nodes.size) return

  deleteExpanded(editor)

  let { value } = editor
  let { document, selection } = value
  const { start, end } = selection
  const { startText, endText, startInline } = value
  const lastText = fragment.getLastText()
  const lastInline = fragment.getClosestInline(lastText.key)
  const lastBlock = fragment.getClosestBlock(lastText.key)
  const firstChild = fragment.nodes.first()
  const lastChild = fragment.nodes.last()
  const keys = document.getTexts().map(text => text.key)
  const isAppending =
    !startInline ||
    (start.isAtStartOfNode(startText) || end.isAtStartOfNode(startText)) ||
    (start.isAtEndOfNode(endText) || end.isAtEndOfNode(endText))

  const isInserting =
    firstChild.hasBlockChildren() || lastChild.hasBlockChildren()

  editor.insertFragmentAtRange(selection, fragment)
  value = editor.value
  document = value.document

  const newTexts = document.getTexts().filter(n => !keys.includes(n.key))
  const newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first()

  if (newText && (lastInline || isInserting)) {
    editor.moveToEndOfNode(newText)
  } else if (newText) {
    editor.moveToStartOfNode(newText).moveForward(lastBlock.text.length)
  }
}

/**
 * Insert an `inline` at the current selection.
 *
 * @param {Editor} editor
 * @param {String|Object|Inline} inline
 */

Commands.insertInline = (editor, inline) => {
  deleteExpanded(editor)

  inline = Inline.create(inline)
  const { value } = editor
  const { selection } = value
  editor.insertInlineAtRange(selection, inline)

  // If the node was successfully inserted, update the selection.
  const node = editor.value.document.getNode(inline.key)
  if (node) editor.moveToEndOfNode(node)
}

/**
 * Insert a string of `text` with optional `marks` at the current selection.
 *
 * @param {Editor} editor
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.insertText = (editor, text, marks) => {
  deleteExpanded(editor)

  const { value } = editor
  const { document, selection } = value
  marks = marks || selection.marks || document.getInsertMarksAtRange(selection)
  editor.insertTextAtRange(selection, text, marks)

  // If the text was successfully inserted, and the selection had marks on it,
  // unset the selection's marks.
  if (selection.marks && document != editor.value.document) {
    editor.select({ marks: null })
  }
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Editor} editor
 * @param {Mark} mark
 */

Commands.removeMark = (editor, mark) => {
  mark = Mark.create(mark)
  const { value } = editor
  const { document, selection } = value

  if (selection.isExpanded) {
    editor.removeMarkAtRange(selection, mark)
  } else if (selection.marks) {
    const marks = selection.marks.remove(mark)
    const sel = selection.set('marks', marks)
    editor.select(sel)
  } else {
    const marks = document.getActiveMarksAtRange(selection).remove(mark)
    const sel = selection.set('marks', marks)
    editor.select(sel)
  }
}

/**
 * Replace an `oldMark` with a `newMark` in the characters in the current selection.
 *
 * @param {Editor} editor
 * @param {Mark} oldMark
 * @param {Mark} newMark
 */

Commands.replaceMark = (editor, oldMark, newMark) => {
  editor.removeMark(oldMark)
  editor.addMark(newMark)
}

/**
 * Set the `properties` of block nodes.
 *
 * @param {Editor} editor
 * @param {Object|String} properties
 */

Commands.setBlocks = (editor, properties) => {
  const { value } = editor
  const { selection } = value
  editor.setBlocksAtRange(selection, properties)
}

/**
 * Set the `properties` of inline nodes.
 *
 * @param {Editor} editor
 * @param {Object|String} properties
 */

Commands.setInlines = (editor, properties) => {
  const { value } = editor
  const { selection } = value
  editor.setInlinesAtRange(selection, properties)
}

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Editor} editor
 * @param {Number} depth (optional)
 */

Commands.splitBlock = (editor, depth = 1) => {
  deleteExpanded(editor)

  const { value } = editor
  const { selection, document } = value
  const marks = selection.marks || document.getInsertMarksAtRange(selection)
  editor.splitBlockAtRange(selection, depth).moveToEnd()

  if (marks && marks.size !== 0) {
    editor.select({ marks })
  }
}

/**
 * Split the inline nodes to optional `height`.
 *
 * @param {Editor} editor
 * @param {Number} height (optional)
 */

Commands.splitInline = (editor, height) => {
  deleteExpanded(editor)
  const { value } = editor
  const { selection } = value
  editor.splitInlineAtRange(selection, height)
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Editor} editor
 * @param {Mark} mark
 */

Commands.toggleMark = (editor, mark) => {
  mark = Mark.create(mark)
  const { value } = editor
  const exists = value.activeMarks.has(mark)

  if (exists) {
    editor.removeMark(mark)
  } else {
    editor.addMark(mark)
  }
}

/**
 * Unwrap nodes from a block with `properties`.
 *
 * @param {Editor} editor
 * @param {String|Object} properties
 */

Commands.unwrapBlock = (editor, properties) => {
  const { value } = editor
  const { selection } = value
  editor.unwrapBlockAtRange(selection, properties)
}

/**
 * Unwrap nodes from an inline with `properties`.
 *
 * @param {Editor} editor
 * @param {String|Object} properties
 */

Commands.unwrapInline = (editor, properties) => {
  const { value } = editor
  const { selection } = value
  editor.unwrapInlineAtRange(selection, properties)
}

/**
 * Wrap nodes in a new `block`.
 *
 * @param {Editor} editor
 * @param {Block|Object|String} block
 */

Commands.wrapBlock = (editor, block) => {
  const { value } = editor
  const { selection } = value
  editor.wrapBlockAtRange(selection, block)
}

/**
 * Wrap nodes in a new `inline`.
 *
 * @param {Editor} editor
 * @param {Inline|Object|String} inline
 */

Commands.wrapInline = (editor, inline) => {
  const { value } = editor
  const { selection } = value
  editor.wrapInlineAtRange(selection, inline)
}

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {Editor} editor
 * @param {String} prefix
 * @param {String} suffix
 */

Commands.wrapText = (editor, prefix, suffix = prefix) => {
  const { value } = editor
  const { selection } = value
  editor.wrapTextAtRange(selection, prefix, suffix)

  // If the selection was collapsed, it will have moved the start offset too.
  if (selection.isCollapsed) {
    editor.moveStartBackward(prefix.length)
  }

  // Adding the suffix will have pushed the end of the selection further on, so
  // we need to move it back to account for this.
  editor.moveEndBackward(suffix.length)

  // There's a chance that the selection points moved "through" each other,
  // resulting in a now-incorrect selection direction.
  if (selection.isForward != editor.value.selection.isForward) {
    editor.flip()
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
