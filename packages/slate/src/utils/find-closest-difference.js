/**
 * Find the smallest node covering all difference between previousNode and node
 * @param {Node|Text} previousMNode
 * @param {Node|Text} node
 * @return {null|Node|Text}
 *
 */

function findClosestDifference(previousNode, node) {
  if (node === previousNode) return null
  if (node.object !== previousNode.object) return node
  if (node.object === 'text') return node
  if (node.nodes.size !== previousNode.nodes.size) return node
  if (node.key !== previousNode.key) return node
  if (node.data !== previousNode.data) return node

  const first = node.nodes.findIndex(
    (child, index) => child !== previousNode.nodes.get(index)
  )

  const last = node.nodes.findLastIndex(
    (child, index) => child !== previousNode.nodes.get(index)
  )

  if (first !== last) return node

  return findClosestDifference(
    previousNode.nodes.get(first),
    node.nodes.get(first)
  )
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findClosestDifference
