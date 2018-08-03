import findDOMNode from './find-dom-node'

/**
 * Find a native DOM selection point from a Slate `point`.
 *
 * @param {Point} point
 * @param {Window} win (optional)
 * @return {Object|Null}
 */

function findDOMPoint(point, win = window) {
  const el = findDOMNode(point.key, win)
  let start = 0
  let n

  // COMPAT: In IE, this method's arguments are not optional, so we have to
  // pass in all four even though the last two are defaults. (2017/10/25)
  const iterator = win.document.createNodeIterator(
    el,
    NodeFilter.SHOW_TEXT,
    () => NodeFilter.FILTER_ACCEPT,
    false
  )

  while ((n = iterator.nextNode())) {
    const { length } = n.textContent
    const end = start + length

    if (point.offset <= end) {
      const o = point.offset - start
      return { node: n, offset: o >= 0 ? o : 0 }
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
