import findDOMNode from './find-dom-node'
import warning from 'tiny-warning'

import DATA_ATTRS from '../constants/data-attributes'
import SELECTORS from '../constants/selectors'

/**
 * Find a native DOM selection point from a Slate `point`.
 *
 * @param {Point} point
 * @param {Window} win (optional)
 * @return {Object|Null}
 */

function findDOMPoint(point, win = window) {
  warning(
    false,
    'As of slate-react@0.22 the `findDOMPoint(point)` helper is deprecated in favor of `editor.findDOMPoint(point)`.'
  )

  const el = findDOMNode(point.key, win)
  let start = 0

  // For each leaf, we need to isolate its content, which means filtering to its
  // direct text and zero-width spans. (We have to filter out any other siblings
  // that may have been rendered alongside them.)
  const texts = Array.from(
    el.querySelectorAll(`${SELECTORS.STRING}, ${SELECTORS.ZERO_WIDTH}`)
  )

  for (const text of texts) {
    const node = text.childNodes[0]
    const domLength = node.textContent.length
    let slateLength = domLength

    if (text.hasAttribute(DATA_ATTRS.LENGTH)) {
      slateLength = parseInt(text.getAttribute(DATA_ATTRS.LENGTH), 10)
    }

    const end = start + slateLength

    if (point.offset <= end) {
      const offset = Math.min(domLength, Math.max(0, point.offset - start))
      return { node, offset }
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
