import findNode from './find-node'
import warning from 'tiny-warning'

/**
 * Find a Slate path from a DOM `element`.
 *
 * @param {Element} element
 * @param {Editor} editor
 * @return {List|Null}
 */

function findPath(element, editor) {
  warning(
    false,
    'As of slate-react@0.22 the `findPath(element)` helper is deprecated in favor of `editor.findPath(element)`.'
  )

  const node = findNode(element, editor)

  if (!node) {
    return null
  }

  const { value } = editor
  const { document } = value
  const path = document.getPath(node)
  return path
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findPath
