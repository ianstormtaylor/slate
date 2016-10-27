
import memoize from '../utils/memoize'
import getLeafText from '../utils/get-leaf-text'
import warning from '../utils/warning'
import { Record } from 'immutable'

/**
 * Start-end-and-edge convenience methods to auto-generate.
 */

const EDGE_METHODS = [
  'has%AtStartOf',
  'has%AtEndOf',
  'has%Between',
  'has%In',
]

/**
 * Default properties.
 */

const DEFAULTS = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: null,
  isFocused: false,
  marks: null,
}

/**
 * Selection.
 */

class Selection extends new Record(DEFAULTS) {

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
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'selection'
  }

  /**
   * Get whether the selection is blurred.
   *
   * @return {Boolean} isBlurred
   */

  get isBlurred() {
    return !this.isFocused
  }

  /**
   * Get whether the selection is collapsed.
   *
   * @return {Boolean} isCollapsed
   */

  get isCollapsed() {
    return (
      this.anchorKey == this.focusKey &&
      this.anchorOffset == this.focusOffset
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
   * Get whether the selection is forward.
   *
   * @return {Boolean} isForward
   */

  get isForward() {
    return this.isBackward == null ? null : !this.isBackward
  }

  /**
   * Check whether the selection's keys are not set.
   *
   * @return {Boolean}
   */

  get isUnset() {
    return this.anchorKey == null || this.focusKey == null
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
   * Check whether anchor point of the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtStartOf(node) {
    if (this.anchorOffset != 0) return false
    const first = node.kind == 'text' ? node : node.getFirstText()
    return this.anchorKey == first.key
  }

  /**
   * Check whether anchor point of the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtEndOf(node) {
    const last = node.kind == 'text' ? node : node.getLastText()
    return this.anchorKey == last.key && this.anchorOffset == last.length
  }

  /**
   * Check whether the anchor edge of a selection is in a `node` and at an
   * offset between `start` and `end`.
   *
   * @param {Node} node
   * @param {Number} start
   * @param {Number} end
   * @return {Boolean}
   */

  hasAnchorBetween(node, start, end) {
    return (
      this.anchorOffset <= end &&
      start <= this.anchorOffset &&
      this.hasAnchorIn(node)
    )
  }

  /**
   * Check whether the anchor edge of a selection is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorIn(node) {
    const nodes = node.kind == 'text' ? [node] : node.getTexts()
    return nodes.some(n => n.key == this.anchorKey)
  }

  /**
   * Check whether focus point of the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtEndOf(node) {
    const last = node.kind == 'text' ? node : node.getLastText()
    return this.focusKey == last.key && this.focusOffset == last.length
  }

  /**
   * Check whether focus point of the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtStartOf(node) {
    if (this.focusOffset != 0) return false
    const first = node.kind == 'text' ? node : node.getFirstText()
    return this.focusKey == first.key
  }

  /**
   * Check whether the focus edge of a selection is in a `node` and at an
   * offset between `start` and `end`.
   *
   * @param {Node} node
   * @param {Number} start
   * @param {Number} end
   * @return {Boolean}
   */

  hasFocusBetween(node, start, end) {
    return (
      start <= this.focusOffset &&
      this.focusOffset <= end &&
      this.hasFocusIn(node)
    )
  }

  /**
   * Check whether the focus edge of a selection is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusIn(node) {
    const nodes = node.kind == 'text' ? [node] : node.getTexts()
    return nodes.some(n => n.key == this.focusKey)
  }

  /**
   * Check whether the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean} isAtStart
   */

  isAtStartOf(node) {
    const { isExpanded, startKey, startOffset } = this
    if (isExpanded) return false
    if (startOffset != 0) return false
    const first = node.kind == 'text' ? node : node.getFirstText()
    return startKey == first.key
  }

  /**
   * Check whether the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean} isAtEnd
   */

  isAtEndOf(node) {
    const { endKey, endOffset, isExpanded } = this
    if (isExpanded) return false
    const last = node.kind == 'text' ? node : node.getLastText()
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

    // If the selection isn't formed yet or is malformed, ensure that it is
    // properly zeroed out.
    if (
      anchorKey == null ||
      focusKey == null ||
      !node.hasDescendant(anchorKey) ||
      !node.hasDescendant(focusKey)
    ) {
      return selection.merge({
        anchorKey: null,
        anchorOffset: 0,
        focusKey: null,
        focusOffset: 0,
        isBackward: false
      })
    }

    // Get the anchor and focus nodes.
    let anchorNode = node.getDescendant(anchorKey)
    let focusNode = node.getDescendant(focusKey)

    // If the anchor node isn't a text node, match it to one.
    if (anchorNode.kind != 'text') {
      warning('Selection anchor is on a non text node, matching to leaf')
      let anchorText = anchorNode.getTextAtOffset(anchorOffset)
      let offset = anchorNode.getOffset(anchorText)
      anchorOffset = anchorOffset - offset
      anchorNode = anchorText
    }

    // If the focus node isn't a text node, match it to one.
    if (focusNode.kind != 'text') {
      warning('Selection focus is on a non text node, matching to leaf')
      let focusText = focusNode.getTextAtOffset(focusOffset)
      let offset = focusNode.getOffset(focusText)
      focusOffset = focusOffset - offset
      focusNode = focusText
    }

    // If `isBackward` is not set, derive it.
    if (isBackward == null) {
      let texts = node.getTexts()
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
   * Focus the selection.
   *
   * @return {Selection} selection
   */

  focus() {
    return this.merge({
      isFocused: true
    })
  }

  /**
   * Blur the selection.
   *
   * @return {Selection} selection
   */

  blur() {
    return this.merge({
      isFocused: false
    })
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Selection} selection
   */

  collapseToAnchor() {
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

  collapseToFocus() {
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

  collapseToStart() {
    return this.merge({
      anchorKey: this.startKey,
      anchorOffset: this.startOffset,
      focusKey: this.startKey,
      focusOffset: this.startOffset,
      isBackward: false
    })
  }

  /**
   * Move the end point to the start point.
   *
   * @return {Selection} selection
   */

  collapseToEnd() {
    return this.merge({
      anchorKey: this.endKey,
      anchorOffset: this.endOffset,
      focusKey: this.endKey,
      focusOffset: this.endOffset,
      isBackward: false
    })
  }

  /**
   * Move to the start of a `node`.
   *
   * @param {Node} node
   * @return {Selection} selection
   */

  collapseToStartOf(node) {
    node = getLeafText(node)

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

  collapseToEndOf(node) {
    node = getLeafText(node)

    return this.merge({
      anchorKey: node.key,
      anchorOffset: node.length,
      focusKey: node.key,
      focusOffset: node.length,
      isBackward: false
    })
  }

  /**
   * Move to the entire range of `start` and `end` nodes.
   *
   * @param {Node} start
   * @param {Node} end (optional)
   * @param {Document} document
   * @return {Selection} selection
   */

  moveToRangeOf(start, end = start) {
    start = getLeafText(start)
    end = getLeafText(end)

    return this.merge({
      anchorKey: start.key,
      anchorOffset: 0,
      focusKey: end.key,
      focusOffset: end.length,
      isBackward: null,
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
   * Move the selection to `anchor` and `focus` offsets.
   *
   * @param {Number} anchor
   * @param {Number} focus (optional)
   * @return {Selection} selection
   */

  moveToOffsets(anchor, focus = anchor) {
    const props = {}
    props.anchorOffset = anchor
    props.focusOffset = focus

    if (this.anchorKey == this.focusKey) {
      props.isBackward = anchor > focus
    }

    return this.merge(props)
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
   * Extend the start point forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  moveStartOffset(n = 1) {
    return this.isBackward
      ? this.merge({ focusOffset: this.focusOffset + n })
      : this.merge({ anchorOffset: this.anchorOffset + n })
  }

  /**
   * Extend the end point forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  moveEndOffset(n = 1) {
      return this.isBackward
        ? this.merge({ anchorOffset: this.anchorOffset + n })
        : this.merge({ focusOffset: this.focusOffset + n })
  }

  /**
   * Move the start key, while preserving the direction
   *
   * @param {String} key
   * @return {Selection} selection
   */

  moveStartTo(key, offset = 0) {
    return this.isBackward
      ? this.merge({ focusKey: key, focusOffset: offset })
      : this.merge({ anchorKey: key, anchorOffset: offset })
  }

  /**
   * Move the end key, while preserving the direction
   *
   * @param {String} key
   * @return {Selection} selection
   */

  moveEndTo(key, offset = 0) {
    return this.isBackward
      ? this.merge({ anchorKey: key, anchorOffset: offset })
      : this.merge({ focusKey: key, focusOffset: offset })
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

  /**
   * Unset the selection
   *
   * @return {Selection} selection
   */

  unset() {
    return this.merge({
      anchorKey: null,
      anchorOffset: 0,
      focusKey: null,
      focusOffset: 0,
      isFocused: false,
      isBackward: false
    })
  }

}

/**
 * Add start, end and edge convenience methods.
 */

EDGE_METHODS.forEach((pattern) => {
  const [ p, s ] = pattern.split('%')
  const anchor = `${p}Anchor${s}`
  const edge = `${p}Edge${s}`
  const end = `${p}End${s}`
  const focus = `${p}Focus${s}`
  const start = `${p}Start${s}`

  Selection.prototype[start] = function (...args) {
    return this.isBackward
      ? this[focus](...args)
      : this[anchor](...args)
  }

  Selection.prototype[end] = function (...args) {
    return this.isBackward
      ? this[anchor](...args)
      : this[focus](...args)
  }

  Selection.prototype[edge] = function (...args) {
    return this[anchor](...args) || this[focus](...args)
  }
})

/**
 * Memoize read methods.
 */

memoize(Selection.prototype, [
  'hasAnchorAtStartOf',
  'hasAnchorAtEndOf',
  'hasAnchorBetween',
  'hasAnchorIn',
  'hasFocusAtEndOf',
  'hasFocusAtStartOf',
  'hasFocusBetween',
  'hasFocusIn',
  'isAtStartOf',
  'isAtEndOf'
])

/**
 * Export.
 */

export default Selection
