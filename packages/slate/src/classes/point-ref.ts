import { Operation, Point } from '..'

/**
 * An auto-incrementing number to identify `PointRef` objects.
 */

let id = 0

/**
 * `PointRef` objects keep a specific point in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date point value.
 */

class PointRef {
  id: number
  current: Point | null
  private stick: 'forward' | 'backward' | null
  private onUnref: () => void

  constructor(props: {
    point: Point | null
    stick: 'forward' | 'backward' | null
    onUnref: () => void
  }) {
    const { point, stick, onUnref } = props
    this.id = id++
    this.current = point
    this.stick = stick
    this.onUnref = onUnref
  }

  /**
   * Transform the point ref's current value by an operation.
   */

  transform(op: Operation): void {
    const { current, stick } = this

    if (current == null) {
      return
    }

    const point = Point.transform(current, op, { stick })
    this.current = point

    if (point == null) {
      this.unref()
    }
  }

  /**
   * Unreference the ref, allowing the editor to stop updating its value.
   */

  unref(): Point | null {
    this.onUnref()
    return this.current
  }
}

export { PointRef }
