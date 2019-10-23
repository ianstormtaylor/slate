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
