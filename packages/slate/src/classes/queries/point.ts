import { Editor, Path, Point, PointRef } from '../..'
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

    for (const p of this.positions({ ...options, at: point })) {
      if (d > distance) {
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

    for (const p of this.positions({ ...options, at: point, reverse: true })) {
      if (d > distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  }
}

export default PointQueries
