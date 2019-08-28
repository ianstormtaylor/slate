import PathUtils from '../utils/path-utils'

/**
 * Queries.
 *
 * @type {Object}
 */

const Queries = {}

/**
 * Returns the point closest to a point, under a node, where text can
 * be inserted. When the point is ambiguous (for example, in between
 * two nodes), it will be normalized to the beginning of the following
 * node.
 *
 * @param {Editor} editor
 * @param {Point} point
 * @param {Node} node
 * @return {Point}
 */

Queries.getInsertPoint = (editor, point, node) => {
  let resolvedPoint = point.resolveToTextNode(node)
  if (resolvedPoint.path == null) return resolvedPoint

  let closestInline = node.getClosestInline(resolvedPoint.path)
  let resolvedNode = node.getNode(resolvedPoint.path)

  // COMPAT: There is an ambiguity, since a point can exist at the end of a
  // text node, or at the start of the following one. To eliminate it we
  // enforce that if there is a following text node, we always move it there.
  while (
    resolvedPoint.offset === resolvedNode.text.length &&
    (!closestInline || !editor.isVoid(closestInline))
  ) {
    const block = node.getClosestBlock(resolvedPoint.path)
    const depth = node.getDepth(block.key)
    const relativePath = PathUtils.drop(resolvedPoint.path, depth)
    const [next] = block.texts({ path: relativePath })

    if (next) {
      const [, nextPath] = next
      const absolutePath = resolvedPoint.path.slice(0, depth).concat(nextPath)

      resolvedPoint = resolvedPoint.merge({
        key: next.key,
        path: absolutePath,
        offset: 0,
      })
    } else {
      break
    }

    closestInline = node.getClosestInline(resolvedPoint.path)
    resolvedNode = node.getNode(resolvedPoint.path)
  }

  return resolvedPoint
}

export default Queries
