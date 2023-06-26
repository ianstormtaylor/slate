import invariant from 'tiny-invariant'
import { Value } from 'slate'

/**
 * Find a Slate node from a DOM `element`.
 *
 * @param {Element} element
 * @param {Editor} editor
 * @return {Node|Null}
 */

function findNode(element, editor) {
  invariant(
    !Value.isValue(editor),
    'As of Slate 0.42.0, the `findNode` utility takes an `editor` instead of a `value`.'
  )

  const closest = element.closest('[data-key]')
  if (!closest) return null

  const key = closest.getAttribute('data-key')
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
