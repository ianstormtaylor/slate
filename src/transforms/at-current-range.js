
import Normalize from '../utils/normalize'

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 */

Transforms.addMark = (transform, mark) => {
  mark = Normalize.mark(mark)
  const { state } = transform
  const { document, selection } = state

  if (selection.isExpanded) {
    transform.addMarkAtRange(selection, mark)
    return
  }

  if (selection.marks) {
    const marks = selection.marks.add(mark)
    const sel = selection.set('marks', marks)
    transform.select(sel)
    return
  }

  const marks = document.getMarksAtRange(selection).add(mark)
  const sel = selection.set('marks', marks)
  transform.select(sel)
}

/**
 * Delete at the current selection.
 *
 * @param {Transform} transform
 */

Transforms.delete = (transform) => {
  const { state } = transform
  const { selection } = state
  if (selection.isCollapsed) return

  transform
    .snapshotSelection()
    .deleteAtRange(selection)
    // Ensure that the selection is collapsed to the start, because in certain
    // cases when deleting across inline nodes this isn't guaranteed.
    .collapseToStart()
    .snapshotSelection()
}

/**
 * Delete backward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

Transforms.deleteBackward = (transform, n = 1) => {
  const { state } = transform
  const { selection } = state
  transform.deleteBackwardAtRange(selection, n)
}

/**
 * Delete backward until the character boundary at the current selection.
 *
 * @param {Transform} transform
 */

Transforms.deleteCharBackward = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.deleteCharBackwardAtRange(selection)
}

/**
 * Delete backward until the line boundary at the current selection.
 *
 * @param {Transform} transform
 */

Transforms.deleteLineBackward = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.deleteLineBackwardAtRange(selection)
}

/**
 * Delete backward until the word boundary at the current selection.
 *
 * @param {Transform} transform
 */

Transforms.deleteWordBackward = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.deleteWordBackwardAtRange(selection)
}

/**
 * Delete forward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

Transforms.deleteForward = (transform, n = 1) => {
  const { state } = transform
  const { selection } = state
  transform.deleteForwardAtRange(selection, n)
}

/**
 * Delete forward until the character boundary at the current selection.
 *
 * @param {Transform} transform
 */

Transforms.deleteCharForward = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.deleteCharForwardAtRange(selection)
}

/**
 * Delete forward until the line boundary at the current selection.
 *
 * @param {Transform} transform
 */

Transforms.deleteLineForward = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.deleteLineForwardAtRange(selection)
}

/**
 * Delete forward until the word boundary at the current selection.
 *
 * @param {Transform} transform
 */

Transforms.deleteWordForward = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.deleteWordForwardAtRange(selection)
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Transform} transform
 * @param {String|Object|Block} block
 */

Transforms.insertBlock = (transform, block) => {
  block = Normalize.block(block)
  const { state } = transform
  const { selection } = state
  transform.insertBlockAtRange(selection, block)

  // If the node was successfully inserted, update the selection.
  const node = transform.state.document.getNode(block.key)
  if (node) transform.collapseToEndOf(node)
}

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Transform} transform
 * @param {Document} fragment
 */

Transforms.insertFragment = (transform, fragment) => {
  let { state } = transform
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

  transform.deselect()
  transform.insertFragmentAtRange(selection, fragment)
  state = transform.state
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
      .move(lastText.length)
  }

  else {
    after = selection
      .collapseToStart()
      .move(lastText.length)
  }

  transform.select(after)
}

/**
 * Insert a `inline` at the current selection.
 *
 * @param {Transform} transform
 * @param {String|Object|Block} inline
 */

Transforms.insertInline = (transform, inline) => {
  inline = Normalize.inline(inline)
  const { state } = transform
  const { selection } = state
  transform.insertInlineAtRange(selection, inline)

  // If the node was successfully inserted, update the selection.
  const node = transform.state.document.getNode(inline.key)
  if (node) transform.collapseToEndOf(node)
}

/**
 * Insert a `text` string at the current selection.
 *
 * @param {Transform} transform
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Transforms.insertText = (transform, text, marks) => {
  const { state } = transform
  const { document, selection } = state
  marks = marks || selection.marks
  transform.insertTextAtRange(selection, text, marks)

  // If the text was successfully inserted, and the selection had marks on it,
  // unset the selection's marks.
  if (selection.marks && document != transform.state.document) {
    transform.select({ marks: null })
  }
}

/**
 * Set `properties` of the block nodes in the current selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

Transforms.setBlock = (transform, properties) => {
  const { state } = transform
  const { selection } = state
  transform.setBlockAtRange(selection, properties)
}

/**
 * Set `properties` of the inline nodes in the current selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

Transforms.setInline = (transform, properties) => {
  const { state } = transform
  const { selection } = state
  transform.setInlineAtRange(selection, properties)
}

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Transform} transform
 * @param {Number} depth (optional)
 */

Transforms.splitBlock = (transform, depth = 1) => {
  const { state } = transform
  const { selection } = state
  transform
    .snapshotSelection()
    .splitBlockAtRange(selection, depth)
    .collapseToEnd()
    .snapshotSelection()
}

/**
 * Split the inline nodes at the current selection, to optional `depth`.
 *
 * @param {Transform} transform
 * @param {Number} depth (optional)
 */

Transforms.splitInline = (transform, depth = Infinity) => {
  const { state } = transform
  const { selection } = state
  transform
    .snapshotSelection()
    .splitInlineAtRange(selection, depth)
    .snapshotSelection()
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 */

Transforms.removeMark = (transform, mark) => {
  mark = Normalize.mark(mark)
  const { state } = transform
  const { document, selection } = state

  if (selection.isExpanded) {
    transform.removeMarkAtRange(selection, mark)
    return
  }

  if (selection.marks) {
    const marks = selection.marks.remove(mark)
    const sel = selection.set('marks', marks)
    transform.select(sel)
    return
  }

  const marks = document.getMarksAtRange(selection).remove(mark)
  const sel = selection.set('marks', marks)
  transform.select(sel)
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 */

Transforms.toggleMark = (transform, mark) => {
  mark = Normalize.mark(mark)
  const { state } = transform
  const exists = state.marks.some(m => m.equals(mark))

  if (exists) {
    transform.removeMark(mark)
  } else {
    transform.addMark(mark)
  }
}

/**
 * Unwrap the current selection from a block parent with `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

Transforms.unwrapBlock = (transform, properties) => {
  const { state } = transform
  const { selection } = state
  transform.unwrapBlockAtRange(selection, properties)
}

/**
 * Unwrap the current selection from an inline parent with `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

Transforms.unwrapInline = (transform, properties) => {
  const { state } = transform
  const { selection } = state
  transform.unwrapInlineAtRange(selection, properties)
}

/**
 * Wrap the block nodes in the current selection with a new block node with
 * `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

Transforms.wrapBlock = (transform, properties) => {
  const { state } = transform
  const { selection } = state
  transform.wrapBlockAtRange(selection, properties)
}

/**
 * Wrap the current selection in new inline nodes with `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

Transforms.wrapInline = (transform, properties) => {
  let { state } = transform
  let { document, selection } = state
  let after

  const { startKey } = selection

  transform.deselect()
  transform.wrapInlineAtRange(selection, properties)
  state = transform.state
  document = state.document

  // Determine what the selection should be after wrapping.
  if (selection.isCollapsed) {
    after = selection
  }

  else if (selection.startOffset == 0) {
    // Find the inline that has been inserted.
    // We want to handle multiple wrap, so we need to take the highest parent
    const inline = document.getAncestors(startKey)
      .find(parent => (
        parent.kind == 'inline' &&
        parent.getOffset(startKey) == 0
      ))

    const start = inline ? document.getPreviousText(inline.getFirstText().key) : document.getFirstText()
    const end = document.getNextText(inline ? inline.getLastText().key : start.key)

    // Move selection to wrap around the inline
    after = selection
      .moveAnchorToEndOf(start)
      .moveFocusToStartOf(end)
  }

  else if (selection.startKey == selection.endKey) {
    const text = document.getNextText(selection.startKey)
    after = selection.moveToRangeOf(text)
  }

  else {
    const anchor = document.getNextText(selection.anchorKey)
    const focus = document.getDescendant(selection.focusKey)
    after = selection.merge({
      anchorKey: anchor.key,
      anchorOffset: 0,
      focusKey: focus.key,
      focusOffset: selection.focusOffset
    })
  }

  after = after.normalize(document)
  transform.select(after)
}

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {Transform} transform
 * @param {String} prefix
 * @param {String} suffix
 */

Transforms.wrapText = (transform, prefix, suffix = prefix) => {
  const { state } = transform
  const { selection } = state
  transform.wrapTextAtRange(selection, prefix, suffix)

  // If the selection was collapsed, it will have moved the start offset too.
  if (selection.isCollapsed) {
    transform.moveStart(0 - prefix.length)
  }

  // Adding the suffix will have pushed the end of the selection further on, so
  // we need to move it back to account for this.
  transform.moveEnd(0 - suffix.length)

  // There's a chance that the selection points moved "through" each other,
  // resulting in a now-incorrect selection direction.
  if (selection.isForward != transform.state.selection.isForward) {
    transform.flip()
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
