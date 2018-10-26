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
  Commands[method] = (editor, ...args) => {
    const { value } = editor
    const { selection } = value
    const methodAtRange = `${method}AtRange`
    editor[methodAtRange](selection, ...args)

    if (method.match(/Backward$/)) {
      editor.moveToStart()
    } else if (method.match(/Forward$/)) {
      editor.moveToEnd()
    }
  }
})

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
 * @param {Mark} mark
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

  // Ensure that the selection is collapsed to the start, because in certain
  // cases when deleting across inline nodes, when splitting the inline node the
  // end point of the selection will end up after the split point.
  editor.moveToStart()
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Editor} editor
 * @param {String|Object|Block} block
 */

Commands.insertBlock = (editor, block) => {
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

  let { value } = editor
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

  editor.insertFragmentAtRange(selection, fragment)
  value = editor.value
  document = value.document

  const newTexts = document.getTexts().filter(n => !keys.includes(n.key))
  const newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first()

  if (newText && (lastInline || isInserting)) {
    editor.select(selection.moveToEndOfNode(newText))
  } else if (newText) {
    editor.select(
      selection.moveToStartOfNode(newText).moveForward(lastText.text.length)
    )
  } else {
    editor.select(selection.moveToStart().moveForward(lastText.text.length))
  }
}

/**
 * Insert an `inline` at the current selection.
 *
 * @param {Editor} editor
 * @param {String|Object|Inline} inline
 */

Commands.insertInline = (editor, inline) => {
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
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Editor} editor
 * @param {Number} depth (optional)
 */

Commands.splitBlock = (editor, depth = 1) => {
  const { value } = editor
  const { selection, document } = value
  const marks = selection.marks || document.getInsertMarksAtRange(selection)
  editor.splitBlockAtRange(selection, depth).moveToEnd()

  if (marks && marks.size !== 0) {
    editor.select({ marks })
  }
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
