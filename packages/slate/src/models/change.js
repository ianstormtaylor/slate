import Debug from 'debug'
import isPlainObject from 'is-plain-object'
import warning from 'slate-dev-warning'
import { List } from 'immutable'

import Changes from '../changes'
import Operation from './operation'
import PathUtils from '../utils/path-utils'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:change')

/**
 * Change.
 *
 * @type {Change}
 */

class Change {
  /**
   * Create a new `Change` with `attrs`.
   *
   * @param {Object} attrs
   *   @property {Value} value
   */

  constructor(attrs) {
    const { value } = attrs
    this.value = value
    this.operations = new List()

    this.tmp = {
      dirty: [],
      merge: null,
      normalize: true,
      save: true,
    }
  }

  /**
   * Apply an `operation` to the current value, saving the operation to the
   * history if needed.
   *
   * @param {Operation|Object} operation
   * @param {Object} options
   * @return {Change}
   */

  applyOperation(operation, options = {}) {
    const { operations } = this
    let { value } = this
    let { history } = value

    // Add in the current `value` in case the operation was serialized.
    if (isPlainObject(operation)) {
      operation = { ...operation, value }
    }

    operation = Operation.create(operation)

    // Default options to the change-level flags, this allows for setting
    // specific options for all of the operations of a given change.
    let { merge, save } = { ...this.tmp, ...options }

    // If `merge` is non-commital, and this is not the first operation in a new change
    // then we should merge.
    if (merge == null && operations.size !== 0) {
      merge = true
    }

    // Apply the operation to the value.
    debug('apply', { operation, save, merge })
    value = operation.apply(value)

    // If needed, save the operation to the history.
    if (history && save) {
      history = history.save(operation, { merge })
      value = value.set('history', history)
    }

    // Get the paths of the affected nodes, and mark them as dirty.
    const newDirtyPaths = getDirtyPaths(operation)
    const dirty = this.tmp.dirty.reduce((memo, path) => {
      path = PathUtils.create(path)
      const transformed = PathUtils.transform(path, operation)
      memo = memo.concat(transformed.toArray())
      return memo
    }, newDirtyPaths)

    this.tmp.dirty = dirty

    // Update the mutable change object.
    this.value = value
    this.operations = operations.push(operation)
    return this
  }

  /**
   * Apply a series of `operations` to the current value.
   *
   * @param {Array|List} operations
   * @param {Object} options
   * @return {Change}
   */

  applyOperations(operations, options) {
    operations.forEach(op => this.applyOperation(op, options))
    return this
  }

  /**
   * Call a change `fn` with arguments.
   *
   * @param {Function} fn
   * @param {Mixed} ...args
   * @return {Change}
   */

  call(fn, ...args) {
    fn(this, ...args)
    this.normalizeDirtyPaths()
    return this
  }

  /**
   * Normalize all of the nodes in the document from scratch.
   *
   * @return {Change}
   */

  normalize() {
    const { value } = this
    const { document } = value
    const table = document.getKeysToPathsTable()
    const paths = Object.values(table).map(PathUtils.create)
    this.tmp.dirty = this.tmp.dirty.concat(paths)
    this.normalizeDirtyPaths()
    return this
  }

  /**
   * Normalize any new "dirty" paths that have been added to the change.
   *
   * @return {Change}
   */

  normalizeDirtyPaths() {
    if (!this.tmp.normalize) {
      return this
    }

    while (this.tmp.dirty.length) {
      const path = this.tmp.dirty.pop()
      this.normalizeNodeByPath(path)
    }

    return this
  }

  /**
   * Normalize the node at a specific `path`, iterating as many times as
   * necessary until it satisfies all of the schema rules.
   *
   * @param {Array} path
   * @return {Change}
   */

  normalizeNodeByPath(path) {
    const { value } = this
    let { document, schema } = value
    let node = document.assertNode(path)

    let iterations = 0
    const max =
      schema.stack.plugins.length +
      schema.rules.length +
      (node.object === 'text' ? 1 : node.nodes.size)

    const iterate = () => {
      const fn = node.normalize(schema)
      if (!fn) return

      // Run the normalize `fn` to fix the node.
      fn(this)

      // Attempt to re-find the node by path, or by key if it has changed
      // locations in the tree continue iterating.
      document = this.value.document
      const { key } = node
      let found = document.getDescendant(path)

      if (found && found.key === key) {
        node = found
      } else {
        found = document.getDescendant(key)

        if (found) {
          node = found
          path = document.getPath(key)
        } else {
          // If it no longer exists by key, it was removed, so abort.
          return
        }
      }

      // Increment the iterations counter, and check to make sure that we haven't
      // exceeded the max. Without this check, it's easy for the `normalize`
      // function of a schema rule to be written incorrectly and for an infinite
      // invalid loop to occur.
      iterations++

      if (iterations > max) {
        throw new Error(
          'A schema rule could not be normalized after sufficient iterations. This is usually due to a `rule.normalize` or `plugin.normalizeNode` function of a schema being incorrectly written, causing an infinite loop.'
        )
      }

      // Otherwise, iterate again.
      iterate()
    }

    this.withoutNormalizing(() => {
      iterate()
    })

    return this
  }

  /**
   * Apply a series of changes inside a synchronous `fn`, deferring
   * normalization until after the function has finished executing.
   *
   * @param {Function} fn
   * @return {Change}
   */

  withoutNormalizing(fn) {
    const value = this.tmp.normalize
    this.tmp.normalize = false
    fn(this)
    this.tmp.normalize = value
    this.normalizeDirtyPaths()
    return this
  }

  /**
   * Apply a series of changes inside a synchronous `fn`, without merging any of
   * the new operations into previous save point in the history.
   *
   * @param {Function} fn
   * @return {Change}
   */

  withoutMerging(fn) {
    const value = this.tmp.merge
    this.tmp.merge = false
    fn(this)
    this.tmp.merge = value
    return this
  }

  /**
   * Apply a series of changes inside a synchronous `fn`, without saving any of
   * their operations into the history.
   *
   * @param {Function} fn
   * @return {Change}
   */

  withoutSaving(fn) {
    const value = this.tmp.save
    this.tmp.save = false
    fn(this)
    this.tmp.save = value
    return this
  }

  /**
   * Set an operation flag by `key` to `value`.
   *
   * @param {String} key
   * @param {Any} value
   * @return {Change}
   */

  /**
   * Deprecated.
   */

  setOperationFlag(key, value) {
    warning(
      false,
      'As of slate@0.41.0 the `change.setOperationFlag` method has been deprecated.'
    )

    this.tmp[key] = value
    return this
  }

  getFlag(key, options = {}) {
    warning(
      false,
      'As of slate@0.41.0 the `change.getFlag` method has been deprecated.'
    )

    return options[key] !== undefined ? options[key] : this.tmp[key]
  }

  unsetOperationFlag(key) {
    warning(
      false,
      'As of slate@0.41.0 the `change.unsetOperationFlag` method has been deprecated.'
    )

    delete this.tmp[key]
    return this
  }

  withoutNormalization(fn) {
    warning(
      false,
      'As of slate@0.41.0 the `change.withoutNormalization` helper has been renamed to `change.withoutNormalizing`.'
    )

    return this.withoutNormalizing(fn)
  }
}

/**
 * Get the "dirty" paths for a given `operation`.
 *
 * @param {Operation} operation
 * @return {Array}
 */

function getDirtyPaths(operation) {
  const { type, node, path, newPath } = operation

  switch (type) {
    case 'add_mark':
    case 'insert_text':
    case 'remove_mark':
    case 'remove_text':
    case 'set_mark':
    case 'set_node': {
      return [path]
    }

    case 'insert_node': {
      const table = node.getKeysToPathsTable()
      const paths = Object.values(table).map(p => path.concat(p))
      const parentPath = PathUtils.lift(path)
      return [parentPath, path, ...paths]
    }

    case 'split_node': {
      const parentPath = PathUtils.lift(path)
      const nextPath = PathUtils.increment(path)
      return [parentPath, path, nextPath]
    }

    case 'merge_node': {
      const parentPath = PathUtils.lift(path)
      const previousPath = PathUtils.decrement(path)
      return [parentPath, previousPath]
    }

    case 'move_node': {
      let parentPath = PathUtils.lift(path)
      let newParentPath = PathUtils.lift(newPath)

      // HACK: this clause only exists because the `move_path` logic isn't
      // consistent when it deals with siblings.
      if (!PathUtils.isSibling(path, newPath)) {
        if (newParentPath.size && PathUtils.isYounger(path, newPath)) {
          newParentPath = PathUtils.decrement(newParentPath, 1, path.size - 1)
        }

        if (parentPath.size && PathUtils.isYounger(newPath, path)) {
          parentPath = PathUtils.increment(parentPath, 1, newPath.size - 1)
        }
      }

      return [parentPath, newParentPath]
    }

    case 'remove_node': {
      const parentPath = PathUtils.lift(path)
      return [parentPath]
    }

    default: {
      return []
    }
  }
}

/**
 * Add a change method for each of the changes.
 */

Object.keys(Changes).forEach(type => {
  Change.prototype[type] = function(...args) {
    debug(type, { args })
    this.call(Changes[type], ...args)
    return this
  }
})

/**
 * Export.
 *
 * @type {Change}
 */

export default Change
