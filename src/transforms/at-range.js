
import Block from '../models/block'
import Inline from '../models/inline'
import Normalize from '../utils/normalize'
import Selection from '../models/selection'
import Text from '../models/text'
import isInRange from '../utils/is-in-range'
import uid from '../utils/uid'
import { List, Set } from 'immutable'

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mixed} mark
 * @return {Transform}
 */

export function addMarkAtRange(transform, range, mark) {
  if (range.isCollapsed) return transform

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

    transform.addMarkByKey(key, index, length, mark)
  })

  return transform
}

/**
 * Delete everything in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @return {Transform}
 */

export function deleteAtRange(transform, range) {
  if (range.isCollapsed) return transform

  const { startKey, startOffset, endKey, endOffset } = range

  if (startKey == endKey) {
    const index = startOffset
    const length = endOffset - startOffset
    return transform.removeTextByKey(startKey, index, length)
  }

  let { state } = transform
  let { document } = state
  let ancestor = document.getCommonAncestor(startKey, endKey)
  let startChild = ancestor.getHighestChild(startKey)
  let endChild = ancestor.getHighestChild(endKey)
  const startOff = startChild.getOffset(startKey) + startOffset
  const endOff = endChild.getOffset(endKey) + endOffset

  transform.splitNodeByKey(startChild.key, startOff)
  transform.splitNodeByKey(endChild.key, endOff)

  state = transform.state
  document = state.document
  ancestor = document.getCommonAncestor(startKey, endKey)
  const startBlock = document.getClosestBlock(startKey)
  const endBlock = document.getClosestBlock(document.getNextText(endKey))
  startChild = ancestor.getHighestChild(startBlock)
  endChild = ancestor.getHighestChild(endBlock)

  const startIndex = ancestor.nodes.indexOf(startChild)
  const endIndex = ancestor.nodes.indexOf(endChild)
  const middles = ancestor.nodes.slice(startIndex + 1, endIndex)

  middles.forEach((child) => {
    transform.removeNodeByKey(child.key)
  })

  endBlock.nodes.forEach((child, i) => {
    const newKey = startBlock.key
    const newIndex = startBlock.nodes.size + i
    transform.moveNodeByKey(child.key, newKey, newIndex)
  })

  const lonely = document.getFurthest(endBlock, p => p.nodes.size == 1) || endBlock
  transform.removeNodeByKey(lonely.key)
  transform.normalizeDocument()
  return transform
}

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function deleteBackwardAtRange(transform, range, n = 1) {
  const { state } = transform
  const { document } = state
  const { startKey, focusOffset } = range
  const text = document.getDescendant(startKey)
  const block = document.getClosestBlock(startKey)
  const inline = document.getClosestInline(startKey)

  if (range.isExpanded) {
    return transform.deleteAtRange(range)
  }

  if (block && block.isVoid) {
    return transform.removeNodeByKey(block.key)
  }

  if (inline && inline.isVoid) {
    return transform.removeNodeByKey(inline.key)
  }

  if (range.isAtStartOf(document)) {
    return transform
  }

  if (range.isAtStartOf(text)) {
    const prev = document.getPreviousText(text)
    const prevBlock = document.getClosestBlock(prev)
    const prevInline = document.getClosestInline(prev)

    if (prevBlock && prevBlock.isVoid) {
      return transform.removeNodeByKey(prevBlock.key)
    }

    if (prevInline && prevInline.isVoid) {
      return transform.removeNodeByKey(prevInline.key)
    }

    range = range.merge({
      anchorKey: prev.key,
      anchorOffset: prev.length,
    })

    return transform.deleteAtRange(range)
  }

  range = range.merge({
    focusOffset: focusOffset - n,
    isBackward: true,
  })

  return transform.deleteAtRange(range)
}

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function deleteForwardAtRange(transform, range, n = 1) {
  const { state } = transform
  const { document } = state
  const { startKey, focusOffset } = range
  const text = document.getDescendant(startKey)
  const inline = document.getClosestInline(startKey)
  const block = document.getClosestBlock(startKey)

  if (range.isExpanded) {
    return transform.deleteAtRange(range)
  }

  if (block && block.isVoid) {
    return transform.removeNodeByKey(block.key)
  }

  if (inline && inline.isVoid) {
    return transform.removeNodeByKey(inline.key)
  }

  if (range.isAtEndOf(document)) {
    return transform
  }

  if (range.isAtEndOf(text)) {
    const next = document.getNextText(text)
    const nextBlock = document.getClosestBlock(next)
    const nextInline = document.getClosestInline(next)

    if (nextBlock && nextBlock.isVoid) {
      return transform.removeNodeByKey(nextBlock.key)
    }

    if (nextInline && nextInline.isVoid) {
      return transform.removeNodeByKey(nextInline.key)
    }

    range = range.merge({
      focusKey: next.key,
      focusOffset: 0
    })

    return transform.deleteAtRange(range)
  }

  range = range.merge({
    focusOffset: focusOffset + n
  })

  return transform.deleteAtRange(range)
}

/**
 * Insert a `block` node at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Block or String or Object} block
 * @return {Transform}
 */

export function insertBlockAtRange(transform, range, block) {
  block = Normalize.block(block)

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
    transform.insertNodeByKey(parent.key, index + 1, block)
  }

  else if (startBlock.isEmpty) {
    transform.removeNodeByKey(startBlock.key)
    transform.insertNodeByKey(parent.key, index, block)
  }

  else if (range.isAtStartOf(startBlock)) {
    transform.insertNodeByKey(parent.key, index, block)
  }

  else if (range.isAtEndOf(startBlock)) {
    transform.insertNodeByKey(parent.key, index + 1, block)
  }

  else {
    const offset = startBlock.getOffset(startText) + startOffset
    transform.splitNodeByKey(startBlock.key, offset)
    transform.insertNodeByKey(parent.key, index + 1, block)
  }

  transform.normalizeDocument()
  return transform
}

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Document} fragment
 * @return {Transform}
 */

export function insertFragmentAtRange(transform, range, fragment) {
  if (range.isExpanded) {
    transform.deleteAtRange(range)
    range = range.collapseToStart()
  }

  if (!fragment.length) return transform

  fragment = fragment.mapDescendants(child => child.set('key', uid()))

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
      transform.insertNodeByKey(parent.key, newIndex, node)
    })
  }

  transform.splitNodeByKey(startChild.key, offset)

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
      transform.moveNodeByKey(node.key, lastBlock.key, newIndex)
    })
  }

  if (startBlock.isEmpty) {
    transform.removeNodeByKey(startBlock.key)
    transform.insertNodeByKey(parent.key, index, firstBlock)
  } else {
    const inlineChild = startBlock.getHighestChild(startText)
    const inlineIndex = startBlock.nodes.indexOf(inlineChild)

    firstBlock.nodes.forEach((inline, i) => {
      const newIndex = inlineIndex + i + 1
      transform.insertNodeByKey(startBlock.key, newIndex, inline)
    })
  }

  transform.normalizeDocument()
  return transform
}

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Inline or String or Object} inline
 * @return {Transform}
 */

export function insertInlineAtRange(transform, range, inline) {
  inline = Normalize.inline(inline)

  if (range.isExpanded) {
    transform.deleteAtRange(range)
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

  transform.splitNodeByKey(startKey, startOffset)
  transform.insertNodeByKey(parent.key, index + 1, inline)
  transform.normalizeDocument()
  return transform
}

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String} text
 * @param {Set} marks (optional)
 * @return {Transform}
 */

export function insertTextAtRange(transform, range, text, marks) {
  const { state } = transform
  const { document } = state
  const { startKey, startOffset } = range
  const parent = document.getParent(startKey)

  if (parent.isVoid) {
    return transform
  }

  if (range.isExpanded) {
    transform.deleteAtRange(range)
  }

  transform.insertTextByKey(startKey, startOffset, text, marks)
  return transform
}

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mark or String} mark (optional)
 * @return {Transform}
 */

export function removeMarkAtRange(transform, range, mark) {
  if (range.isCollapsed) return transform

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

    transform.removeMarkByKey(key, index, length, mark)
  })

  return transform
}

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object || String} properties
 * @return {Transform}
 */

export function setBlockAtRange(transform, range, properties) {
  const { state } = transform
  const { document } = state
  const blocks = document.getBlocksAtRange(range)

  blocks.forEach((block) => {
    transform.setNodeByKey(block.key, properties)
  })

  return transform
}

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object || String} properties
 * @return {Transform}
 */

export function setInlineAtRange(transform, range, properties) {
  const { state } = transform
  const { document } = state
  const inlines = document.getInlinesAtRange(range)

  inlines.forEach((inline) => {
    transform.setNodeByKey(inline.key, properties)
  })

  return transform
}

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} height (optional)
 * @return {Transform}
 */

export function splitBlockAtRange(transform, range, height = 1) {
  if (range.isExpanded) {
    transform.deleteAtRange(range)
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

  transform.splitNodeByKey(node.key, offset)
  transform.normalizeDocument()
  return transform
}

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} height (optiona)
 * @return {Transform}
 */

export function splitInlineAtRange(transform, range, height = Infinity) {
  if (range.isExpanded) {
    transform.deleteAtRange(range)
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

  return transform.splitNodeByKey(node.key, offset)
}

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mixed} mark
 * @return {Transform}
 */

export function toggleMarkAtRange(transform, range, mark) {
  if (range.isCollapsed) return transform

  mark = Normalize.mark(mark)

  const { state } = transform
  const { document } = state
  const marks = document.getMarksAtRange(range)
  const exists = marks.some(m => m.equals(mark))

  if (exists) {
    transform.removeMarkAtRange(range, mark)
  } else {
    transform.addMarkAtRange(range, mark)
  }

  return transform
}

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String or Object} properties
 * @return {Transform}
 */

export function unwrapBlockAtRange(transform, range, properties) {
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
        transform.moveNodeByKey(child.key, parent.key, index + i)
      })

      transform.removeNodeByKey(block.key)
    }

    else if (last == lastMatch) {
      block.nodes
        .skipUntil(n => n == firstMatch)
        .forEach((child, i) => {
          transform.moveNodeByKey(child.key, parent.key, index + 1 + i)
        })
    }

    else if (first == firstMatch) {
      block.nodes
        .takeUntil(n => n == lastMatch)
        .push(lastMatch)
        .forEach((child, i) => {
          transform.moveNodeByKey(child.key, parent.key, index + i)
        })
    }

    else {
      const offset = block.getOffset(firstMatch)

      transform.splitNodeByKey(block.key, offset)
      state = transform.state
      document = state.document
      const extra = document.getPreviousSibling(firstMatch)

      children.forEach((child, i) => {
        transform.moveNodeByKey(child.key, parent.key, index + 1 + i)
      })

      transform.removeNodeByKey(extra.key)
    }
  })

  transform.normalizeDocument()
  return transform
}

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String or Object} properties
 * @return {Transform}
 */

export function unwrapInlineAtRange(transform, range, properties) {
  properties = Normalize.nodeProperties(properties)

  const { state } = transform
  const { document } = state
  const texts = document.getTexts()
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
      transform.moveNodeByKey(child.key, parent.key, index + i)
    })
  })

  transform.normalizeDocument()
  return transform
}

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Block || Object || String} block
 * @return {Transform}
 */

export function wrapBlockAtRange(transform, range, block) {
  block = Normalize.block(block)

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
  if (parent != document) {
    transform.insertNodeByKey(parent.key, index, block)
  } else {
    transform.insertNodeOperation([], index, block)
  }

  // move the sibling nodes into the new block node
  siblings.forEach((node, i) => {
    transform.moveNodeByKey(node.key, block.key, i)
  })

  return transform
}

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Inline || Object || String} inline
 * @return {Transform}
 */

export function wrapInlineAtRange(transform, range, inline) {
  if (range.isCollapsed) return transform

  inline = Normalize.inline(inline)

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
    transform.splitNodeByKey(endChild.key, endOff)
    transform.splitNodeByKey(startChild.key, startOff)

    state = transform.state
    document = state.document
    startBlock = document.getClosestBlock(startKey)
    startChild = startBlock.getHighestChild(startKey)
    const startInner = document.getNextSibling(startChild)
    const startInnerIndex = startBlock.nodes.indexOf(startInner)
    const endInner = startKey == endKey ? startInner : startBlock.getHighestChild(endKey)
    const inlines = startBlock.nodes
      .skipUntil(n => n == startInner)
      .takeUntil(n => n == endInner)
      .push(endInner)

    const node = inline.merge({ key: uid() })

    transform.insertNodeByKey(startBlock.key, startInnerIndex, node)

    inlines.forEach((child, i) => {
      transform.moveNodeByKey(child.key, node.key, i)
    })
  }

  else {
    transform.splitNodeByKey(startChild.key, startOff)
    transform.splitNodeByKey(endChild.key, endOff)

    state = transform.state
    document = state.document
    startBlock = document.getDescendant(startBlock.key)
    endBlock = document.getDescendant(endBlock.key)

    const startInlines = startBlock.nodes.slice(startIndex + 1)
    const endInlines = endBlock.nodes.slice(0, endIndex + 1)
    const startNode = inline.merge({ key: uid() })
    const endNode = inline.merge({ key: uid() })

    transform.insertNodeByKey(startBlock.key, startIndex - 1, startNode)
    transform.insertNodeByKey(endBlock.key, endIndex, endNode)

    startInlines.forEach((child, i) => {
      transform.moveNodeByKey(child.key, startNode.key, i)
    })

    endInlines.forEach((child, i) => {
      transform.moveNodeByKey(child.key, endNode.key, i)
    })

    blocks.slice(1, -1).forEach((block) => {
      const node = inline.merge({ key: uid() })
      transform.insertNodeByKey(block.key, 0, node)

      block.nodes.forEach((child, i) => {
        transform.moveNodeByKey(child.key, node.key, i)
      })
    })
  }

  transform.normalizeDocument()
  return transform
}

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 * @return {Transform}
 */

export function wrapTextAtRange(transform, range, prefix, suffix = prefix) {
  const { startKey, endKey } = range
  const start = range.collapseToStart()
  let end = range.collapseToEnd()

  if (startKey == endKey) {
    end = end.moveForward(prefix.length)
  }

  transform.insertTextAtRange(start, prefix)
  transform.insertTextAtRange(end, suffix)
  return transform
}
