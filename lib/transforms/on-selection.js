
import Selection from '../models/selection'

/**
 * Blur the selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function blur(transform) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.blur()
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the focus point to the anchor point.
 *
 * @return {Transform}
 */

export function collapseToAnchor(transform) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.collapseToAnchor()
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the anchor point to the focus point.
 *
 * @return {Transform}
 */

export function collapseToFocus(transform) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.collapseToFocus()
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move to the end of a `node`.
 *
 * @return {Transform}
 */

export function collapseToEndOf(transform, ...args) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.collapseToEndOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the end of the next block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfNextBlock(transform) {
  let { state } = transform
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.last()
  if (!block) return transform

  let next = document.getNextBlock(block)
  if (!next) return transform

  selection = selection.collapseToEndOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfNextText(transform) {
  let { state } = transform
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.last()
  if (!text) return transform

  let next = document.getNextText(text)
  if (!next) return transform

  selection = selection.collapseToEndOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfPreviousBlock(transform) {
  let { state } = transform
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.first()
  if (!block) return transform

  let previous = document.getPreviousBlock(block)
  if (!previous) return transform

  selection = selection.collapseToEndOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfPreviousText(transform) {
  let { state } = transform
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.first()
  if (!text) return transform

  let previous = document.getPreviousText(text)
  if (!previous) return transform

  selection = selection.collapseToEndOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move to the start of a `node`.
 *
 * @return {Transform}
 */

export function collapseToStartOf(transform, node) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.collapseToStartOf(node)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfNextBlock(transform) {
  let { state } = transform
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.last()
  if (!block) return transform

  let next = document.getNextBlock(block)
  if (!next) return transform

  selection = selection.collapseToStartOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfNextText(transform) {
  let { state } = transform
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.last()
  if (!text) return transform

  let next = document.getNextText(text)
  if (!next) return transform

  selection = selection.collapseToStartOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfPreviousBlock(transform) {
  let { state } = transform
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.first()
  if (!block) return transform

  let previous = document.getPreviousBlock(block)
  if (!previous) return transform

  selection = selection.collapseToStartOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfPreviousText(transform) {
  let { state } = transform
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.first()
  if (!text) return transform

  let previous = document.getPreviousText(text)
  if (!previous) return transform

  selection = selection.collapseToStartOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
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
