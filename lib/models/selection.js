
import { Record } from 'immutable'

/**
 * Record.
 */

const SelectionRecord = new Record({
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: false,
  isFocused: false
})

/**
 * Selection.
 */

class Selection extends SelectionRecord {

  static create(attrs) {
    return new Selection(attrs)
  }

  get isCollapsed() {
    return (
      this.anchorKey === this.focusKey &&
      this.anchorOffset === this.focusOffset
    )
  }

  get isForward() {
    return ! this.isBackward
  }

  get startKey() {
    return this.isBackward
      ? this.focusKey
      : this.anchorKey
  }

  get startOffset() {
    return this.isBackward
      ? this.focusOffset
      : this.anchorOffset
  }

  get endKey() {
    return this.isBackward
      ? this.anchorKey
      : this.focusKey
  }

  get endOffset() {
    return this.isBackward
      ? this.anchorOffset
      : this.focusOffset
  }

  /**
   * Check whether the selection is at the start of a `state`.
   *
   * @param {State} state
   * @return {Boolean} isAtStart
   */

  isAtStartOf(state) {
    const { nodes } = state
    const { startKey } = this
    const first = nodes.first()
    return startKey == first.key
  }

  /**
   * Check whether the selection is at the end of a `state`.
   *
   * @param {State} state
   * @return {Boolean} isAtEnd
   */

  isAtEndOf(state) {
    const { nodes } = state
    const { endKey } = this
    const last = nodes.last()
    return endKey == last.key
  }

}

/**
 * Export.
 */

export default Selection
