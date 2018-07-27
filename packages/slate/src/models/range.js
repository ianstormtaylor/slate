import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Record, Set } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import Mark from './mark'
import Point from './point'

const UNSET_POINT = new Point({ key: null, offset: 0 })

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  anchorPoint: UNSET_POINT,
  focusPoint: UNSET_POINT,
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

    const {
      anchorPoint = new Point({ key: anchorKey, offset: anchorOffset }),
      focusPoint = new Point({ key: focusKey, offset: focusOffset }),
    } = object

    const range = new Range({
      anchorPoint,
      focusPoint,
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
    return this.anchorPoint.equals(this.focusPoint)
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
    return this.anchorPoint.isSet && this.focusPoint.isSet
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
   * Get the anchor key.
   *
   * @return {String}
   */

  get anchorKey() {
    return this.anchorPoint.key
  }

  /**
   * Get the anchor key.
   *
   * @return {String}
   */

  get anchorOffset() {
    return this.anchorPoint.offset
  }

  /**
   * Get the anchor key.
   *
   * @return {String}
   */

  get focusKey() {
    return this.focusPoint.key
  }

  /**
   * Get the anchor key.
   *
   * @return {String}
   */

  get focusOffset() {
    return this.focusPoint.offset
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
   * Get the start point
   *
   * @return {String}
   */

  get startPoint() {
    return this.isBackward ? this.anchorPoint : this.focusPoint
  }

  /**
   * Get the start point
   *
   * @return {String}
   */

  get endPoint() {
    return this.isBackward ? this.focusPoint : this.anchorPoint
  }

  /**
   * Check whether anchor point of the range is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtStartOf(node) {
    return this.anchorPoint.isAtStartOf(node)
  }

  /**
   * Check whether anchor point of the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtEndOf(node) {
    return this.anchorPoint.isAtEndOf(node)
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
    this.anchorPoint.isBetween(node, start, end)
  }

  /**
   * Check whether focus point of the range is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtStartOf(node) {
    this.focusPoint.isAtStartOf(node)
  }

  /**
   * Check whether focus point of the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtEndOf(node) {
    this.focusPoint.isAtEndOf(node)
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
    return this.focusPoint.isBetween(node, start, end)
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
      anchorPoint: UNSET_POINT,
      focusPoint: UNSET_POINT,
      isFocused: false,
      isBackward: null,
    })
  }

  /**
   * Flip the range.
   *
   * @return {Range}
   */

  flip() {
    const { anchorPoint, focusPoint } = this

    return this.merge({
      anchorPoint: focusPoint,
      focusPoint: anchorPoint,
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
    return this.moveAnchorToPoint(this.anchorPoint.move(n))
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Range}
   */

  moveFocus(n = 1) {
    return this.moveFocusToPoint(this.focusPoint.move(n))
  }

  /**
   * Move the range's anchor point to a `key` and `offset`.
   *
   * @param {String} key
   * @param {Number} offset
   * @return {Range}
   */

  moveAnchorTo(key, offset) {
    return this.moveAnchorToPoint(new Point({ key, offset }))
  }

  /**
   * Move the range's anchor point to a `key` and `offset`.
   *
   * @param {Point} point
   * @return {Range}
   */

  moveAnchorToPoint(point) {
    const { anchorKey, focusKey, focusOffset, isBackward } = this
    const { key, offset } = point
    return this.merge({
      anchorPoint: point,
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
    return this.moveFocusToPoint(new Point({ key, offset }))
  }

  /**
   * Move the range's focus point to a `key` and `offset`.
   *
   * @param {Point} point
   * @return {Range}
   */

  moveFocusToPoint(point) {
    const { focusKey, anchorKey, anchorOffset, isBackward } = this
    const { key, offset } = point
    return this.merge({
      focusPoint: point,
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
    return this.moveAnchorToPoint(this.anchorPoint.moveOffsetTo(anchorOffset))
  }

  /**
   * Move the range to `focusOffset`.
   *
   * @param {Number} focusOffset
   * @return {Range}
   */

  moveFocusOffsetTo(focusOffset) {
    return this.moveFocusToPoint(this.focusPoint.moveOffsetTo(focusOffset))
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
    const { anchorPoint: focusPoint } = this
    return this.merge({ focusPoint, isBackward: null })
  }

  /**
   * Move the anchor point to the focus point.
   *
   * @return {Range}
   */

  moveToFocus() {
    const { focusPoint: anchorPoint } = this
    return this.merge({ anchorPoint, isBackward: null })
  }

  /**
   * Move the range's anchor point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToStartOf(node) {
    const { anchorPoint } = this
    return this.moveAnchorToPoint(anchorPoint.moveToStartOf(node))
  }

  /**
   * Move the range's anchor point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToEndOf(node) {
    const { anchorPoint } = this
    return this.moveAnchorToPoint(anchorPoint.moveToEndOf(node))
  }

  /**
   * Move the range's focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToStartOf(node) {
    const { focusPoint } = this
    return this.moveFocusToPoint(focusPoint.moveToStartOf(node))
  }

  /**
   * Move the range's focus point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToEndOf(node) {
    const { focusPoint } = this
    return this.moveFocusToPoint(focusPoint.moveToEndOf(node))
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
    let { anchorPoint, focusPoint, isBackward } = this

    if (anchorPoint.isUnset || focusPoint.isUnset) {
      return this.merge(DEFAULTS)
    }

    anchorPoint = anchorPoint.normalize(node)
    focusPoint = focusPoint.normalize(node)

    // If `isBackward` is not set, derive it.
    if (isBackward == null) {
      if (anchorPoint.key === focusPoint.key) {
        isBackward = anchorPoint.offset > focusPoint.offset
      } else {
        isBackward = !node.areDescendantsSorted(anchorPoint.key, focusPoint.key)
      }
    }

    // Merge in any updated properties.
    return this.merge({
      anchorPoint,
      focusPoint,
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

  /**
   * Compatability Issue
   * @param{object} props
   * @return
   */

  loadProps(props) {
    let { anchorPoint = this.anchorPoint, focusPoint = this.focusPoint } = props

    if (anchorPoint === this.anchorPoint) {
      const { anchorOffset: offset, anchorKey: key } = props
      if (key != null) anchorPoint = anchorPoint.set('key', key)
      if (offset != null) anchorPoint = anchorPoint.set('offset', offset)
    }

    if (focusPoint === this.focusPoint) {
      const { focusOffset: offset, focusKey: key } = props
      if (key != null) focusPoint = focusPoint.set('key', key)
      if (offset != null) focusPoint = focusPoint.set('offset', offset)
    }

    const object = {}

    for (const key in props) {
      if (!key.includes('anchor') && !key.includes('focus')) {
        object[key] = props[key]
      }
    }

    object.focusPoint = focusPoint
    object.anchorPoint = anchorPoint

    return this.merge(object)
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
 * Export.
 *
 * @type {Range}
 */

export default Range
