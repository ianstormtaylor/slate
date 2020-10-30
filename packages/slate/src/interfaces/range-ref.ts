import { Operation, SlateRange } from '..'

/**
 * `RangeRef` objects keep a specific range in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date range value.
 */

export interface RangeRef {
  current: SlateRange | null
  affinity: 'forward' | 'backward' | 'outward' | 'inward' | null
  unref(): SlateRange | null
}

export const RangeRef = {
  /**
   * Transform the range ref's current value by an operation.
   */

  transform(ref: RangeRef, op: Operation): void {
    const { current, affinity } = ref

    if (current == null) {
      return
    }

    const path = SlateRange.transform(current, op, { affinity })
    ref.current = path

    if (path == null) {
      ref.unref()
    }
  },
}
