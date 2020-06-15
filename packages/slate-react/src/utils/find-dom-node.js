import { Node } from 'slate'

/**
 * Find the DOM node for a `key`.
 *
 * @param {String|Node} key
 * @param {Window} win (optional)
 * @return {Element}
 */

function findDOMNode(key, win = window) {
  if (Node.isNode(key)) {
    key = key.key
  }

  const el = win.document.querySelector(`[data-key="${key}"]`)

  if (!el) {
    throw new Error(
      `Unable to find a DOM node for "${key}". This is often because of forgetting to add \`props.attributes\` to a custom component.`
    )
  }

  return el
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDOMNode
