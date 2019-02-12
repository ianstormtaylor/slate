import { List } from 'immutable'
import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import TextUtils from '../utils/text-utils'

/**
 * Ensure that an expanded selection is deleted first, and return the updated
 * range to account for the deleted part.
 *
 * @param {Editor}
 */

function deleteExpandedAtRange(editor, range) {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
  }

  const { value } = editor
  const { document } = value
  const { start, end } = range

  if (document.hasDescendant(start.key)) {
    range = range.moveToStart()
  } else {
    range = range.moveTo(end.key, 0).normalize(document)
  }

  return range
}

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Mixed} mark
 */

Commands.addMarkAtRange = (editor, range, mark) => {
  if (range.isCollapsed) return

  const { value } = editor
  const { document } = value
  const { start, end } = range
  const texts = document.getTextsAtRange(range)

  editor.withoutNormalizing(() => {
    texts.forEach(node => {
      const { key } = node
      let index = 0
      let length = node.text.length

      if (key == start.key) index = start.offset
      if (key == end.key) length = end.offset
      if (key == start.key && key == end.key) length = end.offset - start.offset

      editor.addMarkByKey(key, index, length, mark)
    })
  })
}

/**
 * Add a list of `marks` to the characters at `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Array<Mixed>} mark
 */

Commands.addMarksAtRange = (editor, range, marks) => {
  marks.forEach(mark => editor.addMarkAtRange(range, mark))
}

/**
 * Delete everything in a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteAtRange = (editor, range) => {
  // Snapshot the selection, which creates an extra undo save point, so that
  // when you undo a delete, the expanded selection will be retained.
  editor.snapshotSelection()

  const { value } = editor
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

  editor.withoutNormalizing(() => {
    // If the start node is inside a void node, remove the void node and update
    // the starting point to be right after it, continuously until the start point
    // is not a void, or until the entire range is handled.
    while (isStartVoid) {
      const startVoid = document.getClosestVoid(startKey, editor)
      const nextText = document.getNextText(startKey)
      editor.removeNodeByKey(startVoid.key)

      // If the start and end keys are the same, we're done.
      if (startKey == endKey) return

      // If there is no next text node, we're done.
      if (!nextText) return

      // Continue...
      document = editor.value.document
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
      editor.removeNodeByKey(endVoid.key)

      // Continue...
      document = editor.value.document
      endKey = prevText.key
      endOffset = prevText.text.length
      isEndVoid = document.hasVoidParent(endKey, editor)
    }

    // If the start and end key are the same, and it was a hanging selection, we
    // can just remove the entire block.
    if (startKey == endKey && isHanging) {
      editor.removeNodeByKey(startBlock.key)
      return
    } else if (startKey == endKey) {
      // Otherwise, if it wasn't hanging, we're inside a single text node, so we can
      // simply remove the text in the range.
      const index = startOffset
      const length = endOffset - startOffset
      editor.removeTextByKey(startKey, index, length)
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
          editor.removeNodeByKey(node.key)
        })

        child = parent
      }

      // Remove all of the middle children.
      const startChildIndex = ancestor.nodes.indexOf(startChild)
      const endChildIndex = ancestor.nodes.indexOf(endChild)
      const middles = ancestor.nodes.slice(startChildIndex + 1, endChildIndex)

      middles.reverse().forEach(node => {
        editor.removeNodeByKey(node.key)
      })

      // Remove the nodes before the end text node in the tree.
      child = endText

      while (child.key != endChild.key) {
        const parent = document.getParent(child.key)
        const index = parent.nodes.indexOf(child)
        const befores = parent.nodes.slice(0, index)

        befores.reverse().forEach(node => {
          editor.removeNodeByKey(node.key)
        })

        child = parent
      }

      // Remove any overlapping text content from the leaf text nodes.
      if (startLength != 0) {
        editor.removeTextByKey(startKey, startOffset, startLength)
      }

      if (endLength != 0) {
        editor.removeTextByKey(endKey, 0, endOffset)
      }

      // If the start and end blocks aren't the same, move and merge the end block
      // into the start block.
      if (startBlock.key != endBlock.key) {
        document = editor.value.document
        const lonely = document.getFurthestOnlyChildAncestor(endBlock.key)

        // Move the end block to be right after the start block.
        if (endParentIndex != startParentIndex + 1) {
          editor.moveNodeByKey(
            endBlock.key,
            startParent.key,
            startParentIndex + 1
          )
        }

        // If the selection is hanging, just remove the start block, otherwise
        // merge the end block into it.
        if (isHanging) {
          editor.removeNodeByKey(startBlock.key)
        } else {
          editor.mergeNodeByKey(endBlock.key)
        }

        // If nested empty blocks are left over above the end block, remove them.
        if (lonely) {
          editor.removeNodeByKey(lonely.key)
        }
      }
    }
  })
}

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Number} n (optional)
 */

Commands.deleteBackwardAtRange = (editor, range, n = 1) => {
  if (n === 0) return
  const { value } = editor
  const { document } = value
  const { start, focus } = range

  // If the range is expanded, perform a regular delete instead.
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const voidParent = document.getClosestVoid(start.key, editor)

  // If there is a void parent, delete it.
  if (voidParent) {
    editor.removeNodeByKey(voidParent.key)
    return
  }

  // If the range is at the start of the document, abort.
  if (start.isAtStartOfNode(document)) {
    return
  }

  const block = document.getClosestBlock(start.key)

  // PERF: If the closest block is empty, remove it. This is just a shortcut,
  // since merging it would result in the same outcome.
  if (
    document.nodes.size !== 1 &&
    block &&
    block.text === '' &&
    block.nodes.size === 1
  ) {
    editor.removeNodeByKey(block.key)
    return
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  const text = document.getDescendant(start.key)

  if (start.isAtStartOfNode(text)) {
    let prev = document.getPreviousText(text.key)
    const inline = document.getClosestInline(text.key)

    // If the range is at the start of the inline node, and previous text node
    // is empty, take the text node before that, or "prevBlock" would be the
    // same node as "block"
    if (inline && prev.text === '') {
      prev = document.getPreviousText(prev.key)
    }

    const prevBlock = document.getClosestBlock(prev.key)
    const prevVoid = document.getClosestVoid(prev.key, editor)

    // If the previous text node has a void parent, remove it.
    if (prevVoid) {
      editor.removeNodeByKey(prevVoid.key)
      return
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && prevBlock != block) {
      range = range.moveAnchorTo(prev.key, prev.text.length)
      editor.deleteAtRange(range)
      return
    }
  }

  // If the focus offset is farther than the number of characters to delete,
  // just remove the characters backwards inside the current node.
  if (n < focus.offset) {
    range = range.moveFocusBackward(n)
    editor.deleteAtRange(range)
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
  editor.deleteAtRange(range)
}

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteCharBackwardAtRange = (editor, range) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const { value } = editor
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const n = TextUtils.getCharOffsetBackward(text, o)
  editor.deleteBackwardAtRange(range, n)
}

/**
 * Delete forward until the character boundary at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteCharForwardAtRange = (editor, range) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const { value } = editor
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const n = TextUtils.getCharOffsetForward(text, o)
  editor.deleteForwardAtRange(range, n)
}

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Number} n (optional)
 */

Commands.deleteForwardAtRange = (editor, range, n = 1) => {
  if (n === 0) return
  const { value } = editor
  const { document } = value
  const { start, focus } = range

  // If the range is expanded, perform a regular delete instead.
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const voidParent = document.getClosestVoid(start.key, editor)

  // If the node has a void parent, delete it.
  if (voidParent) {
    editor.removeNodeByKey(voidParent.key)
    return
  }

  const block = document.getClosestBlock(start.key)

  // If the closest is not void, but empty, remove it
  if (
    block &&
    !editor.isVoid(block) &&
    block.text === '' &&
    document.nodes.size !== 1
  ) {
    const nextBlock = document.getNextBlock(block.key)
    editor.removeNodeByKey(block.key)

    if (nextBlock && nextBlock.key) {
      editor.moveToStartOfNode(nextBlock)
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
      editor.removeNodeByKey(nextVoid.key)
      return
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && nextBlock != block) {
      range = range.moveFocusTo(next.key, 0)
      editor.deleteAtRange(range)
      return
    }
  }

  // If the remaining characters to the end of the node is greater than or equal
  // to the number of characters to delete, just remove the characters forwards
  // inside the current node.
  if (n <= text.text.length - focus.offset) {
    range = range.moveFocusForward(n)
    editor.deleteAtRange(range)
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
  editor.deleteAtRange(range)
}

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteLineBackwardAtRange = (editor, range) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const { value } = editor
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  editor.deleteBackwardAtRange(range, o)
}

/**
 * Delete forward until the line boundary at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteLineForwardAtRange = (editor, range) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const { value } = editor
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  editor.deleteForwardAtRange(range, startBlock.text.length - o)
}

/**
 * Delete backward until the word boundary at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteWordBackwardAtRange = (editor, range) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const { value } = editor
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const n = o === 0 ? 1 : TextUtils.getWordOffsetBackward(text, o)
  editor.deleteBackwardAtRange(range, n)
}

/**
 * Delete forward until the word boundary at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteWordForwardAtRange = (editor, range) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  const { value } = editor
  const { document } = value
  const { start } = range
  const startBlock = document.getClosestBlock(start.key)
  const offset = startBlock.getOffset(start.key)
  const o = offset + start.offset
  const { text } = startBlock
  const wordOffset = TextUtils.getWordOffsetForward(text, o)
  const n = wordOffset === 0 ? 1 : wordOffset
  editor.deleteForwardAtRange(range, n)
}

/**
 * Insert a `block` node at `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Block|String|Object} block
 */

Commands.insertBlockAtRange = (editor, range, block) => {
  range = deleteExpandedAtRange(editor, range)
  block = Block.create(block)

  const { value } = editor
  const { document } = value
  const { start } = range
  let startKey = start.key
  let startOffset = start.offset
  const startBlock = document.getClosestBlock(startKey)
  const startInline = document.getClosestInline(startKey)
  const parent = document.getParent(startBlock.key)
  const index = parent.nodes.indexOf(startBlock)

  if (editor.isVoid(startBlock)) {
    const extra = start.isAtEndOfNode(startBlock) ? 1 : 0
    editor.insertNodeByKey(parent.key, index + extra, block)
  } else if (!startInline && startBlock.text === '') {
    editor.insertNodeByKey(parent.key, index + 1, block)
  } else if (start.isAtStartOfNode(startBlock)) {
    editor.insertNodeByKey(parent.key, index, block)
  } else if (start.isAtEndOfNode(startBlock)) {
    editor.insertNodeByKey(parent.key, index + 1, block)
  } else {
    if (startInline && editor.isVoid(startInline)) {
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

    editor.withoutNormalizing(() => {
      editor.splitDescendantsByKey(startBlock.key, startKey, startOffset)
      editor.insertNodeByKey(parent.key, index + 1, block)
    })
  }
}

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Document} fragment
 */

Commands.insertFragmentAtRange = (editor, range, fragment) => {
  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)

    // If the fragment is empty, there's nothing to do after deleting.
    if (!fragment.nodes.size) return

    // Regenerate the keys for all of the fragments nodes, so that they're
    // guaranteed not to collide with the existing keys in the document. Otherwise
    // they will be rengerated automatically and we won't have an easy way to
    // reference them.
    fragment = fragment.mapDescendants(child => child.regenerateKey())

    // Calculate a few things...
    const { start } = range
    const { value } = editor
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
    if (firstBlock === lastBlock && editor.isVoid(firstBlock)) {
      editor.insertBlockAtRange(range, firstBlock)
      return
    }

    // If inserting the entire fragment and it starts or ends with a single
    // nested block, e.g. a table, we do not merge it with existing blocks.
    if (
      insertionNode === fragment &&
      (firstChild.hasBlockChildren() || lastChild.hasBlockChildren())
    ) {
      fragment.nodes.reverse().forEach(node => {
        editor.insertBlockAtRange(range, node)
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
        editor.insertNodeByKey(parent.key, newIndex, node)
      })
    }

    // Check if we need to split the node.
    if (start.offset != 0) {
      editor.splitDescendantsByKey(startChild.key, start.key, start.offset)
    }

    // Update our variables with the new value.
    document = editor.value.document
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
        editor.moveNodeByKey(node.key, lastBlock.key, newIndex)
      })
    }

    // If the starting block is empty, we replace it entirely with the first block
    // of the fragment, since this leads to a more expected behavior for the user.
    if (!editor.isVoid(startBlock) && startBlock.text === '') {
      editor.removeNodeByKey(startBlock.key)
      editor.insertNodeByKey(parent.key, index, firstBlock)
    } else {
      // Otherwise, we maintain the starting block, and insert all of the first
      // block's inline nodes into it at the split point.
      const inlineChild = startBlock.getFurthestAncestor(startText.key)
      const inlineIndex = startBlock.nodes.indexOf(inlineChild)

      firstBlock.nodes.forEach((inline, i) => {
        const o = start.offset == 0 ? 0 : 1
        const newIndex = inlineIndex + i + o
        editor.insertNodeByKey(startBlock.key, newIndex, inline)
      })
    }
  })
}

/**
 * Get the deepest single child block inside `fragment` whose reversed block
 * ancestors match the reversed block ancestors of the `document` starting at
 * the `documentKey`.
 *
 * @param {Document} document
 * @param {string} documentKey
 * @param {Document} fragment
 * @return {Node}
 */

const findInsertionNode = (fragment, document, documentKey) => {
  // Find the deepest block in a doc with no siblings.
  const deepestSingleBlock = doc => {
    let result = doc

    while (result.nodes.size === 1 && result.nodes.first().object === 'block') {
      result = result.nodes.first()
    }

    return result === doc ? null : result
  }

  // Return whether every block in the `fragmentAncestors` list has the
  // same type as the block in `documentAncestors` with the same index.
  const ancestorTypesMatch = (fragmentAncestors, documentAncestors) => {
    return (
      documentAncestors.size >= fragmentAncestors.size &&
      fragmentAncestors.every((fragmentNode, i) => {
        return documentAncestors.get(i).type === fragmentNode.type
      })
    )
  }

  // Given two reverse lists of ancestors, check if all fragment ancestor types
  // match the doc ancestors at some position.
  const matchingFragmentAncestor = (documentAncestors, fragmentAncestors) => {
    const depthDifference = documentAncestors.size - fragmentAncestors.size

    // There is nothing to align if the fragment is deeper than the document.
    if (depthDifference < 0) {
      return fragment
    }

    for (let fragIdx = 0; fragIdx < fragmentAncestors.size; fragIdx++) {
      // The docIdx loop relaxes our check in that we can still match if there
      // are node type differences leaf-side.
      // This is important for example if our fragment inserts multiple siblings
      // or inserts another type while the tree structure remains the same.
      for (let docIdx = 0; docIdx <= depthDifference; docIdx++) {
        if (
          ancestorTypesMatch(
            fragmentAncestors.slice(fragIdx),
            documentAncestors.slice(docIdx)
          )
        ) {
          return fragmentAncestors.get(fragIdx)
        }
      }
    }
    return fragment
  }

  // Get the type definitions for all ancestors up from node with key `key`,
  // except the document object.
  const getAncestorBlocks = (doc, key) => {
    return doc
      .getAncestors(key)
      .slice(1)
      .push(doc.getNode(key))
      .reverse()
  }

  const fragmentStartBlock = deepestSingleBlock(fragment)

  if (!fragmentStartBlock) {
    return fragment
  }

  const documentAncestors = getAncestorBlocks(document, documentKey)
  const fragmentAncestors = getAncestorBlocks(fragment, fragmentStartBlock.key)

  return matchingFragmentAncestor(documentAncestors, fragmentAncestors)
}

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Inline|String|Object} inline
 */

Commands.insertInlineAtRange = (editor, range, inline) => {
  inline = Inline.create(inline)

  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)

    const { value } = editor
    const { document } = value
    const { start } = range
    const parent = document.getParent(start.key)
    const startText = document.assertDescendant(start.key)
    const index = parent.nodes.indexOf(startText)

    if (editor.isVoid(parent)) return

    editor.splitNodeByKey(start.key, start.offset)
    editor.insertNodeByKey(parent.key, index + 1, inline)
  })
}

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.insertTextAtRange = (editor, range, text, marks) => {
  range = deleteExpandedAtRange(editor, range)

  const { value } = editor
  const { document } = value
  const { start } = range
  const offset = start.offset
  const parent = document.getParent(start.key)

  if (editor.isVoid(parent)) {
    return
  }

  editor.insertTextByKey(start.key, offset, text, marks)
}

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Mark|String} mark (optional)
 */

Commands.removeMarkAtRange = (editor, range, mark) => {
  if (range.isCollapsed) return

  const { value } = editor
  const { document } = value
  const texts = document.getTextsAtRange(range)
  const { start, end } = range

  editor.withoutNormalizing(() => {
    texts.forEach(node => {
      const { key } = node
      let index = 0
      let length = node.text.length

      if (key == start.key) index = start.offset
      if (key == end.key) length = end.offset
      if (key == start.key && key == end.key) length = end.offset - start.offset

      editor.removeMarkByKey(key, index, length, mark)
    })
  })
}

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Object|String} properties
 */

Commands.setBlocksAtRange = (editor, range, properties) => {
  const { value } = editor
  const { document } = value
  const blocks = document.getLeafBlocksAtRange(range)

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

  editor.withoutNormalizing(() => {
    sets.forEach(block => {
      editor.setNodeByKey(block.key, properties)
    })
  })
}

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Object|String} properties
 */

Commands.setInlinesAtRange = (editor, range, properties) => {
  const { value } = editor
  const { document } = value
  const inlines = document.getLeafInlinesAtRange(range)

  editor.withoutNormalizing(() => {
    inlines.forEach(inline => {
      editor.setNodeByKey(inline.key, properties)
    })
  })
}

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Number} height (optional)
 */

Commands.splitBlockAtRange = (editor, range, height = 1) => {
  range = deleteExpandedAtRange(editor, range)

  const { start, end } = range
  let { value } = editor
  let { document } = value
  let node = document.assertDescendant(start.key)
  let parent = document.getClosestBlock(node.key)
  let h = 0

  while (parent && parent.object == 'block' && h < height) {
    node = parent
    parent = document.getClosestBlock(parent.key)
    h++
  }

  editor.withoutNormalizing(() => {
    editor.splitDescendantsByKey(node.key, start.key, start.offset)

    value = editor.value
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
      editor.deleteAtRange(range)
    }
  })
}

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Number} height (optional)
 */

Commands.splitInlineAtRange = (editor, range, height = Infinity) => {
  range = deleteExpandedAtRange(editor, range)

  const { start } = range
  const { value } = editor
  const { document } = value
  let node = document.assertDescendant(start.key)
  let parent = document.getClosestInline(node.key)
  let h = 0

  while (parent && parent.object == 'inline' && h < height) {
    node = parent
    parent = document.getClosestInline(parent.key)
    h++
  }

  editor.splitDescendantsByKey(node.key, start.key, start.offset)
}

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Mixed} mark
 */

Commands.toggleMarkAtRange = (editor, range, mark) => {
  if (range.isCollapsed) return

  mark = Mark.create(mark)

  const { value } = editor
  const { document } = value
  const marks = document.getActiveMarksAtRange(range)
  const exists = marks.some(m => m.equals(mark))

  if (exists) {
    editor.removeMarkAtRange(range, mark)
  } else {
    editor.addMarkAtRange(range, mark)
  }
}

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {String|Object} properties
 */

Commands.unwrapBlockAtRange = (editor, range, properties) => {
  properties = Node.createProperties(properties)

  const { value } = editor
  let { document } = value
  const blocks = document.getLeafBlocksAtRange(range)
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

  editor.withoutNormalizing(() => {
    wrappers.forEach(block => {
      const first = block.nodes.first()
      const last = block.nodes.last()
      const parent = editor.value.document.getParent(block.key)
      const index = parent.nodes.indexOf(block)

      const children = block.nodes.filter(child => {
        return blocks.some(b => child == b || child.hasDescendant(b.key))
      })

      const firstMatch = children.first()
      const lastMatch = children.last()

      if (first == firstMatch && last == lastMatch) {
        block.nodes.forEach((child, i) => {
          editor.moveNodeByKey(child.key, parent.key, index + i)
        })

        editor.removeNodeByKey(block.key)
      } else if (last == lastMatch) {
        block.nodes.skipUntil(n => n == firstMatch).forEach((child, i) => {
          editor.moveNodeByKey(child.key, parent.key, index + 1 + i)
        })
      } else if (first == firstMatch) {
        block.nodes
          .takeUntil(n => n == lastMatch)
          .push(lastMatch)
          .forEach((child, i) => {
            editor.moveNodeByKey(child.key, parent.key, index + i)
          })
      } else {
        const firstText = firstMatch.getFirstText()

        editor.splitDescendantsByKey(block.key, firstText.key, 0)

        document = editor.value.document

        children.forEach((child, i) => {
          if (i == 0) {
            const extra = child
            child = document.getNextBlock(child.key)
            editor.removeNodeByKey(extra.key)
          }

          editor.moveNodeByKey(child.key, parent.key, index + 1 + i)
        })
      }
    })
  })
}

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {String|Object} properties
 */

Commands.unwrapInlineAtRange = (editor, range, properties) => {
  properties = Node.createProperties(properties)

  const { value } = editor
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

  editor.withoutNormalizing(() => {
    inlines.forEach(inline => {
      const parent = editor.value.document.getParent(inline.key)
      const index = parent.nodes.indexOf(inline)

      inline.nodes.forEach((child, i) => {
        editor.moveNodeByKey(child.key, parent.key, index + i)
      })

      editor.removeNodeByKey(inline.key)
    })
  })
}

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Block|Object|String} block
 */

Commands.wrapBlockAtRange = (editor, range, block) => {
  block = Block.create(block)
  block = block.set('nodes', block.nodes.clear())

  const { value } = editor
  const { document } = value

  const blocks = document.getLeafBlocksAtRange(range)
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

  editor.withoutNormalizing(() => {
    // Inject the new block node into the parent.
    editor.insertNodeByKey(parent.key, index, block)

    // Move the sibling nodes into the new block node.
    siblings.forEach((node, i) => {
      editor.moveNodeByKey(node.key, block.key, i)
    })
  })
}

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Inline|Object|String} inline
 */

Commands.wrapInlineAtRange = (editor, range, inline) => {
  const { value } = editor
  let { document } = value
  const { start, end } = range

  if (range.isCollapsed) {
    // Wrapping an inline void
    const inlineParent = document.getClosestInline(start.key)

    if (!inlineParent) {
      return
    }

    if (!editor.isVoid(inlineParent)) {
      return
    }

    return editor.wrapInlineByKey(inlineParent.key, inline)
  }

  inline = Inline.create(inline)
  inline = inline.set('nodes', inline.nodes.clear())

  const blocks = document.getLeafBlocksAtRange(range)
  let startBlock = document.getClosestBlock(start.key)
  let endBlock = document.getClosestBlock(end.key)
  const startInline = document.getClosestInline(start.key)
  const endInline = document.getClosestInline(end.key)
  let startChild = startBlock.getFurthestAncestor(start.key)
  let endChild = endBlock.getFurthestAncestor(end.key)

  editor.withoutNormalizing(() => {
    if (!startInline || startInline != endInline) {
      editor.splitDescendantsByKey(endChild.key, end.key, end.offset)
      editor.splitDescendantsByKey(startChild.key, start.key, start.offset)
    }

    document = editor.value.document
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
      editor.insertInlineAtRange(range, inline)

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
      editor.select(rng)
    } else if (startBlock == endBlock) {
      document = editor.value.document
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

      editor.insertNodeByKey(startBlock.key, startInnerIndex, node)

      inlines.forEach((child, i) => {
        editor.moveNodeByKey(child.key, node.key, i)
      })
    } else {
      const startInlines = startBlock.nodes.slice(startIndex + 1)
      const endInlines = endBlock.nodes.slice(0, endIndex + 1)
      const startNode = inline.regenerateKey()
      const endNode = inline.regenerateKey()

      editor.insertNodeByKey(startBlock.key, startIndex + 1, startNode)
      editor.insertNodeByKey(endBlock.key, endIndex, endNode)

      startInlines.forEach((child, i) => {
        editor.moveNodeByKey(child.key, startNode.key, i)
      })

      endInlines.forEach((child, i) => {
        editor.moveNodeByKey(child.key, endNode.key, i)
      })

      blocks.slice(1, -1).forEach(block => {
        const node = inline.regenerateKey()
        editor.insertNodeByKey(block.key, 0, node)

        block.nodes.forEach((child, i) => {
          editor.moveNodeByKey(child.key, node.key, i)
        })
      })
    }
  })
}

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 */

Commands.wrapTextAtRange = (editor, range, prefix, suffix = prefix) => {
  const { start, end } = range
  const startRange = range.moveToStart()
  let endRange = range.moveToEnd()

  if (start.key == end.key) {
    endRange = endRange.moveForward(prefix.length)
  }

  editor.withoutNormalizing(() => {
    editor.insertTextAtRange(startRange, prefix, [])
    editor.insertTextAtRange(endRange, suffix, [])
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
