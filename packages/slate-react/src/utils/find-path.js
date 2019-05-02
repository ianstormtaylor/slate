import findNode from './find-node'

/**
 * Find a Slate path from a DOM `element`.
 *
 * @param {Element} element
 * @param {Editor} editor
 * @return {List|Null}
 */

function findPath(element, editor) {
  const node = findNode(element, editor)
  if (!node) return null

  const { value } = editor
  const { document } = value
  const path = document.assertPath(node.key)
  return path
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findPath
