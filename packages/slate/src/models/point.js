import isPlainObject from 'is-plain-object'
import warning from 'tiny-warning'
import { Record } from 'immutable'

import KeyUtils from '../utils/key-utils'
import PathUtils from '../utils/path-utils'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  key: undefined,
  offset: undefined,
  path: undefined,
}

/**
 * Point.
 *
 * @type {Point}
 */

class Point extends Record(DEFAULTS) {
  /**
   * Create a new `Point` with `attrs`.
   *
   * @param {Object|Point} attrs
   * @return {Point}
   */

  static create(attrs = {}) {
    if (Point.isPoint(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Point.fromJSON(attrs)
    }

    throw new Error(
      `\`Point.create\` only accepts objects or points, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a dictionary of settable point properties from `attrs`.
   *
   * @param {Object|Point} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Point.isPoint(a)) {
      return {
        key: a.key,
        offset: a.offset,
        path: a.path,
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('key' in a) p.key = a.key
      if ('offset' in a) p.offset = a.offset
      if ('path' in a) p.path = PathUtils.create(a.path)

      // If only a path is set, or only a key is set, ensure that the other is
      // set to null so that it can be normalized back to the right value.
      // Otherwise we won't realize that the path and key don't match anymore.
      if ('path' in a && !('key' in a)) p.key = null
      if ('key' in a && !('path' in a)) p.path = null

      return p
    }

    throw new Error(
      `\`Point.createProperties\` only accepts objects or points, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Point` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Point}
   */

  static fromJSON(object) {
    const { key = null, offset = null, path = null } = object

    const point = new Point({
      key,
      offset,
      path: PathUtils.create(path),
    })

    return point
  }

  /**
   * Check whether all properties of the point are set.
   *
   * @return {Boolean}
   */

  get isSet() {
    return this.key != null && this.offset != null && this.path != null
  }

  /**
   * Check whether any property of the point is not set.
   *
   * @return {Boolean}
   */

  get isUnset() {
    return !this.isSet
  }

  /**
   * Check whether the point is after another `point`.
   *
   * @return {Boolean}
   */

  isAfterPoint(point) {
    if (this.isUnset) return false
    const is =
      (this.key === point.key && this.offset > point.offset) ||
      PathUtils.compare(this.path, point.path) === 1
    return is
  }

  /**
   * Check whether the point is after a `range`.
   *
   * @return {Boolean}
   */

  isAfterRange(range) {
    if (this.isUnset) return false
    const is = this.isAfterPoint(range.end)
    return is
  }

  /**
   * Check whether the point is at the end of a `range`.
   *
   * @return {Boolean}
   */

  isAtEndOfRange(range) {
    if (this.isUnset) return false
    const is = this.equals(range.end)
    return is
  }

  /**
   * Check whether the point is at the start of a `range`.
   *
   * @return {Boolean}
   */

  isAtStartOfRange(range) {
    if (this.isUnset) return false
    const is = this.equals(range.start)
    return is
  }

  /**
   * Check whether the point is before another `point`.
   *
   * @return {Boolean}
   */

  isBeforePoint(point) {
    if (this.isUnset) return false
    const is =
      (this.key === point.key && this.offset < point.offset) ||
      PathUtils.compare(this.path, point.path) === -1
    return is
  }

  /**
   * Check whether the point is before a `range`.
   *
   * @return {Boolean}
   */

  isBeforeRange(range) {
    if (this.isUnset) return false
    const is = this.isBeforePoint(range.start)
    return is
  }

  /**
   * Check whether the point is inside a `range`.
   *
   * @return {Boolean}
   */

  isInRange(range) {
    if (this.isUnset) return false
    const is =
      this.equals(range.start) ||
      this.equals(range.end) ||
      (this.isAfterPoint(range.start) && this.isBeforePoint(range.end))
    return is
  }

  /**
   * Check whether the point is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtEndOfNode(node) {
    if (this.isUnset) return false
    const last = node.getLastText()
    const is = this.key === last.key && this.offset === last.text.length
    return is
  }

  /**
   * Check whether the point is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtStartOfNode(node) {
    if (this.isUnset) return false

    // PERF: Do a check for a `0` offset first since it's quickest.
    if (this.offset != 0) return false

    const first = node.getFirstText()
    const is = this.key === first.key
    return is
  }

  /**
   * Check whether the point is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isInNode(node) {
    if (this.isUnset) return false
    if (node.object === 'text' && node.key === this.key) return true
    if (node.hasNode(this.key)) return true
    return false
  }

  /**
   * Move the point's offset backward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Point}
   */

  moveBackward(n = 1) {
    if (n === 0) return this
    if (n < 0) return this.moveForward(-n)
    const point = this.setOffset(this.offset - n)
    return point
  }

  /**
   * Move the point's offset forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Point}
   */

  moveForward(n = 1) {
    if (n === 0) return this
    if (n < 0) return this.moveBackward(-n)
    const point = this.setOffset(this.offset + n)
    return point
  }

  /**
   * Move the point's anchor point to a new `path` and `offset`.
   *
   * Optionally, the `path` can be a key string, or omitted entirely in which
   * case it would be the offset number.
   *
   * @param {List|String|Number} path
   * @param {Number} offset
   * @return {Point}
   */

  moveTo(path, offset = 0) {
    let key = this.key

    if (typeof path === 'number') {
      offset = path
      path = this.path
    } else if (typeof path === 'string') {
      key = path
      path = key === this.key ? this.path : null
    } else {
      key = path.equals(this.path) ? this.key : null
    }

    const point = this.merge({ key, path, offset })
    return point
  }

  /**
   * Move the point's anchor point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Point}
   */

  moveToStartOfNode(node) {
    const first = node.getFirstText()
    const point = this.moveTo(first.key, 0)
    return point
  }

  /**
   * Move the point's anchor point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Point}
   */

  moveToEndOfNode(node) {
    const last = node.getLastText()
    const point = this.moveTo(last.key, last.text.length)
    return point
  }

  /**
   * Normalize the point relative to a `node`, ensuring that its key and path
   * reference a text node, or that it gets unset.
   *
   * @param {Node} node
   * @return {Point}
   */

  normalize(node) {
    // If both the key and path are null, there's no reference to a node, so
    // make sure it is entirely unset.
    if (this.key == null && this.path == null) {
      return this.setOffset(null)
    }

    const { key, offset, path } = this
    const target = node.getNode(key || path)

    if (!target) {
      warning(false, "A point's `path` or `key` invalid and was reset!")

      const text = node.getFirstText()
      if (!text) return Point.create()

      const point = this.merge({
        key: text.key,
        offset: 0,
        path: node.getPath(text.key),
      })

      return point
    }

    if (target.object !== 'text') {
      warning(false, 'A point should not reference a non-text node!')

      const text = target.getTextAtOffset(offset)
      const before = target.getOffset(text.key)
      const point = this.merge({
        offset: offset - before,
        key: text.key,
        path: node.getPath(text.key),
      })

      return point
    }

    if (target && path && key && key !== target.key) {
      warning(false, "A point's `key` did not match its `path`!")
    }

    const point = this.merge({
      key: target.key,
      path: path == null ? node.getPath(target.key) : path,
      offset: offset == null ? 0 : Math.min(offset, target.text.length),
    })

    return point
  }

  /**
   * Set the point's key to a new `key`.
   *
   * @param {String} key
   * @return {Point}
   */

  setKey(key) {
    if (key !== null) {
      key = KeyUtils.create(key)
    }

    const point = this.set('key', key)
    return point
  }

  /**
   * Set the point's offset to a new `offset`.
   *
   * @param {Number} offset
   * @return {Point}
   */

  setOffset(offset) {
    const point = this.set('offset', offset)
    return point
  }

  /**
   * Set the point's path to a new `path`.
   *
   * @param {List|Array} path
   * @return {Point}
   */

  setPath(path) {
    if (path !== null) {
      path = PathUtils.create(path)
    }

    const point = this.set('path', path)
    return point
  }

  /**
   * Return a JSON representation of the point.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      key: this.key,
      offset: this.offset,
      path: this.path && this.path.toArray(),
    }

    if (!options.preserveKeys) {
      delete object.key
    }

    return object
  }

  /**
   * Unset the point.
   *
   * @return {Point}
   */

  unset() {
    return this.merge({
      key: null,
      offset: null,
      path: null,
    })
  }
}

/**
 * Export.
 *
 * @type {Point}
 */

export default Point
