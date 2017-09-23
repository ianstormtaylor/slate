
import getWindow from 'get-window'

import findClosestNode from './find-closest-node'
import getPoint from './get-point'

/**
 * Get the target point for a drop event.
 *
 * @param {Event} event
 * @param {State} state
 * @param {Editor} editor
 * @return {Object}
 */

function getDropPoint(event, state, editor) {
  const { document } = state
  const { nativeEvent, target } = event
  const { x, y } = nativeEvent
  const nodeEl = findClosestNode(target, '[data-key]')
  const nodeKey = nodeEl.getAttribute('data-key')
  const node = document.key === nodeKey ? document : document.getDescendant(nodeKey)

  // If the drop DOM target is inside an inline void node use last position of
  // the previous sibling text node or first position of the next sibling text
  // node as Slate target.
  if (node.isVoid && node.kind === 'inline') {
    const rect = nodeEl.getBoundingClientRect()
    const previous = x - rect.left < rect.left + rect.width - x
    const text = previous ?
      document.getPreviousSibling(nodeKey) :
      document.getNextSibling(nodeKey)
    const key = text.key
    const offset = previous ? text.characters.size : 0

    return { key, offset }
  }

  // If the drop DOM target is inside a block void node use last position of
  // the previous sibling block node or first position of the next sibling block
  // node as Slate target.
  if (node.isVoid) {
    const rect = nodeEl.getBoundingClientRect()
    const previous = y - rect.top < rect.top + rect.height - y

    if (previous) {
      const block = document.getPreviousBlock(nodeKey)
      const text = block.getLastText()
      const { key } = text
      const offset = text.characters.size
      return { key, offset }
    }

    const block = document.getNextBlock(nodeKey)
    const text = block.getLastText()
    const { key } = text
    const offset = 0

    return { key, offset }
  }

  // Otherwise, resolve the caret position where the drop occured.
  const window = getWindow(event.target)
  let offsetNode, offset

  // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
  if (window.document.caretRangeFromPoint) {
    const range = window.document.caretRangeFromPoint(x, y)
    offsetNode = range.startContainer
    offset = range.startOffset
  } else {
    const position = window.document.caretPositionFromPoint(x, y)
    offsetNode = position.offsetNode
    offset = position.offset
  }

  const point = getPoint(offsetNode, offset, state, editor)

  return point
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getDropPoint
