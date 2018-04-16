/**
 * When the oldNode is replaced by the newNode, try to refind oldNode texts based on key and path structure in old node and new node;
 *
 * @param {string} key
 * @param {Node|Text} oldNode
 * @param {Node|Text} newNode
 * @returns {Boolean}
 *
 */

function refindByKey(key, oldNode, newNode) {
  const oldText = oldNode.getDescendant(key)
  if (!oldText) return null
  if (newNode.getDescendant(key)) {
    const result = newNode.getDescendant(key)
    return result.object === 'text' ? result : result.getFirsttext()
  }
  if (oldNode.object === 'text') {
    if (newNode.object === 'text') {
      return newNode
    }
    return newNode.getFirstText()
  }
  const oldPath = oldNode.getPath(key)
  const result = newNode.getDescendantAtPath(oldPath)
  if (!result) return null
  return result.object === 'text' ? result : result.getFirstText()
}
export default refindByKey
