
import Normalize from '../utils/normalize'
import Selection from '../models/selection'

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
  return transform.updateSelection(sel)
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
  return transform.updateSelection(sel)
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
  return transform.updateSelection(sel)
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
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the end of the next block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return transform

  const sel = selection.collapseToEndOf(next)
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return transform

  const sel = selection.collapseToEndOf(next)
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return transform

  const sel = selection.collapseToEndOf(previous)
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return transform

  const sel = selection.collapseToEndOf(previous)
  return transform.updateSelection(sel)
}

/**
 * Move to the start of a `node
 * `.
 * @param {Transform} transform
 * @return {Transform}
 */

export function collapseToStartOf(transform, node) {
  const { state } = transform
  const { selection } = state
  const sel = selection.collapseToStartOf(node)
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return transform

  const sel = selection.collapseToStartOf(next)
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return transform

  const sel = selection.collapseToStartOf(next)
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return transform

  const sel = selection.collapseToStartOf(previous)
  return transform.updateSelection(sel)
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return transform

  const sel = selection.collapseToStartOf(previous)
  return transform.updateSelection(sel)
}

/**
 * Extend the focus point backward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function extendBackward(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.extendBackward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Extend the focus point forward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function extendForward(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.extendForward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Extend the focus point to the end of a `node`.
 *
 * @param {Node} node
 * @return {Transform}
 */

export function extendToEndOf(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.extendToEndOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Extend the focus point to the start of a `node`.
 *
 * @param {Node} node
 * @return {Transform}
 */

export function extendToStartOf(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.extendToStartOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Focus the selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function focus(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.focus(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection backward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function moveBackward(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.moveBackward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection forward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function moveForward(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.moveForward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to a specific anchor and focus point.
 *
 * @param {State} state
 * @param {Object} properties
 * @return {State}
 */

export function moveTo(transform, properties) {
  let { state } = transform
  let { document, selection } = state

  // Allow for passing a `Selection` object.
  if (properties instanceof Selection) {
    properties = {
      anchorKey: properties.anchorKey,
      anchorOffset: properties.anchorOffset,
      focusKey: properties.focusKey,
      focusOffset: properties.focusOffset,
      isFocused: properties.isFocused
    }
  }

  // Pass in properties, and force `isBackward` to be re-resolved.
  selection = selection.merge({
    ...properties,
    isBackward: null
  })

  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to `anchor` and `focus` offsets.
 *
 * @param {Number} anchor
 * @param {Number} focus (optional)
 * @return {Transform}
 */

export function moveToOffsets(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.moveToOffsets(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move to the entire range of `start` and `end` nodes.
 *
 * @param {Node} start
 * @param {Node} end (optional)
 * @return {Transform}
 */

export function moveToRangeOf(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.moveToRangeOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Update the selection with a new `selection`.
 *
 * @param {Transform} transform
 * @param {Mixed} sel
 * @return {Transform}
 */

export function updateSelection(transform, sel) {
  sel = Normalize.selection(sel)

  let { state } = transform
  let { selection } = state
  selection = selection.merge(sel)
  state = state.merge({ selection })

  return transform.add(state, {
    type: 'update-selection',
    selection,
  })
}
