
import { Record } from 'immutable'

/**
 * Record.
 */

const DEFAULTS = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: null,
  isFocused: false
}

/**
 * Selection.
 */

class Selection extends Record(DEFAULTS) {

  /**
   * Create a new `Selection` with `properties`.
   *
   * @param {Object} properties
   * @return {Selection} selection
   */

  static create(properties = {}) {
    if (properties instanceof Selection) return properties
    return new Selection(properties)
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
   * @return {Boolean} isExpanded
   */

  get isExpanded() {
    return !this.isCollapsed
  }

  /**
   * Get whether the range's anchor of focus keys are not set yet.
   *
   * @return {Boolean} isUnset
   */

  get isUnset() {
    return this.anchorKey == null || this.focusKey == null
  }

  /**
   * Get whether the selection is forward.
   *
   * @return {Boolean} isForward
   */

  get isForward() {
    return this.isBackward == null ? null : !this.isBackward
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
    const first = node.kind == 'text' ? node : node.getTextNodes().first()
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
    const last = node.kind == 'text' ? node : node.getTextNodes().last()
    return endKey == last.key && endOffset == last.length
  }

  /**
   * Normalize the selection, relative to a `node`, ensuring that the anchor
   * and focus nodes of the selection always refer to leaf text nodes.
   *
   * @param {Node} node
   * @return {Selection} selection
   */

  normalize(node) {
    let selection = this
    let { anchorKey, anchorOffset, focusKey, focusOffset, isBackward } = selection

    // If the selection isn't formed yet, abort.
    if (this.isUnset) return this

    // Asset that the anchor and focus nodes exist in the node tree.
    node.assertHasDescendant(anchorKey)
    node.assertHasDescendant(focusKey)
    let anchorNode = node.getDescendant(anchorKey)
    let focusNode = node.getDescendant(focusKey)

    // If the anchor node isn't a text node, match it to one.
    if (anchorNode.kind != 'text') {
      let anchorText = anchorNode.getTextAtOffset(anchorOffset)
      let offset = anchorNode.getOffset(anchorText)
      anchorOffset = anchorOffset - offset
      anchorNode = anchorText
    }

    // If the focus node isn't a text node, match it to one.
    if (focusNode.kind != 'text') {
      let focusText = focusNode.getTextAtOffset(focusOffset)
      let offset = focusNode.getOffset(focusText)
      focusOffset = focusOffset - offset
      focusNode = focusText
    }

    // If `isBackward` is not set, derive it.
    if (isBackward == null) {
      let texts = node.getTextNodes()
      let anchorIndex = texts.indexOf(anchorNode)
      let focusIndex = texts.indexOf(focusNode)
      isBackward = anchorIndex == focusIndex
        ? anchorOffset > focusOffset
        : anchorIndex > focusIndex
    }

    // Merge in any updated properties.
    return selection.merge({
      anchorKey: anchorNode.key,
      anchorOffset,
      focusKey: focusNode.key,
      focusOffset,
      isBackward
    })
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Selection} selection
   */

  moveToAnchor() {
    return this.merge({
      focusKey: this.anchorKey,
      focusOffset: this.anchorOffset,
      isBackward: false
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
      anchorOffset: this.focusOffset,
      isBackward: false
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
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  moveForward(n = 1) {
    return this.merge({
      anchorOffset: this.anchorOffset + n,
      focusOffset: this.focusOffset + n
    })
  }

  /**
   * Move the selection backward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  moveBackward(n = 1) {
    return this.merge({
      anchorOffset: this.anchorOffset - n,
      focusOffset: this.focusOffset - n
    })
  }

  /**
   * Extend the focus point forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  extendForward(n = 1) {
    return this.merge({
      focusOffset: this.focusOffset + n,
      isBackward: null
    })
  }

  /**
   * Extend the focus point backward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  extendBackward(n = 1) {
    return this.merge({
      focusOffset: this.focusOffset - n,
      isBackward: null
    })
  }

  /**
   * Extend the focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Selection} selection
   */

  extendToStartOf(node) {
    return this.merge({
      focusKey: node.key,
      focusOffset: 0,
      isBackward: null
    })
  }

  /**
   * Extend the focus point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Selection} selection
   */

  extendToEndOf(node) {
    return this.merge({
      focusKey: node.key,
      focusOffset: node.length,
      isBackward: null
    })
  }

}

/**
 * Export.
 */

export default Selection
