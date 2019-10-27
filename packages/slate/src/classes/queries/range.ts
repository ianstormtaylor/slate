import { Editor, Range, RangeRef } from '../..'
import { RANGE_REFS } from '../../symbols'

class RangeQueries {
  /**
   * Create a mutable ref for a `Range` object, which will stay in sync as new
   * operations are applied to the this.
   */

  createRangeRef(
    this: Editor,
    range: Range,
    options: {
      stick?: 'backward' | 'forward' | 'outward' | 'inward' | null
    } = {}
  ): RangeRef {
    const { stick = 'forward' } = options
    const ref: RangeRef = new RangeRef({
      range,
      stick,
      onUnref: () => delete this[RANGE_REFS][ref.id],
    })

    this[RANGE_REFS][ref.id] = ref
    return ref
  }
}

export default RangeQueries
