import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Record, Set } from 'immutable'

import PathUtils from '../utils/path-utils'
import MODEL_TYPES from '../constants/model-types'
import Mark from './mark'
import Point from './point'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  anchor: Point.create(),
  focus: Point.create(),
  isAtomic: false,
  isFocused: false,
  marks: null,
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

  static createProperties(a = {}) {
    if (Range.isRange(a)) {
      return {
        anchor: Point.createProperties(a.anchor),
        focus: Point.createProperties(a.focus),
        isAtomic: a.isAtomic,
        isFocused: a.isFocused,
        marks: a.marks,
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('anchor' in a) p.anchor = Point.create(a.anchor)
      if ('focus' in a) p.focus = Point.create(a.focus)
      if ('isAtomic' in a) p.isAtomic = a.isAtomic
      if ('isFocused' in a) p.isFocused = a.isFocused
      if ('marks' in a)
        p.marks = a.marks == null ? null : Mark.createSet(a.marks)
      return p
    }

    throw new Error(
      `\`Range.createProperties\` only accepts objects or ranges, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Range` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Range}
   */

  static fromJSON(object) {
    let {
      anchor,
      focus,
      isAtomic = false,
      isFocused = false,
      marks = null,
    } = object

    if (
      !anchor &&
      (object.anchorKey || object.anchorOffset || object.anchorPath)
    ) {
      logger.deprecate(
        '0.37.0',
        '`Range` objects now take a `Point` object as an `anchor` instead of taking `anchorKey/Offset/Path` properties. But you passed:',
        object
      )

      anchor = {
        key: object.anchorKey,
        offset: object.anchorOffset,
        path: object.anchorPath,
      }
    }

    if (!focus && (object.focusKey || object.focusOffset || object.focusPath)) {
      logger.deprecate(
        '0.37.0',
        '`Range` objects now take a `Point` object as a `focus` instead of taking `focusKey/Offset/Path` properties. But you passed:',
        object
      )

      focus = {
        key: object.focusKey,
        offset: object.focusOffset,
        path: object.focusPath,
      }
    }

    const range = new Range({
      anchor: Point.fromJSON(anchor || {}),
      focus: Point.fromJSON(focus || {}),
      isAtomic,
      isFocused,
      marks: marks == null ? null : new Set(marks.map(Mark.fromJSON)),
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
      this.anchor === this.focus ||
      (this.anchor.key === this.focus.key &&
        this.anchor.offset === this.focus.offset)
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
   * Check whether the range is backward.
   *
   * @return {Boolean}
   */

  get isBackward() {
    const { isUnset, anchor, focus } = this

    if (isUnset) {
      return null
    }

    if (anchor.key === focus.key) {
      return anchor.offset > focus.offset
    }

    const isBackward = PathUtils.isBefore(focus.path, anchor.path)
    return isBackward
  }

  /**
   * Check whether the range is forward.
   *
   * @return {Boolean}
   */

  get isForward() {
    const { isBackward } = this
    const isForward = isBackward == null ? null : !isBackward
    return isForward
  }

  /**
   * Check whether the range isn't set.
   *
   * @return {Boolean}
   */

  get isUnset() {
    const { anchor, focus } = this
    const isUnset = anchor.isUnset || focus.isUnset
    return isUnset
  }

  /**
   * Check whether the range is set.
   *
   * @return {Boolean}
   */

  get isSet() {
    return !this.isUnset
  }

  /**
   * Get the start point.
   *
   * @return {String}
   */

  get start() {
    return this.isBackward ? this.focus : this.anchor
  }

  /**
   * Get the end point.
   *
   * @return {String}
   */

  get end() {
    return this.isBackward ? this.anchor : this.focus
  }

  /**
   * Flip the range.
   *
   * @return {Range}
   */

  flip() {
    const range = this.setPoints([this.focus, this.anchor])
    return range
  }

  /**
   * Move the anchor and focus offsets forward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveForward(n) {
    return this.updatePoints(point => point.moveForward(n))
  }

  /**
   * Move the anchor and focus offsets backward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveBackward(n) {
    return this.updatePoints(point => point.moveBackward(n))
  }

  /**
   * Move the anchor offset backward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveAnchorBackward(n) {
    const range = this.setAnchor(this.anchor.moveBackward(n))
    return range
  }

  /**
   * Move the anchor offset forward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveAnchorForward(n) {
    const range = this.setAnchor(this.anchor.moveForward(n))
    return range
  }

  /**
   * Move the range's anchor point to a new `path` and `offset`.
   *
   * Optionally, the `path` can be a key string, or omitted entirely in which
   * case it would be the offset number.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @return {Range}
   */

  moveAnchorTo(path, offset) {
    const range = this.setAnchor(this.anchor.moveTo(path, offset))
    return range
  }

  /**
   * Move the range's anchor point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToStartOfNode(node) {
    const range = this.setAnchor(this.anchor.moveToStartOfNode(node))
    return range
  }

  /**
   * Move the range's anchor point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToEndOfNode(node) {
    const range = this.setAnchor(this.anchor.moveToEndOfNode(node))
    return range
  }

  /**
   * Move the end offset backward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveEndBackward(n) {
    const range = this.setEnd(this.end.moveBackward(n))
    return range
  }

  /**
   * Move the end offset forward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveEndForward(n) {
    const range = this.setEnd(this.end.moveForward(n))
    return range
  }

  /**
   * Move the range's end point to a new `path` and `offset`.
   *
   * Optionally, the `path` can be a key string, or omitted entirely in which
   * case it would be the offset number.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @return {Range}
   */

  moveEndTo(path, offset) {
    const range = this.setEnd(this.end.moveTo(path, offset))
    return range
  }

  /**
   * Move the range's end point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveEndToStartOfNode(node) {
    const range = this.setEnd(this.end.moveToStartOfNode(node))
    return range
  }

  /**
   * Move the range's end point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveEndToEndOfNode(node) {
    const range = this.setEnd(this.end.moveToEndOfNode(node))
    return range
  }

  /**
   * Move the focus offset backward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveFocusBackward(n) {
    const range = this.setFocus(this.focus.moveBackward(n))
    return range
  }

  /**
   * Move the focus offset forward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveFocusForward(n) {
    const range = this.setFocus(this.focus.moveForward(n))
    return range
  }

  /**
   * Move the range's focus point to a new `path` and `offset`.
   *
   * Optionally, the `path` can be a key string, or omitted entirely in which
   * case it would be the offset number.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @return {Range}
   */

  moveFocusTo(path, offset) {
    const range = this.setFocus(this.focus.moveTo(path, offset))
    return range
  }

  /**
   * Move the range's focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToStartOfNode(node) {
    const range = this.setFocus(this.focus.moveToStartOfNode(node))
    return range
  }

  /**
   * Move the range's focus point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToEndOfNode(node) {
    const range = this.setFocus(this.focus.moveToEndOfNode(node))
    return range
  }

  /**
   * Move the start offset backward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveStartBackward(n) {
    const range = this.setStart(this.start.moveBackward(n))
    return range
  }

  /**
   * Move the start offset forward `n` characters.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveStartForward(n) {
    const range = this.setStart(this.start.moveForward(n))
    return range
  }

  /**
   * Move the range's start point to a new `path` and `offset`.
   *
   * Optionally, the `path` can be a key string, or omitted entirely in which
   * case it would be the offset number.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @return {Range}
   */

  moveStartTo(path, offset) {
    const range = this.setStart(this.start.moveTo(path, offset))
    return range
  }

  /**
   * Move the range's start point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveStartToStartOfNode(node) {
    const range = this.setStart(this.start.moveToStartOfNode(node))
    return range
  }

  /**
   * Move the range's start point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveStartToEndOfNode(node) {
    const range = this.setStart(this.start.moveToEndOfNode(node))
    return range
  }

  /**
   * Move range's points to a new `path` and `offset`.
   *
   * @param {Number} n
   * @return {Range}
   */

  moveTo(path, offset) {
    return this.updatePoints(point => point.moveTo(path, offset))
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Range}
   */

  moveToAnchor() {
    const range = this.setFocus(this.anchor)
    return range
  }

  /**
   * Move the start point to the end point.
   *
   * @return {Range}
   */

  moveToEnd() {
    const range = this.setStart(this.end)
    return range
  }

  /**
   * Move the range's points to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveToEndOfNode(node) {
    return this.updatePoints(point => point.moveToEndOfNode(node))
  }

  /**
   * Move the anchor point to the focus point.
   *
   * @return {Range}
   */

  moveToFocus() {
    const range = this.setAnchor(this.focus)
    return range
  }

  /**
   * Move to the entire range of `start` and `end` nodes.
   *
   * @param {Node} start
   * @param {Node} end (optional)
   * @return {Range}
   */

  moveToRangeOfNode(start, end = start) {
    const range = this.setPoints([
      this.anchor.moveToStartOfNode(start),
      this.focus.moveToEndOfNode(end),
    ])

    return range
  }

  /**
   * Move the end point to the start point.
   *
   * @return {Range}
   */

  moveToStart() {
    const range = this.setEnd(this.start)
    return range
  }

  /**
   * Move the range's points to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveToStartOfNode(node) {
    return this.updatePoints(point => point.moveToStartOfNode(node))
  }

  /**
   * Normalize the range, relative to a `node`, ensuring that the anchor
   * and focus nodes of the range always refer to leaf text nodes.
   *
   * @param {Node} node
   * @return {Range}
   */

  normalize(node) {
    return this.updatePoints(point => point.normalize(node))
  }

  /**
   * Set the anchor point to a new `anchor`.
   *
   * @param {Point} anchor
   * @return {Range}
   */

  setAnchor(anchor) {
    const range = this.set('anchor', anchor)
    return range
  }

  /**
   * Set the end point to a new `point`.
   *
   * @param {Point} point
   * @return {Range}
   */

  setEnd(point) {
    const range = this.isBackward ? this.setAnchor(point) : this.setFocus(point)
    return range
  }

  /**
   * Set the focus point to a new `focus`.
   *
   * @param {Point} focus
   * @return {Range}
   */

  setFocus(focus) {
    const range = this.set('focus', focus)
    return range
  }

  /**
   * Set the `isAtomic` property to a new `value`.
   *
   * @param {Boolean} value
   * @return {Range}
   */

  setIsAtomic(value) {
    const range = this.set('isAtomic', value)
    return range
  }

  /**
   * Set the `isFocused` property to a new `value`.
   *
   * @param {Boolean} value
   * @return {Range}
   */

  setIsFocused(value) {
    const range = this.set('isFocused', value)
    return range
  }

  /**
   * Set the `marks` property to a new set of `marks`.
   *
   * @param {Set} marks
   * @return {Range}
   */

  setMarks(marks) {
    const range = this.set('marks', marks)
    return range
  }

  /**
   * Set the anchor and focus points to new `values`.
   *
   * @param {Array<Point>} values
   * @return {Range}
   */

  setPoints(values) {
    const [anchor, focus] = values
    const range = this.set('anchor', anchor).set('focus', focus)
    return range
  }

  /**
   * Set the anchor and focus points with `updator` callback
   *
   * @param {Function} updator
   * @return {Range}
   */

  updatePoints(updator) {
    let { anchor, focus } = this
    anchor = updator(anchor)
    focus = updator(focus)
    return this.merge({ anchor, focus })
  }

  /**
   * Set the start point to a new `point`.
   *
   * @param {Point} point
   * @return {Range}
   */

  setStart(point) {
    const range = this.isBackward ? this.setFocus(point) : this.setAnchor(point)
    return range
  }

  /**
   * Set new `properties` on the range.
   *
   * @param {Object|Range} properties
   * @return {Range}
   */

  setProperties(properties) {
    properties = Range.createProperties(properties)
    const { anchor, focus, ...props } = properties

    if (anchor) {
      props.anchor = Point.create(anchor)
    }

    if (focus) {
      props.focus = Point.create(focus)
    }

    const range = this.merge(props)
    return range
  }

  /**
   * Return a JSON representation of the range.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      anchor: this.anchor.toJSON(options),
      focus: this.focus.toJSON(options),
      isAtomic: this.isAtomic,
      isFocused: this.isFocused,
      marks:
        this.marks == null ? null : this.marks.toArray().map(m => m.toJSON()),
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
   * Deprecated.
   */

  get anchorKey() {
    logger.deprecate(
      '0.37.0',
      'The `range.anchorKey` property has been deprecated, use `range.anchor.key` instead.'
    )

    return this.anchor.key
  }

  get anchorOffset() {
    logger.deprecate(
      '0.37.0',
      'The `range.anchorOffset` property has been deprecated, use `range.anchor.offset` instead.'
    )

    return this.anchor.offset
  }

  get anchorPath() {
    logger.deprecate(
      '0.37.0',
      'The `range.anchorPath` property has been deprecated, use `range.anchor.path` instead.'
    )

    return this.anchor.path
  }

  get focusKey() {
    logger.deprecate(
      '0.37.0',
      'The `range.focusKey` property has been deprecated, use `range.focus.key` instead.'
    )

    return this.focus.key
  }

  get focusOffset() {
    logger.deprecate(
      '0.37.0',
      'The `range.focusOffset` property has been deprecated, use `range.focus.offset` instead.'
    )

    return this.focus.offset
  }

  get focusPath() {
    logger.deprecate(
      '0.37.0',
      'The `range.focusPath` property has been deprecated, use `range.focus.path` instead.'
    )

    return this.focus.path
  }

  get startKey() {
    logger.deprecate(
      '0.37.0',
      'The `range.startKey` property has been deprecated, use `range.start.key` instead.'
    )

    return this.start.key
  }

  get startOffset() {
    logger.deprecate(
      '0.37.0',
      'The `range.startOffset` property has been deprecated, use `range.start.offset` instead.'
    )

    return this.start.offset
  }

  get startPath() {
    logger.deprecate(
      '0.37.0',
      'The `range.startPath` property has been deprecated, use `range.start.path` instead.'
    )

    return this.start.path
  }

  get endKey() {
    logger.deprecate(
      '0.37.0',
      'The `range.endKey` property has been deprecated, use `range.end.key` instead.'
    )

    return this.end.key
  }

  get endOffset() {
    logger.deprecate(
      '0.37.0',
      'The `range.endOffset` property has been deprecated, use `range.end.offset` instead.'
    )

    return this.end.offset
  }

  get endPath() {
    logger.deprecate(
      '0.37.0',
      'The `range.endPath` property has been deprecated, use `range.end.path` instead.'
    )

    return this.end.path
  }

  hasAnchorBetween(node, start, end) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasAnchorBetween` method is deprecated, please use the `Range.anchor` methods and properties directly instead.'
    )

    return (
      this.anchor.offset <= end &&
      start <= this.anchor.offset &&
      this.anchor.isInNode(node)
    )
  }

  hasEdgeBetween(node, start, end) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEdgeBetween` method is deprecated.'
    )

    return (
      (this.anchor.offset <= end &&
        start <= this.anchor.offset &&
        this.anchor.isInNode(node)) ||
      (this.focus.offset <= end &&
        start <= this.focus.offset &&
        this.focus.isInNode(node))
    )
  }

  hasEndBetween(node, start, end) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEndBetween` method is deprecated, please use the `Range.end` methods and properties directly instead.'
    )

    return (
      this.end.offset <= end &&
      start <= this.end.offset &&
      this.end.isInNode(node)
    )
  }

  hasFocusBetween(node, start, end) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasFocusBetween` method is deprecated, please use the `Range.focus` methods and properties directly instead.'
    )

    return (
      start <= this.focus.offset &&
      this.focus.offset <= end &&
      this.focus.isInNode(node)
    )
  }

  hasStartBetween(node, start, end) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasStartBetween` method is deprecated, please use the `Range.start` methods and properties directly instead.'
    )

    return (
      this.start.offset <= end &&
      start <= this.start.offset &&
      this.start.isInNode(node)
    )
  }

  isAtStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.isAtStartOf` method is deprecated, please use `Range.isCollapsed` and `Point.isAtStartOfNode` instead.'
    )

    return this.isCollapsed && this.anchor.isAtStartOfNode(node)
  }

  isAtEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.isAtEndOf` method is deprecated, please use `Range.isCollapsed` and `Point.isAtEndOfNode` instead.'
    )

    return this.isCollapsed && this.anchor.isAtEndOfNode(node)
  }

  blur() {
    logger.deprecate(
      '0.37.0',
      'The `Range.blur` method is deprecated, please use `Range.merge` directly instead.'
    )

    return this.merge({ isFocused: false })
  }

  deselect() {
    logger.deprecate(
      '0.37.0',
      'The `Range.deselect` method is deprecated, please use `Range.create` to create a new unset range instead.'
    )

    return Range.create()
  }

  moveAnchorOffsetTo(o) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveAnchorOffsetTo` method is deprecated, please use `Range.moveAnchorTo(offset)` instead.'
    )

    return this.moveAnchorTo(o)
  }

  moveFocusOffsetTo(fo) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveFocusOffsetTo` method is deprecated, please use `Range.moveFocusTo(offset)` instead.'
    )

    return this.moveFocusTo(fo)
  }

  moveStartOffsetTo(o) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveStartOffsetTo` method is deprecated, please use `Range.moveStartTo(offset)` instead.'
    )

    return this.moveStartTo(o)
  }

  moveEndOffsetTo(o) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveEndOffsetTo` method is deprecated, please use `Range.moveEndTo(offset)` instead.'
    )

    return this.moveEndTo(o)
  }

  moveOffsetsTo(ao, fo = ao) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveOffsetsTo` method is deprecated, please use `Range.moveAnchorTo` and `Range.moveFocusTo` in sequence instead.'
    )

    return this.moveAnchorTo(ao).moveFocusTo(fo)
  }

  moveAnchorToStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveAnchorToStartOf` method is deprecated, please use `Range.moveAnchorToStartOfNode` instead.'
    )

    return this.moveAnchorToStartOfNode(node)
  }

  moveAnchorToEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveAnchorToEndOf` method is deprecated, please use `Range.moveAnchorToEndOfNode` instead.'
    )

    return this.moveAnchorToEndOfNode(node)
  }

  moveFocusToStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveFocusToStartOf` method is deprecated, please use `Range.moveFocusToStartOfNode` instead.'
    )

    return this.moveFocusToStartOfNode(node)
  }

  moveFocusToEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveFocusToEndOf` method is deprecated, please use `Range.moveFocusToEndOfNode` instead.'
    )

    return this.moveFocusToEndOfNode(node)
  }

  moveToStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveToStartOf` method is deprecated, please use `Range.moveToStartOfNode` instead.'
    )

    return this.moveToStartOfNode(node)
  }

  moveToEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveToEndOf` method is deprecated, please use `Range.moveToEndOfNode` instead.'
    )

    return this.moveToEndOfNode(node)
  }

  moveToRangeOf(...args) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveToRangeOf` method is deprecated, please use `Range.moveToRangeOfNode` instead.'
    )

    return this.moveToRangeOfNode(...args)
  }

  collapseToAnchor() {
    logger.deprecate(
      '0.37.0',
      'The `Range.collapseToAnchor` method is deprecated, please use `Range.moveToAnchor` instead.'
    )

    return this.moveToAnchor()
  }

  collapseToEnd() {
    logger.deprecate(
      '0.37.0',
      'The `Range.collapseToEnd` method is deprecated, please use `Range.moveToEnd` instead.'
    )

    return this.moveToEnd()
  }

  collapseToFocus() {
    logger.deprecate(
      '0.37.0',
      'The `Range.collapseToFocus` method is deprecated, please use `Range.moveToFocus` instead.'
    )

    return this.moveToFocus()
  }

  collapseToStart() {
    logger.deprecate(
      '0.37.0',
      'The `Range.collapseToStart` method is deprecated, please use `Range.moveToStart` instead.'
    )

    return this.moveToStart()
  }

  move(n = 1) {
    logger.deprecate(
      '0.37.0',
      'The `Range.move` method is deprecated, please use `Range.moveForward` or `Range.moveBackward` instead.'
    )

    return n > 0 ? this.moveForward(n) : this.moveBackward(-n)
  }

  moveAnchor(n = 1) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveAnchor` method is deprecated, please use `Range.moveAnchorForward` or `Range.moveAnchorBackward` instead.'
    )

    return n > 0 ? this.moveAnchorForward(n) : this.moveAnchorBackward(-n)
  }

  moveEnd(n = 1) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveEnd` method is deprecated, please use `Range.moveEndForward` or `Range.moveEndBackward` instead.'
    )

    return n > 0 ? this.moveEndForward(n) : this.moveEndBackward(-n)
  }

  moveFocus(n = 1) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveFocus` method is deprecated, please use `Range.moveFocusForward` or `Range.moveFocusBackward` instead.'
    )

    return n > 0 ? this.moveFocusForward(n) : this.moveFocusBackward(-n)
  }

  moveStart(n = 1) {
    logger.deprecate(
      '0.37.0',
      'The `Range.moveStart` method is deprecated, please use `Range.moveStartForward` or `Range.moveStartBackward` instead.'
    )

    return n > 0 ? this.moveStartForward(n) : this.moveStartBackward(-n)
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.prototype[MODEL_TYPES.RANGE] = true

/**
 * Mix in some aliases for convenience / parallelism with the browser APIs.
 */

const ALIAS_METHODS = [
  ['collapseTo', 'moveTo'],
  ['collapseToStartOf', 'moveToStartOfNode'],
  ['collapseToEndOf', 'moveToEndOfNode'],
  ['extend', 'moveFocus'],
  ['extendTo', 'moveFocusTo'],
  ['extendToStartOf', 'moveFocusToStartOfNode'],
  ['extendToEndOf', 'moveFocusToEndOfNode'],
]

ALIAS_METHODS.forEach(([alias, method]) => {
  Range.prototype[alias] = function(...args) {
    logger.deprecate(
      '0.37.0',
      `The \`Range.${alias}\` method is deprecated, please use \`Range.${method}\` instead.`
    )

    return this[method](...args)
  }
})

const DEPRECATED_EDGE_METHODS = [
  {
    getAlias: edge => `has${edge}AtStartOf`,
    pointMethod: 'isAtStartOfNode',
  },
  {
    getAlias: edge => `has${edge}AtEndOf`,
    pointMethod: `isAtEndOfNode`,
  },
  {
    getAlias: edge => `has${edge}In`,
    pointMethod: `isInNode`,
  },
]

DEPRECATED_EDGE_METHODS.forEach(({ getAlias, pointMethod }) => {
  ;['start', 'end', 'focus', 'anchor', 'edge'].forEach(edge => {
    const alias = getAlias(edge.charAt(0).toUpperCase() + edge.substr(1))

    Range.prototype[alias] = function(...args) {
      logger.deprecate(
        '0.37.0',
        `The \`Range.${alias}\` method is deprecated, please use \`this[${edge}].${pointMethod}\` instead.`
      )

      if (edge === 'edge') {
        return (
          this.focus[pointMethod](...args) || this.anchor[pointMethod](...args)
        )
      }

      return this[edge][pointMethod](...args)
    }
  })
})

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
