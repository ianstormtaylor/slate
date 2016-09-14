
/**
 * Blur the selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function blur(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.blur()
  return transform.setSelectionOperation(sel)
}

/**
 * Move the focus point to the anchor point.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function collapseToAnchor(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToAnchor()
  return transform.setSelectionOperation(sel)
}

/**
 * Move the anchor point to the
 *  focus point.
 * @param {Transform} transform
 * @return {Transform}
 */

export function collapseToEnd(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToEnd()
  return transform.setSelectionOperation(sel)
}

/**
 * Move the anchor point to the
 *  focus point.
 * @param {Transform} transform
 * @return {Transform}
 */

export function collapseToFocus(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToFocus()
  return transform.setSelectionOperation(sel)
}

/**
 * Move the focus point to the anchor point.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function collapseToStart(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToStart()
  return transform.setSelectionOperation(sel)
}

/**
 * Move to the end of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @return {Transform}
 */

export function collapseToEndOf(transform, node) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToEndOf(node)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the next block.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToEndOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return transform

  const sel = selection.collapseToEndOf(next)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToEndOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return transform

  const sel = selection.collapseToEndOf(next)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToEndOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return transform

  const sel = selection.collapseToEndOf(previous)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToEndOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return transform

  const sel = selection.collapseToEndOf(previous)
  return transform.setSelectionOperation(sel)
}

/**
 * Move to the start of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @return {Transform}
 */

export function collapseToStartOf(transform, node) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToStartOf(node)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToStartOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return transform

  const sel = selection.collapseToStartOf(next)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToStartOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return transform

  const sel = selection.collapseToStartOf(next)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToStartOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return transform

  const sel = selection.collapseToStartOf(previous)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {Transform} tansform
 * @return {Transform}
 */

export function collapseToStartOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return transform

  const sel = selection.collapseToStartOf(previous)
  return transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point backward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function extendBackward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendBackward(n).normalize(document)
  return transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point forward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function extendForward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendForward(n).normalize(document)
  return transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point to the end of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @return {Transform}
 */

export function extendToEndOf(transform, node) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendToEndOf(node).normalize(document)
  return transform.setSelectionOperation(sel)
}

/**
 * Extend the focus point to the start of a `node`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @return {Transform}
 */

export function extendToStartOf(transform, node) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.extendToStartOf(node).normalize(document)
  return transform.setSelectionOperation(sel)
}

/**
 * Focus the selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function focus(transform) {
  const { state } = transform
  const { selection } = state
  const sel = selection.focus()
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection backward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function moveBackward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveBackward(n).normalize(document)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection forward `n` characters.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function moveForward(transform, n) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveForward(n).normalize(document)
  return transform.setSelectionOperation(sel)
}

/**
 * Move the selection to a specific anchor and focus point.
 *
 * @param {Transform} transform
 * @param {Object} properties
 * @return {Transform}
 */

export function moveTo(transform, properties) {
  return transform.setSelectionOperation(properties)
}

/**
 * Move the selection to `anchor` and `focus` offsets.
 *
 * @param {Transform} transform
 * @param {Number} anchor
 * @param {Number} focus (optional)
 * @return {Transform}
 */

export function moveToOffsets(transform, anchor, fokus) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveToOffsets(anchor, fokus)
  return transform.setSelectionOperation(sel)
}

/**
 * Move to the entire range of `start` and `end` nodes.
 *
 * @param {Transform} transform
 * @param {Node} start
 * @param {Node} end (optional)
 * @return {Transform}
 */

export function moveToRangeOf(transform, start, end) {
  const { state } = transform
  const { document, selection } = state
  const sel = selection.moveToRangeOf(start, end).normalize(document)
  return transform.setSelectionOperation(sel)
}

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function unsetSelection(transform) {
  return transform.setSelectionOperation({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  })
}
