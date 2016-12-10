
import getLeafText from '../utils/get-leaf-text'
import warn from '../utils/warn'
import { Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
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
 *
 * @type {Selection}
 */

class Selection extends new Record(DEFAULTS) {

  /**
   * Create a new `Selection` with `properties`.
   *
   * @param {Object|Selection} properties
   * @return {Selection}
   */

  static create(properties = {}) {
    if (properties instanceof Selection) return properties
    return new Selection(properties)
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'selection'
  }

  /**
   * Get whether the selection is blurred.
   *
   * @return {Boolean}
   */

  get isBlurred() {
    return !this.isFocused
  }

  /**
   * Get whether the selection is collapsed.
   *
   * @return {Boolean}
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
   * @return {Boolean}
   */

  get isExpanded() {
    return !this.isCollapsed
  }

  /**
   * Get whether the selection is forward.
   *
   * @return {Boolean}
   */

  get isForward() {
    return this.isBackward == null ? null : !this.isBackward
  }

  /**
   * Check whether the selection's keys are set.
   *
   * @return {Boolean}
   */

  get isSet() {
    return this.anchorKey != null && this.focusKey != null
  }

  /**
   * Check whether the selection's keys are not set.
   *
   * @return {Boolean}
   */

  get isUnset() {
    return !this.isSet
  }

  /**
   * Get the start key.
   *
   * @return {String}
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
    if (node.kind == 'text') {
      return node.key === this.anchorKey
    } else {
      return node.hasDescendant(this.anchorKey)
    }
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
    if (node.kind == 'text') {
      return node.key === this.focusKey
    } else {
      return node.hasDescendant(this.focusKey)
    }
  }

  /**
   * Check whether the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
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
   * @return {Boolean}
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
   * @return {Selection}
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
      warn('The selection anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', anchorNode)
      let anchorText = anchorNode.getTextAtOffset(anchorOffset)
      let offset = anchorNode.getOffset(anchorText)
      anchorOffset = anchorOffset - offset
      anchorNode = anchorText
    }

    // If the focus node isn't a text node, match it to one.
    if (focusNode.kind != 'text') {
      warn('The selection focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', focusNode)
      let focusText = focusNode.getTextAtOffset(focusOffset)
      let offset = focusNode.getOffset(focusText)
      focusOffset = focusOffset - offset
      focusNode = focusText
    }

    // If `isBackward` is not set, derive it.
    if (isBackward == null) {
      if (anchorNode.key === focusNode.key) {
        isBackward = anchorOffset > focusOffset
      } else {
        isBackward = !node.areDescendantSorted(anchorNode.key, focusNode.key)
      }
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
   * @return {Selection}
   */

  focus() {
    return this.merge({
      isFocused: true
    })
  }

  /**
   * Blur the selection.
   *
   * @return {Selection}
   */

  blur() {
    return this.merge({
      isFocused: false
    })
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Selection}
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
   * @return {Selection}
   */

  collapseToFocus() {
    return this.merge({
      anchorKey: this.focusKey,
      anchorOffset: this.focusOffset,
      isBackward: false
    })
  }

  /**
   * Move to the start of a `node`.
   *
   * @param {Node} node
   * @return {Selection}
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
   * @return {Selection}
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
   * @return {Selection}
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
   * @return {Selection}
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
   * @return {Selection}
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
   * @return {Selection}
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
   * @return {Selection}
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
   * @return {Selection}
   */

  extendBackward(n = 1) {
    return this.merge({
      focusOffset: this.focusOffset - n,
      isBackward: null
    })
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveAnchorOffset(n = 1) {
    const { anchorKey, focusKey, focusOffset } = this
    const anchorOffset = this.anchorOffset + n
    return this.merge({
      anchorOffset,
      isBackward: anchorKey == focusKey ? anchorOffset > focusOffset : this.isBackward
    })
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveFocusOffset(n = 1) {
    const { focusKey, anchorKey, anchorOffset } = this
    const focusOffset = this.focusOffset + n
    return this.merge({
      focusOffset,
      isBackward: focusKey == anchorKey ? anchorOffset > focusOffset : this.isBackward
    })
  }

  /**
   * Move the start key, while preserving the direction
   *
   * @param {String} key
   * @return {Selection}
   */

  moveStartTo(key, offset = 0) {
    if (this.isBackward) {
      return this.merge({
        focusKey: key,
        focusOffset: offset,
        isBackward: null
      })
    } else {
      return this.merge({
        anchorKey: key,
        anchorOffset: offset,
        isBackward: null
      })
    }
  }

  /**
   * Move the end key, while preserving the direction
   *
   * @param {String} key
   * @return {Selection}
   */

  moveEndTo(key, offset = 0) {
    if (this.isBackward) {
      return this.merge({
        anchorKey: key,
        anchorOffset: offset,
        isBackward: null
      })
    } else {
      return this.merge({
        focusKey: key,
        focusOffset: offset,
        isBackward: null
      })
    }
  }

  /**
   * Extend the focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Selection}
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
   * @return {Selection}
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
   * @return {Selection}
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

  /**
   * Flip the selection.
   *
   * @return {Selection}
   */

  flip() {
    return this.merge({
      anchorKey: this.focusKey,
      anchorOffset: this.focusOffset,
      focusKey: this.anchorKey,
      focusOffset: this.anchorOffset,
      isBackward: this.isBackward == null ? null : !this.isBackward,
    })
  }

}

/**
 * Add start, end and edge convenience methods.
 */

[
  ['has', 'AtStartOf', true],
  ['has', 'AtEndOf', true],
  ['has', 'Between', true],
  ['has', 'In', true],
  ['collapseTo', ''],
  ['move', 'Offset'],
].forEach((opts) => {
  const [ p, s, hasEdge ] = opts
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

  if (hasEdge) {
    Selection.prototype[edge] = function (...args) {
      return this[anchor](...args) || this[focus](...args)
    }
  }
})

/**
 * Export.
 *
 * @type {Selection}
 */

export default Selection
