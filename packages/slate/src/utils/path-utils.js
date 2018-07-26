import { List } from 'immutable'

/**
 * Compare paths `a` and `b` to see which is before or after.
 *
 * @param {List} a
 * @param {List} b
 * @return {Number|Null}
 */

function compare(a, b) {
  a = a.toArray()
  b = b.toArray()

  if (a.length !== b.length) return null

  for (let i = 0; i < a.length; i++) {
    const av = a[i]
    const bv = b[i]

    // If a's value is ever less than b's, it's before.
    if (av < bv) return -1

    // If b's value is ever less than a's, it's after.
    if (av > bv) return 1
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
 * Decrement a `path` by `n` at `index`, defaulting to the last index.
 *
 * @param {List} path
 * @param {Number} n
 * @param {Number} index
 */

function decrement(path, n = 1, index = path.size - 1) {
  return increment(path, 0 - n, index)
}

function crop(a, b, size = min(a, b)) {
  const ca = a.slice(0, size)
  const cb = b.slice(0, size)
  return [ca, cb]
}

/**
 * Get the parent path of a `path`.
 *
 * @param {List} path
 * @return {Array}
 */

function getParent(path) {
  const parentPath = path.slice(0, -1)
  return parentPath
}

/**
 * Get the index of a node by `path` in its parent.
 *
 * @param {List} path
 * @return {Number}
 */

function getIndex(path) {
  const last = path.last()
  return last
}

/**
 * Get the common ancestor path of path `a` and path `b`.
 *
 * @param {List} a
 * @param {List} b
 * @return {List}
 */

function getCommonAncestor(a, b) {
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
  return (
    path.size < target.size && compare(path, target.slice(0, path.size)) === 0
  )
}

/**
 * Is a `path` after another `target` path in a document?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isAfter(path, target) {
  const size = min(path, target)
  const p = path.slice(0, size)
  const t = target.slice(0, size)
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
  const size = min(path, target)
  const p = path.slice(0, size)
  const t = target.slice(0, size)
  return compare(p, t) === -1
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
 * Export.
 *
 * @type {Object}
 */

export default {
  compare,
  create,
  crop,
  decrement,
  getCommonAncestor,
  getIndex,
  getParent,
  increment,
  isAbove,
  isAfter,
  isBefore,
  min,
}
