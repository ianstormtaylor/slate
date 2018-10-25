import { List } from 'immutable'

/**
 * Compare paths `path` and `target` to see which is before or after.
 *
 * @param {List} path
 * @param {List} target
 * @return {Number|Null}
 */

function compare(path, target) {
  const m = min(path, target)

  for (let i = 0; i < m; i++) {
    const pv = path.get(i)
    const tv = target.get(i)

    // If the path's value is ever less than the target's, it's before.
    if (pv < tv) return -1

    // If the target's value is ever less than the path's, it's after.
    if (pv > tv) return 1
  }

  // Paths should now be equal, otherwise something is wrong
  return path.size === target.size ? 0 : null
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
 * Get all ancestor paths of th given path.
 *
 * @param {List} path
 * @returns {List}
 */

function getAncestors(path) {
  let ancestors = new List()

  for (let i = 0; i < path.size; i++) {
    ancestors = ancestors.push(path.slice(0, i))
  }

  return ancestors
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
 * Is a `path` older than a `target` path? Meaning that it ends as an older
 * sibling of one of the indexes in the target.
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isOlder(path, target) {
  const index = path.size - 1
  const [p, t] = crop(path, target, index)
  const pl = path.get(index)
  const tl = target.get(index)
  return isEqual(p, t) && pl > tl
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
 * Is a `path` younger than a `target` path? Meaning that it ends as a younger
 * sibling of one of the indexes in the target.
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isYounger(path, target) {
  const index = path.size - 1
  const [p, t] = crop(path, target, index)
  const pl = path.get(index)
  const tl = target.get(index)
  return isEqual(p, t) && pl < tl
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
 * Transform a `path` by an `operation`, adjusting it to stay current.
 *
 * @param {List} path
 * @param {Operation} operation
 * @return {List<List>}
 */

function transform(path, operation) {
  const { type, position, path: p } = operation

  if (
    type === 'add_mark' ||
    type === 'insert_text' ||
    type === 'remove_mark' ||
    type === 'remove_text' ||
    type === 'set_mark' ||
    type === 'set_node' ||
    type === 'set_selection' ||
    type === 'set_value' ||
    path.size === 0
  ) {
    return List([path])
  }

  const pIndex = p.size - 1
  const pEqual = isEqual(p, path)
  const pYounger = isYounger(p, path)
  const pAbove = isAbove(p, path)

  if (type === 'insert_node') {
    if (pEqual || pYounger || pAbove) {
      path = increment(path, 1, pIndex)
    }
  }

  if (type === 'remove_node') {
    if (pYounger) {
      path = decrement(path, 1, pIndex)
    } else if (pEqual || pAbove) {
      path = []
    }
  }

  if (type === 'merge_node') {
    if (pEqual || pYounger) {
      path = decrement(path, 1, pIndex)
    } else if (pAbove) {
      path = decrement(path, 1, pIndex)
      path = increment(path, position, pIndex + 1)
    }
  }

  if (type === 'split_node') {
    if (pEqual) {
      path = [path, increment(path)]
    } else if (pYounger) {
      path = increment(path, 1, pIndex)
    } else if (pAbove) {
      if (path.get(pIndex + 1) >= position) {
        path = increment(path, 1, pIndex)
        path = decrement(path, position, pIndex + 1)
      }
    }
  }

  if (type === 'move_node') {
    const { newPath: np } = operation
    const npIndex = np.size - 1
    const npEqual = isEqual(np, path)

    if (isEqual(p, np)) {
      return List([path])
    }

    const npYounger = isYounger(np, path)
    const npAbove = isAbove(np, path)

    if (pAbove) {
      path = np.concat(path.slice(p.size))
    } else {
      if (pEqual) {
        path = np
      } else if (pYounger) {
        path = decrement(path, 1, pIndex)
      }

      if (npEqual || npYounger || npAbove) {
        path = increment(path, 1, npIndex)
      }
    }
  }

  const paths = Array.isArray(path) ? path : [path]
  return List(paths)
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
  getAncestors,
  increment,
  isAbove,
  isAfter,
  isBefore,
  isEqual,
  isOlder,
  isSibling,
  isYounger,
  lift,
  max,
  min,
  relate,
  transform,
}
