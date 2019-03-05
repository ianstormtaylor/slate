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
}

/**
 * Mix in the range interface.
 *
 * @param {Record}
 */

mixin(RangeInterface, [Decoration, Range, Selection])
