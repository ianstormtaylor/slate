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
   * Calculate the next point forward in the document from a starting point.
   */

  getNextPoint(
    this: Editor,
    point: Point,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of this.positions({ ...options, point })) {
      if (d >= distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  }

  /**
   * Calculate the previous point backward from a starting point.
   */

  getPreviousPoint(
    this: Editor,
    point: Point,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of this.positions({ ...options, point, reverse: true })) {
      if (d >= distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  }

  /**
   * Check if a point is at the start of a path.
   */

  isAtStart(this: Editor, point: Point, path: Path): boolean {
    const first = this.getFirstText(path)

    if (!first) {
      return false
    }

    const [, firstPath] = first
    return point.offset === 0 && Path.equals(point.path, firstPath)
  }

  /**
   * Check if a point is at the end of a path.
   */

  isAtEnd(this: Editor, point: Point, path: Path): boolean {
    const last = this.getLastText(path)

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

  isAtEdge(this: Editor, point: Point, path: Path): boolean {
    return this.isAtStart(point, path) || this.isAtEnd(point, path)
  }
}

export default PointQueries
