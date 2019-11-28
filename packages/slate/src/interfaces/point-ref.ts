import { Operation, Point } from '..'

/**
 * `PointRef` objects keep a specific point in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date point value.
 */

export interface PointRef {
  current: Point | null
  affinity: 'forward' | 'backward' | null
  unref(): Point | null
}

export const PointRef = {
  /**
   * Transform the point ref's current value by an operation.
   */

  transform(ref: PointRef, op: Operation): void {
    const { current, affinity } = ref

    if (current == null) {
      return
    }

    const point = Point.transform(current, op, { affinity })
    ref.current = point

    if (point == null) {
      ref.unref()
    }
  },
}
