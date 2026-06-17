import { Operation, Point } from '..'
import { TextDirection } from '../types/types'

/**
 * `PointRef` objects keep a specific point in a document synced over time as new
 * operations are applied to the editor. It is created using the
 * {@link Editor.PointRef} method. You can access their property `current` at any time
 * for the up-to-date `Point` value. When you no longer need to track this
 * location, call `unref()` to free the resources.
 */
export interface PointRef {
  /**
   * The up-to-date `Point` value, or null if the point has been deleted or
   * {@link unref} has been called.
   */
  current: Point | null
  /**
   * The direction the `PointRef` will go when a user inserts content at the
   * current position of the `Point`.
   */
  affinity: TextDirection | null
  /**
   * Free the resources used by the PointRef. This should be called when you no
   * longer need to track the point. Returns the final point value before being
   * unrefed, or `null` if the point was already invalid.
   */
  unref(): Point | null
}

export interface PointRefInterface {
  /**
   * Transform the point ref's current value by an operation.
   */
  transform: (ref: PointRef, op: Operation) => void
}

// eslint-disable-next-line no-redeclare
export const PointRef: PointRefInterface = {
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
