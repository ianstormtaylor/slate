
/**
 * Find the closest ancestor of a DOM `element` that matches a given selector.
 *
 * COMPAT: In IE11, the `Node.closest` method doesn't exist natively, so we
 * have to polyfill it. (2017/09/06)
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 *
 * @param {Element} node
 * @param {String} selector
 * @return {Element}
 */

function findClosestNode(node, selector) {
  if (typeof node.closest === 'function') return node.closest(selector)

  const matches = (node.document || node.ownerDocument).querySelectorAll(selector)
  let parentNode = node
  let i

  do {
    i = matches.length
    while (--i >= 0 && matches.item(i) !== parentNode);
  }
  while ((i < 0) && (parentNode = parentNode.parentElement))

  return parentNode
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findClosestNode
