
import getWindow from 'get-window'

import OffsetKey from './offset-key'
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
 * From a DOM selection's `node` and `offset`, normalize so that it always
 * refers to a text node.
 *
 * @param {Element} node
 * @param {Number} offset
 * @return {Object}
 */

function normalizeNodeAndOffset(node, offset) {
  // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.
  if (node.nodeType == 1 && node.childNodes.length) {
    const isLast = offset == node.childNodes.length
    const direction = isLast ? 'backward' : 'forward'
    const index = isLast ? offset - 1 : offset
    node = getEditableChild(node, index, direction)

    // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.
    while (node.nodeType == 1 && node.childNodes.length) {
      const i = isLast ? node.childNodes.length - 1 : 0
      node = getEditableChild(node, i, direction)
    }

    // Determine the new offset inside the text node.
    offset = isLast ? node.textContent.length : 0
  }

  // Return the node and offset.
  return { node, offset }
}

/**
 * Get the nearest editable child at `index` in a `parent`, preferring
 * `direction`.
 *
 * @param {Element} parent
 * @param {Number} index
 * @param {String} direction ('forward' or 'backward')
 * @return {Element|Null}
 */

function getEditableChild(parent, index, direction) {
  const { childNodes } = parent
  let child = childNodes[index]
  let i = index
  let triedForward = false
  let triedBackward = false

  // While the child is a comment node, or an element node with no children,
  // keep iterating to find a sibling non-void, non-comment node.
  while (
    (child.nodeType == 8) ||
    (child.nodeType == 1 && child.childNodes.length == 0) ||
    (child.nodeType == 1 && child.getAttribute('contenteditable') == 'false')
  ) {
    if (triedForward && triedBackward) break

    if (i >= childNodes.length) {
      triedForward = true
      i = index - 1
      direction = 'backward'
      continue
    }

    if (i < 0) {
      triedBackward = true
      i = index + 1
      direction = 'forward'
      continue
    }

    child = childNodes[i]
    if (direction == 'forward') i++
    if (direction == 'backward') i--
  }

  return child || null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findPoint
