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

  console.log('keyOrder', keyOrder)
  console.log('decorations', decorations)

  const childNodes = node.nodes.toArray()

  const endPoints = childNodes.map((child, index) => ({
    child,
    index,
    order: keyOrder[child.key],
  }))

  decorations.forEach(decoration => {
    endPoints.push({
      isRangeStart: true,
      order: keyOrder[decoration.startKey] - 0.5,
      decoration,
    })
    endPoints.push({
      isRangeEnd: true,
      order: keyOrder[decoration.endKey] + 0.5,
      decoration,
    })
  })

  const sort = (a, b) => (a.order > b.order ? 1 : -1)

  const sortWithRangeStart = (rangeItem, childItem) => {
    // A rangeStart should be before the child containing its startKey, so it is
    // taken account before going down the child.

    const nextChild = node.nodes.get(childItem.child.index + 1)
    if (!nextChild) {
      return sort(rangeItem, childItem)
    }

    const nextChildOrder = keyOrder[nextChild.key]

    const containsRangeKey =
      childItem.order < rangeItem.order && rangeItem.order < nextChildOrder

    return containsRangeKey ? 1 : sort(rangeItem, childItem)
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

  console.log('result', res)
  return res
}

/**
 * Export.
 *
 * @type {Function}
 */

export default orderChildDecorations
