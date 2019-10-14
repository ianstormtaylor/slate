import { Editor, Node, Operation, Path, Point, PointRef } from '../..'
import { POINT_REFS } from '../../symbols'

class PointQueries {
  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the this.
   */

  createPointRef(
    this: Editor,
    point: Point,
    options: { stick?: 'backward' | 'forward' | null } = {}
  ): PointRef {
    const { stick = 'forward' } = options
    const ref: PointRef = new PointRef({
      point,
      stick,
      onUnref: () => delete this[POINT_REFS][ref.id],
    })

    this[POINT_REFS][ref.id] = ref
    return ref
  }

  /**
   * Check if a point is at the start of a path.
   */

  isAtStartOfPath(this: Editor, point: Point, path: Path): boolean {
    const { value } = this
    const [first] = Node.texts(value, { path })

    if (!first) {
      return false
    }

    const [, firstPath] = first
    return point.offset === 0 && Path.equals(point.path, firstPath)
  }

  /**
   * Check if a point is at the end of a path.
   */

  isAtEndOfPath(this: Editor, point: Point, path: Path): boolean {
    const { value } = this
    const [last] = Node.texts(value, { path, reverse: true })

    if (!last) {
      return false
    }

    const [lastNode, lastPath] = last
    return (
      point.offset === lastNode.text.length && Path.equals(point.path, lastPath)
    )
  }

  /**
   * Check if a point is at either edge of a path.
   */

  isAtEdgeOfPath(this: Editor, point: Point, path: Path): boolean {
    return this.isAtStartOfPath(point, path) || this.isAtEndOfPath(point, path)
  }

  /**
   * Calculate the next point forward in the document from a starting point.
   */

  getNextPoint(
    this: Editor,
    point: Point,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      allowZeroWidth?: boolean
    } = {}
  ): Point | undefined {
    const { distance = 1 } = options
    let d = 0
    let target: Point | undefined

    for (const p of this.positions({ ...options, point })) {
      if (d >= distance) {
        break
      }

      target = p
      d++
    }

    return target
  }

  /**
   * Get the next point in the document that is not inside a void node.
   */

  getNextNonVoidPoint(this: Editor, point: Point): Point | undefined {
    let next: Point | undefined = point

    while (next) {
      const closestVoid = this.getClosestVoid(next.path)

      if (closestVoid) {
        next = this.getNextPoint(next, { allowZeroWidth: true })
      } else {
        return next
      }
    }
  }

  /**
   * Calculate the previous point backward from a starting point.
   */

  getPreviousPoint(
    this: Editor,
    point: Point,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      allowZeroWidth?: boolean
    } = {}
  ): Point | undefined {
    const { distance = 1 } = options
    let d = 0
    let target: Point | undefined

    for (const p of this.positions({ ...options, point, reverse: true })) {
      if (d >= distance) {
        break
      }

      target = p
      d++
    }

    return target
  }

  /**
   * Get the previous point in the document that is not inside a void node.
   */

  getPreviousNonVoidPoint(this: Editor, point: Point): Point | undefined {
    let prev: Point | undefined = point

    while (prev) {
      const closestVoid = this.getClosestVoid(prev.path)

      if (closestVoid) {
        prev = this.getPreviousPoint(prev, { allowZeroWidth: true })
      } else {
        return prev
      }
    }
  }
}

export default PointQueries
