import { Editor, Path, Point, PathRef, PointRef, Range, RangeRef } from '../..'

class GeneralQueries {
  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the this.
   */

  createPathRef(
    this: Editor,
    path: Path,
    options: {
      affinity?: 'backward' | 'forward' | null
    } = {}
  ): PathRef {
    const { affinity = 'forward' } = options
    const ref: PathRef = new PathRef({ path, affinity, editor: this })
    return ref
  }

  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the this.
   */

  createPointRef(
    this: Editor,
    point: Point,
    options: {
      affinity?: 'backward' | 'forward' | null
    } = {}
  ): PointRef {
    const { affinity = 'forward' } = options
    const ref: PointRef = new PointRef({ point, affinity, editor: this })
    return ref
  }

  /**
   * Create a mutable ref for a `Range` object, which will stay in sync as new
   * operations are applied to the this.
   */

  createRangeRef(
    this: Editor,
    range: Range,
    options: {
      affinity?: 'backward' | 'forward' | 'outward' | 'inward' | null
    } = {}
  ): RangeRef {
    const { affinity = 'forward' } = options
    const ref: RangeRef = new RangeRef({ range, affinity, editor: this })
    return ref
  }
}

export default GeneralQueries
