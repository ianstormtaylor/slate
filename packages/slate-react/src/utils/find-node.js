
/**
 * Find a Slate node from a DOM `element`.
 *
 * @param {Element} element
 * @return {Node|Null}
 */

function findNode(element, state) {
  const closest = element.closest('[data-key]')
  if (!closest) return null

  const key = closest.getAttribute('data-key')
  if (!key) return null

  const node = state.document.getNode(key)
  return node || null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findNode
