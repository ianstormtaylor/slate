import { Operation, Range } from '..'

/**
 * `RangeRef` objects keep a specific range in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date range value.
 */

export interface RangeRef {
  current: Range | null
  affinity: 'forward' | 'backward' | 'outward' | 'inward' | null
  onChange(): void
  unref(): Range | null
}

export interface RangeRefInterface {
  /**
   * Transform the range ref's current value by an operation.
   */
  transform: (ref: RangeRef, op: Operation) => boolean
}

// eslint-disable-next-line no-redeclare
export const RangeRef: RangeRefInterface = {
  transform(ref: RangeRef, op: Operation): boolean {
    const { current: prevRange, affinity } = ref

    if (prevRange == null) {
      return false
    }

    const range = Range.transform(prevRange, op, { affinity })
    ref.current = range

    if (range == null) {
      ref.unref()
    }

    if (range && prevRange) {
      return !Range.equals(range, prevRange)
    }

    return range !== prevRange
  },
}
