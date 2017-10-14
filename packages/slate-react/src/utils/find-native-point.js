
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

  // COMPAT: For empty blocks with only a single empty text node, we will have
  // rendered a `<br/>` instead of a text node.
  if (
    el.childNodes.length == 1 &&
    el.childNodes[0].childNodes.length == 1 &&
    el.childNodes[0].childNodes[0].tagName == 'BR'
  ) {
    return { node: el.childNodes[0], offset: 0 }
  }

  return null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findNativePoint
