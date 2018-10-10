import Debug from 'debug'
import invariant from 'tiny-invariant'

import AbstractChange from './change'
import CorePlugin from '../plugins/core'
import CommandsPlugin from '../plugins/commands'
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
    const { editor = this } = options
    const {
      onChange = () => {},
      plugins = [],
      readOnly = false,
      value = Value.create(),
    } = attrs

    this.Change = class Change extends AbstractChange {}
    this.editor = editor
    this.middleware = {}
    this.onChange = onChange
    this.readOnly = null
    this.value = null

    this.tmp = {
      change: null,
      isChanging: false,
    }

    const core = CorePlugin({ plugins })
    registerPlugin(this, core)

    this.run('onConstruct', this)

    this.setReadOnly(readOnly)
    this.setValue(value, options)
  }

  /**
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Any} ...args
   */

  change(...args) {
    const { Change, editor, value } = this
    const { isChanging } = this.tmp
    const change = isChanging ? this.tmp.change : new Change({ value, editor })

    try {
      this.tmp.change = change
      this.tmp.isChanging = true
      change.call(...args)
    } catch (error) {
      throw error
    } finally {
      this.tmp.isChanging = isChanging
    }

    // If this isn't the top-most change function, exit to let it finish.
    if (isChanging === true) {
      return
    }

    // If the change doesn't define any operations to apply, abort.
    if (change.operations.size === 0) {
      return
    }

    this.run('onChange', change)

    // Call the provided `onChange` handler.
    this.value = change.value
    this.onChange(change)
  }

  /**
   * Trigger a `command` with `...args`.
   *
   * @param {String} command
   * @param {Any} ...args
   */

  command(command, ...args) {
    debug('command', { command, args })

    this.change(change => {
      const obj = { type: command, args }
      this.run('onCommand', obj, change)
    })
  }

  /**
   * Process an `event` by running it through the stack.
   *
   * @param {String} handler
   * @param {Event} event
   */

  event(handler, event) {
    debug('event', { handler, event })

    this.change(change => {
      this.run(handler, event, change)
    })
  }

  /**
   * Ask a `query` with `...args`.
   *
   * @param {String} query
   * @param {Any} ...args
   */

  query(query, ...args) {
    debug('query', { query, args })

    const { editor } = this
    const obj = { type: query, args }
    return this.run('onQuery', obj, editor)
  }

  /**
   * Register a `command` with the editor.
   *
   * @param {String} command
   */

  registerCommand(command) {
    const { Change } = this
    if (Change.prototype[command]) return

    Change.prototype[command] = function(...args) {
      const change = this.command(command, ...args)
      return change
    }
  }

  /**
   * Register a `query` with the editor.
   *
   * @param {String} query
   */

  registerQuery(query) {
    const { Change } = this
    if (Change.prototype[query]) return

    Change.prototype[query] = function(...args) {
      const ret = this.query(query, ...args)
      return ret
    }
  }

  /**
   * Run through the middleware stack by `key` with `args`.
   *
   * @param {String} key
   * @param {Any} ...args
   * @return {Any}
   */

  run(key, ...args) {
    const middleware = this.middleware[key] || []
    let i = 0

    function next(...overrides) {
      const fn = middleware[i++]
      if (!fn) return

      if (overrides.length) {
        args = overrides
      }

      const ret = fn(...args, next)
      return ret
    }

    Object.defineProperty(next, 'change', {
      get() {
        invariant(
          false,
          'As of Slate 0.42.0, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'onChange', {
      get() {
        invariant(
          false,
          'As of Slate 0.42.0, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'props', {
      get() {
        invariant(
          false,
          'As of Slate 0.42.0, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'schema', {
      get() {
        invariant(
          false,
          'As of Slate 0.42.0, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
        )
      },
    })

    Object.defineProperty(next, 'stack', {
      get() {
        invariant(
          false,
          'As of Slate 0.42.0, the `editor` is no longer passed as the third argument to event handlers. You can access it via `change.editor` instead.'
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
      this.change(change => change.normalize())
    }

    return this
  }
}

/**
 * Register a `plugin` with the editor.
 *
 * @param {Editor} editor
 * @param {Object|Array} plugin
 */

function registerPlugin(editor, plugin) {
  if (Array.isArray(plugin)) {
    plugin.forEach(p => registerPlugin(editor, p))
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
