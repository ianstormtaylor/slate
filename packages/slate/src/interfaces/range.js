import logger from 'slate-dev-logger'

import mixin from '../utils/mixin'
import Decoration from '../models/decoration'
import PathUtils from '../utils/path-utils'
import Point from '../models/point'
import Range from '../models/range'
import Selection from '../models/selection'

/**
 * The interface that `Decoration`, `Range` and `Selection` all implement, to make
 * working anchor and focus points easier.
 *
 * @type {Class}
 */

class RangeInterface {
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
   * Set the anchor and focus points with `updater` callback
   *
   * @param {Function} updater
   * @return {Range}
   */

  updatePoints(updater) {
    let { anchor, focus } = this
    anchor = updater(anchor)
    focus = updater(focus)
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
    }

    return object
  }

  /**
   * Return a `Range` instance from any range-like instance.
   *
   * @return {Range}
   */

  toRange() {
    const properties = Range.createProperties(this)
    const range = Range.create(properties)
    return range
  }

  /**
   * Unset the range.
   *
   * @return {Range}
   */

  unset() {
    const range = this.updatePoints(p => p.unset())
    return range
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

  hasAnchorAtStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasAnchorAtStartOf` method is deprecated, please use `Range.anchor.isAtStartOfNode` instead.'
    )

    return this.anchor.isAtStartOfNode(node)
  }

  hasAnchorAtEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasAnchorAtEndOf` method is deprecated, please use `Range.anchor.isAtEndOfNode` instead.'
    )

    return this.anchor.isAtEndOfNode(node)
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

  hasAnchorIn(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasAnchorAtEndOf` method is deprecated, please use `Range.anchor.isInNode` instead.'
    )

    return this.anchor.isInNode(node)
  }

  hasEdgeAtStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEdgeAtStartOf` method is deprecated.'
    )

    return this.anchor.isAtStartOfNode(node) || this.focus.isAtStartOfNode(node)
  }

  hasEdgeAtEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEdgeAtEndOf` method is deprecated.'
    )

    return this.anchor.isAtEndOfNode(node) || this.focus.isAtEndOfNode(node)
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

  hasEdgeIn(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEdgeAtEndOf` method is deprecated.'
    )

    return this.anchor.isInNode(node) || this.focus.isInNode(node)
  }

  hasEndAtStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEndAtStartOf` method is deprecated, please use `Range.end.isAtStartOfNode` instead.'
    )

    return this.end.isAtStartOfNode(node)
  }

  hasEndAtEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEndAtEndOf` method is deprecated, please use `Range.end.isAtEndOfNode` instead.'
    )

    return this.end.isAtEndOfNode(node)
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

  hasEndIn(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasEndAtEndOf` method is deprecated, please use `Range.end.isInNode` instead.'
    )

    return this.end.isInNode(node)
  }

  hasFocusAtEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasFocusAtEndOf` method is deprecated, please use `Range.focus.isAtEndOfNode` instead.'
    )

    return this.focus.isAtEndOfNode(node)
  }

  hasFocusAtStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasFocusAtStartOf` method is deprecated, please use `Range.focus.isAtStartOfNode` instead.'
    )

    return this.focus.isAtStartOfNode(node)
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

  hasFocusIn(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasFocusAtEndOf` method is deprecated, please use `Range.focus.isInNode` instead.'
    )

    return this.focus.isInNode(node)
  }

  hasStartAtStartOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasStartAtStartOf` method is deprecated, please use `Range.start.isAtStartOfNode` instead.'
    )

    return this.start.isAtStartOfNode(node)
  }

  hasStartAtEndOf(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasStartAtEndOf` method is deprecated, please use `Range.start.isAtEndOfNode` instead.'
    )

    return this.start.isAtEndOfNode(node)
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

  hasStartIn(node) {
    logger.deprecate(
      '0.37.0',
      'The `Range.hasStartAtEndOf` method is deprecated, please use `Range.start.isInNode` instead.'
    )

    return this.start.isInNode(node)
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
  RangeInterface.prototype[alias] = function(...args) {
    logger.deprecate(
      '0.37.0',
      `The \`Range.${alias}\` method is deprecated, please use \`Range.${method}\` instead.`
    )

    return this[method](...args)
  }
})

/**
 * Mix in the range interface.
 *
 * @param {Record}
 */

mixin(RangeInterface, [Decoration, Range, Selection])
