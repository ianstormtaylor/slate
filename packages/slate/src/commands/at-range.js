import { List } from 'immutable'
import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import TextUtils from '../utils/text-utils'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mixed} mark
 */

Commands.addMarkAtRange = (change, range, mark) => {
  if (range.isCollapsed) return

  const { value } = change
  const { document } = value
  const { start, end } = range
  const texts = document.getTextsAtRange(range)

  change.withoutNormalizing(() => {
    texts.forEach(node => {
      const { key } = node
      let index = 0
      let length = node.text.length

      if (key == start.key) index = start.offset
      if (key == end.key) length = end.offset
      if (key == start.key && key == end.key) length = end.offset - start.offset

      change.addMarkByKey(key, index, length, mark)
    })
  })
}

/**
 * Add a list of `marks` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Array<Mixed>} mark
 */

Commands.addMarksAtRange = (change, range, marks) => {
  marks.forEach(mark => change.addMarkAtRange(range, mark))
}

/**
 * Delete everything in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 */

Commands.deleteAtRange = (change, range) => {
  // Snapshot the selection, which creates an extra undo save point, so that
  // when you undo a delete, the expanded selection will be retained.
  change.snapshotSelection()

  const { editor, value } = change
  const { start, end } = range
  let startKey = start.key
  let startOffset = start.offset
  let endKey = end.key
  let endOffset = end.offset
  let { document } = value
  let isStartVoid = document.hasVoidParent(startKey, editor)
  let isEndVoid = document.hasVoidParent(endKey, editor)
  let startBlock = document.getClosestBlock(startKey)
  let endBlock = document.getClosestBlock(endKey)

  // Check if we have a "hanging" selection case where the even though the
  // selection extends into the start of the end node, we actually want to
  // ignore that for UX reasons.
  const isHanging =
    startOffset == 0 &&
    endOffset == 0 &&
    isStartVoid == false &&
    startKey == startBlock.getFirstText().key &&
    endKey == endBlock.getFirstText().key

  // If it's a hanging selection, nudge it back to end in the previous text.
  if (isHanging && isEndVoid) {
    const prevText = document.getPreviousText(endKey)
    endKey = prevText.key
    endOffset = prevText.text.length
    isEndVoid = document.hasVoidParent(endKey, editor)
  }

  change.withoutNormalizing(() => {
    // If the start node is inside a void node, remove the void node and update
    // the starting point to be right after it, continuously until the start point
    // is not a void, or until the entire range is handled.
    while (isStartVoid) {
      const startVoid = document.getClosestVoid(startKey, editor)
      const nextText = document.getNextText(startKey)
      change.removeNodeByKey(startVoid.key)

      // If the start and end keys are the same, we're done.
      if (startKey == endKey) return

      // If there is no next text node, we're done.
      if (!nextText) return

      // Continue...
      document = change.value.document
      startKey = nextText.key
      startOffset = 0
      isStartVoid = document.hasVoidParent(startKey, editor)
    }

    // If the end node is inside a void node, do the same thing but backwards. But
    // we don't need any aborting checks because if we've gotten this far there
    // must be a non-void node that will exit the loop.
    while (isEndVoid) {
      const endVoid = document.getClosestVoid(endKey, editor)
      const prevText = document.getPreviousText(endKey)
      change.removeNodeByKey(endVoid.key)

      // Continue...
      document = change.value.document
      endKey = prevText.key
      endOffset = prevText.text.length
      isEndVoid = document.hasVoidParent(endKey, editor)
    }

    // If the start and end key are the same, and it was a hanging selection, we
    // can just remove the entire block.
    if (startKey == endKey && isHanging) {
      change.removeNodeByKey(startBlock.key)
      return
    } else if (startKey == endKey) {
      // Otherwise, if it wasn't hanging, we're inside a single text node, so we can
      // simply remove the text in the range.
      const index = startOffset
      const length = endOffset - startOffset
      change.removeTextByKey(startKey, index, length)
      return
    } else {
      // Otherwise, we need to recursively remove text and nodes inside the start
      // block after the start offset and inside the end block before the end
      // offset. Then remove any blocks that are in between the start and end
      // blocks. Then finally merge the start and end nodes.
      startBlock = document.getClosestBlock(startKey)
      endBlock = document.getClosestBlock(endKey)
      const startText = document.getNode(startKey)
      const endText = document.getNode(endKey)
      const startLength = startText.text.length - startOffset
      const endLength = endOffset

      const ancestor = document.getCommonAncestor(startKey, endKey)
      const startChild = ancestor.getFurthestAncestor(startKey)
      const endChild = ancestor.getFurthestAncestor(endKey)

      const startParent = document.getParent(startBlock.key)
      const startParentIndex = startParent.nodes.indexOf(startBlock)
      const endParentIndex = startParent.nodes.indexOf(endBlock)

      let child

      // Iterate through all of the nodes in the tree after the start text node
      // but inside the end child, and remove them.
      child = startText

      while (child.key != startChild.key) {
        const parent = document.getParent(child.key)
        const index = parent.nodes.indexOf(child)
        const afters = parent.nodes.slice(index + 1)

        afters.reverse().forEach(node => {
          change.removeNodeByKey(node.key)
        })

        child = parent
      }

      // Remove all of the middle children.
      const startChildIndex = ancestor.nodes.indexOf(startChild)
      const endChildIndex = ancestor.nodes.indexOf(endChild)
      const middles = ancestor.nodes.slice(startChildIndex + 1, endChildIndex)

      middles.reverse().forEach(node => {
        change.removeNodeByKey(node.key)
      })

      // Remove the nodes before the end text node in the tree.
      child = endText

      while (child.key != endChild.key) {
        const parent = document.getParent(child.key)
        const index = parent.nodes.indexOf(child)
        const befores = parent.nodes.slice(0, index)

        befores.reverse().forEach(node => {
          change.removeNodeByKey(node.key)
        })

        child = parent
      }

      // Remove any overlapping text content from the leaf text nodes.
      if (startLength != 0) {
        change.removeTextByKey(startKey, startOffset, startLength)
      }

      if (endLength != 0) {
        change.removeTextByKey(endKey, 0, endOffset)
      }

      // If the start and end blocks aren't the same, move and merge the end block
      // into the start block.
      if (startBlock.key != endBlock.key) {
        document = change.value.document
        const lonely = document.getFurthestOnlyChildAncestor(endBlock.key)

        // Move the end block to be right after the start block.
        if (endParentIndex != startParentIndex + 1) {
          change.moveNodeByKey(
            endBlock.key,
            startParent.key,
            startParentIndex + 1
          )
        }

        // If the selection is hanging, just remove the start block, otherwise
        // merge the end block into it.
        if (isHanging) {
          change.removeNodeByKey(startBlock.key)
        } else {
          change.mergeNodeByKey(endBlock.key)
        }

        // If nested empty blocks are left over above the end block, remove them.
        if (lonely) {
          change.removeNodeByKey(lonely.key)
        }
      }
    }
  })
}

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 */

Commands.deleteCharBackwardAtRange = (change, range) => {
  const { value } = change
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const n = TextUtils.getCharOffsetBackward(text, o)
  change.deleteBackwardAtRange(range, n)
}

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 */

Commands.deleteLineBackwardAtRange = (change, range) => {
  const { value } = change
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  change.deleteBackwardAtRange(range, o)
}

/**
 * Delete backward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 */

Commands.deleteWordBackwardAtRange = (change, range) => {
  const { value } = change
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const n = o === 0 ? 1 : TextUtils.getWordOffsetBackward(text, o)
  change.deleteBackwardAtRange(range, n)
}

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} n (optional)
 */

Commands.deleteBackwardAtRange = (change, range, n = 1) => {
  if (n === 0) return
  const { editor, value } = change
  const { document } = value
  const { start, focus } = range

  // If the range is expanded, perform a regular delete instead.
  if (range.isExpanded) {
    change.deleteAtRange(range)
    return
  }

  const voidParent = document.getClosestVoid(start.key, editor)

  // If there is a void parent, delete it.
  if (voidParent) {
    change.removeNodeByKey(voidParent.key)
    return
  }

  const block = document.getClosestBlock(start.key)

  // If the closest is not void, but empty, remove it
  if (
    block &&
    !change.isVoid(block) &&
    block.text === '' &&
    document.nodes.size !== 1
  ) {
    change.removeNodeByKey(block.key)
    return
  }

  // If the range is at the start of the document, abort.
  if (start.isAtStartOfNode(document)) {
    return
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  const text = document.getDescendant(start.key)

  if (start.isAtStartOfNode(text)) {
    const prev = document.getPreviousText(text.key)
    const prevBlock = document.getClosestBlock(prev.key)
    const prevVoid = document.getClosestVoid(prev.key, editor)

    // If the previous text node has a void parent, remove it.
    if (prevVoid) {
      change.removeNodeByKey(prevVoid.key)
      return
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && prevBlock != block) {
      range = range.moveAnchorTo(prev.key, prev.text.length)
      change.deleteAtRange(range)
      return
    }
  }

  // If the focus offset is farther than the number of characters to delete,
  // just remove the characters backwards inside the current node.
  if (n < focus.offset) {
    range = range.moveFocusBackward(n)
    change.deleteAtRange(range)
    return
  }

  // Otherwise, we need to see how many nodes backwards to go.
  let node = text
  let offset = 0
  let traversed = focus.offset

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

  range = range.moveAnchorTo(node.key, offset)
  change.deleteAtRange(range)
}

/**
 * Delete forward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 */

Commands.deleteCharForwardAtRange = (change, range) => {
  const { value } = change
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const n = TextUtils.getCharOffsetForward(text, o)
  change.deleteForwardAtRange(range, n)
}

/**
 * Delete forward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 */

Commands.deleteLineForwardAtRange = (change, range) => {
  const { value } = change
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  change.deleteForwardAtRange(range, startBlock.text.length - o)
}

/**
 * Delete forward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 */

Commands.deleteWordForwardAtRange = (change, range) => {
  const { value } = change
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const wordOffset = TextUtils.getWordOffsetForward(text, o)
  const n = wordOffset === 0 ? 1 : wordOffset
  change.deleteForwardAtRange(range, n)
}

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} n (optional)
 */

Commands.deleteForwardAtRange = (change, range, n = 1) => {
  if (n === 0) return
  const { editor, value } = change
  const { document } = value
  const { start, focus } = range

  // If the range is expanded, perform a regular delete instead.
  if (range.isExpanded) {
    change.deleteAtRange(range)
    return
  }

  const voidParent = document.getClosestVoid(start.key, editor)

  // If the node has a void parent, delete it.
  if (voidParent) {
    change.removeNodeByKey(voidParent.key)
    return
  }

  const block = document.getClosestBlock(start.key)

  // If the closest is not void, but empty, remove it
  if (
    block &&
    !change.isVoid(block) &&
    block.text === '' &&
    document.nodes.size !== 1
  ) {
    const nextBlock = document.getNextBlock(block.key)
    change.removeNodeByKey(block.key)

    if (nextBlock && nextBlock.key) {
      change.moveToStartOfNode(nextBlock)
    }

    return
  }

  // If the range is at the start of the document, abort.
  if (start.isAtEndOfNode(document)) {
    return
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  const text = document.getDescendant(start.key)

  if (start.isAtEndOfNode(text)) {
    const next = document.getNextText(text.key)
    const nextBlock = document.getClosestBlock(next.key)
    const nextVoid = document.getClosestVoid(next.key, editor)

    // If the next text node has a void parent, remove it.
    if (nextVoid) {
      change.removeNodeByKey(nextVoid.key)
      return
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && nextBlock != block) {
      range = range.moveFocusTo(next.key, 0)
      change.deleteAtRange(range)
      return
    }
  }

  // If the remaining characters to the end of the node is greater than or equal
  // to the number of characters to delete, just remove the characters forwards
  // inside the current node.
  if (n <= text.text.length - focus.offset) {
    range = range.moveFocusForward(n)
    change.deleteAtRange(range)
    return
  }

  // Otherwise, we need to see how many nodes forwards to go.
  let node = text
  let offset = focus.offset
  let traversed = text.text.length - focus.offset

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

  range = range.moveFocusTo(node.key, offset)
  change.deleteAtRange(range)
}

/**
 * Insert a `block` node at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Block|String|Object} block
 */

Commands.insertBlockAtRange = (change, range, block) => {
  block = Block.create(block)

  if (range.isExpanded) {
    change.deleteAtRange(range)
    range = range.moveToStart()
  }

  const { value } = change
  const { document } = value
  const { start } = range
  let startKey = start.key
  let startOffset = start.offset
  const startBlock = document.getClosestBlock(startKey)
  const startInline = document.getClosestInline(startKey)
  const parent = document.getParent(startBlock.key)
  const index = parent.nodes.indexOf(startBlock)

  if (change.isVoid(startBlock)) {
    const extra = start.isAtEndOfNode(startBlock) ? 1 : 0
    change.insertNodeByKey(parent.key, index + extra, block)
  } else if (!startInline && startBlock.text === '') {
    change.insertNodeByKey(parent.key, index + 1, block)
  } else if (start.isAtStartOfNode(startBlock)) {
    change.insertNodeByKey(parent.key, index, block)
  } else if (start.isAtEndOfNode(startBlock)) {
    change.insertNodeByKey(parent.key, index + 1, block)
  } else {
    if (startInline && change.isVoid(startInline)) {
      const atEnd = start.isAtEndOfNode(startInline)
      const siblingText = atEnd
        ? document.getNextText(startKey)
        : document.getPreviousText(startKey)

      const splitRange = atEnd
        ? range.moveToStartOfNode(siblingText)
        : range.moveToEndOfNode(siblingText)

      startKey = splitRange.start.key
      startOffset = splitRange.start.offset
    }

    change.withoutNormalizing(() => {
      change.splitDescendantsByKey(startBlock.key, startKey, startOffset)
      change.insertNodeByKey(parent.key, index + 1, block)
    })
  }
}

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Document} fragment
 */

Commands.insertFragmentAtRange = (change, range, fragment) => {
  change.withoutNormalizing(() => {
    // If the range is expanded, delete it first.
    if (range.isExpanded) {
      change.deleteAtRange(range)

      if (change.value.document.getDescendant(range.start.key)) {
        range = range.moveToStart()
      } else {
        range = range.moveTo(range.end.key, 0).normalize(change.value.document)
      }
    }

    // If the fragment is empty, there's nothing to do after deleting.
    if (!fragment.nodes.size) return

    // Regenerate the keys for all of the fragments nodes, so that they're
    // guaranteed not to collide with the existing keys in the document. Otherwise
    // they will be rengerated automatically and we won't have an easy way to
    // reference them.
    fragment = fragment.mapDescendants(child => child.regenerateKey())

    // Calculate a few things...
    const { start } = range
    const { value } = change
    let { document } = value
    let startText = document.getDescendant(start.key)
    let startBlock = document.getClosestBlock(startText.key)
    let startChild = startBlock.getFurthestAncestor(startText.key)
    const isAtStart = start.isAtStartOfNode(startBlock)
    const parent = document.getParent(startBlock.key)
    const index = parent.nodes.indexOf(startBlock)
    const blocks = fragment.getBlocks()
    const firstChild = fragment.nodes.first()
    const lastChild = fragment.nodes.last()
    const firstBlock = blocks.first()
    const lastBlock = blocks.last()
    const insertionNode = findInsertionNode(fragment, document, startBlock.key)

    // If the fragment only contains a void block, use `insertBlock` instead.
    if (firstBlock === lastBlock && change.isVoid(firstBlock)) {
      change.insertBlockAtRange(range, firstBlock)
      return
    }

    // If inserting the entire fragment and it starts or ends with a single
    // nested block, e.g. a table, we do not merge it with existing blocks.
    if (
      insertionNode === fragment &&
      (firstChild.hasBlockChildren() || lastChild.hasBlockChildren())
    ) {
      fragment.nodes.reverse().forEach(node => {
        change.insertBlockAtRange(range, node)
      })
      return
    }

    // If the first and last block aren't the same, we need to insert all of the
    // nodes after the insertion node's first block at the index.
    if (firstBlock != lastBlock) {
      const lonelyParent = insertionNode.getFurthest(
        firstBlock.key,
        p => p.nodes.size == 1
      )
      const lonelyChild = lonelyParent || firstBlock

      const startIndex = parent.nodes.indexOf(startBlock)
      const excludingLonelyChild = insertionNode.removeNode(lonelyChild.key)

      excludingLonelyChild.nodes.forEach((node, i) => {
        const newIndex = startIndex + i + 1
        change.insertNodeByKey(parent.key, newIndex, node)
      })
    }

    // Check if we need to split the node.
    if (start.offset != 0) {
      change.splitDescendantsByKey(startChild.key, start.key, start.offset)
    }

    // Update our variables with the new value.
    document = change.value.document
    startText = document.getDescendant(start.key)
    startBlock = document.getClosestBlock(start.key)
    startChild = startBlock.getFurthestAncestor(startText.key)

    // If the first and last block aren't the same, we need to move any of the
    // starting block's children after the split into the last block of the
    // fragment, which has already been inserted.
    if (firstBlock != lastBlock) {
      const nextChild = isAtStart
        ? startChild
        : startBlock.getNextSibling(startChild.key)
      const nextNodes = nextChild
        ? startBlock.nodes.skipUntil(n => n.key == nextChild.key)
        : List()
      const lastIndex = lastBlock.nodes.size

      nextNodes.forEach((node, i) => {
        const newIndex = lastIndex + i
        change.moveNodeByKey(node.key, lastBlock.key, newIndex)
      })
    }

    // If the starting block is empty, we replace it entirely with the first block
    // of the fragment, since this leads to a more expected behavior for the user.
    if (!change.isVoid(startBlock) && startBlock.text === '') {
      change.removeNodeByKey(startBlock.key)
      change.insertNodeByKey(parent.key, index, firstBlock)
    } else {
      // Otherwise, we maintain the starting block, and insert all of the first
      // block's inline nodes into it at the split point.
      const inlineChild = startBlock.getFurthestAncestor(startText.key)
      const inlineIndex = startBlock.nodes.indexOf(inlineChild)

      firstBlock.nodes.forEach((inline, i) => {
        const o = start.offset == 0 ? 0 : 1
        const newIndex = inlineIndex + i + o
        change.insertNodeByKey(startBlock.key, newIndex, inline)
      })
    }
  })
}

const findInsertionNode = (fragment, document, startKey) => {
  const hasSingleNode = object => object && object.nodes.size === 1
  const firstNode = object => object && object.nodes.first()
  let node = fragment

  if (hasSingleNode(fragment)) {
    let fragmentInner = firstNode(fragment)

    const matches = documentNode => documentNode.type === fragmentInner.type
    let documentInner = document.getFurthest(startKey, matches)

    if (documentInner === document.getParent(startKey)) node = fragmentInner

    while (hasSingleNode(fragmentInner) && hasSingleNode(documentInner)) {
      fragmentInner = firstNode(fragmentInner)
      documentInner = firstNode(documentInner)

      if (fragmentInner.type === documentInner.type) {
        node = fragmentInner
      } else {
        break
      }
    }
  }

  return node
}

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Inline|String|Object} inline
 */

Commands.insertInlineAtRange = (change, range, inline) => {
  inline = Inline.create(inline)

  change.withoutNormalizing(() => {
    if (range.isExpanded) {
      change.deleteAtRange(range)
      range = range.moveToStart()
    }

    const { value } = change
    const { document } = value
    const { start } = range
    const parent = document.getParent(start.key)
    const startText = document.assertDescendant(start.key)
    const index = parent.nodes.indexOf(startText)

    if (change.isVoid(parent)) return

    change.splitNodeByKey(start.key, start.offset)
    change.insertNodeByKey(parent.key, index + 1, inline)
  })
}

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.insertTextAtRange = (change, range, text, marks) => {
  const { value } = change
  const { document } = value
  const { start } = range
  let key = start.key
  const offset = start.offset
  const path = start.path
  const parent = document.getParent(start.key)

  if (change.isVoid(parent)) {
    return
  }

  change.withoutNormalizing(() => {
    if (range.isExpanded) {
      change.deleteAtRange(range)

      const startText = change.value.document.getNode(path)

      // Update range start after delete
      if (startText && startText.key !== key) {
        key = startText.key
      }
    }

    change.insertTextByKey(key, offset, text, marks)
  })
}

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mark|String} mark (optional)
 */

Commands.removeMarkAtRange = (change, range, mark) => {
  if (range.isCollapsed) return

  const { value } = change
  const { document } = value
  const texts = document.getTextsAtRange(range)
  const { start, end } = range

  change.withoutNormalizing(() => {
    texts.forEach(node => {
      const { key } = node
      let index = 0
      let length = node.text.length

      if (key == start.key) index = start.offset
      if (key == end.key) length = end.offset
      if (key == start.key && key == end.key) length = end.offset - start.offset

      change.removeMarkByKey(key, index, length, mark)
    })
  })
}

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object|String} properties
 */

Commands.setBlocksAtRange = (change, range, properties) => {
  const { editor, value } = change
  const { document } = value
  const blocks = document.getBlocksAtRange(range)

  const { start, end, isCollapsed } = range
  const isStartVoid = document.hasVoidParent(start.key, editor)
  const startBlock = document.getClosestBlock(start.key)
  const endBlock = document.getClosestBlock(end.key)

  // Check if we have a "hanging" selection case where the even though the
  // selection extends into the start of the end node, we actually want to
  // ignore that for UX reasons.
  const isHanging =
    isCollapsed == false &&
    start.offset == 0 &&
    end.offset == 0 &&
    isStartVoid == false &&
    start.key == startBlock.getFirstText().key &&
    end.key == endBlock.getFirstText().key

  // If it's a hanging selection, ignore the last block.
  const sets = isHanging ? blocks.slice(0, -1) : blocks

  change.withoutNormalizing(() => {
    sets.forEach(block => {
      change.setNodeByKey(block.key, properties)
    })
  })
}

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object|String} properties
 */

Commands.setInlinesAtRange = (change, range, properties) => {
  const { value } = change
  const { document } = value
  const inlines = document.getInlinesAtRange(range)

  change.withoutNormalizing(() => {
    inlines.forEach(inline => {
      change.setNodeByKey(inline.key, properties)
    })
  })
}

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} height (optional)
 */

Commands.splitBlockAtRange = (change, range, height = 1) => {
  const { start, end } = range
  let { value } = change
  let { document } = value
  let node = document.assertDescendant(start.key)
  let parent = document.getClosestBlock(node.key)
  let h = 0

  while (parent && parent.object == 'block' && h < height) {
    node = parent
    parent = document.getClosestBlock(parent.key)
    h++
  }

  change.withoutNormalizing(() => {
    change.splitDescendantsByKey(node.key, start.key, start.offset)

    value = change.value
    document = value.document

    if (range.isExpanded) {
      if (range.isBackward) range = range.flip()
      const nextBlock = document.getNextBlock(node.key)
      range = range.moveAnchorToStartOfNode(nextBlock)
      range = range.setFocus(range.focus.setPath(null))

      if (start.key === end.key) {
        range = range.moveFocusTo(range.anchor.key, end.offset - start.offset)
      }

      range = document.resolveRange(range)
      change.deleteAtRange(range)
    }
  })
}

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} height (optional)
 */

Commands.splitInlineAtRange = (change, range, height = Infinity) => {
  if (range.isExpanded) {
    change.deleteAtRange(range)
    range = range.moveToStart()
  }

  const { start } = range
  const { value } = change
  const { document } = value
  let node = document.assertDescendant(start.key)
  let parent = document.getClosestInline(node.key)
  let h = 0

  while (parent && parent.object == 'inline' && h < height) {
    node = parent
    parent = document.getClosestInline(parent.key)
    h++
  }

  change.splitDescendantsByKey(node.key, start.key, start.offset)
}

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mixed} mark
 */

Commands.toggleMarkAtRange = (change, range, mark) => {
  if (range.isCollapsed) return

  mark = Mark.create(mark)

  const { value } = change
  const { document } = value
  const marks = document.getActiveMarksAtRange(range)
  const exists = marks.some(m => m.equals(mark))

  if (exists) {
    change.removeMarkAtRange(range, mark)
  } else {
    change.addMarkAtRange(range, mark)
  }
}

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String|Object} properties
 */

Commands.unwrapBlockAtRange = (change, range, properties) => {
  properties = Node.createProperties(properties)

  const { value } = change
  let { document } = value
  const blocks = document.getBlocksAtRange(range)
  const wrappers = blocks
    .map(block => {
      return document.getClosest(block.key, parent => {
        if (parent.object != 'block') return false
        if (properties.type != null && parent.type != properties.type)
          return false
        if (properties.data != null && !parent.data.isSuperset(properties.data))
          return false
        return true
      })
    })
    .filter(exists => exists)
    .toOrderedSet()
    .toList()

  change.withoutNormalizing(() => {
    wrappers.forEach(block => {
      const first = block.nodes.first()
      const last = block.nodes.last()
      const parent = document.getParent(block.key)
      const index = parent.nodes.indexOf(block)

      const children = block.nodes.filter(child => {
        return blocks.some(b => child == b || child.hasDescendant(b.key))
      })

      const firstMatch = children.first()
      const lastMatch = children.last()

      if (first == firstMatch && last == lastMatch) {
        block.nodes.forEach((child, i) => {
          change.moveNodeByKey(child.key, parent.key, index + i)
        })

        change.removeNodeByKey(block.key)
      } else if (last == lastMatch) {
        block.nodes.skipUntil(n => n == firstMatch).forEach((child, i) => {
          change.moveNodeByKey(child.key, parent.key, index + 1 + i)
        })
      } else if (first == firstMatch) {
        block.nodes
          .takeUntil(n => n == lastMatch)
          .push(lastMatch)
          .forEach((child, i) => {
            change.moveNodeByKey(child.key, parent.key, index + i)
          })
      } else {
        const firstText = firstMatch.getFirstText()

        change.splitDescendantsByKey(block.key, firstText.key, 0)

        document = change.value.document

        children.forEach((child, i) => {
          if (i == 0) {
            const extra = child
            child = document.getNextBlock(child.key)
            change.removeNodeByKey(extra.key)
          }

          change.moveNodeByKey(child.key, parent.key, index + 1 + i)
        })
      }
    })
  })
}

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String|Object} properties
 */

Commands.unwrapInlineAtRange = (change, range, properties) => {
  properties = Node.createProperties(properties)

  const { value } = change
  const { document } = value
  const texts = document.getTextsAtRange(range)
  const inlines = texts
    .map(text => {
      return document.getClosest(text.key, parent => {
        if (parent.object != 'inline') return false
        if (properties.type != null && parent.type != properties.type)
          return false
        if (properties.data != null && !parent.data.isSuperset(properties.data))
          return false
        return true
      })
    })
    .filter(exists => exists)
    .toOrderedSet()
    .toList()

  change.withoutNormalizing(() => {
    inlines.forEach(inline => {
      const parent = change.value.document.getParent(inline.key)
      const index = parent.nodes.indexOf(inline)

      inline.nodes.forEach((child, i) => {
        change.moveNodeByKey(child.key, parent.key, index + i)
      })

      change.removeNodeByKey(inline.key)
    })
  })
}

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Block|Object|String} block
 */

Commands.wrapBlockAtRange = (change, range, block) => {
  block = Block.create(block)
  block = block.set('nodes', block.nodes.clear())

  const { value } = change
  const { document } = value

  const blocks = document.getBlocksAtRange(range)
  const firstblock = blocks.first()
  const lastblock = blocks.last()
  let parent, siblings, index

  // If there is only one block in the selection then we know the parent and
  // siblings.
  if (blocks.length === 1) {
    parent = document.getParent(firstblock.key)
    siblings = blocks
  } else {
    // Determine closest shared parent to all blocks in selection.
    parent = document.getClosest(firstblock.key, p1 => {
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

  change.withoutNormalizing(() => {
    // Inject the new block node into the parent.
    change.insertNodeByKey(parent.key, index, block)

    // Move the sibling nodes into the new block node.
    siblings.forEach((node, i) => {
      change.moveNodeByKey(node.key, block.key, i)
    })
  })
}

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Inline|Object|String} inline
 */

Commands.wrapInlineAtRange = (change, range, inline) => {
  const { value } = change
  let { document } = value
  const { start, end } = range

  if (range.isCollapsed) {
    // Wrapping an inline void
    const inlineParent = document.getClosestInline(start.key)

    if (!change.isVoid(inlineParent)) {
      return
    }

    return change.wrapInlineByKey(inlineParent.key, inline)
  }

  inline = Inline.create(inline)
  inline = inline.set('nodes', inline.nodes.clear())

  const blocks = document.getBlocksAtRange(range)
  let startBlock = document.getClosestBlock(start.key)
  let endBlock = document.getClosestBlock(end.key)
  const startInline = document.getClosestInline(start.key)
  const endInline = document.getClosestInline(end.key)
  let startChild = startBlock.getFurthestAncestor(start.key)
  let endChild = endBlock.getFurthestAncestor(end.key)

  change.withoutNormalizing(() => {
    if (!startInline || startInline != endInline) {
      change.splitDescendantsByKey(endChild.key, end.key, end.offset)
      change.splitDescendantsByKey(startChild.key, start.key, start.offset)
    }

    document = change.value.document
    startBlock = document.getDescendant(startBlock.key)
    endBlock = document.getDescendant(endBlock.key)
    startChild = startBlock.getFurthestAncestor(start.key)
    endChild = endBlock.getFurthestAncestor(end.key)
    const startIndex = startBlock.nodes.indexOf(startChild)
    const endIndex = endBlock.nodes.indexOf(endChild)

    if (startInline && startInline == endInline) {
      const text = startBlock
        .getTextsAtRange(range)
        .get(0)
        .splitText(start.offset)[1]
        .splitText(end.offset - start.offset)[0]

      inline = inline.set('nodes', List([text]))
      change.insertInlineAtRange(range, inline)

      const inlinekey = inline.getFirstText().key
      const rng = {
        anchor: {
          key: inlinekey,
          offset: 0,
        },
        focus: {
          key: inlinekey,
          offset: end.offset - start.offset,
        },
        isFocused: true,
      }
      change.select(rng)
    } else if (startBlock == endBlock) {
      document = change.value.document
      startBlock = document.getClosestBlock(start.key)
      startChild = startBlock.getFurthestAncestor(start.key)

      const startInner = document.getNextSibling(startChild.key)
      const startInnerIndex = startBlock.nodes.indexOf(startInner)
      const endInner =
        start.key == end.key
          ? startInner
          : startBlock.getFurthestAncestor(end.key)
      const inlines = startBlock.nodes
        .skipUntil(n => n == startInner)
        .takeUntil(n => n == endInner)
        .push(endInner)

      const node = inline.regenerateKey()

      change.insertNodeByKey(startBlock.key, startInnerIndex, node)

      inlines.forEach((child, i) => {
        change.moveNodeByKey(child.key, node.key, i)
      })
    } else {
      const startInlines = startBlock.nodes.slice(startIndex + 1)
      const endInlines = endBlock.nodes.slice(0, endIndex + 1)
      const startNode = inline.regenerateKey()
      const endNode = inline.regenerateKey()

      change.insertNodeByKey(startBlock.key, startIndex + 1, startNode)
      change.insertNodeByKey(endBlock.key, endIndex, endNode)

      startInlines.forEach((child, i) => {
        change.moveNodeByKey(child.key, startNode.key, i)
      })

      endInlines.forEach((child, i) => {
        change.moveNodeByKey(child.key, endNode.key, i)
      })

      blocks.slice(1, -1).forEach(block => {
        const node = inline.regenerateKey()
        change.insertNodeByKey(block.key, 0, node)

        block.nodes.forEach((child, i) => {
          change.moveNodeByKey(child.key, node.key, i)
        })
      })
    }
  })
}

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 */

Commands.wrapTextAtRange = (change, range, prefix, suffix = prefix) => {
  const { start, end } = range
  const startRange = range.moveToStart()
  let endRange = range.moveToEnd()

  if (start.key == end.key) {
    endRange = endRange.moveForward(prefix.length)
  }

  change.withoutNormalizing(() => {
    change.insertTextAtRange(startRange, prefix, [])
    change.insertTextAtRange(endRange, suffix, [])
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
