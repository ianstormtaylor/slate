import isPlainObject from 'is-plain-object'
import logger from '@gitbook/slate-dev-logger'
import { List, Record, Set } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import Mark from './mark'

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
  isAtomic: false,
}

/**
 * Range.
 *
 * @type {Range}
 */

class Range extends Record(DEFAULTS) {
  /**
   * Create a new `Range` with `attrs`.
   *
   * @param {Object|Range} attrs
   * @return {Range}
   */

  static create(attrs = {}) {
    if (Range.isRange(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Range.fromJSON(attrs)
    }

    throw new Error(
      `\`Range.create\` only accepts objects or ranges, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Ranges` from `elements`.
   *
   * @param {Array<Range|Object>|List<Range|Object>} elements
   * @return {List<Range>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Range.create))
      return list
    }

    throw new Error(
      `\`Range.createList\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a dictionary of settable range properties from `attrs`.
   *
   * @param {Object|String|Range} attrs
   * @return {Object}
   */

  static createProperties(attrs = {}) {
    if (Range.isRange(attrs)) {
      return {
        anchorKey: attrs.anchorKey,
        anchorOffset: attrs.anchorOffset,
        focusKey: attrs.focusKey,
        focusOffset: attrs.focusOffset,
        isBackward: attrs.isBackward,
        isFocused: attrs.isFocused,
        marks: attrs.marks,
        isAtomic: attrs.isAtomic,
      }
    }

    if (isPlainObject(attrs)) {
      const props = {}
      if ('anchorKey' in attrs) props.anchorKey = attrs.anchorKey
      if ('anchorOffset' in attrs) props.anchorOffset = attrs.anchorOffset
      if ('anchorPath' in attrs) props.anchorPath = attrs.anchorPath
      if ('focusKey' in attrs) props.focusKey = attrs.focusKey
      if ('focusOffset' in attrs) props.focusOffset = attrs.focusOffset
      if ('focusPath' in attrs) props.focusPath = attrs.focusPath
      if ('isBackward' in attrs) props.isBackward = attrs.isBackward
      if ('isFocused' in attrs) props.isFocused = attrs.isFocused
      if ('marks' in attrs)
        props.marks = attrs.marks == null ? null : Mark.createSet(attrs.marks)
      if ('isAtomic' in attrs) props.isAtomic = attrs.isAtomic
      return props
    }

    throw new Error(
      `\`Range.createProperties\` only accepts objects or ranges, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Range` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Range}
   */

  static fromJSON(object) {
    const {
      anchorKey = null,
      anchorOffset = 0,
      focusKey = null,
      focusOffset = 0,
      isBackward = null,
      isFocused = false,
      marks = null,
      isAtomic = false,
    } = object

    const range = new Range({
      anchorKey,
      anchorOffset,
      focusKey,
      focusOffset,
      isBackward,
      isFocused,
      marks: marks == null ? null : new Set(marks.map(Mark.fromJSON)),
      isAtomic,
    })

    return range
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Range.fromJSON

  /**
   * Check if an `obj` is a `Range`.
   *
   * @param {Any} obj
   * @return {Boolean}
   */

  static isRange(obj) {
    return !!(obj && obj[MODEL_TYPES.RANGE])
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'range'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Check whether the range is blurred.
   *
   * @return {Boolean}
   */

  get isBlurred() {
    return !this.isFocused
  }

  /**
   * Check whether the range is collapsed.
   *
   * @return {Boolean}
   */

  get isCollapsed() {
    return (
      this.anchorKey == this.focusKey && this.anchorOffset == this.focusOffset
    )
  }

  /**
   * Check whether the range is expanded.
   *
   * @return {Boolean}
   */

  get isExpanded() {
    return !this.isCollapsed
  }

  /**
   * Check whether the range is forward.
   *
   * @return {Boolean}
   */

  get isForward() {
    return this.isBackward == null ? null : !this.isBackward
  }

  /**
   * Check whether the range's keys are set.
   *
   * @return {Boolean}
   */

  get isSet() {
    return this.anchorKey != null && this.focusKey != null
  }

  /**
   * Check whether the range's keys are not set.
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
   * Check whether anchor point of the range is at the start of a `node`.
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
   * Check whether anchor point of the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtEndOf(node) {
    const last = getLast(node)
    return this.anchorKey == last.key && this.anchorOffset == last.text.length
  }

  /**
   * Check whether the anchor edge of a range is in a `node` and at an
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
   * Check whether the anchor edge of a range is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorIn(node) {
    return node.object == 'text'
      ? node.key == this.anchorKey
      : this.anchorKey != null && node.hasDescendant(this.anchorKey)
  }

  /**
   * Check whether focus point of the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtEndOf(node) {
    const last = getLast(node)
    return this.focusKey == last.key && this.focusOffset == last.text.length
  }

  /**
   * Check whether focus point of the range is at the start of a `node`.
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
   * Check whether the focus edge of a range is in a `node` and at an
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
   * Check whether the focus edge of a range is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusIn(node) {
    return node.object == 'text'
      ? node.key == this.focusKey
      : this.focusKey != null && node.hasDescendant(this.focusKey)
  }

  /**
   * Check whether the range is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtStartOf(node) {
    return this.isCollapsed && this.hasAnchorAtStartOf(node)
  }

  /**
   * Check whether the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtEndOf(node) {
    return this.isCollapsed && this.hasAnchorAtEndOf(node)
  }

  /**
   * Focus the range.
   *
   * @return {Range}
   */

  focus() {
    return this.merge({
      isFocused: true,
    })
  }

  /**
   * Blur the range.
   *
   * @return {Range}
   */

  blur() {
    return this.merge({
      isFocused: false,
    })
  }

  /**
   * Unset the range.
   *
   * @return {Range}
   */

  deselect() {
    return this.merge({
      anchorKey: null,
      anchorOffset: 0,
      focusKey: null,
      focusOffset: 0,
      isFocused: false,
      isBackward: false,
    })
  }

  /**
   * Flip the range.
   *
   * @return {Range}
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
   * @return {Range}
   */

  moveAnchor(n = 1) {
    const { anchorKey, focusKey, focusOffset, isBackward } = this
    const anchorOffset = this.anchorOffset + n
    return this.merge({
      anchorOffset,
      isBackward:
        anchorKey == focusKey ? anchorOffset > focusOffset : isBackward,
    })
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Range}
   */

  moveFocus(n = 1) {
    const { anchorKey, anchorOffset, focusKey, isBackward } = this
    const focusOffset = this.focusOffset + n
    return this.merge({
      focusOffset,
      isBackward:
        focusKey == anchorKey ? anchorOffset > focusOffset : isBackward,
    })
  }

  /**
   * Move the range's anchor point to a `key` and `offset`.
   *
   * @param {String} key
   * @param {Number} offset
   * @return {Range}
   */

  moveAnchorTo(key, offset) {
    const { anchorKey, focusKey, focusOffset, isBackward } = this
    return this.merge({
      anchorKey: key,
      anchorOffset: offset,
      isBackward:
        key == focusKey
          ? offset > focusOffset
          : key == anchorKey ? isBackward : null,
    })
  }

  /**
   * Move the range's focus point to a `key` and `offset`.
   *
   * @param {String} key
   * @param {Number} offset
   * @return {Range}
   */

  moveFocusTo(key, offset) {
    const { focusKey, anchorKey, anchorOffset, isBackward } = this
    return this.merge({
      focusKey: key,
      focusOffset: offset,
      isBackward:
        key == anchorKey
          ? anchorOffset > offset
          : key == focusKey ? isBackward : null,
    })
  }

  /**
   * Move the range to `anchorOffset`.
   *
   * @param {Number} anchorOffset
   * @return {Range}
   */

  moveAnchorOffsetTo(anchorOffset) {
    return this.merge({
      anchorOffset,
      isBackward:
        this.anchorKey == this.focusKey
          ? anchorOffset > this.focusOffset
          : this.isBackward,
    })
  }

  /**
   * Move the range to `focusOffset`.
   *
   * @param {Number} focusOffset
   * @return {Range}
   */

  moveFocusOffsetTo(focusOffset) {
    return this.merge({
      focusOffset,
      isBackward:
        this.anchorKey == this.focusKey
          ? this.anchorOffset > focusOffset
          : this.isBackward,
    })
  }

  /**
   * Move the range to `anchorOffset` and `focusOffset`.
   *
   * @param {Number} anchorOffset
   * @param {Number} focusOffset (optional)
   * @return {Range}
   */

  moveOffsetsTo(anchorOffset, focusOffset = anchorOffset) {
    return this.moveAnchorOffsetTo(anchorOffset).moveFocusOffsetTo(focusOffset)
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Range}
   */

  moveToAnchor() {
    return this.moveFocusTo(this.anchorKey, this.anchorOffset)
  }

  /**
   * Move the anchor point to the focus point.
   *
   * @return {Range}
   */

  moveToFocus() {
    return this.moveAnchorTo(this.focusKey, this.focusOffset)
  }

  /**
   * Move the range's anchor point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToStartOf(node) {
    node = getFirst(node)
    return this.moveAnchorTo(node.key, 0)
  }

  /**
   * Move the range's anchor point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToEndOf(node) {
    node = getLast(node)
    return this.moveAnchorTo(node.key, node.text.length)
  }

  /**
   * Move the range's focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToStartOf(node) {
    node = getFirst(node)
    return this.moveFocusTo(node.key, 0)
  }

  /**
   * Move the range's focus point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToEndOf(node) {
    node = getLast(node)
    return this.moveFocusTo(node.key, node.text.length)
  }

  /**
   * Move to the entire range of `start` and `end` nodes.
   *
   * @param {Node} start
   * @param {Node} end (optional)
   * @return {Range}
   */

  moveToRangeOf(start, end = start) {
    const range = this.isBackward ? this.flip() : this
    return range.moveAnchorToStartOf(start).moveFocusToEndOf(end)
  }

  /**
   * Normalize the range, relative to a `node`, ensuring that the anchor
   * and focus nodes of the range always refer to leaf text nodes.
   *
   * @param {Node} node
   * @return {Range}
   */

  normalize(node) {
    const range = this
    let { anchorKey, anchorOffset, focusKey, focusOffset, isBackward } = range

    const anchorOffsetType = typeof anchorOffset
    const focusOffsetType = typeof focusOffset

    if (anchorOffsetType != 'number' || focusOffsetType != 'number') {
      logger.warn(
        `The range offsets should be numbers, but they were of type "${anchorOffsetType}" and "${focusOffsetType}".`
      )
    }

    // If the range is unset, make sure it is properly zeroed out.
    if (anchorKey == null || focusKey == null) {
      return range.merge({
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

    // If the range is malformed, warn and zero it out.
    if (!anchorNode || !focusNode) {
      logger.warn(
        'The range was invalid and was reset. The range in question was:',
        range
      )

      const first = node.getFirstText()
      return range.merge({
        anchorKey: first ? first.key : null,
        anchorOffset: 0,
        focusKey: first ? first.key : null,
        focusOffset: 0,
        isBackward: false,
      })
    }

    // If the anchor node isn't a text node, match it to one.
    if (anchorNode.object != 'text') {
      logger.warn(
        'The range anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:',
        anchorNode
      )

      const anchorText = anchorNode.getTextAtOffset(anchorOffset)
      const offset = anchorNode.getOffset(anchorText.key)
      anchorOffset = anchorOffset - offset
      anchorNode = anchorText
    }

    // If the focus node isn't a text node, match it to one.
    if (focusNode.object != 'text') {
      logger.warn(
        'The range focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:',
        focusNode
      )

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
    return range.merge({
      anchorKey: anchorNode.key,
      anchorOffset,
      focusKey: focusNode.key,
      focusOffset,
      isBackward,
    })
  }

  /**
   * Return a JSON representation of the range.
   *
   * @return {Object}
   */

  toJSON() {
    const object = {
      object: this.object,
      anchorKey: this.anchorKey,
      anchorOffset: this.anchorOffset,
      focusKey: this.focusKey,
      focusOffset: this.focusOffset,
      isBackward: this.isBackward,
      isFocused: this.isFocused,
      marks:
        this.marks == null ? null : this.marks.toArray().map(m => m.toJSON()),
      isAtomic: this.isAtomic,
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS() {
    return this.toJSON()
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.prototype[MODEL_TYPES.RANGE] = true

/**
 * Mix in some "move" convenience methods.
 */

const MOVE_METHODS = [
  ['move', ''],
  ['move', 'To'],
  ['move', 'ToStartOf'],
  ['move', 'ToEndOf'],
]

MOVE_METHODS.forEach(([p, s]) => {
  Range.prototype[`${p}${s}`] = function(...args) {
    return this[`${p}Anchor${s}`](...args)[`${p}Focus${s}`](...args)
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

EDGE_METHODS.forEach(([p, s, hasEdge]) => {
  const anchor = `${p}Anchor${s}`
  const focus = `${p}Focus${s}`

  Range.prototype[`${p}Start${s}`] = function(...args) {
    return this.isBackward ? this[focus](...args) : this[anchor](...args)
  }

  Range.prototype[`${p}End${s}`] = function(...args) {
    return this.isBackward ? this[anchor](...args) : this[focus](...args)
  }

  if (hasEdge) {
    Range.prototype[`${p}Edge${s}`] = function(...args) {
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

ALIAS_METHODS.forEach(([alias, method]) => {
  Range.prototype[alias] = function(...args) {
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
  return node.object == 'text' ? node : node.getFirstText()
}

/**
 * Get the last text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getLast(node) {
  return node.object == 'text' ? node : node.getLastText()
}

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
