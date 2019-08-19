import Debug from 'debug'
import invariant from 'tiny-invariant'
import isPlainObject from 'is-plain-object'
import warning from 'tiny-warning'
import { List } from 'immutable'

import CommandsPlugin from '../plugins/commands'
import CorePlugin from '../plugins/core'
import Operation from '../models/operation'
import PathUtils from '../utils/path-utils'
import QueriesPlugin from '../plugins/queries'
import SchemaPlugin from '../plugins/schema'
import Value from '../models/value'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:editor')

/**
 * Editor.
 *
 * @type {Editor}
 */

class Editor {
  /**
   * Create a new `Editor` with `attrs`.
   *
   * @param {Object} attrs
   * @param {Object} options
   */

  constructor(attrs = {}, options = {}) {
    const { controller = this, construct = true } = options
    const {
      onChange = () => {},
      plugins = [],
      readOnly = false,
      value = Value.create(),
    } = attrs

    this.controller = controller
    this.middleware = {}
    this.onChange = onChange
    this.operations = List()
    this.readOnly = null
    this.value = null

    this.tmp = {
      dirty: [],
      flushing: false,
      merge: null,
      normalize: true,
      save: true,
    }

    const core = CorePlugin({ plugins })
    registerPlugin(this, core)

    if (construct) {
      this.run('onConstruct')
      this.setReadOnly(readOnly)
      this.setValue(value, options)
    }
  }

  /**
   * Apply an `operation` to the editor, updating its value.
   *
   * @param {Operation|Object} operation
   * @return {Editor}
   */

  applyOperation(operation) {
    const { operations, controller } = this
    let value = this.value

    // Add in the current `value` in case the operation was serialized.
    if (isPlainObject(operation)) {
      operation = { ...operation, value }
    }

    operation = Operation.create(operation)

    // Save the operation into the history. Since `save` is a command, we need
    // to do it without normalizing, since it would have side effects.
    this.withoutNormalizing(() => {
      controller.save(operation)
      value = this.value
    })

    // Apply the operation to the value.
    debug('apply', { operation })
    this.value = operation.apply(value)
    this.operations = operations.push(operation)

    // Get the paths of the affected nodes, and mark them as dirty.
    const newDirtyPaths = getDirtyPaths(operation)

    const dirty = this.tmp.dirty.map(path => {
      path = PathUtils.create(path)
      const transformed = PathUtils.transform(path, operation)
      return transformed.toArray()
    })

    const pathIndex = {}
    const dirtyPaths = Array.prototype.concat.apply(newDirtyPaths, dirty)
    this.tmp.dirty = []

    // PERF: De-dupe the paths so we don't do extra normalization.
    dirtyPaths.forEach(dirtyPath => {
      const key = dirtyPath.join(',')

      if (!pathIndex[key]) {
        this.tmp.dirty.push(dirtyPath)
      }

      pathIndex[key] = true
    })

    // If we're not already, queue the flushing process on the next tick.
    if (!this.tmp.flushing) {
      this.tmp.flushing = true
      Promise.resolve().then(() => this.flush())
    }

    return controller
  }

  /**
   * Flush the editor's current change.
   *
   * @return {Editor}
   */

  flush() {
    this.run('onChange')
    const { value, operations, controller } = this
    const change = { value, operations }
    this.operations = List()
    this.tmp.flushing = false
    this.onChange(change)
    return controller
  }

  /**
   * Trigger a command by `type` with `...args`.
   *
   * @param {String|Function} type
   * @param {Any} ...args
   * @return {Editor}
   */

  command(type, ...args) {
    const { controller } = this

    if (typeof type === 'function') {
      type(controller, ...args)
      normalizeDirtyPaths(this)
      return controller
    }

    debug('command', { type, args })
    const obj = { type, args }
    this.run('onCommand', obj)
    normalizeDirtyPaths(this)
    return controller
  }

  /**
   * Checks if a command by `type` has been registered.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasCommand(type) {
    const { controller } = this
    const has = type in controller && controller[type].__command

    return has
  }

  /**
   * Checks if a query by `type` has been registered.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasQuery(type) {
    const { controller } = this
    const has = type in controller && controller[type].__query

    return has
  }

  /**
   * Normalize all of the nodes in the document from scratch.
   *
   * @return {Editor}
   */

  normalize() {
    const { value, controller } = this
    let { document } = value
    const table = document.getKeysToPathsTable()
    const paths = Object.values(table).map(PathUtils.create)
    this.tmp.dirty = this.tmp.dirty.concat(paths)
    normalizeDirtyPaths(this)

    const { selection } = value
    document = value.document

    if (selection.isUnset && document.nodes.size) {
      controller.moveToStartOfDocument()
    }

    return controller
  }

  /**
   * Ask a query by `type` with `...args`.
   *
   * @param {String|Function} type
   * @param {Any} ...args
   * @return {Any}
   */

  query(type, ...args) {
    const { controller } = this

    if (typeof type === 'function') {
      return type(controller, ...args)
    }

    debug('query', { type, args })
    const obj = { type, args }
    return this.run('onQuery', obj)
  }

  /**
   * Register a command `type` with the editor.
   *
   * @param {String} type
   * @return {Editor}
   */

  registerCommand(type) {
    const { controller } = this

    if (type in controller && controller[type].__command) {
      return controller
    }

    invariant(
      !(type in controller),
      `You cannot register a \`${type}\` command because it would overwrite an existing property of the \`Editor\`.`
    )

    const method = (...args) => this.command(type, ...args)
    controller[type] = method
    method.__command = true
    return controller
  }

  /**
   * Register a query `type` with the editor.
   *
   * @param {String} type
   * @return {Editor}
   */

  registerQuery(type) {
    const { controller } = this

    if (type in controller && controller[type].__query) {
      return controller
    }

    invariant(
      !(type in controller),
      `You cannot register a \`${type}\` query because it would overwrite an existing property of the \`Editor\`.`
    )

    const method = (...args) => this.query(type, ...args)
    controller[type] = method
    method.__query = true
    return controller
  }

  /**
   * Run through the middleware stack by `key` with `args`.
   *
   * @param {String} key
   * @param {Any} ...args
   * @return {Any}
   */

  run(key, ...args) {
    const { controller, middleware } = this
    const fns = middleware[key] || []
    let i = 0

    function next(...overrides) {
      const fn = fns[i++]
      if (!fn) return

      if (overrides.length) {
        args = overrides
      }

      const ret = fn(...args, controller, next)
      return ret
    }

    Object.defineProperty(next, 'change', {
      get() {
        invariant(
          false,
          'As of Slate 0.42, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'onChange', {
      get() {
        invariant(
          false,
          'As of Slate 0.42, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'props', {
      get() {
        invariant(
          false,
          'As of Slate 0.42, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'schema', {
      get() {
        invariant(
          false,
          'As of Slate 0.42, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'stack', {
      get() {
        invariant(
          false,
          'As of Slate 0.42, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    return next()
  }

  /**
   * Set the `readOnly` flag.
   *
   * @param {Boolean} readOnly
   * @return {Editor}
   */

  setReadOnly(readOnly) {
    this.readOnly = readOnly
    return this
  }

  /**
   * Set the editor's `value`.
   *
   * @param {Value} value
   * @param {Options} options
   * @return {Editor}
   */

  setValue(value, options = {}) {
    const { normalize = value !== this.value } = options
    this.value = value

    if (normalize) {
      this.normalize()
    }

    return this
  }

  /**
   * Apply a series of changes inside a synchronous `fn`, deferring
   * normalization until after the function has finished executing.
   *
   * @param {Function} fn
   * @return {Editor}
   */

  withoutNormalizing(fn) {
    const { controller } = this
    const value = this.tmp.normalize
    this.tmp.normalize = false
    fn(controller)
    this.tmp.normalize = value
    normalizeDirtyPaths(this)
    return controller
  }

  /**
   * Deprecated.
   */

  get editor() {
    warning(
      false,
      "As of Slate 0.43 the `change` object has been replaced with `editor`, so you don't need to access `change.editor`."
    )

    return this.controller
  }

  change(fn, ...args) {
    warning(
      false,
      'As of Slate 0.43 the `change` object has been replaced with `editor`, so the `editor.change()` method is deprecated.`'
    )

    fn(this.controller, ...args)
  }

  call(fn, ...args) {
    warning(
      false,
      'As of Slate 0.43 the `editor.call(fn)` method has been deprecated, please use `editor.command(fn)` instead.'
    )

    fn(this.controller, ...args)
    return this.controller
  }

  applyOperations(operations) {
    warning(
      false,
      'As of Slate 0.43 the `applyOperations` method is deprecated, please apply each operation in a loop instead.'
    )

    operations.forEach(op => this.applyOperation(op))
    return this.controller
  }

  setOperationFlag(key, value) {
    warning(
      false,
      'As of slate@0.41 the `change.setOperationFlag` method has been deprecated.'
    )

    this.tmp[key] = value
    return this
  }

  getFlag(key, options = {}) {
    warning(
      false,
      'As of slate@0.41 the `change.getFlag` method has been deprecated.'
    )

    return options[key] !== undefined ? options[key] : this.tmp[key]
  }

  unsetOperationFlag(key) {
    warning(
      false,
      'As of slate@0.41 the `change.unsetOperationFlag` method has been deprecated.'
    )

    delete this.tmp[key]
    return this
  }

  withoutNormalization(fn) {
    warning(
      false,
      'As of slate@0.41 the `change.withoutNormalization` helper has been renamed to `change.withoutNormalizing`.'
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
      if (PathUtils.isEqual(path, newPath)) {
        return []
      }

      const oldAncestors = PathUtils.getAncestors(path).reduce((arr, p) => {
        arr.push(...PathUtils.transform(p, operation).toArray())
        return arr
      }, [])

      const newAncestors = PathUtils.getAncestors(newPath).reduce((arr, p) => {
        arr.push(...PathUtils.transform(p, operation).toArray())
        return arr
      }, [])

      return [...oldAncestors, ...newAncestors]
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
 * Normalize any new "dirty" paths that have been added to the change.
 *
 * @param {Editor}
 */

function normalizeDirtyPaths(editor) {
  if (!editor.tmp.normalize) {
    return
  }

  if (!editor.tmp.dirty.length) {
    return
  }

  editor.withoutNormalizing(() => {
    while (editor.tmp.dirty.length) {
      const path = editor.tmp.dirty.pop()
      normalizeNodeByPath(editor, path)
    }
  })
}

/**
 * Normalize the node at a specific `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 */

function normalizeNodeByPath(editor, path) {
  const { controller } = editor
  let { value } = editor
  let { document } = value
  let node = document.assertNode(path)
  let iterations = 0
  const max = 100 + (node.object === 'text' ? 1 : node.nodes.size)

  while (node) {
    const fn = node.normalize(controller)

    if (!fn) {
      break
    }

    // Run the normalize `fn` to fix the node.
    fn(controller)

    // Attempt to re-find the node by path, or by key if it has changed
    // locations in the tree continue iterating.
    value = editor.value
    document = value.document
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
        // If it no longer exists by key, it was removed, so we're done.
        break
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
  }
}

/**
 * Register a `plugin` with the editor.
 *
 * @param {Editor} editor
 * @param {Object|Array|Null} plugin
 */

function registerPlugin(editor, plugin) {
  if (Array.isArray(plugin)) {
    plugin.forEach(p => registerPlugin(editor, p))
    return
  }

  if (plugin == null) {
    return
  }

  const { commands, queries, schema, ...rest } = plugin

  if (commands) {
    const commandsPlugin = CommandsPlugin(commands)
    registerPlugin(editor, commandsPlugin)
  }

  if (queries) {
    const queriesPlugin = QueriesPlugin(queries)
    registerPlugin(editor, queriesPlugin)
  }

  if (schema) {
    const schemaPlugin = SchemaPlugin(schema)
    registerPlugin(editor, schemaPlugin)
  }

  for (const key in rest) {
    const fn = rest[key]
    const middleware = (editor.middleware[key] = editor.middleware[key] || [])
    middleware.push(fn)
  }
}

/**
 * Export.
 *
 * @type {Editor}
 */

export default Editor
