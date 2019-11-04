import { Operation, Range, Editor } from '..'
import { RANGE_REFS } from './utils'

/**
 * `RangeRef` objects keep a specific range in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date range value.
 */

class RangeRef {
  current: Range | null
  private affinity: 'forward' | 'backward' | 'outward' | 'inward' | null
  private editor: Editor

  constructor(props: {
    range: Range | null
    affinity: 'forward' | 'backward' | 'outward' | 'inward' | null
    editor: Editor
  }) {
    const { range, affinity, editor } = props
    this.current = range
    this.affinity = affinity
    this.editor = editor
    const rangeRefs = RANGE_REFS.get(editor)!
    rangeRefs.add(this)
  }

  /**
   * Transform the range ref's current value by an operation.
   */

  transform(op: Operation): void {
    const { current, affinity } = this

    if (current == null) {
      return
    }

    const range = Range.transform(current, op, { affinity })
    this.current = range

    if (range == null) {
      this.unref()
    }
  }

  /**
   * Unreference the ref, allowing the editor to stop updating its value.
   */

  unref(): Range | null {
    const { current, editor } = this
    const rangeRefs = RANGE_REFS.get(editor)!
    rangeRefs.delete(this)
    this.current = null
    return current
  }
}

export { RangeRef }
