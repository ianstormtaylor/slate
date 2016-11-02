
import { Map } from 'immutable'

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
      const keys = [property, ...args]
      this.__cache = this.__cache || new Map()

      const cachedValue = this.__cache.getIn(keys, NO_SET)
      if (cachedValue !== NO_SET) {
        return cachedValue
      }

      const value = original.apply(this, args)
      // If `original` is recursive, it might have changed the cache,
      // so read it from this.__cache
      this.__cache = this.__cache.setIn(keys, value)
      return value
    }
  }
}

/**
 * Export.
 */

export default memoize
