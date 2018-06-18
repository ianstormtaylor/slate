import isPlainObject from 'is-plain-object'
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

  static fromJS = Point.fromJSON

  static isPoint = isType.bind(null, 'POINT')

  /**
   * Check whether the range's keys are set.
   *
   * @return {Boolean}
   */

  get isSet() {
    return this.key != null
  }

  /**
   * Check whether the point's key are not set.
   *
   * @return {Boolean}
   */

  get isUnset() {
    return !this.isSet
  }
}

Point.prototype[MODEL_TYPES.POINT] = true
export default Point
