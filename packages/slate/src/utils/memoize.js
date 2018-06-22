/**
 * GLOBAL: True if memoization should is enabled.
 *
 * @type {Boolean}
 */

let ENABLED = true

/**
 * GLOBAL: Changing this cache key will clear all previous cached results.
 *
 * @type {Number}
 */

let CACHE_KEY = 0

/**
 * The leaf node of a cache tree. Used to support variable argument length. A
 * unique object, so that native Maps will key it by reference.
 *
 * @type {Object}
 */

const LEAF = {}

/**
 * A value to represent a memoized undefined value. Allows efficient value
 * retrieval using Map.get only.
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

    object[property] = function(...args) {
      // If memoization is disabled, call into the original method.
      if (!ENABLED) return original.apply(this, args)

      // If the cache key is different, previous caches must be cleared.
      if (CACHE_KEY !== this.__cache_key) {
        this.__cache_key = CACHE_KEY
        this.__cache = new Map() // eslint-disable-line no-undef,no-restricted-globals
        this.__cache_no_args = {}
      }

      if (!this.__cache) {
        this.__cache = new Map() // eslint-disable-line no-undef,no-restricted-globals
      }

      if (!this.__cache_no_args) {
        this.__cache_no_args = {}
      }

      const takesArguments = args.length !== 0

      let cachedValue
      let keys

      if (takesArguments) {
        keys = [property, ...args]
        cachedValue = getIn(this.__cache, keys)
      } else {
        cachedValue = this.__cache_no_args[property]
      }

      // If we've got a result already, return it.
      if (cachedValue !== UNSET) {
        return cachedValue === UNDEFINED ? undefined : cachedValue
      }

      // Otherwise calculate what it should be once and cache it.
      const value = original.apply(this, args)
      const v = value === undefined ? UNDEFINED : value

      if (takesArguments) {
        this.__cache = setIn(this.__cache, keys, v)
      } else {
        this.__cache_no_args[property] = v
      }

      return value
    }
  }
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
  for (const key of keys) {
    map = map.get(key)
    if (map === UNSET) return UNSET
  }

  return map.get(LEAF)
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
  let parent = map
  let child

  for (const key of keys) {
    child = parent.get(key)

    // If the path was not created yet...
    if (child === UNSET) {
      child = new Map() // eslint-disable-line no-undef,no-restricted-globals
      parent.set(key, child)
    }

    parent = child
  }

  // The whole path has been created, so set the value to the bottom most map.
  child.set(LEAF, value)
  return map
}

/**
 * In DEV mode, clears the previously memoized values, globally.
 *
 * @return {Void}
 */

function resetMemoization() {
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

function useMemoization(enabled) {
  ENABLED = enabled
}

/**
 * Export.
 *
 * @type {Object}
 */

export default memoize
export { resetMemoization, useMemoization }
