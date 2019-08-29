import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
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

Commands.insertFragmentAtRange = (fn, editor) => (range, fragment) => {
  let startPointRef
  let endPointRef
  let afterPathRef

  editor.withoutNormalizing(() => {
    range = deleteExpandedAtRange(editor, range)

    if (!fragment.nodes.size) {
      return
    }

    const point = range.start
    const { value: { document } } = editor
    const [, splitPath] = document.closestBlock(point.path)

    editor.splitBlockAtPoint(point, 1)

    const startPath = Path.increment(splitPath)
    afterPathRef = editor.createPathRef(startPath)
    editor.insertFragmentByPath(startPath, fragment)

    const afterPath = afterPathRef.path
    const endPath = Path.decrement(afterPath)
    const startPoint = editor.getStartOfPath(startPath)
    const endPoint = editor.getEndOfPath(endPath)
    const afterPoint = editor.getStartOfPath(afterPath)
    startPointRef = editor.createPointRef(startPoint)
    endPointRef = editor.createPointRef(endPoint)
    editor.mergeBlockByPath(afterPoint.path)
    editor.mergeBlockByPath(startPoint.path)
  })

  startPointRef.unref()
  endPointRef.unref()
  afterPathRef.unref()

  range = range.setPoints([startPointRef.point, endPointRef.point])
  return range
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
