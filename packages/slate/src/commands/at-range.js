import { List } from 'immutable'
import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import Path from '../utils/path-utils'

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
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Range} range
 * @param {Mixed} mark
 */

Commands.addMarkAtRange = (fn, editor) => (range, mark) => {
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
 * @param {Range} range
 * @param {Array<Mixed>} mark
 */

Commands.addMarksAtRange = (fn, editor) => (range, marks) => {
  marks.forEach(mark => editor.addMarkAtRange(range, mark))
}

/**
 * Delete everything in a `range`.
 *
 * @param {Range} range
 */

Commands.deleteAtRange = (fn, editor) => range => {
  editor.withoutNormalizing(() => {
    // HACK: Snapshot the selection, which creates an extra undo save point, so
    // that when you undo a delete, the expanded selection will be retained. We
    // should find a better way to do this...
    editor.snapshotSelection()

    const { value: { document } } = editor
    const iterable = document.descendants({ range })
    const { start, end } = range
    const [startBlock, startBlockPath] = document.closestBlock(start.path)
    const [endBlock, endBlockPath] = document.closestBlock(end.path)
    const isAcrossBlocks = !startBlockPath.equals(endBlockPath)
    const isAcrossTexts = !start.path.equals(end.path)
    const entries = Array.from(iterable).reverse()
    let mergePath = endBlockPath

    // COMPAT: Rich text editors have a special behavior when triple-clicking
    // which results in the end point being at the start of the next block. In
    // this case, they preserve the end block instead of merging it.
    const isHanging =
      range.isExpanded &&
      editor.isAtStartOfBlock(range.start) &&
      editor.isAtStartOfBlock(range.end)

    const isStartVoid = !!document.closest(
      start.path,
      n => n.object === 'block' && editor.isVoid(n)
    )

    const isEndVoid = !!document.closest(
      end.path,
      n => n.object === 'block' && editor.isVoid(n)
    )

    for (const [node, path] of entries) {
      if (isHanging && Path.isIn(path, endBlockPath)) {
        // Don't remove the end block's nodes if it's hanging.
      } else if (editor.isVoid(node)) {
        editor.removeNodeByPath(path)
      } else if (document.closest(path, editor.isVoid)) {
        // Don't bother removing children of voides.
      } else if (
        Path.isChild(path, startBlockPath) ||
        Path.isChild(path, endBlockPath) ||
        (!isAcrossTexts && path.equals(start.path))
      ) {
        const isAtStart = Path.isAt(path, start.path)
        const isAtEnd = Path.isAt(path, end.path)
        const splitEnd = isAtEnd && !editor.isAtEndOfPath(end, path)
        const splitStart = isAtStart && !editor.isAtStartOfPath(start, path)
        const splitLater = !isAcrossTexts && !path.equals(start.path)

        if (
          (isAtEnd && editor.isAtStartOfPath(end, path)) ||
          (isAtStart && editor.isAtEndOfPath(start, path))
        ) {
          // Do nothing, since it's before/after.
        } else if (splitLater) {
          // Don't split yet, since we're too high up.
        } else if (splitEnd && splitStart) {
          const newPath = Path.increment(path)
          editor.splitDescendantsByPath(path, end.path, end.offset)
          editor.splitDescendantsByPath(path, start.path, start.offset)
          editor.removeNodeByPath(newPath)
        } else if (
          splitEnd ||
          (isAtEnd && !splitStart && endBlock.nodes.size === 1)
        ) {
          editor.splitDescendantsByPath(path, end.path, end.offset)
          editor.removeNodeByPath(path)
        } else if (
          splitStart ||
          (isAtStart && !splitEnd && startBlock.nodes.size === 1)
        ) {
          const newPath = Path.increment(path)
          editor.splitDescendantsByPath(path, start.path, start.offset)
          editor.removeNodeByPath(newPath)
        } else if (
          isAtStart ||
          isAtEnd ||
          Path.isBetween(path, start.path, end.path)
        ) {
          editor.removeNodeByPath(path)
        }
      } else if (Path.isBetween(path, startBlockPath, endBlockPath)) {
        editor.removeNodeByPath(path)

        if (Path.isYounger(path, mergePath)) {
          mergePath = Path.decrement(mergePath, 1, path.size - 1)
        }
      }
    }

    // TODO: this `isHanging` logic could probably be simplified by editing the
    // range before iterating, instead of trying to handle each edge case here.
    if (isHanging && isStartVoid && !isEndVoid) {
      // If the selection is hanging, and the start block was a void, it will
      // have already been removed, so we do nothing.
    } else if (isHanging && (isStartVoid || isEndVoid)) {
      editor.removeNodeByPath(startBlockPath)
    } else if (isStartVoid || isEndVoid) {
      // If the selection wasn't hanging, and it started or ended in a void node
      // they will have already been removed, so we're done.
    } else if (isHanging) {
      // If the selection was hanging, we want to remove the start block
      // entirely instead of merging it with the end block. This is a rich text
      // editor behavior that's fairly standard.
      const newPath = Path.increment(startBlockPath)
      editor.moveNodeByPath(mergePath, newPath)
      editor.removeNodeByPath(startBlockPath)
    } else if (isAcrossBlocks) {
      // If the selection wasn't hanging, but we were across blocks, we need to
      // merge the block into the previous one.
      editor.mergeBlockByPath(mergePath)
    }
  })
}

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Range} range
 * @param {Number} n (optional)
 */

Commands.deleteBackwardAtRange = (fn, editor) => (range, n = 1) => {
  if (range.isExpanded) {
    return editor.deleteAtRange(range)
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
  return editor.deleteAtRange(range)
}

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Range} range
 */

Commands.deleteCharBackwardAtRange = (fn, editor) => range => {
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
 * @param {Range} range
 */

Commands.deleteCharForwardAtRange = (fn, editor) => range => {
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
 * @param {Range} range
 * @param {Number} n (optional)
 */

Commands.deleteForwardAtRange = (fn, editor) => (range, n = 1) => {
  if (range.isExpanded) {
    return editor.deleteAtRange(range)
  }

  let point = range.start

  for (let i = 0; i < n; i++) {
    const next = editor.getNextPoint(point)

    if (!next) {
      break
    } else {
      point = next
    }
  }

  range = range.setStart(point)
  return editor.deleteAtRange(range)
}

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Range} range
 */

Commands.deleteLineBackwardAtRange = (fn, editor) => range => {
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
 * @param {Range} range
 */

Commands.deleteLineForwardAtRange = (fn, editor) => range => {
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
 * @param {Range} range
 */

Commands.deleteWordBackwardAtRange = (fn, editor) => range => {
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
 * @param {Range} range
 */

Commands.deleteWordForwardAtRange = (fn, editor) => range => {
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
 * @param {Range} range
 * @param {Block|String|Object} block
 */

Commands.insertBlockAtRange = (fn, editor) => (range, block) => {
  range = deleteExpandedAtRange(editor, range)
  block = Block.create(block)
  const { value: { document } } = editor
  const { start } = range
  const [closestBlock, closestBlockPath] = document.closestBlock(start.path)
  const closestInline = document.closestInline(start.path)
  let targetPath
  let pathRef

  editor.withoutNormalizing(() => {
    if (
      (!closestInline && closestBlock.text === '') ||
      editor.isAtEndOfPath(start, closestBlockPath)
    ) {
      targetPath = Path.increment(closestBlockPath)
    } else if (
      editor.isAtStartOfPath(start, closestBlockPath) ||
      editor.isVoid(closestBlock)
    ) {
      targetPath = closestBlockPath
    } else {
      const splitPoint =
        editor.getNextNonVoidPoint(start) ||
        editor.getPreviousNonVoidPoint(start)

      editor.splitDescendantsByPath(
        closestBlockPath,
        splitPoint.path,
        splitPoint.offset
      )

      targetPath = Path.increment(closestBlockPath)
    }

    editor.insertNodeByPath(targetPath, block)
    pathRef = editor.createPathRef(targetPath)
  })

  pathRef.unref()
  return pathRef.path
}

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Range} range
 * @param {Document} fragment
 */

Commands.getBackwardMostPoint = (fn, editor) => point => {
  if (point.offset === 0) {
    return point
  } else {
    return editor.getPreviousPoint(point, { allowZeroWidth: true })
  }
}

Commands.getForwardMostPoint = (fn, editor) => point => {
  const { value: { document } } = editor
  const node = document.getNode(point.path)

  if (point.offset === node.text.length) {
    return point
  } else {
    return editor.getNextPoint(point, { allowZeroWidth: true })
  }
}

Commands.getInnerMostRange = (fn, editor) => range => {
  const start = editor.getForwardMostPoint(range.start)
  const end = editor.getBackwardMostPoint(range.end)
  return range.setPoints([start, end])
}

Commands.ensureSplitBlockAtRange = (fn, editor) => range => {
  const { value: { document } } = editor
  const { isExpanded, start, end } = range
  const [, startBlockPath] = document.closestBlock(start.path)
  const [, endBlockPath] = document.closestBlock(end.path)

  // if (!editor.isAtEdgeOfPath(end, endBlockPath)) {
  editor.splitDescendantsByPath(endBlockPath, end.path, end.offset)
  // }

  if (isExpanded && !editor.isAtEdgeOfPath(start, startBlockPath)) {
    editor.splitDescendantsByPath(startBlockPath, start.path, start.offset)
  }
}

Commands.insertFragmentAtRange = (fn, editor) => (range, fragment) => {
  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)

    if (!fragment.nodes.size) {
      return
    }

    const point = range.start
    const { value: { document } } = editor
    const [, fragTextPath] = fragment.firstText()
    let fragBlock = fragment.closestBlock(fragTextPath)
    let height = 0
    let splitPath

    // Get a list of the nodes in the fragment that are top-level ancestors that
    // only have a single child. Because sometimes, if the target point has
    // matching ancestors then we avoid inserting them again. And instead insert
    // just their children nodes.
    const fragSingleAncestors = []
    const fragAncestors = Array.from(fragment.ancestors(fragTextPath))
      .reverse()
      .map(([n]) => n)

    for (const ancestor of fragAncestors) {
      fragSingleAncestors.push(ancestor)

      if (ancestor.nodes.size !== 1) {
        break
      }
    }

    for (const [node, path] of document.ancestors(point.path)) {
      debugger

      if (node.object === 'document') {
        break
      }

      if (node.object === 'block' && fragBlock) {
        const [fragBlockNode, fragBlockPath] = fragBlock
        debugger

        if (fragSingleAncestors.some(a => a.isSimilar(node))) {
          fragment = fragment.set('nodes', fragBlockNode.nodes)
          break
        }

        if (fragBlockNode.isSimilar(node)) {
          height++
          splitPath = path
          fragBlock = fragment.closestBlock(fragBlockPath)
        }
      }
    }

    debugger
    editor.splitBlockAtPoint(point, height)

    const firstPath = Path.increment(splitPath)
    const afterPathRef = editor.createPathRef(firstPath)

    fragment = fragment.mapDescendants(child => child.regenerateKey())

    for (const node of fragment.nodes) {
      const { path } = afterPathRef
      const parentPath = Path.lift(path)
      const index = path.last()
      editor.insertNodeByPath(parentPath, index, node)
    }

    const lastPath = Path.decrement(afterPathRef.path)
    const firstPoint = editor.getPointAtStartOfPath(firstPath)
    const afterPoint = editor.getPointAtStartOfPath(afterPathRef.path)
    const lastPoint = editor.getPointAtEndOfPath(lastPath)
    const lastPointRef = editor.createPointRef(lastPoint)
    debugger
    editor.mergeBlockByPath(afterPoint.path)
    debugger
    editor.mergeBlockByPath(firstPoint.path)

    range = range.setPoints([lastPointRef.point, lastPointRef.point])
    afterPathRef.unref()
    lastPointRef.unref()
  })

  return range

  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)

    // If the fragment is empty, there's nothing to do after deleting.
    if (!fragment.nodes.size) {
      return
    }

    // Regenerate the keys for all of the fragments nodes, so that they're
    // guaranteed not to collide with the existing keys in the document. Otherwise
    // they will be rengerated automatically and we won't have an easy way to
    // reference them.
    fragment = fragment.mapDescendants(child => child.regenerateKey())

    const { value: { document } } = editor
    const { start } = range
    const [startBlock, startBlockPath] = document.closestBlock(start.path)
    const hasMultipleBlocks = fragment.nodes.size !== 1
    let insertPath = Path.increment(startBlockPath)
    let parentPath = Path.lift(insertPath)
    let startBlockInsertIndex = startBlock.nodes.size
    let endBlockInsertIndex = 0
    let splitStart = false
    let splitEnd = false

    for (const [node, path] of fragment.descendants()) {
      const index = path.last()
      const isChild = path.size === 1
      const isFirst = index === 0
      const isLast = index === fragment.nodes.size - 1

      if (Path.isAt(path, [0]) && hasMultipleBlocks) {
        if (Path.isChild(path, startBlockPath)) {
          // Before the first child, we might need to split the start block.
          if (path.last() === 0) {
            if (editor.isAtStartOfPath(start, startBlockPath)) {
              insertPath = startBlockPath
            } else if (!editor.isAtEndOfPath(start, startBlockPath)) {
              editor.splitDescendantsByPath(
                startBlockPath,
                start.path,
                start.offset
              )
              insertPath = Path.increment(insertPath)
              startBlockInsertIndex = start.path.get(startBlockPath.size)
            }
          }

          editor.insertNodeByPath(startBlockPath, startBlockInsertIndex, node)
          startBlockInsertIndex++
        } else {
          // Do nothing, since these will get merged in.
        }
      } else if (Path.isAt(path, [fragment.nodes.size - 1])) {
        if (Path.isChild(path, endBlockPath)) {
          // Before the first child, we might need to split the end block.
          if (path.last() === 0) {
            if (editor.isAtStartOfPath(end, endBlockPath)) {
              insertPath = endBlockPath
            } else if (!editor.isAtEndOfPath(end, endBlockPath)) {
              editor.splitDescendantsByPath(endBlockPath, end.path, end.offset)
              insertPath = Path.increment(insertPath)
              endBlockInsertIndex = end.path.get(endBlockPath.size)
            }
          }

          editor.insertNodeByPath(endBlockPath, endBlockInsertIndex, node)
          endBlockInsertIndex++
        } else {
          // Do nothing, since these will get merged in.
        }
      } else {
        const parentPath = Path.lift(insertPath)
        const index = insertPath.last() + 1
        editor.insertNodeByPath(parentPath, index, node)
        insertPath = Path.increment(insertPath)
      }

      if (path.equals(startBlockPath)) {
      } else if (Path.isChild(path, startBlockPath)) {
        editor.insertNodeByPath(startBlockPath, startBlockInsertIndex, node)
        startBlockInsertIndex++
      } else if (path.equals(endBlockPath)) {
      } else {
        const parentPath = Path.lift(insertPath)
        const index = insertPath.last()
        editor.insertNodeByPath(parentPath, index, node)
      }

      // if is start, and not merging, insert it
      // if is middle, insert it
      // if is end, and not merging, insert it
      // if is end and merge, insert its children
      // if is end parent and merging, remove
    }
  })

  return range

  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)

    // If the fragment is empty, there's nothing to do after deleting.
    if (!fragment.nodes.size) {
      return
    }

    // Regenerate the keys for all of the fragments nodes, so that they're
    // guaranteed not to collide with the existing keys in the document. Otherwise
    // they will be rengerated automatically and we won't have an easy way to
    // reference them.
    fragment = fragment.mapDescendants(child => child.regenerateKey())

    const { value: { document } } = editor
    const { start } = range
    const [, startBlockPath] = document.closestBlock(start.path)
    const prevBlock = document.previousBlock(start.path)
    const nextBlock = document.nextBlock(start.path)
    const parentPath = Path.lift(startBlockPath)
    let prevPath = prevBlock ? prevBlock[1] : null
    let nextPath = nextBlock ? nextBlock[1] : null
    let insertPath = Path.increment(startBlockPath)

    if (editor.isAtStartOfPath(start, startBlockPath)) {
      nextPath = startBlockPath
      insertPath = startBlockPath
    } else if (editor.isAtEndOfPath(start, startBlockPath)) {
      prevPath = startBlockPath
    } else {
      editor.splitDescendantsByPath(startBlockPath, start.path, start.offset)
      prevPath = startBlockPath
      nextPath = Path.increment(startBlockPath)
    }

    const firstPath = insertPath

    for (const [node] of fragment.blocks({ onlyRoots: true })) {
      const index = insertPath.last()
      editor.insertNodeByPath(parentPath, index, node)

      if (
        nextPath &&
        (Path.endsBefore(insertPath, nextPath) ||
          Path.endsAt(insertPath, nextPath))
      ) {
        nextPath = Path.increment(nextPath, 1, insertPath.size - 1)
      }

      insertPath = Path.increment(insertPath)
    }

    const lastPath = Path.decrement(insertPath)
    const lastText = fragment.lastText()
    const [textNode, textPath] = lastText
    const [, blockPath] = fragment.closestBlock(textPath)
    const relativePath = textPath.slice(blockPath.size)
    const path = lastPath.concat(relativePath)
    const pathRef = editor.createPathRef(path)

    if (nextPath) {
      nextPath = editor.mergeBlockByPath(nextPath)
    }

    if (prevPath) {
      if (
        nextPath &&
        (Path.endsBefore(firstPath, nextPath) ||
          Path.endsAt(firstPath, nextPath))
      ) {
        nextPath = Path.decrement(nextPath, 1, firstPath.size - 1)
      }

      editor.mergeBlockByPath(firstPath)
    }

    const offset = textNode.text.length
    const point = editor.createPoint({ path: pathRef.path, offset })
    range = range.setPoints([point, point])
    pathRef.unref()
  })

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
}

const findInsertionNode = (fragment, document, startKey) => {
  const hasSingleNode = object => {
    if (!object || object.object === 'text') return
    return object.nodes.size === 1
  }

  const firstNode = object => {
    return object && object.nodes.first()
  }

  let node = fragment

  if (hasSingleNode(fragment)) {
    let fragmentInner = firstNode(fragment)
    let documentInner = document.getFurthest(startKey, documentNode => {
      return documentNode.type === fragmentInner.type
    })

    if (documentInner === document.getParent(startKey)) {
      node = fragmentInner
    }

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
 * @param {Range} range
 * @param {Inline|String|Object} inline
 */

Commands.insertInlineAtRange = (fn, editor) => (range, inline) => {
  inline = Inline.create(inline)
  let pathRef

  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)
    const { value: { document } } = editor
    let { start: { path, offset } } = range
    const closestVoid = document.closest(path, editor.isVoid)

    if (closestVoid) {
      return
    }

    path = editor.splitNodeByPath(path, offset)
    path = editor.insertNodeByPath(path, inline)
    pathRef = editor.createPathRef(path)
  })

  if (!pathRef) {
    return null
  }

  pathRef.unref()
  return pathRef.path
}

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Range} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.insertTextAtRange = (fn, editor) => (range, text, marks) => {
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
 * @param {Range} range
 * @param {Mark|String} mark (optional)
 */

Commands.removeMarkAtRange = (fn, editor) => (range, mark) => {
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
 * @param {Range} range
 * @param {Object|String} properties
 */

Commands.setBlocksAtRange = (fn, editor) => (range, properties) => {
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
 * @param {Range} range
 * @param {Object|String} properties
 */

Commands.setInlinesAtRange = (fn, editor) => (range, properties) => {
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
 * @param {Range} range
 * @param {Number} height (optional)
 */

Commands.splitBlockAtRange = (fn, editor) => (range, height = 1) => {
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
      editor.splitDescendantsByPath(targetPath, start.path, start.offset)
    }
  })
}

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Range} range
 * @param {Number} height (optional)
 */

Commands.splitInlineAtRange = (fn, editor) => (range, height = Infinity) => {
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

Commands.splitInlineEdgesAtRange = (fn, editor) => range => {
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
        .setPath(Path.increment(end.path))
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
          Path.isYounger(furthestPath, end.path) ||
          Path.isAbove(furthestPath, end.path) ||
          Path.isEqual(furthestPath, end.path)
        ) {
          end = end
            .setPath(Path.increment(end.path, 1, furthestPath.size - 1))
            .setKey(null)
            .normalize(editor.value.document)
        }

        start = start
          .setPath(
            Path.increment(furthestPath).concat(relativePath.map(() => 0))
          )
          .setOffset(0)
          .setKey(null)
          .normalize(editor.value.document)
      }
    } else if (start.offset !== 0 && start.offset !== startText.text.length) {
      editor.splitNodeByPath(start.path, start.offset)

      if (
        Path.isYounger(start.path, end.path) ||
        Path.isAbove(start.path, end.path) ||
        Path.isEqual(start.path, end.path)
      ) {
        end = end
          .setPath(Path.increment(end.path, 1, start.path.size - 1))
          .setKey(null)
          .normalize(editor.value.document)
      }

      start = start
        .setPath(Path.increment(start.path))
        .setOffset(0)
        .setKey(null)
        .normalize(editor.value.document)
    }

    range = range.setAnchor(start).setFocus(end)
  })

  return range
}

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Range} range
 * @param {Mixed} mark
 */

Commands.toggleMarkAtRange = (fn, editor) => (range, mark) => {
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
 * @param {Range} range
 * @param {String|Object} properties
 */

Commands.unwrapBlockAtRange = (fn, editor) => (range, properties) => {
  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    const iterable = document.blocks({
      range,
      match: (block, path) => {
        if (block.hasProperties(properties)) {
          return false
        } else {
          const parentPath = Path.lift(path)
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
 * @param {Range} range
 * @param {String|Object} properties
 */

Commands.unwrapInlineAtRange = (fn, editor) => (range, properties) => {
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
 * @param {Range} range
 * @param {Block|Object|String} block
 */

Commands.wrapBlockAtRange = (fn, editor) => (range, block) => {
  block = Block.create(block)
  block = block.set('nodes', block.nodes.clear())

  const { value: { document } } = editor
  const { start, end } = range
  const [, firstPath] = document.closestBlock(start.path)
  const [, lastPath] = document.closestBlock(end.path)
  const ancestorPath = firstPath.equals(lastPath)
    ? Path.lift(firstPath)
    : Path.relate(firstPath, lastPath)

  const startIndex = firstPath.get(ancestorPath.size)
  const endIndex = lastPath.get(ancestorPath.size)

  editor.withoutNormalizing(() => {
    const targetPath = ancestorPath.concat([startIndex])
    editor.insertNodeByPath(targetPath, block)

    for (let i = 0; i <= endIndex - startIndex; i++) {
      const path = ancestorPath.concat(startIndex + 1)
      const newPath = ancestorPath.concat([startIndex, i])
      editor.moveNodeByPath(path, newPath)
    }
  })
}

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Range} range
 * @param {Inline|Object|String} inline
 */

Commands.wrapInlineAtRange = (fn, editor) => (range, inline) => {
  inline = Inline.create(inline)
  inline = inline.set('nodes', inline.nodes.clear())

  editor.withoutNormalizing(() => {
    range = editor.splitInlineEdgesAtRange(range)
    range = editor.getNonHangingRange(range)
    const iterable = editor.value.document.blocks({ range, onlyLeaves: true })

    for (const [block, blockPath] of iterable) {
      const isStart = Path.isAbove(blockPath, range.start.path)
      const isEnd = Path.isAbove(blockPath, range.end.path)
      const startIndex = isStart ? range.start.path.get(blockPath.size) : 0
      const endIndex = isEnd
        ? range.end.path.get(blockPath.size)
        : block.nodes.size - 1

      const targetPath = blockPath.concat([startIndex])
      editor.insertNodeByPath(targetPath, inline)
      // HACK: need to regenerate the key to ensure that subsequent inserts
      // don't re-use the same key.
      inline = inline.regenerateKey()

      for (let i = 0; i <= endIndex - startIndex; i++) {
        const path = blockPath.concat(startIndex + 1)
        const newPath = blockPath.concat([startIndex, i])
        editor.moveNodeByPath(path, newPath)
      }
    }
  })
}

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Range} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 */

Commands.wrapTextAtRange = (fn, editor) => (range, prefix, suffix = prefix) => {
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
