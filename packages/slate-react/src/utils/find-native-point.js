
import getWindow from 'get-window'

import findDOMNode from './find-dom-node'

/**
 * Find a native DOM selection point from a Slate `key` and `offset`.
 *
 * @param {Element} root
 * @param {String} key
 * @param {Number} offset
 * @return {Object}
 */

function findNativePoint(key, offset) {
  const el = findDOMNode(key)
  if (!el) return null

  const window = getWindow(el)
  const iterator = window.document.createNodeIterator(el, NodeFilter.SHOW_TEXT)
  let start = 0
  let n

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

export default findNativePoint
