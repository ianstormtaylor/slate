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
      unit?: 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
    } = {}
  ): void {
    const { reverse = false, unit = 'character', ...rest } = options
    const furthestVoid = this.getFurthestVoid(point.path)

    if (furthestVoid) {
      const [, voidPath] = furthestVoid
      this.removeNodeAtPath(voidPath)
      return
    }

    const target = reverse
      ? this.getPreviousPoint(point, { unit, ...rest })
      : this.getNextPoint(point, { unit, ...rest })

    if (target) {
      this.deleteAtRange({ anchor: point, focus: target })
    }
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
        type: 'remove_text',
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
      totalHeight = h
    } else {
      // If there are no inline ancestors, just split the text node.
      totalHeight = 0
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

    if (height < 0) {
      throw new Error(
        `Cannot split the node at path [${path}] to a negative height of \`${height}\`.`
      )
    }

    this.withoutNormalizing(() => {
      const furthestVoid = this.getFurthestVoid(point.path)
      let position = offset
      let target: number | undefined
      let h = 0

      // If the point it inside a void node, we still want to split up to a
      // `height`, but we need to start after the void node in the tree.
      if (furthestVoid) {
        const [, voidPath] = furthestVoid
        const relPath = Path.relative(point.path, voidPath)
        h = relPath.length + 1
        position = voidPath[voidPath.length - 1]
      }

      // Create a ref that tracks the split point as we move up the ancestors.
      // Stick backwards because we're splitting and we want to remain inside
      // the ancestor branch.
      const pointRef = this.createPointRef(point, { stick: 'backward' })

      // Iterate up the ancestors, splitting each until the right depth.
      while (h <= height) {
        const depth = path.length - h
        const p = path.slice(0, depth)
        h++

        if (p.length === 0) {
          break
        }

        // With the `always: false` option, we will instead split the nodes only
        // when the point isn't already at it's edge.
        if (
          !always &&
          pointRef.current != null &&
          this.isAtEdge(pointRef.current, p)
        ) {
          continue
        }

        this.splitNodeAtPath(p, position, { target })
        target = position
        position = path[depth - 1] + 1
      }

      pointRef.unref()
    })
  }
}

export default PointCommands
