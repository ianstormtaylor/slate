/* After Spell Check, find the corrected content of leaf
 * @param {HTMLNode} anchorNode
 * @param {Value} value
 * @return {Object|void}
 *   @property {number} start
 *   @property {number} end
 *   @property {string} textContent
 *   @property {Leaf} leaf
 *   @property {string} key
 * */

function findContent(anchorNode, value) {
  const { document } = value
  const { parentNode, previousSibling, nextSibling } = anchorNode
  if (!parentNode) return {}
  if (parentNode.getAttribute('data-offset-key')) {
    return findContentInsideLeafSpan(anchorNode, value)
  }
  const key = parentNode.getAttribute('data-key')
  if (!key) return {}
  const node = document.getDescendant(key)
  if (node.object !== 'text') {
    // See https://github.com/ianstormtaylor/slate/pull/1695#issuecomment-376312742
    return undefined
  }

  const leaves = node.getLeaves()
  if (!node || node.object !== 'text') return {}

  // If anchorNode is at the start, the corrected leaf must be the first leaf
  if (!previousSibling) {
    const leaf = leaves.first()
    const start = 0
    const end = leaf.text.length
    let { textContent } = anchorNode
    // if nextSibling is rendered by the first leaf, append textCOntent
    if (nextSibling) {
      const offsetKey = nextSibling.getAttribute('data-offset-key')
      if (offsetKey === `${key}:0`) {
        textContent = textContent + nextSibling.textContent
      }
    }
    return {
      start,
      end,
      textContent,
      leaf,
      key,
    }
  }

  // If anchorNode is at the end, the corrected leaf must be the last leaf
  if (!nextSibling) {
    const leaf = leaves.last()
    const { start, end } = findStartAndEnd(leaf, node)
    let { textContent } = anchorNode
    const index = leaves.size - 1
    const offsetKey = previousSibling.getAttribute('data-offset-key')
    // If previousSibling is rendered by the last leaf, prepand textCOntent
    if (offsetKey === `${key}:${index}`) {
      textContent = previousSibling.textContent + textContent
    }
    return {
      start,
      end,
      textContent,
      leaf,
      key,
    }
  }

  const previousOffsetKey = previousSibling.getAttribute('data-offset-key')
  const nextOffsetKey = nextSibling.getAttribute('data-offset-key')
  const previousSiblingLeafIndex = parseInt(
    previousOffsetKey.match(/[0-9]*$/)[0],
    10
  )
  const nextSiblingLeafIndex = parseInt(nextOffsetKey.match(/[0-9]*$/)[0], 10)

  // If anchorNode is in middle of a leaf dom, prepand and append textContent
  if (previousSiblingLeafIndex === nextSiblingLeafIndex) {
    const leaf = leaves.get(previousSiblingLeafIndex)
    const { start, end } = findStartAndEnd(leaf, node)
    const textContent =
      previousSibling.textContent +
      anchorNode.textContent +
      nextSibling.textContent
    return {
      start,
      end,
      textContent,
      leaf,
      key,
    }
  }

  // If anchorNode replace a leaf dom, then next leaf dom and previous leaf dom have an index difference bigger than 1
  if (nextSiblingLeafIndex - previousSiblingLeafIndex > 1) {
    const leaf = leaves.get(previousSiblingLeafIndex + 1)
    const { start, end } = findStartAndEnd(leaf, node)
    const { textContent } = anchorNode
    return {
      start,
      end,
      textContent,
      leaf,
      key,
    }
  }

  // If next leaf dom and previous leaf dom have index difference as 1, then
  // anchorNode can be
  //   1. change of previous dom leaf
  //   2. change of next dom leaf
  //
  const nextLeaf = leaves.get(nextSiblingLeafIndex)

  // If anchorNode changes the next leaf
  if (nextLeaf.text !== nextSibling.textContent) {
    const leaf = nextLeaf
    const { start, end } = findStartAndEnd(leaf, node)
    const textContent = anchorNode.textContent + nextSibling.textContent
    return {
      start,
      end,
      textContent,
      leaf,
      key,
    }
  }

  // If anchorNode changes the previous leaf
  const leaf = leaves.get(previousSiblingLeafIndex)
  const { start, end } = findStartAndEnd(leaf, node)
  const textContent = previousSibling.textContent + anchorNode.textContent
  return {
    start,
    end,
    textContent,
    leaf,
    key,
  }
}

/* When the anchorNode's parent is a leaf dom, identified by anchorNode.parentNode has
 * attribute data-offset-key, this function gets the corrected content of leaf
 * @param {HTMLNode} anchorNode
 * @param {Value} value
 * @return {Object|void}
 *   @property {number} start
 *   @property {number} end
 *   @property {string} textContent
 *   @property {Leaf} leaf
 *   @property {string} key
 */

function findContentInsideLeafSpan(anchorNode, value) {
  const { parentNode } = anchorNode
  const { textContent } = parentNode
  const offsetKey = parentNode.getAttribute('data-offset-key')
  const matched = offsetKey.match(/[0-9]*$/)
  const leafIndex = parseInt(matched[0], 10)
  if (leafIndex !== leafIndex) return {}
  const key = offsetKey.slice(0, matched.index - 1)
  const { document } = value
  const node = document.getDescendant(key)
  if (node.object !== 'text') return {}
  const leaves = node.getLeaves()
  const leaf = leaves.get(leafIndex)
  if (!leaf) return {}
  const { start, end } = findStartAndEnd(leaf, node)
  return {
    start,
    end,
    textContent,
    leaf,
    key,
  }
}

/* Given a leaf, find the startOffset and endOffset covering the leaf
 * @param {Leaf} leaf
 * @param {Node} node
 * @return {Object}
 *   @property {number} start
 *   @property {number} end
 */

function findStartAndEnd(leaf, node) {
  const leaves = node.getLeaves()
  let start = 0
  let end = 0
  leaves.find(r => {
    start = end
    end += r.text.length
    return r === leaf
  })
  return { start, end }
}

export default findContent
