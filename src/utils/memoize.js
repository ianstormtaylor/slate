
import Map from 'es6-map'
import IS_DEV from '../constants/is-dev'

/**
 * GLOBAL: True if memoization should is enabled. Only effective in DEV mode.
 *
 * @type {Boolean}
 */

let ENABLED = true

/**
 * GLOBAL: Changing this cache key will clear all previous cached results.
 * Only effective in DEV mode.
 *
 * @type {Number}
 */

let CACHE_KEY = 0

/**
 * The leaf node of a cache tree. Used to support variable argument length.
 *
 * A unique object, so that native Maps will key it by reference.
 *
 * @type {Object}
 */

const LEAF = {}

/**
 * A value to represent a memoized undefined value. Allows efficient
 * value retrieval using Map.get only.
 *
 * @type {Object}
 */

const UNDEFINED = {}

/**
 * Default value for unset keys in native Maps
 *
 * @type {Undefined}
 */

const UNSET = undefined

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
      if (IS_DEV) {
        if (!ENABLED) {
          // Memoization disabled
          return original.apply(this, args)
        } else if (CACHE_KEY !== this.__cache_key) {
          // Previous caches must be cleared
          this.__cache_key = CACHE_KEY
          this.__cache = new Map()
        }
      }

      const keys = [property, ...args]
      this.__cache = this.__cache || new Map()

      const cachedValue = getIn(this.__cache, keys)
      if (cachedValue !== UNSET) {
        return cachedValue === UNDEFINED ? undefined : cachedValue
      }

      const value = original.apply(this, args)
      this.__cache = setIn(this.__cache, keys, value)
      return value
    }
  }
}

/**
 * Set a value at a key path in a tree of Map, creating Maps on the go.
 *
 * @param {Map} map
 * @param {Array} keys
 * @param {Any} value
 * @return {Map}
 */

function setIn(map, keys, value) {
  value = value === undefined ? UNDEFINED : value

  let parentMap = map
  let childMap
  for (const key of keys) {
    childMap = parentMap.get(key)

    // If the path was not created yet...
    if (childMap === UNSET) {
      childMap = new Map()
      parentMap.set(key, childMap)
    }

    parentMap = childMap
  }

  // The whole path has been created, so set the value to the bottom most map.
  childMap.set(LEAF, value)

  return map
}

/**
 * Get a value at a key path in a tree of Map.
 *
 * If not set, returns UNSET.
 * If the set value is undefined, returns UNDEFINED.
 *
 * @param {Map} map
 * @param {Array} keys
 * @return {Any|UNSET|UNDEFINED}
 */

function getIn(map, keys) {
  let childMap
  for (const key of keys) {
    childMap = map.get(key)

    if (childMap === UNSET) {
      return UNSET
    }

    map = childMap
  }

  return childMap.get(LEAF)
}

/**
 * In DEV mode, clears the previously memoized values, globally.
 *
 * @return {Void}
 */

function __clear() {
  CACHE_KEY++
  if (CACHE_KEY >= Number.MAX_SAFE_INTEGER) {
    CACHE_KEY = 0
  }
}

/**
 * In DEV mode, enable or disable the use of memoize values, globally.
 *
 * @param {Boolean} enabled
 * @return {Void}
 */

function __enable(enabled) {
  ENABLED = enabled
}

/**
 * Export.
 *
 * @type {Object}
 */

export {
  memoize as default,
  __clear,
  __enable
}
