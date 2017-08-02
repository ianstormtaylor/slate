
import warn from '../utils/warn'
import MODEL_TYPES from '../constants/model-types'
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
    if (Selection.isSelection(properties)) return properties
    return new Selection(properties)
  }

  /**
   * Determines if the passed in paramter is a Slate Selection or not
   *
   * @param {*} maybeSelection
   * @return {Boolean}
   */

  static isSelection(maybeSelection) {
    return !!(maybeSelection && maybeSelection[MODEL_TYPES.SELECTION])
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
   * Check whether the selection is blurred.
   *
   * @return {Boolean}
   */

  get isBlurred() {
    return !this.isFocused
  }

  /**
   * Check whether the selection is collapsed.
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
   * Check whether the selection is expanded.
   *
   * @return {Boolean}
   */

  get isExpanded() {
    return !this.isCollapsed
  }

  /**
   * Check whether the selection is forward.
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
    return this.isBackward ? this.focusKey : this.anchorKey
  }

  /**
   * Get the start offset.
   *
   * @return {String}
   */

  get startOffset() {
    return this.isBackward ? this.focusOffset : this.anchorOffset
  }

  /**
   * Get the end key.
   *
   * @return {String}
   */

  get endKey() {
    return this.isBackward ? this.anchorKey : this.focusKey
  }

  /**
   * Get the end offset.
   *
   * @return {String}
   */

  get endOffset() {
    return this.isBackward ? this.anchorOffset : this.focusOffset
  }

  /**
   * Check whether anchor point of the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtStartOf(node) {
    // PERF: Do a check for a `0` offset first since it's quickest.
    if (this.anchorOffset != 0) return false
    const first = getFirst(node)
    return this.anchorKey == first.key
  }

  /**
   * Check whether anchor point of the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtEndOf(node) {
    const last = getLast(node)
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
    return node.kind == 'text'
      ? node.key == this.anchorKey
      : node.hasDescendant(this.anchorKey)
  }

  /**
   * Check whether focus point of the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtEndOf(node) {
    const last = getLast(node)
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
    const first = getFirst(node)
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
    return node.kind == 'text'
      ? node.key == this.focusKey
      : node.hasDescendant(this.focusKey)
  }

  /**
   * Check whether the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtStartOf(node) {
    return this.isCollapsed && this.hasAnchorAtStartOf(node)
  }

  /**
   * Check whether the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtEndOf(node) {
    return this.isCollapsed && this.hasAnchorAtEndOf(node)
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
   * Unset the selection.
   *
   * @return {Selection}
   */

  deselect() {
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

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveAnchor(n = 1) {
    const { anchorKey, focusKey, focusOffset, isBackward } = this
    const anchorOffset = this.anchorOffset + n
    return this.merge({
      anchorOffset,
      isBackward: anchorKey == focusKey
        ? anchorOffset > focusOffset
        : isBackward
    })
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveFocus(n = 1) {
    const { anchorKey, anchorOffset, focusKey, isBackward } = this
    const focusOffset = this.focusOffset + n
    return this.merge({
      focusOffset,
      isBackward: focusKey == anchorKey
        ? anchorOffset > focusOffset
        : isBackward
    })
  }

  /**
   * Move the selection's anchor point to a `key` and `offset`.
   *
   * @param {String} key
   * @param {Number} offset
   * @return {Selection}
   */

  moveAnchorTo(key, offset) {
    const { anchorKey, focusKey, focusOffset, isBackward } = this
    return this.merge({
      anchorKey: key,
      anchorOffset: offset,
      isBackward: key == focusKey
        ? offset > focusOffset
        : key == anchorKey ? isBackward : null
    })
  }

  /**
   * Move the selection's focus point to a `key` and `offset`.
   *
   * @param {String} key
   * @param {Number} offset
   * @return {Selection}
   */

  moveFocusTo(key, offset) {
    const { focusKey, anchorKey, anchorOffset, isBackward } = this
    return this.merge({
      focusKey: key,
      focusOffset: offset,
      isBackward: key == anchorKey
        ? anchorOffset > offset
        : key == focusKey ? isBackward : null
    })
  }

  /**
   * Move the selection to `anchorOffset`.
   *
   * @param {Number} anchorOffset
   * @return {Selection}
   */

  moveAnchorOffsetTo(anchorOffset) {
    return this.merge({
      anchorOffset,
      isBackward: this.anchorKey == this.focusKey
        ? anchorOffset > this.focusOffset
        : this.isBackward
    })
  }

  /**
   * Move the selection to `focusOffset`.
   *
   * @param {Number} focusOffset
   * @return {Selection}
   */

  moveFocusOffsetTo(focusOffset) {
    return this.merge({
      focusOffset,
      isBackward: this.anchorKey == this.focusKey
        ? this.anchorOffset > focusOffset
        : this.isBackward
    })
  }

  /**
   * Move the selection to `anchorOffset` and `focusOffset`.
   *
   * @param {Number} anchorOffset
   * @param {Number} focusOffset (optional)
   * @return {Selection}
   */

  moveOffsetsTo(anchorOffset, focusOffset = anchorOffset) {
    return this
      .moveAnchorOffsetTo(anchorOffset)
      .moveFocusOffsetTo(focusOffset)
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Selection}
   */

  moveToAnchor() {
    return this.moveFocusTo(this.anchorKey, this.anchorOffset)
  }

  /**
   * Move the anchor point to the focus point.
   *
   * @return {Selection}
   */

  moveToFocus() {
    return this.moveAnchorTo(this.focusKey, this.focusOffset)
  }

  /**
   * Move the selection's anchor point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Selection}
   */

  moveAnchorToStartOf(node) {
    node = getFirst(node)
    return this.moveAnchorTo(node.key, 0)
  }

  /**
   * Move the selection's anchor point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Selection}
   */

  moveAnchorToEndOf(node) {
    node = getLast(node)
    return this.moveAnchorTo(node.key, node.length)
  }

  /**
   * Move the selection's focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Selection}
   */

  moveFocusToStartOf(node) {
    node = getFirst(node)
    return this.moveFocusTo(node.key, 0)
  }

  /**
   * Move the selection's focus point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Selection}
   */

  moveFocusToEndOf(node) {
    node = getLast(node)
    return this.moveFocusTo(node.key, node.length)
  }

  /**
   * Move to the entire range of `start` and `end` nodes.
   *
   * @param {Node} start
   * @param {Node} end (optional)
   * @return {Selection}
   */

  moveToRangeOf(start, end = start) {
    return this
      .moveAnchorToStartOf(start)
      .moveFocusToEndOf(end)
  }

  /**
   * Normalize the selection, relative to a `node`, ensuring that the anchor
   * and focus nodes of the selection always refer to leaf text nodes.
   *
   * @param {Node} node
   * @return {Selection}
   */

  normalize(node) {
    const selection = this
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
        isBackward: false,
      })
    }

    // Get the anchor and focus nodes.
    let anchorNode = node.getDescendant(anchorKey)
    let focusNode = node.getDescendant(focusKey)

    // If the anchor node isn't a text node, match it to one.
    if (anchorNode.kind != 'text') {
      warn('The selection anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', anchorNode)
      const anchorText = anchorNode.getTextAtOffset(anchorOffset)
      const offset = anchorNode.getOffset(anchorText.key)
      anchorOffset = anchorOffset - offset
      anchorNode = anchorText
    }

    // If the focus node isn't a text node, match it to one.
    if (focusNode.kind != 'text') {
      warn('The selection focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', focusNode)
      const focusText = focusNode.getTextAtOffset(focusOffset)
      const offset = focusNode.getOffset(focusText.key)
      focusOffset = focusOffset - offset
      focusNode = focusText
    }

    // If `isBackward` is not set, derive it.
    if (isBackward == null) {
      if (anchorNode.key === focusNode.key) {
        isBackward = anchorOffset > focusOffset
      } else {
        isBackward = !node.areDescendantsSorted(anchorNode.key, focusNode.key)
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
   * Unset the selection.
   *
   * @return {Selection}
   */

  unset() {
    warn('The `Selection.unset` method is deprecated, please switch to using `Selection.deselect` instead.')
    return this.deselect()
  }

  /**
   * Move the selection forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveForward(n = 1) {
    warn('The `Selection.moveForward(n)` method is deprecated, please switch to using `Selection.move(n)` instead.')
    return this.move(n)
  }

  /**
   * Move the selection backward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveBackward(n = 1) {
    warn('The `Selection.moveBackward(n)` method is deprecated, please switch to using `Selection.move(-n)` (with a negative number) instead.')
    return this.move(0 - n)
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveAnchorOffset(n = 1) {
    warn('The `Selection.moveAnchorOffset(n)` method is deprecated, please switch to using `Selection.moveAnchor(n)` instead.')
    return this.moveAnchor(n)
  }

  /**
   * Move the focus offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveFocusOffset(n = 1) {
    warn('The `Selection.moveFocusOffset(n)` method is deprecated, please switch to using `Selection.moveFocus(n)` instead.')
    return this.moveFocus(n)
  }

  /**
   * Move the start offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveStartOffset(n = 1) {
    warn('The `Selection.moveStartOffset(n)` method is deprecated, please switch to using `Selection.moveStart(n)` instead.')
    return this.moveStart(n)
  }

  /**
   * Move the focus offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  moveEndOffset(n = 1) {
    warn('The `Selection.moveEndOffset(n)` method is deprecated, please switch to using `Selection.moveEnd(n)` instead.')
    return this.moveEnd(n)
  }

  /**
   * Extend the focus point forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  extendForward(n = 1) {
    warn('The `Selection.extendForward(n)` method is deprecated, please switch to using `Selection.extend(n)` instead.')
    return this.extend(n)
  }

  /**
   * Extend the focus point backward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection}
   */

  extendBackward(n = 1) {
    warn('The `Selection.extendBackward(n)` method is deprecated, please switch to using `Selection.extend(-n)` (with a negative number) instead.')
    return this.extend(0 - n)
  }

  /**
   * Move the selection to `anchorOffset` and `focusOffset`.
   *
   * @param {Number} anchorOffset
   * @param {Number} focusOffset (optional)
   * @return {Selection}
   */

  moveToOffsets(anchorOffset, focusOffset = anchorOffset) {
    warn('The `Selection.moveToOffsets` method is deprecated, please switch to using `Selection.moveOffsetsTo` instead.')
    return this.moveOffsetsTo(anchorOffset, focusOffset)
  }

}

/**
 * Pseduo-symbol that shows this is a Slate Selection
 */

Selection.prototype[MODEL_TYPES.SELECTION] = true

/**
 * Mix in some "move" convenience methods.
 */

const MOVE_METHODS = [
  ['move', ''],
  ['move', 'To'],
  ['move', 'ToStartOf'],
  ['move', 'ToEndOf'],
]

MOVE_METHODS.forEach(([ p, s ]) => {
  Selection.prototype[`${p}${s}`] = function (...args) {
    return this
      [`${p}Anchor${s}`](...args)
      [`${p}Focus${s}`](...args)
  }
})

/**
 * Mix in the "start", "end" and "edge" convenience methods.
 */

const EDGE_METHODS = [
  ['has', 'AtStartOf', true],
  ['has', 'AtEndOf', true],
  ['has', 'Between', true],
  ['has', 'In', true],
  ['collapseTo', ''],
  ['move', ''],
  ['moveTo', ''],
  ['move', 'To'],
  ['move', 'OffsetTo'],
]

EDGE_METHODS.forEach(([ p, s, hasEdge ]) => {
  const anchor = `${p}Anchor${s}`
  const focus = `${p}Focus${s}`

  Selection.prototype[`${p}Start${s}`] = function (...args) {
    return this.isBackward
      ? this[focus](...args)
      : this[anchor](...args)
  }

  Selection.prototype[`${p}End${s}`] = function (...args) {
    return this.isBackward
      ? this[anchor](...args)
      : this[focus](...args)
  }

  if (hasEdge) {
    Selection.prototype[`${p}Edge${s}`] = function (...args) {
      return this[anchor](...args) || this[focus](...args)
    }
  }
})

/**
 * Mix in some aliases for convenience / parallelism with the browser APIs.
 */

const ALIAS_METHODS = [
  ['collapseTo', 'moveTo'],
  ['collapseToAnchor', 'moveToAnchor'],
  ['collapseToFocus', 'moveToFocus'],
  ['collapseToStart', 'moveToStart'],
  ['collapseToEnd', 'moveToEnd'],
  ['collapseToStartOf', 'moveToStartOf'],
  ['collapseToEndOf', 'moveToEndOf'],
  ['extend', 'moveFocus'],
  ['extendTo', 'moveFocusTo'],
  ['extendToStartOf', 'moveFocusToStartOf'],
  ['extendToEndOf', 'moveFocusToEndOf'],
]

ALIAS_METHODS.forEach(([ alias, method ]) => {
  Selection.prototype[alias] = function (...args) {
    return this[method](...args)
  }
})

/**
 * Get the first text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getFirst(node) {
  return node.kind == 'text' ? node : node.getFirstText()
}

/**
 * Get the last text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getLast(node) {
  return node.kind == 'text' ? node : node.getLastText()
}

/**
 * Export.
 *
 * @type {Selection}
 */

export default Selection
