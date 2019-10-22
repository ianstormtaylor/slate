import { Operation, Range } from '..'

/**
 * An auto-incrementing number to identify `RangeRef` objects.
 */

let id = 0

/**
 * `RangeRef` objects keep a specific range in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date range value.
 */

class RangeRef {
  id: number
  current: Range | null
  private stick: 'forward' | 'backward' | 'outward' | 'inward' | null
  private onUnref: () => void

  constructor(props: {
    range: Range | null
    stick: 'forward' | 'backward' | 'outward' | 'inward' | null
    onUnref: () => void
  }) {
    const { range, stick, onUnref } = props
    this.id = id++
    this.current = range
    this.stick = stick
    this.onUnref = onUnref
  }

  /**
   * Transform the range ref's current value by an operation.
   */

  transform(op: Operation): void {
    const { current, stick } = this

    if (current == null) {
      return
    }

    const range = Range.transform(current, op, { stick })
    this.current = range

    if (range == null) {
      this.unref()
    }
  }

  /**
   * Unreference the ref, allowing the editor to stop updating its value.
   */

  unref(): Range | null {
    this.onUnref()
    const { current } = this
    this.current = null
    return current
  }
}

export { RangeRef }
