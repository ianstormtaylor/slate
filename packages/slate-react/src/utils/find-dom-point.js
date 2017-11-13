
import findDOMNode from './find-dom-node'

/**
 * Find a native DOM selection point from a Slate `key` and `offset`.
 *
 * @param {Element} root
 * @param {String} key
 * @param {Number} offset
 * @return {Object}
 */

function findDOMPoint(key, offset, window) {
  const el = findDOMNode(key, window)
  let start = 0
  let n

  // COMPAT: In IE, this method's arguments are not optional, so we have to
  // pass in all four even though the last two are defaults. (2017/10/25)
  const iterator = window.document.createNodeIterator(
    el,
    NodeFilter.SHOW_TEXT,
    () => NodeFilter.FILTER_ACCEPT,
    false
  )

  while (n = iterator.nextNode()) {
    const { length } = n.textContent
    const end = start + length

    if (offset <= end) {
      const o = offset - start
      return { node: n, offset: o }
    }

    start = end
  }

  return null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDOMPoint
