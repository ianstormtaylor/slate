/* global WeakMap, Map, Symbol */

/**
 * GLOBAL: True if memoization should is enabled.
 *
 * @type {Boolean}
 */

let ENABLED = true

/**
 * The leaf node of a cache tree. Used to support variable argument length. A
 * unique object, so that native Maps will key it by reference.
 *
 * @type {Symbol}
 */

const LEAF = Symbol('LEAF')

/**
 * The node of a cache tree for a WeakMap to store cache visited by objects
 *
 * @type {Symbol}
 */

const STORE_KEY = Symbol('STORE_KEY')

/**
 * Values to represent a memoized undefined and null value. Allows efficient value
 * retrieval using Map.get only.
 *
 * @type {Symbol}
 */

const UNDEFINED = Symbol('undefined')
const NULL = Symbol('null')

/**
 * Default value for unset keys in native Maps
 *
 * @type {Undefined}
 */

const UNSET = undefined

/**
 * Global Store for all cached values
 *
 * @type {WeakMap}
 */

let memoizeStore = new WeakMap()

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

      if (!memoizeStore.has(this)) {
        memoizeStore.set(this, {
          noArgs: {},
          hasArgs: {},
        })
      }

      const { noArgs, hasArgs } = memoizeStore.get(this)

      const takesArguments = args.length !== 0

      let cachedValue
      let keys

      if (takesArguments) {
        keys = [property, ...args]
        cachedValue = getIn(hasArgs, keys)
      } else {
        cachedValue = noArgs[property]
      }

      // If we've got a result already, return it.
      if (cachedValue !== UNSET) {
        return cachedValue === UNDEFINED ? undefined : cachedValue
      }

      // Otherwise calculate what it should be once and cache it.
      const value = original.apply(this, args)
      const v = value === undefined ? UNDEFINED : value

      if (takesArguments) {
        setIn(hasArgs, keys, v)
      } else {
        noArgs[property] = v
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
  for (let key of keys) {
    if (key === undefined) {
      key = UNDEFINED
    } else if (key === null) {
      key = NULL
    }

    if (typeof key === 'object') {
      map = map[STORE_KEY] && map[STORE_KEY].get(key)
    } else {
      map = map[key]
    }

    if (map === UNSET) return UNSET
  }

  return map[LEAF]
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
  let child = map

  for (let key of keys) {
    if (key === undefined) {
      key = UNDEFINED
    } else if (key === null) {
      key = NULL
    }

    if (typeof key !== 'object') {
      if (!child[key]) {
        child[key] = {}
      }

      child = child[key]
      continue
    }

    if (!child[STORE_KEY]) {
      child[STORE_KEY] = new WeakMap()
    }

    if (!child[STORE_KEY].has(key)) {
      const newChild = {}
      child[STORE_KEY].set(key, newChild)
      child = newChild
      continue
    }

    child = child[STORE_KEY].get(key)
  }

  // The whole path has been created, so set the value to the bottom most map.
  child[LEAF] = value
  return map
}

/**
 * In DEV mode, clears the previously memoized values, globally.
 *
 * @return {Void}
 */

function resetMemoization() {
  memoizeStore = new WeakMap()
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
