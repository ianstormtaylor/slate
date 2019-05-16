import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { Value } from 'slate'

import DATA_ATTRS from '../constants/data-attributes'
import SELECTORS from '../constants/selectors'

/**
 * Find a Slate node from a DOM `element`.
 *
 * @param {Element} element
 * @param {Editor} editor
 * @return {Node|Null}
 */

function findNode(element, editor) {
  warning(
    false,
    'As of slate-react@0.22 the `findNode(element)` helper is deprecated in favor of `editor.findNode(element)`.'
  )

  invariant(
    !Value.isValue(editor),
    'As of Slate 0.42.0, the `findNode` utility takes an `editor` instead of a `value`.'
  )

  const closest = element.closest(SELECTORS.KEY)
  if (!closest) return null

  const key = closest.getAttribute(DATA_ATTRS.KEY)
  if (!key) return null

  const { value } = editor
  const { document } = value
  const node = document.getNode(key)
  return node || null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findNode
