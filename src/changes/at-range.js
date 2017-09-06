
import Normalize from '../utils/normalize'
import String from '../utils/string'
import SCHEMA from '../schemas/core'
import { List } from 'immutable'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * An options object with normalize set to `false`.
 *
 * @type {Object}
 */

const OPTS = {
  normalize: false
}

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.addMarkAtRange = (change, range, mark, options = {}) => {
  if (range.isCollapsed) return

  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const { startKey, startOffset, endKey, endOffset } = range
  const texts = document.getTextsAtRange(range)

  texts.forEach((node) => {
    const { key } = node
    let index = 0
    let length = node.text.length

    if (key == startKey) index = startOffset
    if (key == endKey) length = endOffset
    if (key == startKey && key == endKey) length = endOffset - startOffset

    change.addMarkByKey(key, index, length, mark, { normalize })
  })
}

/**
 * Delete everything in a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteAtRange = (change, range, options = {}) => {
  if (range.isCollapsed) return

  change.snapshotSelection()

  const { normalize = true } = options
  let { startKey, startOffset, endKey, endOffset } = range

  // Split at the range edges within a common ancestor, without normalizing.
  let { state } = change
  let { document } = state
  let ancestor = document.getCommonAncestor(startKey, endKey)
  let startChild = ancestor.getFurthestAncestor(startKey)
  let endChild = ancestor.getFurthestAncestor(endKey)

  // If the start child is a void node, and the range begins or
  // ends (when range is backward) at the start of it, remove it
  // and set nextSibling as startChild until there is no startChild
  // that is a void node and included in the selection range
  let startChildIncludesVoid = startChild.isVoid && (
    range.anchorOffset === 0 && !range.isBackward ||
    range.focusOffset === 0 && range.isBackward
  )

  while (startChildIncludesVoid) {
    const nextSibling = document.getNextSibling(startChild.key)
    change.removeNodeByKey(startChild.key, OPTS)
    // Abort if no nextSibling or we are about to process the endChild which is aslo a void node
    if (!nextSibling || endChild.key === nextSibling.key && nextSibling.isVoid) {
      startChildIncludesVoid = false
      return
    }
    // Process the next void
    if (nextSibling.isVoid) {
      startChild = nextSibling
    }
    // Set the startChild, startKey and startOffset in the beginning of the next non void sibling
    if (!nextSibling.isVoid) {
      startChild = nextSibling
      if (startChild.getTexts) {
        startKey = startChild.getTexts().first().key
      } else {
        startKey = startChild.key
      }
      startOffset = 0
      startChildIncludesVoid = false
    }
  }

  // If the start child is a void node, and the range ends or
  // begins (when range is backward) at the end of it move to nextSibling
  const startChildEndOfVoid = startChild.isVoid && (
    range.anchorOffset === 1 && !range.isBackward ||
    range.focusOffset === 1 && range.isBackward
  )

  if (startChildEndOfVoid) {
    const nextSibling = document.getNextSibling(startChild.key)
    if (nextSibling) {
      startChild = nextSibling
      if (startChild.getTexts) {
        startKey = startChild.getTexts().first().key
      } else {
        startKey = startChild.key
      }
      startOffset = 0
    }
  }

  // If the start and end key are the same, we can just remove it.
  if (startKey == endKey) {
    // If it is a void node, remove the whole node
    if (ancestor.isVoid) {
      // Deselect if this is the only node left in document
      if (document.nodes.size === 1) {
        change.deselect()
      }
      change.removeNodeByKey(ancestor.key, OPTS)
      return
    }
    // Remove the text
    const index = startOffset
    const length = endOffset - startOffset
    change.removeTextByKey(startKey, index, length, { normalize })
    return
  }

  // Split at the range edges within a common ancestor, without normalizing.
  state = change.state
  document = state.document
  ancestor = document.getCommonAncestor(startKey, endKey)
  startChild = ancestor.getFurthestAncestor(startKey)
  endChild = ancestor.getFurthestAncestor(endKey)

  if (startChild.kind == 'text') {
    change.splitNodeByKey(startChild.key, startOffset, OPTS)
  } else {
    change.splitDescendantsByKey(startChild.key, startKey, startOffset, OPTS)
  }

  if (endChild.kind == 'text') {
    change.splitNodeByKey(endChild.key, endOffset, OPTS)
  } else {
    change.splitDescendantsByKey(endChild.key, endKey, endOffset, OPTS)
  }

  // Refresh variables.
  state = change.state
  document = state.document
  ancestor = document.getCommonAncestor(startKey, endKey)
  startChild = ancestor.getFurthestAncestor(startKey)
  endChild = ancestor.getFurthestAncestor(endKey)
  const startIndex = ancestor.nodes.indexOf(startChild)
  const endIndex = ancestor.nodes.indexOf(endChild)
  const middles = ancestor.nodes.slice(startIndex + 1, endIndex + 1)
  const next = document.getNextText(endKey)

  // Remove all of the middle nodes, between the splits.
  if (middles.size) {
    middles.forEach((child) => {
      change.removeNodeByKey(child.key, OPTS)
    })
  }

  // If the start and end block are different, move all of the nodes from the
  // end block into the start block.
  state = change.state
  document = state.document
  const startBlock = document.getClosestBlock(startKey)
  const endBlock = document.getClosestBlock(next.key)

  // If the endBlock is void, just remove the startBlock
  if (endBlock.isVoid) {
    change.removeNodeByKey(startBlock.key)
    return
  }

  // If the start and end block are different, move all of the nodes from the
  // end block into the start block
  if (startBlock.key !== endBlock.key) {
    endBlock.nodes.forEach((child, i) => {
      const newKey = startBlock.key
      const newIndex = startBlock.nodes.size + i
      change.moveNodeByKey(child.key, newKey, newIndex, OPTS)
    })

    // Remove parents of endBlock as long as they have a single child
    const lonely = document.getFurthestOnlyChildAncestor(endBlock.key) || endBlock
    change.removeNodeByKey(lonely.key, OPTS)
  }

  if (normalize) {
    change.normalizeNodeByKey(ancestor.key, SCHEMA)
  }
}

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteCharBackwardAtRange = (change, range, options) => {
  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const startBlock = document.getClosestBlock(startKey)
  const offset = startBlock.getOffset(startKey)
  const o = offset + startOffset
  const { text } = startBlock
  const n = String.getCharOffsetBackward(text, o)
  change.deleteBackwardAtRange(range, n, options)
}

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteLineBackwardAtRange = (change, range, options) => {
  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const startBlock = document.getClosestBlock(startKey)
  const offset = startBlock.getOffset(startKey)
  const o = offset + startOffset
  change.deleteBackwardAtRange(range, o, options)
}

/**
 * Delete backward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteWordBackwardAtRange = (change, range, options) => {
  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const startBlock = document.getClosestBlock(startKey)
  const offset = startBlock.getOffset(startKey)
  const o = offset + startOffset
  const { text } = startBlock
  const n = String.getWordOffsetBackward(text, o)
  change.deleteBackwardAtRange(range, n, options)
}

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteBackwardAtRange = (change, range, n = 1, options = {}) => {
  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const { startKey, focusOffset } = range

  // If the range is expanded, perform a regular delete instead.
  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize })
    return
  }

  const block = document.getClosestBlock(startKey)
  // If the closest block is void, delete it.
  if (block && block.isVoid) {
    change.removeNodeByKey(block.key, { normalize })
    return
  }
  // If the closest is not void, but empty, remove it
  if (block && !block.isVoid && block.isEmpty && document.nodes.size !== 1) {
    change.removeNodeByKey(block.key, { normalize })
    return
  }

  // If the closest inline is void, delete it.
  const inline = document.getClosestInline(startKey)
  if (inline && inline.isVoid) {
    change.removeNodeByKey(inline.key, { normalize })
    return
  }

  // If the range is at the start of the document, abort.
  if (range.isAtStartOf(document)) {
    return
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  const text = document.getDescendant(startKey)
  if (range.isAtStartOf(text)) {
    const prev = document.getPreviousText(text.key)
    const prevBlock = document.getClosestBlock(prev.key)
    const prevInline = document.getClosestInline(prev.key)

    // If the previous block is void, remove it.
    if (prevBlock && prevBlock.isVoid) {
      change.removeNodeByKey(prevBlock.key, { normalize })
      return
    }

    // If the previous inline is void, remove it.
    if (prevInline && prevInline.isVoid) {
      change.removeNodeByKey(prevInline.key, { normalize })
      return
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && prevBlock != block) {
      range = range.merge({
        anchorKey: prev.key,
        anchorOffset: prev.text.length,
      })

      change.deleteAtRange(range, { normalize })
      return
    }
  }

  // If the focus offset is farther than the number of characters to delete,
  // just remove the characters backwards inside the current node.
  if (n < focusOffset) {
    range = range.merge({
      focusOffset: focusOffset - n,
      isBackward: true,
    })

    change.deleteAtRange(range, { normalize })
    return
  }

  // Otherwise, we need to see how many nodes backwards to go.
  let node = text
  let offset = 0
  let traversed = focusOffset

  while (n > traversed) {
    node = document.getPreviousText(node.key)
    const next = traversed + node.text.length
    if (n <= next) {
      offset = next - n
      break
    } else {
      traversed = next
    }
  }

  // If the focus node is inside a void, go up until right after it.
  if (document.hasVoidParent(node.key)) {
    const parent = document.getClosestVoid(node.key)
    node = document.getNextText(parent.key)
    offset = 0
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset,
    isBackward: true
  })

  change.deleteAtRange(range, { normalize })
}

/**
 * Delete forward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteCharForwardAtRange = (change, range, options) => {
  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const startBlock = document.getClosestBlock(startKey)
  const offset = startBlock.getOffset(startKey)
  const o = offset + startOffset
  const { text } = startBlock
  const n = String.getCharOffsetForward(text, o)
  change.deleteForwardAtRange(range, n, options)
}

/**
 * Delete forward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteLineForwardAtRange = (change, range, options) => {
  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const startBlock = document.getClosestBlock(startKey)
  const offset = startBlock.getOffset(startKey)
  const o = offset + startOffset
  change.deleteForwardAtRange(range, o, options)
}

/**
 * Delete forward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteWordForwardAtRange = (change, range, options) => {
  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const startBlock = document.getClosestBlock(startKey)
  const offset = startBlock.getOffset(startKey)
  const o = offset + startOffset
  const { text } = startBlock
  const n = String.getWordOffsetForward(text, o)
  change.deleteForwardAtRange(range, n, options)
}

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteForwardAtRange = (change, range, n = 1, options = {}) => {
  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const { startKey, focusOffset } = range

  // If the range is expanded, perform a regular delete instead.
  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize })
    return
  }

  const block = document.getClosestBlock(startKey)
  // If the closest block is void, delete it.
  if (block && block.isVoid) {
    change.removeNodeByKey(block.key, { normalize })
    return
  }
  // If the closest is not void, but empty, remove it
  if (block && !block.isVoid && block.isEmpty && document.nodes.size !== 1) {
    change.removeNodeByKey(block.key, { normalize })
    return
  }

  // If the closest inline is void, delete it.
  const inline = document.getClosestInline(startKey)
  if (inline && inline.isVoid) {
    change.removeNodeByKey(inline.key, { normalize })
    return
  }

  // If the range is at the start of the document, abort.
  if (range.isAtEndOf(document)) {
    return
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  const text = document.getDescendant(startKey)
  if (range.isAtEndOf(text)) {
    const next = document.getNextText(text.key)
    const nextBlock = document.getClosestBlock(next.key)
    const nextInline = document.getClosestInline(next.key)

    // If the previous block is void, remove it.
    if (nextBlock && nextBlock.isVoid) {
      change.removeNodeByKey(nextBlock.key, { normalize })
      return
    }

    // If the previous inline is void, remove it.
    if (nextInline && nextInline.isVoid) {
      change.removeNodeByKey(nextInline.key, { normalize })
      return
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && nextBlock != block) {
      range = range.merge({
        focusKey: next.key,
        focusOffset: 0
      })

      change.deleteAtRange(range, { normalize })
      return
    }
  }

  // If the remaining characters to the end of the node is greater than or equal
  // to the number of characters to delete, just remove the characters forwards
  // inside the current node.
  if (n <= (text.text.length - focusOffset)) {
    range = range.merge({
      focusOffset: focusOffset + n
    })

    change.deleteAtRange(range, { normalize })
    return
  }

  // Otherwise, we need to see how many nodes forwards to go.
  let node = text
  let offset = focusOffset
  let traversed = text.text.length - focusOffset

  while (n > traversed) {
    node = document.getNextText(node.key)
    const next = traversed + node.text.length
    if (n <= next) {
      offset = n - traversed
      break
    } else {
      traversed = next
    }
  }

  // If the focus node is inside a void, go up until right before it.
  if (document.hasVoidParent(node.key)) {
    const parent = document.getClosestVoid(node.key)
    node = document.getPreviousText(parent.key)
    offset = node.text.length
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset,
  })

  change.deleteAtRange(range, { normalize })
}

/**
 * Insert a `block` node at `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Block|String|Object} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertBlockAtRange = (change, range, block, options = {}) => {
  block = Normalize.block(block)
  const { normalize = true } = options

  if (range.isExpanded) {
    change.deleteAtRange(range)
    range = range.collapseToStart()
  }

  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const startBlock = document.getClosestBlock(startKey)
  const parent = document.getParent(startBlock.key)
  const index = parent.nodes.indexOf(startBlock)

  if (startBlock.isVoid) {
    const extra = range.isAtEndOf(startBlock) ? 1 : 0
    change.insertNodeByKey(parent.key, index + extra, block, { normalize })
  }

  else if (startBlock.isEmpty) {
    change.removeNodeByKey(startBlock.key)
    change.insertNodeByKey(parent.key, index, block, { normalize })
  }

  else if (range.isAtStartOf(startBlock)) {
    change.insertNodeByKey(parent.key, index, block, { normalize })
  }

  else if (range.isAtEndOf(startBlock)) {
    change.insertNodeByKey(parent.key, index + 1, block, { normalize })
  }

  else {
    change.splitDescendantsByKey(startBlock.key, startKey, startOffset, OPTS)
    change.insertNodeByKey(parent.key, index + 1, block, { normalize })
  }

  if (normalize) {
    change.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Document} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertFragmentAtRange = (change, range, fragment, options = {}) => {
  const { normalize = true } = options

  // If the range is expanded, delete it first.
  if (range.isExpanded) {
    change.deleteAtRange(range, OPTS)
    range = range.collapseToStart()
  }

  // If the fragment is empty, there's nothing to do after deleting.
  if (!fragment.nodes.size) return

  // Regenerate the keys for all of the fragments nodes, so that they're
  // guaranteed not to collide with the existing keys in the document. Otherwise
  // they will be rengerated automatically and we won't have an easy way to
  // reference them.
  fragment = fragment.mapDescendants(child => child.regenerateKey())

  // Calculate a few things...
  const { startKey, startOffset } = range
  let { state } = change
  let { document } = state
  let startText = document.getDescendant(startKey)
  let startBlock = document.getClosestBlock(startText.key)
  let startChild = startBlock.getFurthestAncestor(startText.key)
  const isAtStart = range.isAtStartOf(startBlock)
  const parent = document.getParent(startBlock.key)
  const index = parent.nodes.indexOf(startBlock)
  const blocks = fragment.getBlocks()
  const firstBlock = blocks.first()
  const lastBlock = blocks.last()

  // If the fragment only contains a void block, use `insertBlock` instead.
  if (firstBlock == lastBlock && firstBlock.isVoid) {
    change.insertBlockAtRange(range, firstBlock, options)
    return
  }

  // If the first and last block aren't the same, we need to insert all of the
  // nodes after the fragment's first block at the index.
  if (firstBlock != lastBlock) {
    const lonelyParent = fragment.getFurthest(firstBlock.key, p => p.nodes.size == 1)
    const lonelyChild = lonelyParent || firstBlock
    const startIndex = parent.nodes.indexOf(startBlock)
    fragment = fragment.removeDescendant(lonelyChild.key)

    fragment.nodes.forEach((node, i) => {
      const newIndex = startIndex + i + 1
      change.insertNodeByKey(parent.key, newIndex, node, OPTS)
    })
  }

  // Check if we need to split the node.
  if (startOffset != 0) {
    change.splitDescendantsByKey(startChild.key, startKey, startOffset, OPTS)
  }

  // Update our variables with the new state.
  state = change.state
  document = state.document
  startText = document.getDescendant(startKey)
  startBlock = document.getClosestBlock(startKey)
  startChild = startBlock.getFurthestAncestor(startText.key)

  // If the first and last block aren't the same, we need to move any of the
  // starting block's children after the split into the last block of the
  // fragment, which has already been inserted.
  if (firstBlock != lastBlock) {
    const nextChild = isAtStart ? startChild : startBlock.getNextSibling(startChild.key)
    const nextNodes = nextChild ? startBlock.nodes.skipUntil(n => n.key == nextChild.key) : List()
    const lastIndex = lastBlock.nodes.size

    nextNodes.forEach((node, i) => {
      const newIndex = lastIndex + i
      change.moveNodeByKey(node.key, lastBlock.key, newIndex, OPTS)
    })
  }

  // If the starting block is empty, we replace it entirely with the first block
  // of the fragment, since this leads to a more expected behavior for the user.
  if (startBlock.isEmpty) {
    change.removeNodeByKey(startBlock.key, OPTS)
    change.insertNodeByKey(parent.key, index, firstBlock, OPTS)
  }

  // Otherwise, we maintain the starting block, and insert all of the first
  // block's inline nodes into it at the split point.
  else {
    const inlineChild = startBlock.getFurthestAncestor(startText.key)
    const inlineIndex = startBlock.nodes.indexOf(inlineChild)

    firstBlock.nodes.forEach((inline, i) => {
      const o = startOffset == 0 ? 0 : 1
      const newIndex = inlineIndex + i + o
      change.insertNodeByKey(startBlock.key, newIndex, inline, OPTS)
    })
  }

  // Normalize if requested.
  if (normalize) {
    change.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Inline|String|Object} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertInlineAtRange = (change, range, inline, options = {}) => {
  const { normalize = true } = options
  inline = Normalize.inline(inline)

  if (range.isExpanded) {
    change.deleteAtRange(range, OPTS)
    range = range.collapseToStart()
  }

  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const parent = document.getParent(startKey)
  const startText = document.assertDescendant(startKey)
  const index = parent.nodes.indexOf(startText)

  if (parent.isVoid) return

  change.splitNodeByKey(startKey, startOffset, OPTS)
  change.insertNodeByKey(parent.key, index + 1, inline, OPTS)

  if (normalize) {
    change.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertTextAtRange = (change, range, text, marks, options = {}) => {
  let { normalize } = options
  const { state } = change
  const { document } = state
  const { startKey, startOffset } = range
  const parent = document.getParent(startKey)

  if (parent.isVoid) return

  if (range.isExpanded) {
    change.deleteAtRange(range, OPTS)
  }

  // PERF: Unless specified, don't normalize if only inserting text.
  if (normalize !== undefined) {
    normalize = range.isExpanded
  }

  change.insertTextByKey(startKey, startOffset, text, marks, { normalize })
}

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Mark|String} mark (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeMarkAtRange = (change, range, mark, options = {}) => {
  if (range.isCollapsed) return

  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const texts = document.getTextsAtRange(range)
  const { startKey, startOffset, endKey, endOffset } = range

  texts.forEach((node) => {
    const { key } = node
    let index = 0
    let length = node.text.length

    if (key == startKey) index = startOffset
    if (key == endKey) length = endOffset
    if (key == startKey && key == endKey) length = endOffset - startOffset

    change.removeMarkByKey(key, index, length, mark, { normalize })
  })
}

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setBlockAtRange = (change, range, properties, options = {}) => {
  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const blocks = document.getBlocksAtRange(range)

  blocks.forEach((block) => {
    change.setNodeByKey(block.key, properties, { normalize })
  })
}

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setInlineAtRange = (change, range, properties, options = {}) => {
  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const inlines = document.getInlinesAtRange(range)

  inlines.forEach((inline) => {
    change.setNodeByKey(inline.key, properties, { normalize })
  })
}

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitBlockAtRange = (change, range, height = 1, options = {}) => {
  const { normalize = true } = options

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize })
    range = range.collapseToStart()
  }

  const { startKey, startOffset } = range
  const { state } = change
  const { document } = state
  let node = document.assertDescendant(startKey)
  let parent = document.getClosestBlock(node.key)
  let h = 0

  while (parent && parent.kind == 'block' && h < height) {
    node = parent
    parent = document.getClosestBlock(parent.key)
    h++
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, { normalize })
}

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitInlineAtRange = (change, range, height = Infinity, options = {}) => {
  const { normalize = true } = options

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize })
    range = range.collapseToStart()
  }

  const { startKey, startOffset } = range
  const { state } = change
  const { document } = state
  let node = document.assertDescendant(startKey)
  let parent = document.getClosestInline(node.key)
  let h = 0

  while (parent && parent.kind == 'inline' && h < height) {
    node = parent
    parent = document.getClosestInline(parent.key)
    h++
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, { normalize })
}

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.toggleMarkAtRange = (change, range, mark, options = {}) => {
  if (range.isCollapsed) return

  mark = Normalize.mark(mark)

  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const marks = document.getActiveMarksAtRange(range)
  const exists = marks.some(m => m.equals(mark))

  if (exists) {
    change.removeMarkAtRange(range, mark, { normalize })
  } else {
    change.addMarkAtRange(range, mark, { normalize })
  }
}

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapBlockAtRange = (change, range, properties, options = {}) => {
  properties = Normalize.nodeProperties(properties)

  const { normalize = true } = options
  let { state } = change
  let { document } = state
  const blocks = document.getBlocksAtRange(range)
  const wrappers = blocks
    .map((block) => {
      return document.getClosest(block.key, (parent) => {
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
    const parent = document.getParent(block.key)
    const index = parent.nodes.indexOf(block)

    const children = block.nodes.filter((child) => {
      return blocks.some(b => child == b || child.hasDescendant(b.key))
    })

    const firstMatch = children.first()
    const lastMatch = children.last()

    if (first == firstMatch && last == lastMatch) {
      block.nodes.forEach((child, i) => {
        change.moveNodeByKey(child.key, parent.key, index + i, OPTS)
      })

      change.removeNodeByKey(block.key, OPTS)
    }

    else if (last == lastMatch) {
      block.nodes
        .skipUntil(n => n == firstMatch)
        .forEach((child, i) => {
          change.moveNodeByKey(child.key, parent.key, index + 1 + i, OPTS)
        })
    }

    else if (first == firstMatch) {
      block.nodes
        .takeUntil(n => n == lastMatch)
        .push(lastMatch)
        .forEach((child, i) => {
          change.moveNodeByKey(child.key, parent.key, index + i, OPTS)
        })
    }

    else {
      const firstText = firstMatch.getFirstText()
      change.splitDescendantsByKey(block.key, firstText.key, 0, OPTS)
      state = change.state
      document = state.document

      children.forEach((child, i) => {
        if (i == 0) {
          const extra = child
          child = document.getNextBlock(child.key)
          change.removeNodeByKey(extra.key, OPTS)
        }

        change.moveNodeByKey(child.key, parent.key, index + 1 + i, OPTS)
      })
    }
  })

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument(SCHEMA)
  }
}

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapInlineAtRange = (change, range, properties, options = {}) => {
  properties = Normalize.nodeProperties(properties)

  const { normalize = true } = options
  const { state } = change
  const { document } = state
  const texts = document.getTextsAtRange(range)
  const inlines = texts
    .map((text) => {
      return document.getClosest(text.key, (parent) => {
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
    const parent = change.state.document.getParent(inline.key)
    const index = parent.nodes.indexOf(inline)

    inline.nodes.forEach((child, i) => {
      change.moveNodeByKey(child.key, parent.key, index + i, OPTS)
    })
  })

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument(SCHEMA)
  }
}

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Block|Object|String} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapBlockAtRange = (change, range, block, options = {}) => {
  block = Normalize.block(block)
  block = block.set('nodes', block.nodes.clear())

  const { normalize = true } = options
  const { state } = change
  const { document } = state

  const blocks = document.getBlocksAtRange(range)
  const firstblock = blocks.first()
  const lastblock = blocks.last()
  let parent, siblings, index

  // If there is only one block in the selection then we know the parent and
  // siblings.
  if (blocks.length === 1) {
    parent = document.getParent(firstblock.key)
    siblings = blocks
  }

  // Determine closest shared parent to all blocks in selection.
  else {
    parent = document.getClosest(firstblock.key, (p1) => {
      return !!document.getClosest(lastblock.key, p2 => p1 == p2)
    })
  }

  // If no shared parent could be found then the parent is the document.
  if (parent == null) parent = document

  // Create a list of direct children siblings of parent that fall in the
  // selection.
  if (siblings == null) {
    const indexes = parent.nodes.reduce((ind, node, i) => {
      if (node == firstblock || node.hasDescendant(firstblock.key)) ind[0] = i
      if (node == lastblock || node.hasDescendant(lastblock.key)) ind[1] = i
      return ind
    }, [])

    index = indexes[0]
    siblings = parent.nodes.slice(indexes[0], indexes[1] + 1)
  }

  // Get the index to place the new wrapped node at.
  if (index == null) {
    index = parent.nodes.indexOf(siblings.first())
  }

  // Inject the new block node into the parent.
  change.insertNodeByKey(parent.key, index, block, OPTS)

  // Move the sibling nodes into the new block node.
  siblings.forEach((node, i) => {
    change.moveNodeByKey(node.key, block.key, i, OPTS)
  })

  if (normalize) {
    change.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Inline|Object|String} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapInlineAtRange = (change, range, inline, options = {}) => {
  let { state } = change
  let { document } = state
  const { normalize = true } = options
  const { startKey, startOffset, endKey, endOffset } = range

  if (range.isCollapsed) {
    // Wrapping an inline void
    const inlineParent = document.getClosestInline(startKey)
    if (!inlineParent.isVoid) {
      return
    }

    return change.wrapInlineByKey(inlineParent.key, inline, options)
  }

  inline = Normalize.inline(inline)
  inline = inline.set('nodes', inline.nodes.clear())

  const blocks = document.getBlocksAtRange(range)
  let startBlock = document.getClosestBlock(startKey)
  let endBlock = document.getClosestBlock(endKey)
  let startChild = startBlock.getFurthestAncestor(startKey)
  let endChild = endBlock.getFurthestAncestor(endKey)

  change.splitDescendantsByKey(endChild.key, endKey, endOffset, OPTS)
  change.splitDescendantsByKey(startChild.key, startKey, startOffset, OPTS)

  state = change.state
  document = state.document
  startBlock = document.getDescendant(startBlock.key)
  endBlock = document.getDescendant(endBlock.key)
  startChild = startBlock.getFurthestAncestor(startKey)
  endChild = endBlock.getFurthestAncestor(endKey)
  const startIndex = startBlock.nodes.indexOf(startChild)
  const endIndex = endBlock.nodes.indexOf(endChild)

  if (startBlock == endBlock) {
    state = change.state
    document = state.document
    startBlock = document.getClosestBlock(startKey)
    startChild = startBlock.getFurthestAncestor(startKey)

    const startInner = document.getNextSibling(startChild.key)
    const startInnerIndex = startBlock.nodes.indexOf(startInner)
    const endInner = startKey == endKey ? startInner : startBlock.getFurthestAncestor(endKey)
    const inlines = startBlock.nodes
      .skipUntil(n => n == startInner)
      .takeUntil(n => n == endInner)
      .push(endInner)

    const node = inline.regenerateKey()

    change.insertNodeByKey(startBlock.key, startInnerIndex, node, OPTS)

    inlines.forEach((child, i) => {
      change.moveNodeByKey(child.key, node.key, i, OPTS)
    })

    if (normalize) {
      change.normalizeNodeByKey(startBlock.key, SCHEMA)
    }
  }

  else {
    const startInlines = startBlock.nodes.slice(startIndex + 1)
    const endInlines = endBlock.nodes.slice(0, endIndex + 1)
    const startNode = inline.regenerateKey()
    const endNode = inline.regenerateKey()

    change.insertNodeByKey(startBlock.key, startIndex - 1, startNode, OPTS)
    change.insertNodeByKey(endBlock.key, endIndex, endNode, OPTS)

    startInlines.forEach((child, i) => {
      change.moveNodeByKey(child.key, startNode.key, i, OPTS)
    })

    endInlines.forEach((child, i) => {
      change.moveNodeByKey(child.key, endNode.key, i, OPTS)
    })

    if (normalize) {
      change
        .normalizeNodeByKey(startBlock.key, SCHEMA)
        .normalizeNodeByKey(endBlock.key, SCHEMA)
    }

    blocks.slice(1, -1).forEach((block) => {
      const node = inline.regenerateKey()
      change.insertNodeByKey(block.key, 0, node, OPTS)

      block.nodes.forEach((child, i) => {
        change.moveNodeByKey(child.key, node.key, i, OPTS)
      })

      if (normalize) {
        change.normalizeNodeByKey(block.key, SCHEMA)
      }
    })
  }
}

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapTextAtRange = (change, range, prefix, suffix = prefix, options = {}) => {
  const { normalize = true } = options
  const { startKey, endKey } = range
  const start = range.collapseToStart()
  let end = range.collapseToEnd()

  if (startKey == endKey) {
    end = end.move(prefix.length)
  }

  change.insertTextAtRange(start, prefix, [], { normalize })
  change.insertTextAtRange(end, suffix, [], { normalize })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
