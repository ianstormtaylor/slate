import { Set } from 'immutable'

/**
 * Split the decorations in lists of relevant decorations for each child.
 *
 * @param {Node} node
 * @param {List} decorations
 * @return {Array<List<Decoration>>}
 */

function getChildrenDecorations(node, decorations) {
  const activeDecorations = Set().asMutable()
  const childrenDecorations = []

  orderChildDecorations(node, decorations).forEach(item => {
    if (item.isRangeStart) {
      // Item is a decoration start
      activeDecorations.add(item.decoration)
    } else if (item.isRangeEnd) {
      // item is a decoration end
      activeDecorations.remove(item.decoration)
    } else {
      // Item is a child node
      childrenDecorations.push(activeDecorations.toList())
    }
  })

  return childrenDecorations
}

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
  const keyOrders = { [node.key]: 0 }
  let globalOrder = 1

  node.forEachDescendant(child => {
    keyOrders[child.key] = globalOrder
    globalOrder = globalOrder + 1
  })

  const childNodes = node.nodes.toArray()

  const endPoints = childNodes.map((child, index) => ({
    child,
    index,
    order: keyOrders[child.key],
  }))

  decorations.forEach(decoration => {
    // Range start.
    // A rangeStart should be before the child containing its startKey, in order
    // to consider it active before going down the child.
    const startKeyOrder = keyOrders[decoration.start.key]
    const containingChildOrder =
      startKeyOrder === undefined
        ? 0
        : getContainingChildOrder(childNodes, keyOrders, startKeyOrder)

    endPoints.push({
      isRangeStart: true,
      order: containingChildOrder - 0.5,
      decoration,
    })

    // Range end.
    const endKeyOrder = (keyOrders[decoration.end.key] || globalOrder) + 0.5

    endPoints.push({
      isRangeEnd: true,
      order: endKeyOrder,
      decoration,
    })
  })

  return endPoints.sort((a, b) => (a.order > b.order ? 1 : -1))
}

/*
 * Returns the key order of the child right before the given order.
 */

function getContainingChildOrder(children, keyOrders, order) {
  // Find the first child that is after the given key
  const nextChildIndex = children.findIndex(
    child => order < keyOrders[child.key]
  )

  if (nextChildIndex <= 0) {
    return 0
  }

  const containingChild = children[nextChildIndex - 1]
  return keyOrders[containingChild.key]
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getChildrenDecorations
