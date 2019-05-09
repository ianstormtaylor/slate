import { Node } from 'slate'
import warning from 'tiny-warning'

import DATA_ATTRS from '../constants/data-attributes'

/**
 * Find the DOM node for a `key`.
 *
 * @param {String|Node} key
 * @param {Window} win (optional)
 * @return {Element}
 */

function findDOMNode(key, win = window) {
  warning(
    false,
    'As of slate-react@0.22 the `findDOMNode(key)` helper is deprecated in favor of `editor.findDOMNode(path)`.'
  )

  if (Node.isNode(key)) {
    key = key.key
  }

  const el = win.document.querySelector(`[${DATA_ATTRS.KEY}="${key}"]`)

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
