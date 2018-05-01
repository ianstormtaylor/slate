/* Find the furthest ancestor in node that covers all difference between previousNode and node
 * @param {Node|Text} previousMNode
 * @param {Node|Text} node
 * @return {void|Node|Text}
 *
*/

function findFurthestDifferentAncestor(previousNode, node) {
  if (node === previousNode) return null
  if (node.object !== previousNode.object) return node
  if (node.object === 'text') return node
  if (node.nodes.size !== previousNode.nodes.size) return node
  const first = node.nodes.findIndex(
    (child, index) => child !== previousNode.get(index)
  )
  const last = node.nodes.findLastIndex(
    (child, index) => child !== previousNode.get(index)
  )
  if (first !== last) return node
  return findFurthestDifferentAncestor(
    previousNode.nodes.get(first),
    node.nodes.get(first)
  )
}
export default findFurthestDifferentAncestor
