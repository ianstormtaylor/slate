
/**
 * Find the nearest parent of a `node` and return their offset key.
 *
 * @param {Node} node
 * @return {String} key
 */

export default function findOffsetKey(node) {
  let match = node

  while (match && match != document.documentElement) {
    if (
      match instanceof Element &&
      match.hasAttribute('data-key')
    ) {
      return match.getAttribute('data-key')
    }

    match = match.parentNode
  }

  return null
}
