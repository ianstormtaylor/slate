
/**
 * Find the closest ancestor of a DOM `element` that matches a given selector.
 *
 * @param {Element} node
 * @param {String} selector
 * @return {Element}
 */

function findClosestNode(node, selector) {
  if (typeof node.closest === 'function') return node.closest(selector)

  // See https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
  const matches = (node.document || node.ownerDocument).querySelectorAll(selector)
  let i
  let parentNode = node
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
