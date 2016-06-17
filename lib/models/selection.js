
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

  /**
   * Create a new `Selection` from `attrs`.
   *
   * @return {Selection} selection
   */

  static create(attrs) {
    return new Selection(attrs)
  }

  /**
   * Get whether the selection is collapsed.
   *
   * @return {Boolean} isCollapsed
   */

  get isCollapsed() {
    return (
      this.anchorKey === this.focusKey &&
      this.anchorOffset === this.focusOffset
    )
  }

  /**
   * Get whether the selection is expanded.
   *
   * Aliased as `isExtended` since browser implementations refer to it as both.
   *
   * @return {Boolean} isExpanded
   */

  get isExpanded() {
    return ! this.isCollapsed
  }

  get isExtended() {
    return this.isExpanded
  }

  /**
   * Get whether the selection is forward.
   *
   * @return {Boolean} isForward
   */

  get isForward() {
    return ! this.isBackward
  }

  /**
   * Get the start key.
   *
   * @return {String} startKey
   */

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
   * Check whether the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean} isAtStart
   */

  isAtStartOf(node) {
    const { startKey, startOffset } = this
    const first = node.type == 'text' ? node : node.nodes.first()
    return startKey == first.key && startOffset == 0
  }

  /**
   * Check whether the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean} isAtEnd
   */

  isAtEndOf(node) {
    const { endKey, endOffset } = this
    const last = node.type == 'text' ? node : node.nodes.last()
    return endKey == last.key && endOffset == last.length
  }

  /**
   * Move the selection to a set of `properties`.
   *
   * @param {Object} properties
   * @return {State} state
   */

  moveTo(properties) {
    return this.merge(properties)
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Selection} selection
   */

  moveToAnchor() {
    return this.merge({
      focusKey: this.anchorKey,
      focusOffset: this.anchorOffset
    })
  }

  /**
   * Move the anchor point to the focus point.
   *
   * @return {Selection} selection
   */

  moveToFocus() {
    return this.merge({
      anchorKey: this.focusKey,
      anchorOffset: this.focusOffset
    })
  }

  /**
   * Move the end point to the start point.
   *
   * @return {Selection} selection
   */

  moveToStart() {
    return this.isBackward
      ? this.merge({
          anchorKey: this.focusKey,
          anchorOffset: this.focusOffset,
          isBackward: false
        })
      : this.merge({
          focusKey: this.anchorKey,
          focusOffset: this.anchorOffset,
          isBackward: false
        })
  }

  /**
   * Move the start point to the end point.
   *
   * @return {Selection} selection
   */

  moveToEnd() {
    return this.isBackward
      ? this.merge({
          focusKey: this.anchorKey,
          focusOffset: this.anchorOffset,
          isBackward: false
        })
      : this.merge({
          anchorKey: this.focusKey,
          anchorOffset: this.focusOffset,
          isBackward: false
        })
  }

  /**
   * Move to the start of a `node`.
   *
   * @return {Selection} selection
   */

  moveToStartOf(node) {
    return this.merge({
      anchorKey: node.key,
      anchorOffset: 0,
      focusKey: node.key,
      focusOffset: 0,
      isBackward: false
    })
  }

  /**
   * Move to the end of a `node`.
   *
   * @return {Selection} selection
   */

  moveToEndOf(node) {
    return this.merge({
      anchorKey: node.key,
      anchorOffset: node.length,
      focusKey: node.key,
      focusOffset: node.length,
      isBackward: false
    })
  }

  /**
   * Move to the entire range of a `node`.
   *
   * @return {Selection} selection
   */

  moveToRangeOf(node) {
    return this.merge({
      anchorKey: node.key,
      anchorOffset: 0,
      focusKey: node.key,
      focusOffset: node.length,
      isBackward: false
    })
  }

  /**
   * Move the selection forward `n` characters.
   *
   * @param {Number} n
   * @return {Selection} selection
   */

  moveForward(n = 1) {
    if (!this.isCollapsed) {
      throw new Error('The selection must be collapsed to move forward.')
    }

    return this.merge({
      anchorOffset: this.anchorOffset + n,
      focusOffset: this.focusOffset + n
    })
  }

  /**
   * Move the selection backward `n` characters.
   *
   * @param {Number} n
   * @return {Selection} selection
   */

  moveBackward(n = 1) {
    if (!this.isCollapsed) {
      throw new Error('The selection must be collapsed to move backward.')
    }

    return this.merge({
      anchorOffset: this.anchorOffset - n,
      focusOffset: this.focusOffset - n
    })
  }

}

/**
 * Export.
 */

export default Selection
