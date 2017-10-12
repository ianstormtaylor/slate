
import getWindow from 'get-window'

import OffsetKey from './offset-key'
import normalizeNodeAndOffset from './normalize-node-and-offset'
import findClosestNode from './find-closest-node'

/**
 * Constants.
 *
 * @type {String}
 */

const OFFSET_KEY_ATTRIBUTE = 'data-offset-key'
const RANGE_SELECTOR = `[${OFFSET_KEY_ATTRIBUTE}]`
const TEXT_SELECTOR = `[data-key]`
const VOID_SELECTOR = '[data-slate-void]'

/**
 * Find a Slate point from a DOM selection's `nativeNode` and `nativeOffset`.
 *
 * @param {Element} nativeNode
 * @param {Number} nativeOffset
 * @param {State} state
 * @return {Object}
 */

function findPoint(nativeNode, nativeOffset, state) {
  const {
    node: nearestNode,
    offset: nearestOffset,
  } = normalizeNodeAndOffset(nativeNode, nativeOffset)

  const window = getWindow(nativeNode)
  const { parentNode } = nearestNode
  let rangeNode = findClosestNode(parentNode, RANGE_SELECTOR)
  let offset
  let node

  // Calculate how far into the text node the `nearestNode` is, so that we can
  // determine what the offset relative to the text node is.
  if (rangeNode) {
    const range = window.document.createRange()
    const textNode = findClosestNode(rangeNode, TEXT_SELECTOR)
    range.setStart(textNode, 0)
    range.setEnd(nearestNode, nearestOffset)
    node = textNode
    offset = range.toString().length
  }

  // For void nodes, the element with the offset key will be a cousin, not an
  // ancestor, so find it by going down from the nearest void parent.
  else {
    const voidNode = findClosestNode(parentNode, VOID_SELECTOR)
    if (!voidNode) return null
    rangeNode = voidNode.querySelector(RANGE_SELECTOR)
    node = rangeNode
    offset = node.textContent.length
  }

  // Get the string value of the offset key attribute.
  const offsetKey = rangeNode.getAttribute(OFFSET_KEY_ATTRIBUTE)
  if (!offsetKey) return null

  const { key } = OffsetKey.parse(offsetKey)

  // COMPAT: If someone is clicking from one Slate editor into another, the
  // select event fires twice, once for the old editor's `element` first, and
  // then afterwards for the correct `element`. (2017/03/03)
  if (!state.document.hasDescendant(key)) return null

  return {
    key,
    offset,
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findPoint
