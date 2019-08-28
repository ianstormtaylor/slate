import Debug from 'debug'
import invariant from 'tiny-invariant'
import isPlainObject from 'is-plain-object'
import warning from 'tiny-warning'
import { List } from 'immutable'

import CorePlugin from '../plugins/core'
import Operation from '../models/operation'
import PathUtils from '../utils/path-utils'
import SchemaPlugin from '../plugins/schema'
import Value from '../models/value'

let refIds = 0

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
    this.onChange = onChange
    this.operations = List()
    this.readOnly = null
    this.value = null
    this.handlers = {}

    this.tmp = {
      dirty: [],
      pathRefs: [],
      pointRefs: [],
      flushing: false,
      merge: null,
      normalize: true,
      save: true,
    }

    const core = CorePlugin({ plugins })
    registerPlugin(this, controller, core)

    if (construct) {
      this.exec('onConstruct')
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

    // Iterate all of the path refs to update them. If the operation results in
    // the path being destroyed, unref them since they'll never change.
    for (const id in this.tmp.pathRefs) {
      const ref = this.tmp.pathRefs[id]
      const path = PathUtils.transform(ref.path, operation).last()

      if (!path) {
        ref.path = null
        ref.unref()
      } else {
        ref.path = path
      }
    }

    // Do the same with any point refs.
    for (const id in this.tmp.pointRefs) {
      const ref = this.tmp.pointRefs[id]
      const point = ref.point.transform(operation)

      if (!point) {
        ref.point = null
        ref.unref()
      } else {
        ref.point = point.normalize(this.value.document)
      }
    }

    // If we're not already, queue the flushing process on the next tick.
    if (!this.tmp.flushing) {
      this.tmp.flushing = true
      Promise.resolve().then(() => this.flush())
    }
  }

  createPathRef(path) {
    const id = refIds++
    const ref = {
      path,
      unref: () => delete this.tmp.pathRefs[id],
    }

    if (path) {
      this.tmp.pathRefs[id] = ref
    }

    return ref
  }

  createPointRef(point) {
    const id = refIds++
    const ref = {
      point,
      unref: () => delete this.tmp.pointRefs[id],
    }

    if (point) {
      this.tmp.pointRefs[id] = ref
    }

    return ref
  }

  /**
   * Exec a handler of the editor by `name` with `...args`.
   *
   * @param {String} name
   * @param {Any} ...args
   * @return {Any}
   */

  exec(name, ...args) {
    invariant(
      typeof name === 'string',
      'As of slate@0.48 the `editor.exec` method must take a name string, not a function.'
    )

    invariant(this.has(name), `No editor middleware found named "${name}"!`)

    const fn = this.handlers[name]
    const ret = fn(...args)
    normalizeDirtyPaths(this)
    return ret
  }

  /**
   * Flush the editor's current change.
   *
   * @return {Editor}
   */

  flush() {
    this.exec('onChange')
    const { value, operations } = this
    const change = { value, operations }
    this.operations = List()
    this.tmp.flushing = false
    this.onChange(change)
  }

  /**
   * Check if the editor has a handler by `name`.
   *
   * @param {String} name
   * @return {Boolean}
   */

  has(name) {
    return name in this.handlers
  }

  /**
   * Normalize all of the nodes in the document from scratch.
   *
   * @return {Editor}
   */

  normalize() {
    const { value } = this
    let { document } = value
    const paths = Array.from(
      document.descendants({ includeTarget: true, includeRoot: true }),
      ([, path]) => path
    )

    this.tmp.dirty = this.tmp.dirty.concat(paths)
    normalizeDirtyPaths(this)

    const { selection } = value
    document = value.document

    if (selection.isUnset && document.nodes.size) {
      this.moveToStartOfDocument()
    }
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
    const value = this.tmp.normalize
    this.tmp.normalize = false
    fn()
    this.tmp.normalize = value
    normalizeDirtyPaths(this)
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

  run(fn, ...args) {
    warning(
      false,
      'As of slate@0.48 the `editor.run` method has been renamed to `editor.exec`.'
    )

    invariant(
      typeof fn === 'string',
      'As of slate@0.48 the `editor.run` method must take a middleware name string, not a function.'
    )

    return this.exec(fn, ...args)
  }

  command(type, ...args) {
    warning(
      false,
      'As of slate@0.48 the `editor.command` method is deprecated. Please use `editor.exec` instead.'
    )

    return this.exec(type, ...args)
  }

  hasCommand(type) {
    warning(
      false,
      'As of slate@0.48 the `editor.hasCommand` method is deprecated. Please use `editor.has` instead.'
    )

    return this.has(type)
  }

  hasQuery(type) {
    warning(
      false,
      'As of slate@0.48 the `editor.hasQuery` method is deprecated. Please use `editor.has` instead.'
    )

    return this.has(type)
  }

  query(type, ...args) {
    warning(
      false,
      'As of slate@0.48 the `editor.query` method is deprecated. Please use `editor.exec` instead.'
    )

    return this.exec(type, ...args)
  }

  registerCommand(type) {
    invariant(
      false,
      'As of slate@0.48 the `editor.registerCommand` method has been removed.'
    )
  }

  registerQuery(type) {
    invariant(
      false,
      'As of slate@0.48 the `editor.registerQuery` method has been removed.'
    )
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
      const paths =
        node.object === 'text'
          ? []
          : Array.from(
              node.descendants({ includeTarget: true, includeRoot: true }),
              ([, p]) => path.concat(p)
            )

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
 * @param {Number} iteration
 */

function normalizeNodeByPath(
  editor,
  path,
  iteration = 0,
  maxIterations = null
) {
  const { controller } = editor
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  // Set a best estimate for maximum iterations.
  if (!maxIterations) {
    maxIterations = 100 + (node.object === 'text' ? 1 : node.nodes.size)
  }

  // Check to make sure that we haven't exceeded the max. Without this check,
  // it's easy for a `normalize` function of a schema rule to be written
  // incorrectly and for an infinite invalid loop to occur.
  if (iteration > maxIterations) {
    throw new Error(
      'A schema rule could not be normalized after sufficient iterations. This is usually due to a `rule.normalize` or `plugin.normalizeNode` function of a schema being incorrectly written, causing an infinite loop.'
    )
  }

  const fn = node.normalize(controller)

  // A normalizing function is only returned when the node is invalid.
  if (!fn) {
    return
  }

  // Run the normalize `fn` to fix the node.
  const opCount = editor.operations.size
  fn()

  // Now that normalizing operations have been applied, we need to refind the
  // path, transformed by all the new operations.
  const newOps = editor.operations.slice(opCount)
  let paths = [path]

  for (const op of newOps) {
    let next = []

    // Transforming paths can sometimes result in multiple new paths, so we
    // have to accoutn for that by collecting an array.
    for (const p of paths) {
      const transformed = PathUtils.transform(p, op)
      next = next.concat(transformed.toArray())
    }

    paths = next
  }

  // For every updated path, we want to continue iterating to ensure that the
  // node is fully normalized by all rules.
  for (const p of paths) {
    normalizeNodeByPath(editor, p, iteration + 1, maxIterations)
  }
}

/**
 * Register a `plugin` with the editor.
 *
 * @param {Editor} editor
 * @param {Object|Array|Null} plugin
 */

function registerPlugin(editor, controller, plugin) {
  if (Array.isArray(plugin)) {
    plugin
      .slice()
      .reverse()
      .forEach(p => registerPlugin(editor, controller, p))

    return
  }

  if (plugin == null) {
    return
  }

  const { commands, queries, schema, ...rest } = plugin

  if (commands) {
    warning(
      false,
      'As of slate@0.48 the `plugin.commands` dictionary is deprecated. Register the commands as top-level functions in the plugin instead.'
    )

    for (const key in commands) {
      const command = commands[key]

      registerHandler(editor, controller, key, () => (...args) =>
        command(editor, ...args)
      )
    }
  }

  if (queries) {
    warning(
      false,
      'As of slate@0.48 the `plugin.queries` dictionary is deprecated. Register the queries as top-level functions in the plugin instead.'
    )

    for (const key in queries) {
      const query = queries[key]

      registerHandler(editor, controller, key, () => (...args) =>
        query(editor, ...args)
      )
    }
  }

  if (schema) {
    const schemaPlugin = SchemaPlugin(schema)
    registerPlugin(editor, controller, schemaPlugin)
  }

  for (const key in rest) {
    const fn = rest[key]
    registerHandler(editor, controller, key, fn)
  }
}

function registerHandler(editor, controller, name, fn) {
  const existing = editor.handlers[name] || noop
  editor.handlers[name] = fn(existing, controller)
  editor[name] = editor[name] || ((...args) => editor.exec(name, ...args))
  controller[name] = editor[name]
}

function noop() {}

/**
 * Export.
 *
 * @type {Editor}
 */

export default Editor
