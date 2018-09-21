import { List } from 'immutable'

/**
 * Compare paths `path` and `b` to see which is before or after.
 *
 * @param {List} path
 * @param {List} b
 * @return {Number|Null}
 */

function compare(path, target) {
  // PERF: if the paths are not the same size we can exit early.
  if (path.size !== target.size) return null

  for (let i = 0; i < path.size; i++) {
    const pv = path.get(i)
    const tv = target.get(i)

    // If the path's value is ever less than the target's, it's before.
    if (pv < tv) return -1

    // If the target's value is ever less than the path's, it's after.
    if (pv > tv) return 1
  }

  // Otherwise they were equal the whole way, it's the same.
  return 0
}

/**
 * Create a path from `attrs`.
 *
 * @param {Array|List} attrs
 * @return {List}
 */

function create(attrs) {
  if (attrs == null) {
    return null
  }

  if (List.isList(attrs)) {
    return attrs
  }

  if (Array.isArray(attrs)) {
    return List(attrs)
  }

  throw new Error(
    `Paths can only be created from arrays or lists, but you passed: ${attrs}`
  )
}

/**
 * Crop paths `a` and `b` to an equal size, defaulting to the shortest.
 *
 * @param {List} a
 * @param {List} b
 */

function crop(a, b, size = min(a, b)) {
  const ca = a.slice(0, size)
  const cb = b.slice(0, size)
  return [ca, cb]
}

/**
 * Decrement a `path` by `n` at `index`, defaulting to the last index.
 *
 * @param {List} path
 * @param {Number} n
 * @param {Number} index
 */

function decrement(path, n = 1, index = path.size - 1) {
  return increment(path, 0 - n, index)
}

/**
 * Increment a `path` by `n` at `index`, defaulting to the last index.
 *
 * @param {List} path
 * @param {Number} n
 * @param {Number} index
 */

function increment(path, n = 1, index = path.size - 1) {
  const value = path.get(index)
  const newValue = value + n
  const newPath = path.set(index, newValue)
  return newPath
}

/**
 * Is a `path` above another `target` path?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isAbove(path, target) {
  const [p, t] = crop(path, target)
  return path.size < target.size && compare(p, t) === 0
}

/**
 * Is a `path` after another `target` path in a document?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isAfter(path, target) {
  const [p, t] = crop(path, target)
  return compare(p, t) === 1
}

/**
 * Is a `path` before another `target` path in a document?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isBefore(path, target) {
  const [p, t] = crop(path, target)
  return compare(p, t) === -1
}

/**
 * Is a `path` equal to another `target` path in a document?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isEqual(path, target) {
  return path.equals(target)
}

/**
 * Is a `path` a sibling of a `target` path?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isSibling(path, target) {
  if (path.size !== target.size) return false
  const p = path.butLast()
  const t = target.butLast()
  return p.equals(t)
}

/**
 * Lift a `path` to refer to its parent.
 *
 * @param {List} path
 * @return {Array}
 */

function lift(path) {
  const parent = path.slice(0, -1)
  return parent
}

/**
 * Get the maximum length of paths `a` and `b`.
 *
 * @param {List} path
 * @param {List} path
 * @return {Number}
 */

function max(a, b) {
  const n = Math.max(a.size, b.size)
  return n
}

/**
 * Get the minimum length of paths `a` and `b`.
 *
 * @param {List} path
 * @param {List} path
 * @return {Number}
 */

function min(a, b) {
  const n = Math.min(a.size, b.size)
  return n
}

/**
 * Get the common ancestor path of path `a` and path `b`.
 *
 * @param {List} a
 * @param {List} b
 * @return {List}
 */

function relate(a, b) {
  const array = []

  for (let i = 0; i < a.size && i < b.size; i++) {
    const av = a.get(i)
    const bv = b.get(i)

    // If the values aren't equal, they've diverged and don't share an ancestor.
    if (av !== bv) break

    // Otherwise, the current value is still a common ancestor.
    array.push(av)
  }

  const path = create(array)
  return path
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  compare,
  create,
  crop,
  decrement,
  increment,
  isAbove,
  isAfter,
  isBefore,
  isEqual,
  isSibling,
  lift,
  max,
  min,
  relate,
}
