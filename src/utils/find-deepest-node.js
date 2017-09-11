
/**
 * Find the deepest descendant of a DOM `element`.
 *
 * @param {Element} node
 * @return {Element}
 */

function findDeepestNode(element) {
  return element && element.firstChild
    ? findDeepestNode(element.firstChild)
    : element
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDeepestNode
