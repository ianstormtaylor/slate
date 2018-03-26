function getContent(anchorNode, value) {
  const { document } = value
  const { parentNode, previousSibling, nextSibling } = anchorNode
  if (!parentNode) return {}
  if (parentNode.getAttribute('data-offset-key')) {
    return getContentInsideLeafSpan(anchorNode, value)
  }
  const key = parentNode.getAttribute('data-key')
  if (!key) return {}
  const node = document.getDescendant(key)
  const leaves = node.getLeaves()
  if (!node || node.object !== 'text') return {}

  // If anchorNode is at the start
  if (!previousSibling) {
    const leaf = leaves.first()
    const start = 0
    const end = leaf.text.length
    let { textContent } = anchorNode
    // check if nextSibling is rendered by the first leaf
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

  // If anchorNode is at the end
  if (!nextSibling) {
    const leaf = leaves.last()
    const { start, end } = findStartAndEnd(leaf, node)
    let { textContent } = anchorNode
    const index = leaves.size - 1
    const offsetKey = previousSibling.getAttribute('data-offset-key')
    // Check if the previousSibling is rendered by the last leaf
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

  const prevOffsetKey = previousSibling.getAttribute('data-offset-key')
  const nextOffsetKey = nextSibling.getAttribute('data-offset-key')
  const prevOffsetIndex = parseInt(prevOffsetKey.match(/[0-9]*$/)[0], 10)
  if (prevOffsetIndex !== prevOffsetIndex) return {}
  const nextOffsetIndex = parseInt(nextOffsetKey.match(/[0-9]*$/)[0], 10)

  // If anchorNode splits a leaf
  if (prevOffsetIndex === nextOffsetIndex) {
    const leaf = leaves.get(prevOffsetIndex)
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

  // If anchorNode replace a leaf
  if (nextOffsetIndex - prevOffsetIndex > 1) {
    const leaf = leaves.get(prevOffsetIndex + 1)
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

  // If anchorNode changes a leaf at start or end
  const nextLeaf = leaves.get(nextOffsetIndex)

  // If anchorNode changes a leaf at the start of nextSibling
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

  // If anchorNode changes a leaf at the end of previousSibling
  const leaf = leaves.get(prevOffsetIndex)
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

function getContentInsideLeafSpan(anchorNode, value) {
  // After insert in masks, we can see:
  // <b> Cat i cute </b>
  // as
  // <b> Cat </b>is <b>cute</b>
  // The parentNode shall be rendered by text.js with data-offset-key
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

export default getContent
