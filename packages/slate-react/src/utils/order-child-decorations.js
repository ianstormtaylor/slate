/**
 * Orders the children of provided node and its decoration endpoints (start, end)
 * so that decorations can be passed only to relevant children (see use in Node.render())
 *
 * @param {Node} node
 * @param {List} decorations
 * @return {Array<Item>}
 *
 * where type Item =
 * {
 *   child: Node,
 *   // Index of the child in its parent
 *   index: number
 * }
 * or {
 *   // True if this represents the start of the given decoration
 *   isRangeStart: boolean,
 *   // True if this represents the end of the given decoration
 *   isRangeEnd: boolean,
 *   decoration: Range
 * }
 */

function orderChildDecorations(node, decorations) {
  if (decorations.isEmpty()) {
    return node.nodes.toArray().map((child, index) => ({
      child,
      index,
    }))
  }

  // Map each key to its global order
  const keyOrder = { [node.key]: 0 }
  let globalOrder = 1
  node.forEachDescendant(child => {
    keyOrder[child.key] = globalOrder
    globalOrder = globalOrder + 1
  })

  const childNodes = node.nodes.toArray()

  const endPoints = childNodes.map((child, index) => ({
    child,
    index,
    order: keyOrder[child.key],
  }))

  decorations.forEach(decoration => {
    let startKeyOrder = keyOrder[decoration.endKey]
    startKeyOrder = (startKeyOrder === undefined ? 0 : startKeyOrder) - 0.5
    endPoints.push({
      isRangeStart: true,
      order: startKeyOrder,
      decoration,
    })

    let endKeyOrder = keyOrder[decoration.endKey]
    endKeyOrder = (endKeyOrder === undefined ? globalOrder : endKeyOrder) + 0.5

    endPoints.push({
      isRangeEnd: true,
      order: endKeyOrder,
      decoration,
    })
  })

  const sort = (a, b) => (a.order > b.order ? 1 : -1)

  const sortWithRangeStart = (rangeItem, childItem) => {
    // A rangeStart should be before the child containing its startKey, so it is
    // taken account before going down the child.
    const nextChild = node.nodes.get(childItem.index + 1)

    // The child contains the start key if the start key is between the lowest
    // and highest key in the child
    const lowestOrder = childItem.order
    const highestOrder = nextChild ? keyOrder[nextChild.key] : globalOrder + 1
    const containsRangeKey =
      lowestOrder < rangeItem.order && rangeItem.order < highestOrder

    return containsRangeKey ? -1 : sort(rangeItem, childItem)
  }

  const res = endPoints.sort((a, b) => {
    // Special cases for sorting a range start and a child
    if (a.isRangeStart && b.child) {
      return sortWithRangeStart(a, b)
    } else if (a.child && b.isRangeStart) {
      return -sortWithRangeStart(b, a)
    } else {
      return sort(a, b)
    }
  })

  return res
}

/**
 * Export.
 *
 * @type {Function}
 */

export default orderChildDecorations
