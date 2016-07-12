
/**
 * Find the DOM node for a `node`.
 *
 * @param {Node} node
 * @return {Element} el
 */

function findDOMNode(node) {
  return window.document.querySelector(`[data-key="${node.key}"]`)
}

/**
 * Export.
 */

export default findDOMNode
