
/**
 * Blur the selection.
 *
 * @param {Transform} transform
 */

export function blur(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.blur()
  transform.setSelectionOperation(sel)
}

/**
 * Move the focus point to the anchor point.
 *
 * @param {Transform} transform
 */

export function collapseToAnchor(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToAnchor()
  transform.setSelectionOperation(sel)
}

/**
 * Move the start point to the end point.
 *
 * @param {Transform} transform
 */

export function collapseToEnd(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToEnd()
  transform.setSelectionOperation(sel)
}

/**
 * Move the anchor point to the focus point.
 *
 * @param {Transform} transform
 */

export function collapseToFocus(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToFocus()
  transform.setSelectionOperation(sel)
}

/**
 * Move the end point to the start point.
 *
 * @param {Transform} transform
 */

export function collapseToStart(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToStart()
  transform.setSelectionOperation(sel)
}

/**
 * Move to the end of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 */

export function collapseToEndOf(transform, node) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToEndOf(node)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the next block.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return

  const sel = selection.collapseToEndOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return

  const sel = selection.collapseToEndOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return

  const sel = selection.collapseToEndOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return

  const sel = selection.collapseToEndOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move to the start of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 */

export function collapseToStartOf(transform, node) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToStartOf(node)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return

  const sel = selection.collapseToStartOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return

  const sel = selection.collapseToStartOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return

  const sel = selection.collapseToStartOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return

  const sel = selection.collapseToStartOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point backward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

export function extendBackward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendBackward(n).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point forward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

export function extendForward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendForward(n).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point to the end of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 */

export function extendToEndOf(transform, node) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendToEndOf(node).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point to the start of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 */

export function extendToStartOf(transform, node) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendToStartOf(node).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Focus the selection.
 *
 * @param {Transform} transform
 */

export function focus(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.focus()
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection backward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

export function moveBackward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveBackward(n).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection forward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

export function moveForward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveForward(n).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to a specific anchor and focus point.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

export function moveTo(transform, properties) {
  transform.setSelectionOperation(properties)
}

/**
 * Move the selection to `anchor` and `focus` offsets.
 *
 * @param {Transform} transform
 * @param {Number} anchor
 * @param {Number} focus (optional)
 */

export function moveToOffsets(transform, anchor, _focus) {
  const { state } = transform
  const { selection } = state
  const sel = selection.moveToOffsets(anchor, _focus)
  transform.setSelectionOperation(sel)
}

/**
 * Move to the entire range of `start` and `end` nodes.
 *
 * @param {Transform} transform
 * @param {Node} start
 * @param {Node} end (optional)
 */

export function moveToRangeOf(transform, start, end) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveToRangeOf(start, end).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Move the start offset by `n`.
 *
 * @param {Transform} transform
 * @param {Number} n
 */

export function moveStartOffset(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveStartOffset(n).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Move the end offset by `n`.
 *
 * @param {Transform} transform
 * @param {Number} n
 */

export function moveEndOffset(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveEndOffset(n).normalize(document)
  transform.setSelectionOperation(sel)
}

/**
 * Unset the selection's marks.
 *
 * @param {Transform} transform
 */

export function unsetMarks(transform) {
  transform.setSelectionOperation({ marks: null })
}

/**
 * Snapshot the current selection.
 *
 * @param {Transform} transform
 */

export function snapshotSelection(transform) {
  const { state } = transform
  const { selection } = state
  transform.setSelectionOperation(selection, { snapshot: true })
}

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Transform} transform
 */

export function unsetSelection(transform) {
  transform.setSelectionOperation({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  })
}
