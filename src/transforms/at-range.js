/* eslint no-console: 0 */

import Normalize from '../utils/normalize'

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function addMarkAtRange(transform, range, mark, options = {}) {
  if (range.isCollapsed) {
    return transform
  }

  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const { startKey, startOffset, endKey, endOffset } = range
  const texts = document.getTextsAtRange(range)

  texts.forEach((text) => {
    const { key } = text
    let index = 0
    let length = text.length

    if (key == startKey) index = startOffset
    if (key == endKey) length = endOffset
    if (key == startKey && key == endKey) length = endOffset - startOffset

    transform.addMarkByKey(key, index, length, mark, { normalize })
  })

  return transform
}

/**
 * Delete everything in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function deleteAtRange(transform, range, options = {}) {
  if (range.isCollapsed) {
    return transform
  }

  const { normalize = true } = options
  const { startKey, startOffset, endKey, endOffset } = range

  if (startKey == endKey) {
    const index = startOffset
    const length = endOffset - startOffset
    return transform.removeTextByKey(startKey, index, length, { normalize })
  }

  let { state } = transform
  let { document } = state

  // split the nodes at range, within the common ancestor
  let ancestor = document.getCommonAncestor(startKey, endKey)
  let startChild = ancestor.getHighestChild(startKey)
  let endChild = ancestor.getHighestChild(endKey)
  const startOff = (startChild.kind == 'text' ? 0 : startChild.getOffset(startKey)) + startOffset
  const endOff = (endChild.kind == 'text' ? 0 : endChild.getOffset(endKey)) + endOffset

  transform = transform.splitNodeByKey(startChild.key, startOff, { normalize: false })
  transform = transform.splitNodeByKey(endChild.key, endOff, { normalize: false })

  state = transform.state
  document = state.document
  const startBlock = document.getClosestBlock(startKey)
  const endBlock = document.getClosestBlock(document.getNextText(endKey))

  // remove all of the nodes between range
  ancestor = document.getCommonAncestor(startKey, endKey)
  startChild = ancestor.getHighestChild(startKey)
  endChild = ancestor.getHighestChild(endKey)
  const startIndex = ancestor.nodes.indexOf(startChild)
  const endIndex = ancestor.nodes.indexOf(endChild)
  const middles = ancestor.nodes.slice(startIndex + 1, endIndex + 1)

  if (middles.size) {
    // remove first nodes directly so the document is not normalized
    middles.forEach(child => {
      transform.removeNodeByKey(child.key, { normalize: false })
    })
  }

  if (startBlock.key !== endBlock.key) {
    endBlock.nodes.forEach((child, i) => {
      const newKey = startBlock.key
      const newIndex = startBlock.nodes.size + i
      transform.moveNodeByKey(child.key, newKey, newIndex, { normalize: false })
    })

    const lonely = document.getFurthest(endBlock, p => p.nodes.size == 1) || endBlock
    transform.removeNodeByKey(lonely.key, { normalize: false })
  }

  if (normalize) {
    transform.normalizeNodeByKey(ancestor.key)
  }

  transform.normalizeDocument()

  return transform
}

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function deleteBackwardAtRange(transform, range, n = 1, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const { startKey, focusOffset } = range
  const text = document.getDescendant(startKey)
  const block = document.getClosestBlock(startKey)
  const inline = document.getClosestInline(startKey)

  if (range.isExpanded) {
    return transform.deleteAtRange(range, { normalize })
  }

  if (block && block.isVoid) {
    return transform.removeNodeByKey(block.key, { normalize })
  }

  if (inline && inline.isVoid) {
    return transform.removeNodeByKey(inline.key, { normalize })
  }

  if (range.isAtStartOf(document)) {
    return transform
  }

  if (range.isAtStartOf(text)) {
    const prev = document.getPreviousText(text)
    const prevBlock = document.getClosestBlock(prev)
    const prevInline = document.getClosestInline(prev)

    if (prevBlock && prevBlock.isVoid) {
      return transform.removeNodeByKey(prevBlock.key, { normalize })
    }

    if (prevInline && prevInline.isVoid) {
      return transform.removeNodeByKey(prevInline.key, { normalize })
    }

    range = range.merge({
      anchorKey: prev.key,
      anchorOffset: prev.length,
    })

    return transform.deleteAtRange(range, { normalize })
  }

  range = range.merge({
    focusOffset: focusOffset - n,
    isBackward: true,
  })

  return transform.deleteAtRange(range, { normalize })
}

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function deleteForwardAtRange(transform, range, n = 1, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const { startKey, focusOffset } = range
  const text = document.getDescendant(startKey)
  const inline = document.getClosestInline(startKey)
  const block = document.getClosestBlock(startKey)

  if (range.isExpanded) {
    return transform.deleteAtRange(range, { normalize })
  }

  if (block && block.isVoid) {
    return transform.removeNodeByKey(block.key, { normalize })
  }

  if (inline && inline.isVoid) {
    return transform.removeNodeByKey(inline.key, { normalize })
  }

  if (range.isAtEndOf(document)) {
    return transform
  }

  if (range.isAtEndOf(text)) {
    const next = document.getNextText(text)
    const nextBlock = document.getClosestBlock(next)
    const nextInline = document.getClosestInline(next)

    if (nextBlock && nextBlock.isVoid) {
      return transform.removeNodeByKey(nextBlock.key, { normalize })
    }

    if (nextInline && nextInline.isVoid) {
      return transform.removeNodeByKey(nextInline.key, { normalize })
    }

    range = range.merge({
      focusKey: next.key,
      focusOffset: 0
    })

    return transform.deleteAtRange(range, { normalize })
  }

  range = range.merge({
    focusOffset: focusOffset + n
  })

  return transform.deleteAtRange(range, { normalize })
}

/**
 * Insert a `block` node at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Block or String or Object} block
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function insertBlockAtRange(transform, range, block, options = {}) {
  block = Normalize.block(block)
  const { normalize = true } = options

  if (range.isExpanded) {
    transform.deleteAtRange(range)
    range = range.collapseToStart()
  }

  const { state } = transform
  const { document } = state
  const { startKey, startOffset } = range
  const startText = document.assertDescendant(startKey)
  const startBlock = document.getClosestBlock(startKey)
  const parent = document.getParent(startBlock)
  const index = parent.nodes.indexOf(startBlock)

  if (startBlock.isVoid) {
    transform.insertNodeByKey(parent.key, index + 1, block, { normalize })
  }

  else if (startBlock.isEmpty) {
    transform.removeNodeByKey(startBlock.key)
    transform.insertNodeByKey(parent.key, index, block, { normalize })
  }

  else if (range.isAtStartOf(startBlock)) {
    transform.insertNodeByKey(parent.key, index, block, { normalize })
  }

  else if (range.isAtEndOf(startBlock)) {
    transform.insertNodeByKey(parent.key, index + 1, block, { normalize })
  }

  else {
    const offset = startBlock.getOffset(startText) + startOffset
    transform.splitNodeByKey(startBlock.key, offset, { normalize })
    transform.insertNodeByKey(parent.key, index + 1, block, { normalize })
  }

  if (normalize) {
    transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Document} fragment
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function insertFragmentAtRange(transform, range, fragment, options = {}) {
  const { normalize = true } = options

  if (range.isExpanded) {
    transform = transform.deleteAtRange(range, { normalize: false })
    range = range.collapseToStart()
  }

  if (!fragment.length) {
    return transform
  }

  fragment = fragment.mapDescendants(child => child.regenerateKey())

  const { startKey, startOffset } = range
  let { state } = transform
  let { document } = state
  let startText = document.getDescendant(startKey)
  let startBlock = document.getClosestBlock(startText)
  let startChild = startBlock.getHighestChild(startText)
  const parent = document.getParent(startBlock)
  const index = parent.nodes.indexOf(startBlock)
  const offset = startChild == startText
    ? startOffset
    : startChild.getOffset(startText) + startOffset

  const blocks = fragment.getBlocks()
  const firstBlock = blocks.first()
  const lastBlock = blocks.last()

  if (firstBlock != lastBlock) {
    const lonelyParent = fragment.getFurthest(firstBlock, p => p.nodes.size == 1)
    const lonelyChild = lonelyParent || firstBlock
    const startIndex = parent.nodes.indexOf(startBlock)
    fragment = fragment.removeDescendant(lonelyChild)

    fragment.nodes.forEach((node, i) => {
      const newIndex = startIndex + i + 1
      transform = transform.insertNodeByKey(parent.key, newIndex, node, { normalize: false })
    })
  }

  if (startOffset != 0) {
    transform.splitNodeByKey(startChild.key, offset, { normalize: false })
  }

  state = transform.state
  document = state.document
  startText = document.getDescendant(startKey)
  startBlock = document.getClosestBlock(startKey)
  startChild = startBlock.getHighestChild(startText)

  if (firstBlock != lastBlock) {
    const nextChild = startBlock.getNextSibling(startChild)
    const nextNodes = startBlock.nodes.skipUntil(n => n == nextChild)
    const lastIndex = lastBlock.nodes.size

    nextNodes.forEach((node, i) => {
      const newIndex = lastIndex + i
      transform.moveNodeByKey(node.key, lastBlock.key, newIndex, { normalize: false })
    })
  }

  if (startBlock.isEmpty) {
    transform.removeNodeByKey(startBlock.key, { normalize: false })
    transform.insertNodeByKey(parent.key, index, firstBlock, { normalize: false })
  } else {
    const inlineChild = startBlock.getHighestChild(startText)
    const inlineIndex = startBlock.nodes.indexOf(inlineChild)

    firstBlock.nodes.forEach((inline, i) => {
      const o = startOffset == 0 ? 0 : 1
      const newIndex = inlineIndex + i + o
      transform.insertNodeByKey(startBlock.key, newIndex, inline, { normalize: false })
    })
  }

  if (normalize) {
    transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Inline or String or Object} inline
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function insertInlineAtRange(transform, range, inline, options = {}) {
  const { normalize = true } = options
  inline = Normalize.inline(inline)

  if (range.isExpanded) {
    transform.deleteAtRange(range, { normalize: false })
    range = range.collapseToStart()
  }

  const { state } = transform
  const { document } = state
  const { startKey, startOffset } = range
  const parent = document.getParent(startKey)
  const startText = document.assertDescendant(startKey)
  const index = parent.nodes.indexOf(startText)

  if (parent.isVoid) {
    return transform
  }

  transform.splitNodeByKey(startKey, startOffset, { normalize: false })
  transform.insertNodeByKey(parent.key, index + 1, inline, { normalize: false })

  if (normalize) {
    transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String} text
 * @param {Set} marks (optional)
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function insertTextAtRange(transform, range, text, marks, options = {}) {
  let { normalize } = options
  const { state } = transform
  const { document } = state
  const { startKey, startOffset } = range
  const parent = document.getParent(startKey)

  if (parent.isVoid) {
    return transform
  }

  if (range.isExpanded) {
    transform = transform.deleteAtRange(range, { normalize: false })
  }

  // Unless specified, don't normalize if only inserting text
  if (normalize !== undefined) {
    normalize = range.isExpanded
  }

  return transform.insertTextByKey(startKey, startOffset, text, marks, { normalize })
}

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mark or String} mark (optional)
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function removeMarkAtRange(transform, range, mark, options = {}) {
  const { normalize = true } = options
  if (range.isCollapsed) {
    return transform
  }

  const { state } = transform
  const { document } = state
  const texts = document.getTextsAtRange(range)
  const { startKey, startOffset, endKey, endOffset } = range

  texts.forEach((text) => {
    const { key } = text
    let index = 0
    let length = text.length

    if (key == startKey) index = startOffset
    if (key == endKey) length = endOffset
    if (key == startKey && key == endKey) length = endOffset - startOffset

    transform.removeMarkByKey(key, index, length, mark, { normalize })
  })

  return transform
}

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object || String} properties
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function setBlockAtRange(transform, range, properties, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const blocks = document.getBlocksAtRange(range)

  blocks.forEach((block) => {
    transform.setNodeByKey(block.key, properties, { normalize })
  })

  return transform
}

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object || String} properties
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function setInlineAtRange(transform, range, properties, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const inlines = document.getInlinesAtRange(range)

  inlines.forEach((inline) => {
    transform.setNodeByKey(inline.key, properties, { normalize})
  })

  return transform
}

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function splitBlockAtRange(transform, range, height = 1, options = {}) {
  const { normalize = true } = options
  if (range.isExpanded) {
    transform.deleteAtRange(range, { normalize })
    range = range.collapseToStart()
  }

  const { startKey, startOffset } = range
  const { state } = transform
  const { document } = state
  let node = document.assertDescendant(startKey)
  let parent = document.getClosestBlock(node)
  let offset = startOffset
  let h = 0

  while (parent && parent.kind == 'block' && h < height) {
    offset += parent.getOffset(node)
    node = parent
    parent = document.getClosestBlock(parent)
    h++
  }

  transform.splitNodeByKey(node.key, offset, { normalize })

  return transform
}

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function splitInlineAtRange(transform, range, height = Infinity, options = {}) {
  const { normalize = true } = options
  if (range.isExpanded) {
    transform.deleteAtRange(range, { normalize })
    range = range.collapseToStart()
  }

  const { startKey, startOffset } = range
  const { state } = transform
  const { document } = state
  let node = document.assertDescendant(startKey)
  let parent = document.getClosestInline(node)
  let offset = startOffset
  let h = 0

  while (parent && parent.kind == 'inline' && h < height) {
    offset += parent.getOffset(node)
    node = parent
    parent = document.getClosestInline(parent)
    h++
  }

  return transform.splitNodeByKey(node.key, offset, { normalize })
}

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function toggleMarkAtRange(transform, range, mark, options = {}) {
  const { normalize = true } = options
  if (range.isCollapsed) {
    return transform
  }

  mark = Normalize.mark(mark)

  const { state } = transform
  const { document } = state
  const marks = document.getMarksAtRange(range)
  const exists = marks.some(m => m.equals(mark))

  if (exists) {
    transform.removeMarkAtRange(range, mark, { normalize })
  } else {
    transform.addMarkAtRange(range, mark, { normalize })
  }

  return transform
}

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String or Object} properties
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function unwrapBlockAtRange(transform, range, properties, options = {}) {
  const { normalize = true } = options
  properties = Normalize.nodeProperties(properties)

  let { state } = transform
  let { document } = state
  const blocks = document.getBlocksAtRange(range)
  const wrappers = blocks
    .map((block) => {
      return document.getClosest(block, (parent) => {
        if (parent.kind != 'block') return false
        if (properties.type != null && parent.type != properties.type) return false
        if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false
        if (properties.data != null && !parent.data.isSuperset(properties.data)) return false
        return true
      })
    })
    .filter(exists => exists)
    .toOrderedSet()
    .toList()

  wrappers.forEach((block) => {
    const first = block.nodes.first()
    const last = block.nodes.last()
    const parent = document.getParent(block)
    const index = parent.nodes.indexOf(block)

    const children = block.nodes.filter((child) => {
      return blocks.some(b => child == b || child.hasDescendant(b))
    })

    const firstMatch = children.first()
    let lastMatch = children.last()

    if (first == firstMatch && last == lastMatch) {
      block.nodes.forEach((child, i) => {
        transform.moveNodeByKey(child.key, parent.key, index + i, { normalize: false })
      })

      transform.removeNodeByKey(block.key, { normalize: false })
    }

    else if (last == lastMatch) {
      block.nodes
        .skipUntil(n => n == firstMatch)
        .forEach((child, i) => {
          transform.moveNodeByKey(child.key, parent.key, index + 1 + i, { normalize: false })
        })
    }

    else if (first == firstMatch) {
      block.nodes
        .takeUntil(n => n == lastMatch)
        .push(lastMatch)
        .forEach((child, i) => {
          transform.moveNodeByKey(child.key, parent.key, index + i, { normalize: false })
        })
    }

    else {
      const offset = block.getOffset(firstMatch)

      transform.splitNodeByKey(block.key, offset, { normalize: false })
      state = transform.state
      document = state.document
      const extra = document.getPreviousSibling(firstMatch)

      children.forEach((child, i) => {
        transform.moveNodeByKey(child.key, parent.key, index + 1 + i, { normalize: false })
      })

      transform.removeNodeByKey(extra.key, { normalize: false })
    }
  })

  // TODO: optmize to only normalize the right block
  if (normalize) {
    transform.normalizeDocument()
  }

  return transform
}

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String or Object} properties
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function unwrapInlineAtRange(transform, range, properties, options = {}) {
  properties = Normalize.nodeProperties(properties)

  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const texts = document.getTextsAtRange(range)
  const inlines = texts
    .map((text) => {
      return document.getClosest(text, (parent) => {
        if (parent.kind != 'inline') return false
        if (properties.type != null && parent.type != properties.type) return false
        if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false
        if (properties.data != null && !parent.data.isSuperset(properties.data)) return false
        return true
      })
    })
    .filter(exists => exists)
    .toOrderedSet()
    .toList()

  inlines.forEach((inline) => {
    const parent = document.getParent(inline)
    const index = parent.nodes.indexOf(inline)

    inline.nodes.forEach((child, i) => {
      transform.moveNodeByKey(child.key, parent.key, index + i, { normalize: false })
    })
  })

  // TODO: optmize to only normalize the right block
  if (normalize) {
    transform.normalizeDocument()
  }

  return transform
}

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Block || Object || String} block
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function wrapBlockAtRange(transform, range, block, options = {}) {
  block = Normalize.block(block)
  block = block.merge({ nodes: block.nodes.clear() })

  const { normalize = true } = options
  const { state } = transform
  const { document } = state

  const blocks = document.getBlocksAtRange(range)
  const firstblock = blocks.first()
  const lastblock = blocks.last()
  let parent, siblings, index

  // if there is only one block in the selection then we know the parent and siblings
  if (blocks.length === 1) {
    parent = document.getParent(firstblock)
    siblings = blocks
  }

  // determine closest shared parent to all blocks in selection
  else {
    parent = document.getClosest(firstblock, p1 => {
      return !!document.getClosest(lastblock, p2 => p1 == p2)
    })
  }

  // if no shared parent could be found then the parent is the document
  if (parent == null) parent = document

  // create a list of direct children siblings of parent that fall in the selection
  if (siblings == null) {
    const indexes = parent.nodes.reduce((ind, node, i) => {
      if (node == firstblock || node.hasDescendant(firstblock)) ind[0] = i
      if (node == lastblock || node.hasDescendant(lastblock)) ind[1] = i
      return ind
    }, [])

    index = indexes[0]
    siblings = parent.nodes.slice(indexes[0], indexes[1] + 1)
  }

  // get the index to place the new wrapped node at
  if (index == null) {
    index = parent.nodes.indexOf(siblings.first())
  }

  // inject the new block node into the parent
  transform = transform.insertNodeByKey(parent.key, index, block, { normalize: false })

  // move the sibling nodes into the new block node
  siblings.forEach((node, i) => {
    transform = transform.moveNodeByKey(node.key, block.key, i, { normalize: false })
  })

  if (normalize) {
    transform = transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Inline || Object || String} inline
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function wrapInlineAtRange(transform, range, inline, options = {}) {
  if (range.isCollapsed) return transform

  inline = Normalize.inline(inline)
  inline = inline.merge({ nodes: inline.nodes.clear() })

  const { normalize = true } = options
  const { startKey, startOffset, endKey, endOffset } = range
  let { state } = transform
  let { document } = state
  const blocks = document.getBlocksAtRange(range)
  let startBlock = document.getClosestBlock(startKey)
  let endBlock = document.getClosestBlock(endKey)
  let startChild = startBlock.getHighestChild(startKey)
  let endChild = endBlock.getHighestChild(endKey)
  const startIndex = startBlock.nodes.indexOf(startChild)
  const endIndex = endBlock.nodes.indexOf(endChild)

  const startOff = startChild.key == startKey
    ? startOffset
    : startChild.getOffset(startKey) + startOffset

  const endOff = endChild.key == endKey
    ? endOffset
    : endChild.getOffset(endKey) + endOffset

  if (startBlock == endBlock) {
    if (endOff != endChild.length) {
      transform.splitNodeByKey(endChild.key, endOff, { normalize: false })
    }

    if (startOff != 0) {
      transform.splitNodeByKey(startChild.key, startOff, { normalize: false })
    }

    state = transform.state
    document = state.document
    startBlock = document.getClosestBlock(startKey)
    startChild = startBlock.getHighestChild(startKey)

    const startInner = startOff == 0
      ? startChild
      : document.getNextSibling(startChild)

    const startInnerIndex = startBlock.nodes.indexOf(startInner)

    const endInner = startKey == endKey ? startInner : startBlock.getHighestChild(endKey)
    const inlines = startBlock.nodes
      .skipUntil(n => n == startInner)
      .takeUntil(n => n == endInner)
      .push(endInner)

    const node = inline.regenerateKey()

    transform.insertNodeByKey(startBlock.key, startInnerIndex, node, { normalize: false })

    inlines.forEach((child, i) => {
      transform.moveNodeByKey(child.key, node.key, i, { normalize: false })
    })

    if (normalize) {
      transform = transform.normalizeNodeByKey(startBlock.key)
    }
  }

  else {
    transform.splitNodeByKey(startChild.key, startOff, { normalize: false })
    transform.splitNodeByKey(endChild.key, endOff, { normalize: false })

    state = transform.state
    document = state.document
    startBlock = document.getDescendant(startBlock.key)
    endBlock = document.getDescendant(endBlock.key)

    const startInlines = startBlock.nodes.slice(startIndex + 1)
    const endInlines = endBlock.nodes.slice(0, endIndex + 1)
    const startNode = inline.regenerateKey()
    const endNode = inline.regenerateKey()

    transform.insertNodeByKey(startBlock.key, startIndex - 1, startNode, { normalize: false })
    transform.insertNodeByKey(endBlock.key, endIndex, endNode, { normalize: false })

    startInlines.forEach((child, i) => {
      transform.moveNodeByKey(child.key, startNode.key, i, { normalize: false })
    })

    endInlines.forEach((child, i) => {
      transform.moveNodeByKey(child.key, endNode.key, i, { normalize: false })
    })

    if (normalize) {
      transform = transform
        .normalizeNodeByKey(startBlock.key)
        .normalizeNodeByKey(endBlock.key)
    }

    blocks.slice(1, -1).forEach((block) => {
      const node = inline.regenerateKey()
      transform.insertNodeByKey(block.key, 0, node, { normalize: false })

      block.nodes.forEach((child, i) => {
        transform.moveNodeByKey(child.key, node.key, i, { normalize: false })
      })

      if (normalize) {
        transform = transform.normalizeNodeByKey(block.key)
      }
    })
  }

  return transform
}

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function wrapTextAtRange(transform, range, prefix, suffix = prefix, options = {}) {
  const { normalize = true } = options
  const { startKey, endKey } = range
  const start = range.collapseToStart()
  let end = range.collapseToEnd()

  if (startKey == endKey) {
    end = end.moveForward(prefix.length)
  }

  transform.insertTextAtRange(start, prefix, [], { normalize })
  transform.insertTextAtRange(end, suffix, [], { normalize })

  return transform
}
