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
    const oldValue = value

    // Add in the current `value` in case the operation was serialized.
    if (isPlainObject(operation)) {
      operation = { ...operation, value }
    }

    operation = Operation.create(operation)

    // Default options to the change-level flags, this allows for setting
    // specific options for all of the operations of a given change.
    let { merge, save } = this.tmp

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

    // Get the keys of the affected nodes, and mark them as dirty.
    const keys = getDirtyKeys(operation, value, oldValue)
    this.tmp.dirty = this.tmp.dirty.concat(keys)

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
    this.normalizeDirtyOperations()
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
    const keys = Object.keys(document.getKeysToPathsTable())
    this.normalizeKeys(keys)
    return this
  }

  /**
   * Normalize any new "dirty" operations that have been added to the change.
   *
   * @return {Change}
   */

  normalizeDirtyOperations() {
    const { normalize, dirty } = this.tmp
    if (!normalize) return this
    if (!dirty.length) return this
    this.tmp.dirty = []
    this.normalizeKeys(dirty)
    return this
  }

  /**
   * Normalize a set of nodes by their `keys`.
   *
   * @param {Array} keys
   * @return {Change}
   */

  normalizeKeys(keys) {
    const { value } = this
    const { document } = value

    const keysToVisit = {}
    keys.forEach(key => (keysToVisit[key] = true))
    const pathsToVisit = []

    document.visitNodesReverseDFS((node, path) => {
      // If this key is included, also visit the parents.
      if (keysToVisit[node.key]) {
        document.getNodesInPath(path).forEach(n => (keysToVisit[n.key] = true))

        pathsToVisit.push(path)
      }
    })

    this.withoutNormalizing(() => {
      pathsToVisit.forEach(path => this.normalizePath(path))
    })

    return this
  }

  /**
   * Normalize the node at a specific `path`, iterating as many times as
   * necessary until it satisfies all of the schema rules.
   *
   * @param {Array} path
   * @return {Change}
   */

  normalizePath(path) {
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

    iterate()
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

    if (this.tmp.normalize) {
      this.normalizeDirtyOperations()
    }

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
 * Get the "dirty" nodes's keys for a given `operation` and values.
 *
 * @param {Operation} operation
 * @param {Value} newValue
 * @param {Value} oldValue
 * @return {Array}
 */

function getDirtyKeys(operation, newValue, oldValue) {
  const { type, node, path, newPath } = operation
  const newDocument = newValue.document
  const oldDocument = oldValue.document

  switch (type) {
    case 'add_mark':
    case 'insert_text':
    case 'remove_mark':
    case 'remove_text':
    case 'set_mark':
    case 'set_node': {
      const target = newDocument.assertNode(path)
      const keys = [target.key]
      return keys
    }

    case 'insert_node': {
      const table = node.getKeysToPathsTable()
      const keys = Object.keys(table)
      return keys
    }

    case 'split_node': {
      const nextPath = PathUtils.increment(path)
      const target = newDocument.assertNode(path)
      const split = newDocument.assertNode(nextPath)
      const keys = [target.key, split.key]
      return keys
    }

    case 'merge_node': {
      const previousPath = PathUtils.decrement(path)
      const merged = newDocument.assertNode(previousPath)
      const keys = [merged.key]
      return keys
    }

    case 'move_node': {
      const parentPath = PathUtils.lift(path)
      const newParentPath = PathUtils.lift(newPath)
      const oldParent = oldDocument.assertNode(parentPath)
      const newParent = oldDocument.assertNode(newParentPath)
      const keys = [oldParent.key, newParent.key]
      return keys
    }

    case 'remove_node': {
      const parentPath = PathUtils.lift(path)
      const parent = newDocument.assertNode(parentPath)
      const keys = [parent.key]
      return keys
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
