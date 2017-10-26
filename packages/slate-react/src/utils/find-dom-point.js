
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

function findDOMPoint(key, offset) {
  const el = findDOMNode(key)
  const window = getWindow(el)
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

export default findDOMPoint
