import { produce } from 'immer'
import { Editor, Element, Fragment, Node, Path, Point, Range } from '../..'

class PointCommands {
  /**
   * Delete a span of content starting from a point.
   */

  deleteAtPoint(
    this: Editor,
    point: Point,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
    } = {}
  ): void {
    const { reverse = false, ...rest } = options
    const target = reverse
      ? this.getPreviousPoint(point, rest)
      : this.getNextPoint(point, rest)

    if (target) {
      this.deleteAtRange({ anchor: point, focus: target })
    }
  }

  /**
   * Insert a block node at a point.
   */

  insertBlockAtPoint(this: Editor, point: Point, block: Element): void {
    this.withoutNormalizing(() => {
      const pointRef = this.createPointRef(point)
      this.splitBlockAtPoint(point, { always: false })

      if (pointRef.current != null) {
        this.insertNodeAtPath(pointRef.current.path, block)
        pointRef.unref()
      }
    })
  }

  /**
   * Insert a fragment of nodes at a point.
   */

  insertFragmentAtPoint(this: Editor, point: Point, fragment: Fragment): void {
    if (fragment.nodes.length === 0) {
      return
    }

    this.withoutNormalizing(() => {
      const pointRef = this.createPointRef(point)
      this.splitBlockAtPoint(point)

      if (pointRef.current != null) {
        const insertClosest = this.getClosestBlock(pointRef.current.path)

        if (insertClosest != null) {
          const [, insertPath] = insertClosest
          this.insertFragmentAtPath(insertPath, fragment)

          const afterClosest = this.getClosestBlock(pointRef.current.path)
          const beforeClosest = this.getClosestBlock(point.path)

          if (afterClosest != null && beforeClosest != null) {
            const [, afterPath] = afterClosest
            const [, beforePath] = beforeClosest
            const startPath = Path.next(beforePath)
            this.mergeBlockAtPath(afterPath)
            this.mergeBlockAtPath(startPath)
          }
        }
      }
    })
  }

  /**
   * Insert an inline node at a point.
   */

  insertInlineAtPoint(this: Editor, point: Point, inline: Element): void {
    this.withoutNormalizing(() => {
      const pointRef = this.createPointRef(point)
      this.splitInlineAtPoint(point, { always: false })

      if (pointRef.current != null) {
        this.insertNodeAtPath(pointRef.current.path, inline)
        pointRef.unref()
      }
    })
  }

  /**
   * Insert a string of text at a specific point in the document.
   */

  insertTextAtPoint(this: Editor, point: Point, text: string): Point {
    const { value } = this
    const { annotations } = value
    const { path, offset } = point

    this.withoutNormalizing(() => {
      for (const key in annotations) {
        const annotation = annotations[key]

        if (this.isAtomic(annotation)) {
          const [start] = Range.points(annotation)
          const [, end] = Range.points(annotation)

          if (
            start.offset < offset &&
            Path.equals(start.path, path) &&
            (!Path.equals(end.path, path) || offset < end.offset)
          ) {
            this.removeAnnotation(key)
          }
        }
      }

      this.apply({
        type: 'insert_text',
        path,
        offset,
        text,
      })
    })

    return produce(point, p => {
      p.offset += text.length
    })
  }

  /**
   * Remove a string of text by length from a specific point in the document.
   */

  removeTextAtPoint(this: Editor, point: Point, length: number): Point {
    const { value } = this
    const { annotations } = value
    const { path, offset } = point
    const node = Node.leaf(value, path)
    const text = node.text.slice(offset, offset + length)

    this.withoutNormalizing(() => {
      for (const key in annotations) {
        const annotation = annotations[key]

        if (this.isAtomic(annotation)) {
          const [start] = Range.points(annotation)
          const [, end] = Range.points(annotation)

          if (
            start.offset < offset &&
            Path.equals(start.path, path) &&
            (!Path.equals(end.path, path) || offset < end.offset)
          ) {
            this.removeAnnotation(key)
          }
        }
      }

      this.apply({
        type: 'insert_text',
        path,
        offset,
        text,
      })
    })

    return point
  }

  /**
   * Split the block node at a specific point, up to a certain block height.
   */

  splitBlockAtPoint(
    this: Editor,
    point: Point,
    options: {
      always?: boolean
      height?: number
    } = {}
  ): void {
    const { height = 0, ...rest } = options
    const { path } = point
    const closestBlock = this.getClosestBlock(path)
    let totalHeight: number

    if (closestBlock) {
      const [, blockPath] = closestBlock
      const relPath = Path.relative(path, blockPath)
      totalHeight = relPath.length + height
    } else {
      totalHeight = path.length
    }

    this.splitNodeAtPoint(point, { height: totalHeight, ...rest })
  }

  /**
   * Split the inline node at a specific point, up to a certain inline height.
   */

  splitInlineAtPoint(
    this: Editor,
    point: Point,
    options: {
      always?: boolean
      height?: number
    } = {}
  ): void {
    const { height = 0, ...rest } = options
    const { path } = point
    const furthestInline = this.getFurthestInline(path)
    let totalHeight: number

    if (furthestInline) {
      const [, furthestPath] = furthestInline
      const furthestRelPath = Path.relative(path, furthestPath)
      // Ensure that the height isn't higher than the furthest inline, since
      // this command should never split any block nodes.
      const h = Math.max(furthestRelPath.length, height)
      totalHeight = h + 1
    } else {
      // If there are no inline ancestors, just split the text node.
      totalHeight = 1
    }

    this.splitNodeAtPoint(point, { height: totalHeight, ...rest })
  }

  /**
   * Split nodes in the document at a specific point, up to a certain height.
   *
   * If the `always: false` option is passed, nodes will only be split if the
   * point is not already at one of their edges.
   */

  splitNodeAtPoint(
    this: Editor,
    point: Point,
    options: {
      always?: boolean
      height?: number
    } = {}
  ): void {
    const { path, offset } = point
    const { height = 0, always = true } = options

    if (height < path.length) {
      throw new Error(
        `Cannot split the leaf node at path ${path} to a height of ${height} because it does not have that many ancestors.`
      )
    }

    this.withoutNormalizing(() => {
      let position = offset
      let h = 0

      // Create a ref that tracks the split point as we move up the ancestors.
      // Stick backwards because we're splitting and we want to remain inside
      // the ancestor branch.
      const pointRef = this.createPointRef(point, { stick: 'backward' })

      // Iterate up the ancestors, splitting each until the right depth.
      while (h < height) {
        const depth = path.length - h
        const index = depth - 1
        const parentPath = path.slice(0, index)
        const target = position
        position = path[index]
        h++

        // With the `always: false` option, we will instead split the nodes only
        // when the point isn't already at it's edge.
        if (
          !always &&
          pointRef.current != null &&
          this.isAtEdgeOfPath(pointRef.current, parentPath)
        ) {
          continue
        }

        this.splitNodeAtPath(parentPath, position, { target })
      }
    })
  }

  /**
   * Split the text node at a point.
   */

  splitTextAtPoint(
    this: Editor,
    point: Point,
    options: { always?: boolean } = {}
  ): void {
    this.splitNodeAtPoint(point, { height: 0, ...options })
  }
}

export default PointCommands
