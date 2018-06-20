import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { Record } from 'immutable'

import MODEL_TYPES, { isType } from '../constants/model-types'

const DEFAULTS = {
  key: null,
  offset: 0,
}

class Point extends Record(DEFAULTS) {
  /**
   * Create a new `Range` with `attrs`.
   *
   * @param {Object|Range} attrs
   * @return {Range}
   */

  static create(attrs) {
    if (Point.isPoint(attrs)) return attrs

    if (isPlainObject(attrs)) {
      return Point.fromJSON(attrs)
    }

    throw new Error(
      `\`Point.create\` only accepts objects or points, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Point` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Range}
   */

  static fromJSON(attrs) {
    const { key = null, offset = 0 } = attrs
    return new Point({ key, offset })
  }

  /**
   * Alias for fromJSON
   */

  static fromJS = Point.fromJSON

  /**
   * Type Assertation
   */

  static isPoint = isType.bind(null, 'POINT')

  /**
   * Check whether the range's keys are set.
   *
   * @return {Boolean}
   */

  get isSet() {
    return this.key !== null && this.key !== undefined
  }

  /**
   * Check whether the point's key are not set.
   *
   * @return {Boolean}
   */

  get isUnset() {
    return !this.isSet
  }

  /**
   * Check whether the point is at the start of a `node`.
   *
   * @param {Node} node
   * @returns {Boolean}
   */

  isAtStartOf(node) {
    // PERF: Do a check for a `0` offset first since it's quickest.
    if (this.offset !== 0) return false
    const first = getFirst(node)
    return this.key == first.key
  }

  /**
   * Check whether the point is at the end of a `node`.
   *
   * @param {Node} node
   * @returns {Boolean}
   */

  isAtEndOf(node) {
    const last = getLast(node)
    const { key, offset } = this
    return key === last.key && offset === last.text.length
  }

  /**
   * Check whether the point is in a `node` and at an
   * offset between `start` and `end`.
   *
   * @param {Node} node
   * @param {Number} start
   * @param {Number} end
   * @returns {Boolean}
   */

  isBetween(node, start, end) {
    let { offset, key } = this

    if (node.object === 'text') {
      return node.key === key && start <= offset && end >= offset
    }

    if (!node.hasDescendant(key)) return false
    offset = offset + node.getOffset(key)
    return start <= offset && end >= offset
  }

  /**
   * Move the point offset `n` characters.
   *
   * @param {Number} n (optional)
   * @returns {Range}
   */

  move(n = 1) {
    const { offset } = this
    return this.set('offset', offset + n)
  }

  /**
   * Move the point to `offset`.
   *
   * @param {Number} anchorOffset
   * @return {Range}
   */

  moveOffsetTo(offset) {
    return this.set('offset', offset)
  }

  /**
   * Move the point to the start of a `node`.
   *
   * @param {Node} node
   * @returns {Range}
   */

  moveToStartOf(node) {
    const text = getFirst(node)
    return this.merge({ offset: 0, key: text.key })
  }

  /**
   * Move the point to the end of a `node`.
   *
   * @param {Node} node
   * @returns {Range}
   */

  moveToEndOf(node) {
    const text = getLast(node)
    return this.merge({ offset: text.text.length, key: text.key })
  }

  /**
   * Normalize the point, relative to a `node`, ensuring that the key
   * and offset referring to text in the node.
   *
   * @param {Node} node
   * @returns {Range}
   */

  normalize(node) {
    const { key, offset } = this

    if (!Number.isSafeInteger(offset)) {
      logger.warn(
        `The point offset should be safe integers, but the offset is ${offset}`
      )
    }

    let text

    if (node.object === 'text') {
      text = node
    } else {
      text = node.getDescendant(key)
      if (!text) text = node.getFirstText()
    }

    if (!text || text.key !== key) {
      logger.warn(
        'The point was invalid and was reset. The point in question was:',
        this
      )
      return this.moveToStartOf(text)
    }
    if (text.object !== 'text') {
      logger.warn(
        'The point was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:',
        text
      )

      // Use getPointByOffset in future
      const pointText = text.getTextAtOffset(offset)
      const nextOffset = offset - text.getOffset(pointText.key)
      return this.merge({ key: text.key, offset: nextOffset })
    }

    if (text.text.length < offset) return this.moveToEndOf(text)
    return this
  }
}

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

Point.prototype[MODEL_TYPES.POINT] = true

/**
 * Export.
 *
 * @type {Point}
 */

export default Point
