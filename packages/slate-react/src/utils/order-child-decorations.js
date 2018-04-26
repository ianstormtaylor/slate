/**
 * Orders the children of provided node and its decoration endpoints (start, end)
 * so that decorations can be passed only to relevant children (see use in Node.render())
 *
 * @param {Node} node
 * @param {List} decorations
 * @return {Array}
 */

function orderChildDecorations(node, decorations) {
  const keyIndices = node.getKeysAsArray()
  const childNodes = node.nodes.toArray()

  const endPoints = childNodes.map((child, i) => ({
    isChild: true,
    offset: keyIndices.indexOf(child.key),
    key: child.key,
    child,
  }))

  decorations.forEach(d => {
    endPoints.push({
      isRangeStart: true,
      offset: keyIndices.indexOf(d.startKey) - 0.5,
      key: d.startKey,
      d,
    })
    endPoints.push({
      isRangeEnd: true,
      offset: keyIndices.indexOf(d.endKey) + 0.5,
      key: d.endKey,
      d,
    })
  })

  const order = (a, b) => (a.offset > b.offset ? 1 : -1)

  return endPoints.sort(
    (a, b) =>
      // if comparing a rangeStart with a child,
      // move it before the child that owns its startKey
      a.isRangeStart && b.isChild && b.child.getKeysAsArray
        ? b.child.getKeysAsArray().includes(a.key) ? -1 : order(a, b)
        : b.isRangeStart && a.isChild && a.child.getKeysAsArray
          ? a.child.getKeysAsArray().includes(b.key) ? 1 : order(a, b)
          : order(a, b)
  )
}

/**
 * Export.
 *
 * @type {Function}
 */

export default orderChildDecorations
