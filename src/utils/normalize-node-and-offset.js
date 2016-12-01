
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
  // including comment nodes, so convert it to a text equivalent.
  if (node.nodeType == 1) {
    const isLast = offset == node.childNodes.length
    const direction = isLast ? 'backward' : 'forward'
    const index = isLast ? offset - 1 : offset
    node = getNonComment(node, index, direction)

    // If the node is not a text node, traverse until we have one.
    while (node.nodeType != 3) {
      const i = isLast ? node.childNodes.length - 1 : 0
      node = getNonComment(node, i, direction)
    }

    // Determine the new offset inside the text node.
    offset = isLast ? node.textContent.length : 0
  }

  // Return the node and offset.
  return { node, offset }
}

/**
 * Get the nearest non-comment to `index` in a `parent`, preferring `direction`.
 *
 * @param {Element} parent
 * @param {Number} index
 * @param {String} direction ('forward' or 'backward')
 * @return {Element|Null}
 */

function getNonComment(parent, index, direction) {
  const { childNodes } = parent
  let child = childNodes[index]
  let i = index
  let triedForward = false
  let triedBackward = false

  while (child.nodeType == 8) {
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

export default normalizeNodeAndOffset
