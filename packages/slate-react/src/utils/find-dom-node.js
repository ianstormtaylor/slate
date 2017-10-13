
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

  if (!el) {
    throw new Error(`Unable to find a DOM node for "${key}". This is often because of forgetting to add \`props.attributes\` to a component returned from \`renderNode\`.`)
  }

  return el
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDOMNode
