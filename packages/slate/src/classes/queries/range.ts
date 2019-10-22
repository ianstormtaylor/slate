import { produce } from 'immer'
import { Editor, Path, Operation, Range, RangeRef } from '../..'
import { RANGE_REFS } from '../../symbols'

let rangeRefIds = 0

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

  /**
   * Get a range, ensuring that it is not hanging into a block node.
   *
   * @param {Range} range
   * @return {Range}
   */

  getNonBlockHangingRange(this: Editor, range: Range): Range {
    if (this.isBlockHanging(range)) {
      range = produce(range, r => {
        const [, end] = Range.points(r)
        const prev = this.getPreviousText(end.path)

        if (prev) {
          const [prevText, prevPath] = prev
          end.path = prevPath
          end.offset = prevText.text.length
        }
      })
    }

    return range
  }

  /**
   * Get a range, ensuring that it is not hanging into an inline node.
   *
   * @param {Range} range
   * @return {Range}
   */

  getNonInlineHangingRange(this: Editor, range: Range): Range {
    if (this.isInlineHanging(range)) {
      range = produce(range, r => {
        const [, end] = Range.points(r)
        const prev = this.getPreviousText(end.path)

        if (prev) {
          const [prevText, prevPath] = prev
          end.path = prevPath
          end.offset = prevText.text.length
        }
      })
    }

    return range
  }

  /**
   * Get a range, ensuring that it is not hanging into the next leaf inline or
   * block node.
   *
   * @param {Range} range
   * @return {Range}
   */

  getNonHangingRange(this: Editor, range: Range): Range {
    range = this.getNonInlineHangingRange(range)
    range = this.getNonBlockHangingRange(range)
    return range
  }

  /**
   * Check whether a range is hanging in a block.
   */

  isBlockHanging(this: Editor, range: Range): boolean {
    if (!Range.isExpanded(range)) {
      return false
    }

    const [start, end] = Range.points(range)
    const startClosest = this.getClosestBlock(start.path)
    const endClosest = this.getClosestBlock(end.path)

    if (!startClosest || !endClosest) {
      return false
    }

    const [, startPath] = startClosest
    const [, endPath] = endClosest
    return this.isAtStart(start, startPath) && this.isAtStart(end, endPath)
  }

  /**
   * Check whether a range is hanging in an inline.
   */

  isInlineHanging(this: Editor, range: Range): boolean {
    if (!Range.isExpanded(range)) {
      return false
    }

    const [, end] = Range.points(range)
    const closestInline = this.getClosestInline(end.path)

    if (!closestInline) {
      return false
    }

    const [, endInlinePath] = closestInline
    return this.isAtStart(end, endInlinePath)
  }

  /**
   * Check whether a range is hanging into the next leaf inline or block node.
   */

  isHanging(this: Editor, range: Range): boolean {
    return this.isInlineHanging(range) || this.isBlockHanging(range)
  }
}

export default RangeQueries
