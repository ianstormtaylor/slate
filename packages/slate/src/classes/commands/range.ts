import { Editor, Fragment, Mark, Element, Path, Range } from '../..'

class RangeCommands {
  /**
   * Add a mark to all of the spans of text in a range, splitting the individual
   * text nodes if the range intersects them.
   */

  addMarkAtRange(this: Editor, range: Range, mark: Mark): void {
    this.withoutNormalizing(() => {
      const rangeRef = this.createRangeRef(range, { stick: 'inward' })
      const [start, end] = Range.points(range)
      this.splitNodeAtPoint(end, { always: false })
      this.splitNodeAtPoint(start, { always: false })
      range = rangeRef.unref()!

      for (const [node, path] of this.texts({ range })) {
        if (!Mark.exists(mark, node.marks)) {
          this.apply({ type: 'add_mark', path, mark })
        }
      }
    })
  }

  /**
   * Delete the content in a range.
   */

  deleteAtRange(
    this: Editor,
    range: Range,
    options: {
      amount?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
      hanging?: boolean
    } = {}
  ): void {
    const { hanging = false } = options

    // If the range is collapsed, the delete functions like a backspace button
    // or delete button would, by deleting in a direction.
    if (Range.isCollapsed(range)) {
      this.deleteAtPoint(range.anchor, options)
      return
    }

    this.withoutNormalizing(() => {
      if (hanging === false) {
        // To obey common rich text editor behavior, if the range is "hanging"
        // into the end block, we move it backwards so that it's not.
        range = this.getNonHangingRange(range)
      }

      const [start, end] = Range.points(range)
      const startRef = this.createPointRef(start)
      const endRef = this.createPointRef(end, { stick: 'backward' })
      const afterRef = this.createPointRef(end)

      this.splitBlockAtRange(range, { height: Infinity })

      const startIndex = startRef.current!.path[0]
      const endIndex = endRef.current!.path[0]

      for (let i = endIndex; i <= startIndex; i--) {
        this.removeNodeAtPath([i])
      }

      const afterClosest = this.getClosestBlock(afterRef.current!.path)

      if (afterClosest) {
        const [, afterBlockPath] = afterClosest
        this.mergeBlockAtPath(afterBlockPath)
      }
    })
  }

  /**
   * Insert a block node at a range.
   */

  insertBlockAtRange(this: Editor, range: Range, block: Element): void {
    this.withoutNormalizing(() => {
      const [start] = Range.points(range)
      const pointRef = this.createPointRef(start)
      this.deleteAtRange(range)
      this.insertBlockAtPoint(pointRef.current!, block)
      pointRef.unref()
    })
  }

  /**
   * Insert a fragment of nodes at a range.
   */

  insertFragmentAtRange(this: Editor, range: Range, fragment: Fragment): void {
    this.withoutNormalizing(() => {
      const [start] = Range.points(range)
      const pointRef = this.createPointRef(start)
      this.deleteAtRange(range)
      this.insertFragmentAtPoint(pointRef.current!, fragment)
      pointRef.unref()
    })
  }

  /**
   * Insert an inline node at a range.
   */

  insertInlineAtRange(this: Editor, range: Range, inline: Element): void {
    this.withoutNormalizing(() => {
      const [start] = Range.points(range)
      const pointRef = this.createPointRef(start)
      this.deleteAtRange(range)
      this.insertInlineAtPoint(pointRef.current!, inline)
      pointRef.unref()
    })
  }

  /**
   * Insert a string of text at a range.
   */

  insertTextAtRange(this: Editor, range: Range, text: string): void {
    this.withoutNormalizing(() => {
      const [start] = Range.points(range)
      const pointRef = this.createPointRef(start)
      this.deleteAtRange(range)
      this.insertTextAtPoint(pointRef.current!, text)
      pointRef.unref()
    })
  }

  /**
   * Remove a mark from all of the spans of text in a range.
   */

  removeMarkAtRange(this: Editor, range: Range, mark: Mark): void {
    this.withoutNormalizing(() => {
      for (const [node, path] of this.texts({ range })) {
        if (Mark.exists(mark, node.marks)) {
          this.apply({ type: 'remove_mark', path, mark })
        }
      }
    })
  }

  /**
   * Set new properties on all of the leaf blocks in a range.
   */

  setLeafBlocksAtRange(
    this: Editor,
    range: Range,
    props: {},
    options: {
      hanging?: boolean
    } = {}
  ): void {
    const { hanging = false } = options

    this.withoutNormalizing(() => {
      if (hanging === false) {
        // To obey common rich text editor behavior, if the range is "hanging"
        // into the end block, we move it backwards so that it's not.
        range = this.getNonHangingRange(range)
      }

      for (const [, path] of this.leafBlocks({ range })) {
        this.setNodeAtPath(path, props)
      }
    })
  }

  /**
   * Set new properties on all of the leaf inlines in a range.
   */

  setLeafInlinesAtRange(
    this: Editor,
    range: Range,
    props: {},
    options: {
      hanging?: boolean
    } = {}
  ): void {
    const { hanging = false } = options

    this.withoutNormalizing(() => {
      if (hanging === false) {
        // To obey common rich text editor behavior, if the range is "hanging"
        // into the end block, we move it backwards so that it's not.
        range = this.getNonHangingRange(range)
      }

      for (const [, path] of this.leafInlines({ range })) {
        this.setNodeAtPath(path, props)
      }
    })
  }

  /**
   * Set new properties on all of the root blocks in a range.
   */

  setRootBlocksAtRange(
    this: Editor,
    range: Range,
    props: {},
    options: {
      hanging?: boolean
    } = {}
  ): void {
    const { hanging = false } = options

    this.withoutNormalizing(() => {
      if (hanging === false) {
        // To obey common rich text editor behavior, if the range is "hanging"
        // into the end block, we move it backwards so that it's not.
        range = this.getNonHangingRange(range)
      }

      for (const [, path] of this.rootBlocks({ range })) {
        this.setNodeAtPath(path, props)
      }
    })
  }

  /**
   * Set new properties on all of the root inlines in a range.
   */

  setRootInlinesAtRange(
    this: Editor,
    range: Range,
    props: {},
    options: {
      hanging?: boolean
    } = {}
  ): void {
    const { hanging = false } = options

    this.withoutNormalizing(() => {
      if (hanging === false) {
        // To obey common rich text editor behavior, if the range is "hanging"
        // into the end block, we move it backwards so that it's not.
        range = this.getNonHangingRange(range)
      }

      for (const [, path] of this.rootInlines({ range })) {
        this.setNodeAtPath(path, props)
      }
    })
  }

  /**
   * Split the block at a range, up to a height.
   */

  splitBlockAtRange(
    this: Editor,
    range: Range,
    options: {
      always?: boolean
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const [, end] = Range.points(range)
      const pointRef = this.createPointRef(end)
      this.deleteAtRange(range)
      const point = pointRef.unref()
      this.splitBlockAtPoint(point!, options)
    })
  }

  /**
   * Split the inline at a range, up to a height.
   */

  splitInlineAtRange(
    this: Editor,
    range: Range,
    options: {
      always?: boolean
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const [, end] = Range.points(range)
      const pointRef = this.createPointRef(end)
      this.deleteAtRange(range)
      const point = pointRef.unref()
      this.splitInlineAtPoint(point!, options)
    })
  }

  /**
   * Toggle a mark on or off for all of the spans of text in a range.
   */

  toggleMarkAtRange(this: Editor, range: Range, mark: Mark): void {
    this.withoutNormalizing(() => {
      for (const [text, path] of this.texts({ range })) {
        this.apply({
          type: Mark.exists(mark, text.marks) ? 'remove_mark' : 'add_mark',
          path,
          mark,
        })
      }
    })
  }

  /**
   * Unwrap the block nodes in a range that match a set of properties.
   */

  unwrapBlockAtRange(this: Editor, range: Range, props: {}) {
    this.withoutNormalizing(() => {
      // Iterate in reverse to ensure unwrapping doesn't affect path lookups.
      for (const [element, path] of this.blocks({ range, reverse: true })) {
        if (Element.matches(element, props)) {
          this.pluckNodeAtPath(path)
        }
      }
    })
  }

  /**
   * Unwrap the inline nodes in a range that match a set of properties.
   */

  unwrapInlineAtRange(this: Editor, range: Range, props: {}) {
    this.withoutNormalizing(() => {
      // Iterate in reverse to ensure unwrapping doesn't affect path lookups.
      for (const [element, path] of this.inlines({ range, reverse: true })) {
        if (Element.matches(element, props)) {
          this.pluckNodeAtPath(path)
        }
      }
    })
  }

  /**
   * Wrap the blocks in a range in a new block parent.
   */

  wrapBlockAtRange(this: Editor, range: Range, block: Element) {
    this.withoutNormalizing(() => {
      const [start] = Range.points(range)
      const [, end] = Range.points(range)

      const startClosest = this.getClosestBlock(start.path)
      const endClosest = this.getClosestBlock(end.path)

      if (startClosest && endClosest) {
        const [, startPath] = startClosest
        const [, endPath] = endClosest
        const ancestorPath = Path.common(startPath, endPath)
        const startIndex = startPath[ancestorPath.length]
        const endIndex = endPath[ancestorPath.length]
        const targetPath = ancestorPath.concat([startIndex])
        this.insertNodeAtPath(targetPath, block)

        for (let i = 0; i <= endIndex - startIndex; i++) {
          const path = ancestorPath.concat(startIndex + 1)
          const newPath = ancestorPath.concat([startIndex, i])
          this.moveNodeAtPath(path, newPath)
        }
      }
    })
  }

  /**
   * Wrap the text and inline nodes in a range in a new inline parent.
   */

  wrapInlineAtRange(this: Editor, range: Range, inline: Element) {
    this.withoutNormalizing(() => {
      const rangeRef = this.createRangeRef(range, { stick: 'inward' })
      const [splitStart, splitEnd] = Range.points(range)
      this.splitInlineAtPoint(splitStart, { always: false })
      this.splitInlineAtPoint(splitEnd, { always: false })

      range = rangeRef.current!
      const [start, end] = Range.points(range)

      for (const [block, blockPath] of this.leafBlocks({ range })) {
        const isStart = Path.isAncestor(blockPath, start.path)
        const isEnd = Path.isAncestor(blockPath, end.path)
        const startIndex = isStart ? start.path[blockPath.length] : 0
        const endIndex = isEnd
          ? end.path[blockPath.length]
          : block.nodes.length - 1

        const targetPath = blockPath.concat([startIndex])
        this.insertNodeAtPath(targetPath, inline)

        for (let i = 0; i <= endIndex - startIndex; i++) {
          const path = blockPath.concat(startIndex + 1)
          const newPath = blockPath.concat([startIndex, i])
          this.moveNodeAtPath(path, newPath)
        }
      }
    })
  }
}

export default RangeCommands
