import {
  Value,
  Editor,
  Fragment,
  Mark,
  Node,
  Element,
  Path,
  Range,
} from '../..'

class RangeCommands {
  /**
   * Delete the content in a range.
   */

  deleteAtRange(
    this: Editor,
    range: Range,
    options: {
      amount?: number
      unit?: 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
      hanging?: boolean
    } = {}
  ): void {
    if (Range.isCollapsed(range)) {
      this.deleteAtPoint(range.anchor, options)
      return
    }

    this.withoutNormalizing(() => {
      const [start, end] = Range.points(range)
      const beforeRef = this.createPointRef(start, { stick: 'backward' })
      const startRef = this.createPointRef(start)
      const endRef = this.createPointRef(end, { stick: 'backward' })
      const afterRef = this.createPointRef(end)
      let commonPath = Path.common(start.path, end.path)
      let startHeight = start.path.length - commonPath.length - 1
      let endHeight = end.path.length - commonPath.length - 1

      if (Path.equals(start.path, end.path)) {
        commonPath = Path.parent(commonPath)
        startHeight = 0
        endHeight = 0
      }

      this.splitNodeAtPoint(end, { height: Math.max(0, endHeight) })
      this.splitNodeAtPoint(start, { height: Math.max(0, startHeight) })

      const startIndex = startRef.unref()!.path[commonPath.length]
      const endIndex = endRef.unref()!.path[commonPath.length]

      for (let i = endIndex; i >= startIndex; i--) {
        this.removeNodeAtPath(commonPath.concat(i))
      }

      const beforePoint = beforeRef.unref()
      const afterPoint = afterRef.unref()

      if (beforePoint == null || afterPoint == null) {
        return
      }

      const ancestor = Node.get(this.value, commonPath)

      if (
        (Value.isValue(ancestor) || Element.isElement(ancestor)) &&
        this.hasBlocks(ancestor)
      ) {
        this.mergeBlockAtPath(afterPoint.path)
      }
    })
  }

  /**
   * Insert a fragment of nodes at a range.
   */

  insertFragmentAtRange(this: Editor, range: Range, fragment: Fragment): void {
    this.withoutNormalizing(() => {
      const [start] = Range.points(range)
      const pointRef = this.createPointRef(start)

      if (Range.isExpanded(range)) {
        this.deleteAtRange(range)
      }

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

      if (Range.isExpanded(range)) {
        this.deleteAtRange(range)
      }

      this.insertInlineAtPoint(pointRef.current!, inline)
      pointRef.unref()
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

      for (const [, path] of this.leafBlocks({ at: range })) {
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

      for (const [, path] of this.leafInlines({ at: range })) {
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

      for (const [, path] of this.rootBlocks({ at: range })) {
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

      for (const [, path] of this.rootInlines({ at: range })) {
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

      if (Range.isExpanded(range)) {
        this.deleteAtRange(range)
      }

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

      if (Range.isExpanded(range)) {
        this.deleteAtRange(range)
      }

      const point = pointRef.unref()
      this.splitInlineAtPoint(point!, options)
    })
  }

  /**
   * Unwrap the block nodes in a range that match a set of properties.
   */

  unwrapBlockAtRange(this: Editor, range: Range, props: {}) {
    this.withoutNormalizing(() => {
      // Iterate in reverse to ensure unwrapping doesn't affect path lookups.
      for (const [element, path] of this.blocks({ at: range, reverse: true })) {
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
      for (const [element, path] of this.inlines({
        at: range,
        reverse: true,
      })) {
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

      for (const [block, blockPath] of this.leafBlocks({ at: range })) {
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
