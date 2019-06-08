import { List } from 'immutable'
import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
import PathUtils from '../utils/path-utils'

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

  if (document.hasDescendant(start.path)) {
    range = range.moveToStart()
  } else {
    range = range.moveTo(end.path, 0).normalize(document)
  }

  return range
}

/**
 * Ensure that the edges of a range are split such that they are at the edge of
 * all of the inline and text nodes they are in. This will split inline nodes
 * and text nodes and update the range to be inside the split.
 *
 * @param {Editor}
 */

function splitInlinesAtRange(editor, range) {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
  }

  const { value: { document } } = editor
  const start = editor.getPreviousNonVoidPoint(range.start)
  const startText = document.getNode(start.path)
  const startInline = document.furthestInline(start.path)
  const end = editor.getNextNonVoidPoint(range.end)
  const endText = document.getNode(end.path)
  const endInline = document.furthestInline(end.path)

  if (end.offset !== 0 && end.offset !== endText.text.length) {
    editor.splitNodeByPath(end.path, end.offset)
  }

  if (start.offset !== 0 && start.offset !== startText.text.length) {
    editor.splitNodeByPath(start.path, start.offset)

    const newStart = start
      .setPath(PathUtils.increment(start.path))
      .setOffset(0)
      .normalize(document)

    range = range.setStart(newStart)
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
  if (range.isCollapsed) {
    return
  }

  const { value } = editor
  const { document } = value
  const { start, end } = range

  editor.withoutNormalizing(() => {
    for (const [node, path] of document.texts({ range })) {
      let index = 0
      let length = node.text.length

      if (path.equals(start.path)) {
        index = start.offset
      }

      if (path.equals(end.path)) {
        length = end.offset
      }

      if (path.equals(start.path) && path.equals(end.path)) {
        length = end.offset - start.offset
      }

      editor.addMarkByPath(path, index, length, mark)
    }
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
    startOffset === 0 &&
    endOffset === 0 &&
    isStartVoid === false &&
    startKey === startBlock.getFirstText().key &&
    endKey === endBlock.getFirstText().key &&
    startKey !== endKey

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
      if (startKey === endKey) return

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
    if (startKey === endKey && isHanging) {
      editor.removeNodeByKey(startBlock.key)
      return
    } else if (startKey === endKey) {
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
      const startChild = ancestor.getFurthestChild(startKey)
      const endChild = ancestor.getFurthestChild(endKey)

      const startParent = document.getParent(startBlock.key)
      const startParentIndex = startParent.nodes.indexOf(startBlock)
      const endParentIndex = startParent.nodes.indexOf(endBlock)

      let child

      // Iterate through all of the nodes in the tree after the start text node
      // but inside the end child, and remove them.
      child = startText

      while (child.key !== startChild.key) {
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

      while (child.key !== endChild.key) {
        const parent = document.getParent(child.key)
        const index = parent.nodes.indexOf(child)
        const befores = parent.nodes.slice(0, index)

        befores.reverse().forEach(node => {
          editor.removeNodeByKey(node.key)
        })

        child = parent
      }

      // Remove any overlapping text content from the leaf text nodes.
      if (startLength !== 0) {
        editor.removeTextByKey(startKey, startOffset, startLength)
      }

      if (endLength !== 0) {
        editor.removeTextByKey(endKey, 0, endOffset)
      }

      // If the start and end blocks aren't the same, move and merge the end block
      // into the start block.
      if (startBlock.key !== endBlock.key) {
        document = editor.value.document
        let onlyChildAncestor

        for (const [node] of document.ancestors(endBlock.key)) {
          if (node.nodes.size > 1) {
            break
          } else {
            onlyChildAncestor = node
          }
        }

        // Move the end block to be right after the start block.
        if (endParentIndex !== startParentIndex + 1) {
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
        if (onlyChildAncestor) {
          editor.removeNodeByKey(onlyChildAncestor.key)
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
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  if (n === 0) {
    return
  }

  const { value } = editor
  const { document } = value
  const { start } = range
  const closestVoid = document.closest(start.path, editor.isVoid)

  if (closestVoid) {
    const [, voidPath] = closestVoid
    editor.removeNodeByPath(voidPath)
    return
  }

  // If the range is at the start of the document, abort.
  if (start.isAtStartOfNode(document)) {
    return
  }

  const block = document.getClosestBlock(start.path)

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
  const text = document.getDescendant(start.path)

  if (start.isAtStartOfNode(text)) {
    let prev = document.getPreviousText(text.key)
    const inline = document.getClosestInline(text.key)

    // If the range is at the start of the inline node, and previous text node
    // is empty, take the text node before that, or "prevBlock" would be the
    // same node as "block"
    if (inline && prev.text === '') {
      prev = document.getPreviousText(prev.key)
    }

    const prevVoid = document.getClosestVoid(prev.key, editor)

    // If the previous text node has a void parent, remove it.
    if (prevVoid) {
      editor.removeNodeByKey(prevVoid.key)
      return
    }
  }

  let point = range.start

  for (let i = 0; i < n; i++) {
    const next = editor.getPreviousPoint(point)

    if (!next) {
      break
    } else {
      point = next
    }
  }

  range = range.setStart(point)
  editor.deleteAtRange(range)
  return
}

// Commands.deleteBackwardAtRange = (editor, range, n = 1) => {
//   if (range.isExpanded) {
//     editor.deleteAtRange(range)
//   } else {
//     let point = range.start

//     for (let i = 0; i < n; i++) {
//       const next = editor.getPreviousPoint(point)

//       if (!next) {
//         break
//       } else {
//         point = next
//       }
//     }

//     range = range.setStart(point)
//     editor.deleteAtRange(range)
//   }
// }

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

Commands.deleteCharBackwardAtRange = (editor, range) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
  } else {
    const prev = editor.getPreviousCharacterPoint(range.end)

    if (prev) {
      range = range.setStart(prev)
      editor.deleteAtRange(range)
    }
  }
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
  } else {
    const next = editor.getNextCharacterPoint(range.end)

    if (next) {
      range = range.setStart(next)
      editor.deleteAtRange(range)
    }
  }
}

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Number} n (optional)
 */

Commands.deleteForwardAtRange = (editor, range, n = 1) => {
  if (range.isExpanded) {
    editor.deleteAtRange(range)
    return
  }

  if (n === 0) {
    return
  }

  const { value } = editor
  const { document } = value
  const { start, focus } = range
  const voidParent = document.getClosestVoid(start.path, editor)

  // If the node has a void parent, delete it.
  if (voidParent) {
    editor.removeNodeByKey(voidParent.key)
    return
  }

  const block = document.getClosestBlock(start.path)

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
  const text = document.getDescendant(start.path)

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
    if (n === 1 && nextBlock !== block) {
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
  const [block, path] = document.closestBlock(start.path)
  const relativePath = start.path.slice(path.size)
  const offset = block.getOffset(relativePath)
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
  const [block, path] = document.closestBlock(start.path)
  const relativePath = start.path.slice(path.size)
  const offset = block.getOffset(relativePath)
  const o = offset + start.offset
  editor.deleteForwardAtRange(range, block.text.length - o)
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
  } else {
    const previous = editor.getPreviousWordPoint(range.end)

    if (previous) {
      range = range.setStart(previous)
      editor.deleteAtRange(range)
    }
  }
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
  } else {
    const next = editor.getNextWordPoint(range.start)

    if (next) {
      range = range.setEnd(next)
      editor.deleteAtRange(range)
    }
  }
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
  const [, blockPath] = document.closestBlock(start.path)
  const parentPath = PathUtils.lift(blockPath)
  const index = blockPath.last()
  const insertionMode = getInsertionMode(editor, range)

  if (insertionMode === 'before') {
    editor.insertNodeByPath(parentPath, index, block)
  } else if (insertionMode === 'after') {
    editor.insertNodeByPath(parentPath, index + 1, block)
  } else {
    const point =
      editor.getNextNonVoidPoint(start) || editor.getPreviousNonVoidPoint(start)

    editor.withoutNormalizing(() => {
      editor.splitDescendantsByPath(blockPath, point.path, point.offset)
      editor.insertNodeByPath(parentPath, index + 1, block)
    })
  }
}

/**
 * Check if current block should be split or new block should be added before or behind it.
 *
 * @param {Editor} editor
 * @param {Range} range
 */

const getInsertionMode = (editor, range) => {
  const { value } = editor
  const { document } = value

  range = range.normalize(document)
  const { start } = range
  const startBlock = document.getClosestBlock(start.path)
  const startInline = document.getClosestInline(start.path)

  if (editor.isVoid(startBlock)) {
    if (start.isAtEndOfNode(startBlock)) return 'after'
    else return 'before'
  } else if (!startInline && startBlock.text === '') {
    return 'after'
  } else if (start.isAtStartOfNode(startBlock)) {
    return 'before'
  } else if (start.isAtEndOfNode(startBlock)) {
    return 'after'
  }
  return 'split'
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
    let startText = document.getDescendant(start.path)
    let startBlock = document.getClosestBlock(start.path)
    let startChild = startBlock.getFurthestChild(startText.key)
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
    if (firstBlock !== lastBlock) {
      const lonelyParent = insertionNode.getFurthest(
        firstBlock.key,
        p => p.nodes.size === 1
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
    if (start.offset !== 0) {
      editor.splitDescendantsByKey(startChild.key, start.key, start.offset)
    }

    // Update our variables with the new value.
    document = editor.value.document
    startText = document.getDescendant(start.key)
    startBlock = document.getClosestBlock(start.key)
    startChild = startBlock.getFurthestChild(startText.key)

    // If the first and last block aren't the same, we need to move any of the
    // starting block's children after the split into the last block of the
    // fragment, which has already been inserted.
    if (firstBlock !== lastBlock) {
      const nextChild = isAtStart
        ? startChild
        : startBlock.getNextSibling(startChild.key)
      const nextNodes = nextChild
        ? startBlock.nodes.skipUntil(n => n.key === nextChild.key)
        : List()
      const lastIndex = lastBlock.nodes.size

      nextNodes.forEach((node, i) => {
        const newIndex = lastIndex + i
        editor.moveNodeByKey(node.key, lastBlock.key, newIndex)
      })
    }

    // If the starting block is empty, we replace it entirely with the first block
    // of the fragment, since this leads to a more expected behavior for the user.
    if (
      !editor.isVoid(startBlock) &&
      startBlock.text === '' &&
      !startBlock.findDescendant(n => editor.isVoid(n))
    ) {
      editor.removeNodeByKey(startBlock.key)
      editor.insertNodeByKey(parent.key, index, firstBlock)
    } else {
      // Otherwise, we maintain the starting block, and insert all of the first
      // block's inline nodes into it at the split point.
      const inlineChild = startBlock.getFurthestChild(startText.key)
      const inlineIndex = startBlock.nodes.indexOf(inlineChild)

      firstBlock.nodes.forEach((inline, i) => {
        const o = start.offset === 0 ? 0 : 1
        const newIndex = inlineIndex + i + o
        editor.insertNodeByKey(startBlock.key, newIndex, inline)
      })
    }
  })
}

const findInsertionNode = (fragment, document, startKey) => {
  const hasSingleNode = object => {
    if (!object || object.object === 'text') return
    return object.nodes.size === 1
  }

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
 * @param {Editor} editor
 * @param {Range} range
 * @param {Inline|String|Object} inline
 */

Commands.insertInlineAtRange = (editor, range, inline) => {
  editor.withoutNormalizing(() => {
    inline = Inline.create(inline)
    range = deleteExpandedAtRange(editor, range)
    const { value: { document } } = editor
    const { start } = range
    const closestVoid = document.closest(start.path, editor.isVoid)
    const parentPath = PathUtils.lift(start.path)
    const index = start.path.last()

    if (closestVoid) {
      return
    }

    editor.splitNodeByPath(start.path, start.offset)
    editor.insertNodeByPath(parentPath, index + 1, inline)
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
  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)
    const { value: { document } } = editor
    const { start } = range
    const closestVoid = document.closest(start.path, editor.isVoid)

    if (closestVoid) {
      return
    }

    editor.insertTextByPath(start.path, start.offset, text, marks)
  })
}

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {Mark|String} mark (optional)
 */

Commands.removeMarkAtRange = (editor, range, mark) => {
  if (range.isCollapsed) {
    return
  }

  const { value } = editor
  const { document } = value
  const { start, end } = range

  editor.withoutNormalizing(() => {
    for (const [node, path] of document.texts({ range })) {
      const isStart = path.equals(start.path)
      const isEnd = path.equals(end.path)
      let index
      let length

      if (isStart && isEnd) {
        index = start.offset
        length = end.offset - start.offset
      } else if (isStart) {
        index = start.offset
        length = node.text.length - start.offset
      } else if (isEnd) {
        index = 0
        length = end.offset
      } else {
        index = 0
        length = node.text.length
      }

      editor.removeMarkByPath(path, index, length, mark)
    }
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
  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    const iterable = document.blocks({
      range,
      includeHanging: false,
      onlyLeaves: true,
    })

    for (const [, path] of iterable) {
      editor.setNodeByPath(path, properties)
    }
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
  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    const iterable = document.inlines({ range, onlyLeaves: true })

    for (const [, path] of iterable) {
      editor.setNodeByPath(path, properties)
    }
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
  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)
    const { start } = range
    const { value: { document } } = editor
    let h = 0
    let targetPath

    for (const [node, path] of document.ancestors(start.path)) {
      if (h >= height) {
        break
      } else if (node.object === 'block') {
        targetPath = path
        h++
      }
    }

    if (targetPath) {
      editor.splitDescendantsByKey(targetPath, start.path, start.offset)
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
  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)
    const { start } = range
    const { value: { document } } = editor
    let h = 0
    let targetPath

    for (const [node, path] of document.ancestors(start.path)) {
      if (h >= height) {
        break
      } else if (node.object === 'inline') {
        targetPath = path
        h++
      }
    }

    if (targetPath) {
      editor.splitDescendantsByPath(targetPath, start.path, start.offset)
    }
  })
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
 * TODO: This should be aligned with `unwrapInlineAtRange`, which currently does
 * not split parent nodes in the ranges, and instead removes any matching inline
 * parent nodes in the range. I think we probably need to different concepts,
 * and then to allow each for blocks and inlines.
 *
 * @param {Editor} editor
 * @param {Range} range
 * @param {String|Object} properties
 */

Commands.unwrapBlockAtRange = (editor, range, properties) => {
  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    const iterable = document.blocks({
      range,
      match: (block, path) => {
        if (block.hasProperties(properties)) {
          return false
        } else {
          const parentPath = PathUtils.lift(path)
          const parent = document.getNode(parentPath)
          return parent && parent.hasProperties(properties)
        }
      },
    })

    // We need to reverse the paths here, because unwrapping each inline will
    // affect the paths of the inlines after it, so we go backwards instead.
    const paths = Array.from(iterable, ([, path]) => path).reverse()

    for (const path of paths) {
      editor.unwrapNodeByPath(path)
    }
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
  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    const iterable = document.inlines({
      range,
      match: inline => inline.hasProperties(properties),
    })

    // We need to reverse the paths here, because unwrapping each inline will
    // affect the paths of the inlines after it, so we go backwards instead.
    const paths = Array.from(iterable, ([, path]) => path).reverse()

    for (const path of paths) {
      editor.unwrapChildrenByPath(path)
    }
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

  const { value: { document } } = editor
  const { start, end } = range
  const [, firstPath] = document.closestBlock(start.path)
  const [, lastPath] = document.closestBlock(end.path)
  const ancestorPath = firstPath.equals(lastPath)
    ? PathUtils.lift(firstPath)
    : PathUtils.relate(firstPath, lastPath)

  const startIndex = firstPath.get(ancestorPath.size)
  const endIndex = lastPath.get(ancestorPath.size)

  editor.withoutNormalizing(() => {
    editor.insertNodeByPath(ancestorPath, startIndex, block)

    for (let i = 0; i <= endIndex - startIndex; i++) {
      const path = ancestorPath.concat(startIndex + 1)
      const newPath = ancestorPath.concat(startIndex)
      editor.moveNodeByPath(path, newPath, i)
    }
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
  inline = Inline.create(inline)
  inline = inline.set('nodes', inline.nodes.clear())

  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    let start = editor.getPreviousNonVoidPoint(range.start)
    let end = editor.getNextNonVoidPoint(range.end)
    const startText = document.getNode(start.path)
    const endText = document.getNode(end.path)
    const startFurthest = document.furthestInline(start.path)
    const endFurthest = document.furthestInline(end.path)

    if (endFurthest) {
      const [furthestNode, furthestPath] = endFurthest
      const [lastText, lastPath] = furthestNode.lastText()
      const relativePath = end.path.slice(furthestPath.size)

      if (
        end.offset !== lastText.text.length ||
        !relativePath.equals(lastPath)
      ) {
        editor.splitDescendantsByPath(furthestPath, end.path, end.offset)
      }
    } else if (end.offset !== 0 && end.offset !== endText.text.length) {
      editor.splitNodeByPath(end.path, end.offset)

      end = end
        .setPath(PathUtils.increment(end.path))
        .setOffset(0)
        .setKey(null)
        .normalize(editor.value.document)
    }

    if (startFurthest) {
      const [furthestNode, furthestPath] = startFurthest
      const [, firstPath] = furthestNode.firstText()
      const relativePath = start.path.slice(furthestPath.size)

      if (start.offset !== 0 || !relativePath.equals(firstPath)) {
        editor.splitDescendantsByPath(furthestPath, start.path, start.offset)

        if (
          PathUtils.isYounger(furthestPath, end.path) ||
          PathUtils.isAbove(furthestPath, end.path) ||
          PathUtils.isEqual(furthestPath, end.path)
        ) {
          end = end
            .setPath(PathUtils.increment(end.path, 1, furthestPath.size - 1))
            .setKey(null)
            .normalize(editor.value.document)
        }

        start = start
          .setPath(
            PathUtils.increment(furthestPath).concat(relativePath.map(() => 0))
          )
          .setOffset(0)
          .setKey(null)
          .normalize(editor.value.document)
      }
    } else if (start.offset !== 0 && start.offset !== startText.text.length) {
      editor.splitNodeByPath(start.path, start.offset)

      if (
        PathUtils.isYounger(start.path, end.path) ||
        PathUtils.isAbove(start.path, end.path) ||
        PathUtils.isEqual(start.path, end.path)
      ) {
        end = end
          .setPath(PathUtils.increment(end.path, 1, start.path.size - 1))
          .setKey(null)
          .normalize(editor.value.document)
      }

      start = start
        .setPath(PathUtils.increment(start.path))
        .setOffset(0)
        .setKey(null)
        .normalize(editor.value.document)
    }

    range = range.setAnchor(start).setFocus(end)
    range = editor.getNonHangingRange(range)

    const iterable = editor.value.document.blocks({ range, onlyLeaves: true })

    for (const [block, blockPath] of iterable) {
      const isStart = PathUtils.isAbove(blockPath, range.start.path)
      const isEnd = PathUtils.isAbove(blockPath, range.end.path)
      const startIndex = isStart ? range.start.path.get(blockPath.size) : 0
      const endIndex = isEnd
        ? range.end.path.get(blockPath.size)
        : block.nodes.size - 1

      editor.insertNodeByPath(blockPath, startIndex, inline)
      // HACK: need to regenerate the key to ensure that subsequent inserts
      // don't re-use the same key.
      inline = inline.regenerateKey()

      for (let i = 0; i <= endIndex - startIndex; i++) {
        const path = blockPath.concat(startIndex + 1)
        const newPath = blockPath.concat(startIndex)
        editor.moveNodeByPath(path, newPath, i)
      }
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

  if (start.path.equals(end.path)) {
    endRange = endRange.moveForward(prefix.length)
  }

  editor.withoutNormalizing(() => {
    editor.insertTextAtRange(startRange, prefix)
    editor.insertTextAtRange(endRange, suffix)
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
