import PathUtils from '../utils/path-utils'

/**
 * Queries.
 *
 * @type {Object}
 */

const Queries = {}

/**
 * Get a set of marks that would occur on the next insert at a `point` in the
 * node. This mimics expected rich text editing behaviors of mark contiuation.
 *
 * @param {Editor} editor
 * @param {Point} point
 * @param {Node} node
 * @return {Set<Mark>}
 */

Queries.getInsertMarksAtPoint = (editor, point, node) => {
  const { path, offset } = point
  const text = node.getDescendant(path)

  // PERF: we can exit early if the offset isn't at the start of the node.
  if (offset !== 0) {
    return text.marks
  }

  let blockNode
  let blockPath

  for (const entry of node.ancestors(path)) {
    const [n, p] = entry

    if (n.object === 'block') {
      blockNode = n
      blockPath = p
    }
  }

  const relativePath = PathUtils.drop(path, blockPath.size)
  const [previous] = blockNode.texts({
    path: relativePath,
    direction: 'backward',
  })

  // If there's no previous text, we're at the start of the block, so use
  // the current text nodes marks.
  if (!previous) {
    return text.marks
  }

  // Otherwise, continue with the previous text node's marks instead.
  const [previousText] = previous
  return previousText.marks
}

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

    if (!next) break

    const [nextText, nextPath] = next
    const absolutePath = resolvedPoint.path.slice(0, depth).concat(nextPath)
    closestInline = node.getClosestInline(absolutePath)

    // If we would move the cursor into a void node, leave it
    // alone. Otherwise, it becomes impossible to navigate left
    // across voids, since the cursor will always move back into
    // the void.
    if (closestInline && editor.isVoid(closestInline)) break

    resolvedNode = node.getNode(absolutePath)

    resolvedPoint = resolvedPoint.merge({
      key: nextText.key,
      path: absolutePath,
      offset: 0,
    })
  }

  return resolvedPoint
}

export default Queries
