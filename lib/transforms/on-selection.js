
import Selection from '../models/selection'

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
