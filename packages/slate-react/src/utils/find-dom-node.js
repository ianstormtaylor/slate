
import { Node } from 'slate'

/**
 * Find the DOM node for a `key`.
 *
 * @param {String|Node} key
 * @return {Element}
 */

function findDOMNode(key) {
  if (Node.isNode(key)) {
    key = key.key
  }

  const el = window.document.querySelector(`[data-key="${key}"]`)
  return el
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDOMNode
