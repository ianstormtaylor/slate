
import getWindow from 'get-window'

import findClosestNode from './find-closest-node'
import findPoint from './find-point'

/**
 * Find the target point for a drop `event`.
 *
 * @param {Event} event
 * @param {State} state
 * @return {Object}
 */

function findDropPoint(event, state) {
  const { document } = state
  const { nativeEvent, target } = event
  const { x, y } = nativeEvent

  // Resolve the caret position where the drop occured.
  const window = getWindow(target)
  let n, o

  // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
  if (window.document.caretRangeFromPoint) {
    const range = window.document.caretRangeFromPoint(x, y)
    n = range.startContainer
    o = range.startOffset
  } else {
    const position = window.document.caretPositionFromPoint(x, y)
    n = position.offsetNode
    o = position.offset
  }

  const nodeEl = findClosestNode(n, '[data-key]')
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

  const point = findPoint(n, o, state)
  return point
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDropPoint
