import Debug from 'debug'
import isPlainObject from 'is-plain-object'
import warning from 'tiny-warning'
import { List } from 'immutable'

import Operation from '../models/operation'
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
    const { editor, value } = attrs
    this.editor = editor
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
   * @return {Change}
   */

  applyOperation(operation) {
    const { operations } = this
    let value = this.value

    // Add in the current `value` in case the operation was serialized.
    if (isPlainObject(operation)) {
      operation = { ...operation, value }
    }

    operation = Operation.create(operation)

    // Save the operation into the history. Since `save` is a command, we need
    // to do it without normalizing, since it would have side effects.
    this.withoutNormalizing(() => {
      this.save(operation)
      value = this.value
    })

    // Apply the operation to the value.
    debug('apply', { operation })
    value = operation.apply(value)

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
   * @return {Change}
   */

  applyOperations(operations) {
    operations.forEach(op => this.applyOperation(op))
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
   * Run a `command` with `args`.
   *
   * @param {String} command
   * @param {Any} ...args
   * @return {Change}
   */

  command(command, ...args) {
    const { editor } = this
    editor.command(command, ...args)
    return this
  }

  /**
   * Run a `query` with `args`.
   *
   * @param {String} query
   * @param {Any} ...args
   * @return {Change}
   */

  query(query, ...args) {
    const { editor } = this
    return editor.query(query, ...args)
  }

  /**
   * Normalize all of the nodes in the document from scratch.
   *
   * @return {Change}
   */

  normalize() {
    const { value } = this
    let { document } = value
    const table = document.getKeysToPathsTable()
    const paths = Object.values(table).map(PathUtils.create)
    this.tmp.dirty = this.tmp.dirty.concat(paths)
    this.normalizeDirtyPaths()

    const { selection } = value
    document = value.document

    if (selection.isUnset && document.nodes.size) {
      this.moveToStartOfDocument()
    }

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
   * Normalize the node at a specific `path`.
   *
   * @param {Array} path
   * @return {Change}
   */

  normalizeNodeByPath(path) {
    const { editor, value } = this
    let { document } = value
    let node = document.assertNode(path)
    let iterations = 0
    const max = 1000 + (node.object === 'text' ? 1 : node.nodes.size)

    const iterate = () => {
      const fn = node.normalize(editor)
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
      const ancestors = PathUtils.getAncestors(path).toArray()
      return [...ancestors, path]
    }

    case 'insert_node': {
      const table = node.getKeysToPathsTable()
      const paths = Object.values(table).map(p => path.concat(p))
      const ancestors = PathUtils.getAncestors(path).toArray()
      return [...ancestors, path, ...paths]
    }

    case 'split_node': {
      const ancestors = PathUtils.getAncestors(path).toArray()
      const nextPath = PathUtils.increment(path)
      return [...ancestors, path, nextPath]
    }

    case 'merge_node': {
      const ancestors = PathUtils.getAncestors(path).toArray()
      const previousPath = PathUtils.decrement(path)
      return [...ancestors, previousPath]
    }

    case 'move_node': {
      let parentPath = PathUtils.lift(path)
      let newParentPath = PathUtils.lift(newPath)

      if (PathUtils.isEqual(path, newPath)) {
        return []
      }

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

      const oldAncestors = PathUtils.getAncestors(parentPath).toArray()
      const newAncestors = PathUtils.getAncestors(newParentPath).toArray()

      return [...oldAncestors, parentPath, ...newAncestors, newParentPath]
    }

    case 'remove_node': {
      const ancestors = PathUtils.getAncestors(path).toArray()
      return [...ancestors]
    }

    default: {
      return []
    }
  }
}

/**
 * Export.
 *
 * @type {Change}
 */

export default Change
