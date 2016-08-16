
import Selection from '../models/selection'

/**
 * Blur the selection.
 *
 * @return {Selection} selection
 */

export function blur(state, ...args) {
  let { document, selection } = state
  selection = selection.blur(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the focus point to the anchor point.
 *
 * @return {Selection} selection
 */

export function collapseToAnchor(state, ...args) {
  let { document, selection } = state
  selection = selection.collapseToAnchor(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the anchor point to the focus point.
 *
 * @return {Selection} selection
 */

export function collapseToFocus(state, ...args) {
  let { document, selection } = state
  selection = selection.collapseToFocus(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move to the end of a `node`.
 *
 * @return {Selection} selection
 */

export function collapseToEndOf(state, ...args) {
  let { document, selection } = state
  selection = selection.collapseToEndOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the end of the next block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfNextBlock(state) {
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.last()
  if (!block) return state

  let next = document.getNextBlock(block)
  if (!next) return state

  selection = selection.collapseToEndOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfNextText(state) {
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.last()
  if (!text) return state

  let next = document.getNextText(text)
  if (!next) return state

  selection = selection.collapseToEndOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfPreviousBlock(state) {
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.first()
  if (!block) return state

  let previous = document.getPreviousBlock(block)
  if (!previous) return state

  selection = selection.collapseToEndOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToEndOfPreviousText(state) {
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.first()
  if (!text) return state

  let previous = document.getPreviousText(text)
  if (!previous) return state

  selection = selection.collapseToEndOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move to the start of a `node`.
 *
 * @return {Selection} selection
 */

export function collapseToStartOf(state, ...args) {
  let { document, selection } = state
  selection = selection.collapseToStartOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfNextBlock(state) {
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.last()
  if (!block) return state

  let next = document.getNextBlock(block)
  if (!next) return state

  selection = selection.collapseToStartOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfNextText(state) {
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.last()
  if (!text) return state

  let next = document.getNextText(text)
  if (!next) return state

  selection = selection.collapseToStartOf(next)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfPreviousBlock(state) {
  let { document, selection } = state
  let blocks = document.getBlocksAtRange(selection)
  let block = blocks.first()
  if (!block) return state

  let previous = document.getPreviousBlock(block)
  if (!previous) return state

  selection = selection.collapseToStartOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {State} state
 * @return {State}
 */

export function collapseToStartOfPreviousText(state) {
  let { document, selection } = state
  let texts = document.getTextsAtRange(selection)
  let text = texts.first()
  if (!text) return state

  let previous = document.getPreviousText(text)
  if (!previous) return state

  selection = selection.collapseToStartOf(previous)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Extend the focus point backward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Selection} selection
 */

export function extendBackward(state, ...args) {
  let { document, selection } = state
  selection = selection.extendBackward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Extend the focus point forward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Selection} selection
 */

export function extendForward(state, ...args) {
  let { document, selection } = state
  selection = selection.extendForward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Extend the focus point to the end of a `node`.
 *
 * @param {Node} node
 * @return {Selection} selection
 */

export function extendToEndOf(state, ...args) {
  let { document, selection } = state
  selection = selection.extendToEndOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Extend the focus point to the start of a `node`.
 *
 * @param {Node} node
 * @return {Selection} selection
 */

export function extendToStartOf(state, ...args) {
  let { document, selection } = state
  selection = selection.extendToStartOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Focus the selection.
 *
 * @return {Selection} selection
 */

export function focus(state, ...args) {
  let { document, selection } = state
  selection = selection.focus(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection backward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Selection} selection
 */

export function moveBackward(state, ...args) {
  let { document, selection } = state
  selection = selection.moveBackward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection forward `n` characters.
 *
 * @param {Number} n (optional)
 * @return {Selection} selection
 */

export function moveForward(state, ...args) {
  let { document, selection } = state
  selection = selection.moveForward(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move the selection to a specific anchor and focus point.
 *
 * @param {State} state
 * @param {Object} properties
 * @return {State}
 */

export function moveTo(state, properties) {
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
  return state
}

/**
 * Move the selection to `anchor` and `focus` offsets.
 *
 * @param {Number} anchor
 * @param {Number} focus (optional)
 * @return {Selection} selection
 */

export function moveToOffsets(state, ...args) {
  let { document, selection } = state
  selection = selection.moveToOffsets(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}

/**
 * Move to the entire range of `start` and `end` nodes.
 *
 * @param {Node} start
 * @param {Node} end (optional)
 * @return {Selection} selection
 */

export function moveToRangeOf(state, ...args) {
  let { document, selection } = state
  selection = selection.moveToRangeOf(...args)
  selection = selection.normalize(document)
  state = state.merge({ selection })
  return state
}
