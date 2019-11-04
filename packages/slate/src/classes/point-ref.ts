import { Operation, Point, Editor } from '..'
import { POINT_REFS } from './utils'

/**
 * `PointRef` objects keep a specific point in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date point value.
 */

class PointRef {
  current: Point | null
  private affinity: 'forward' | 'backward' | null
  private editor: Editor

  constructor(props: {
    point: Point | null
    affinity: 'forward' | 'backward' | null
    editor: Editor
  }) {
    const { point, affinity, editor } = props
    this.current = point
    this.affinity = affinity
    this.editor = editor
    const pointRefs = POINT_REFS.get(editor)!
    pointRefs.add(this)
  }

  /**
   * Transform the point ref's current value by an operation.
   */

  transform(op: Operation): void {
    const { current, affinity } = this

    if (current == null) {
      return
    }

    const point = Point.transform(current, op, { affinity })
    this.current = point

    if (point == null) {
      this.unref()
    }
  }

  /**
   * Unreference the ref, allowing the editor to stop updating its value.
   */

  unref(): Point | null {
    const { current, editor } = this
    const pointRefs = POINT_REFS.get(editor)!
    pointRefs.delete(this)
    this.current = null
    return current
  }
}

export { PointRef }
