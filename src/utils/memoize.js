
import { Map } from 'immutable'

/**
 * The leaf node of a cache tree.
 *
 * An object, so that immutable maps will key it by reference.
 *
 * @type {Object}
 */

const LEAF = {}

/**
 * An unique value used to detect cache misses
 *
 * @type {Object}
 */
const NO_SET = {}

/**
 * Memoize all of the `properties` on a `object`.
 *
 * @param {Object} object
 * @param {Array} properties
 * @return {Record}
 */

function memoize(object, properties) {
  for (const property of properties) {
    const original = object[property]

    if (!original) {
      throw new Error(`Object does not have a property named "${property}".`)
    }

    object[property] = function (...args) {
      const keys = [property, ...args, LEAF]
      const cache = this.__cache = this.__cache || new Map()

      const cachedValue = cache.getIn(keys, NO_SET)
      if (cachedValue !== NO_SET) {
        return cachedValue
      }

      const value = original.apply(this, args)
      this.__cache = cache.setIn(keys, value)
      return value
    }
  }
}

/**
 * Export.
 */

export default memoize
