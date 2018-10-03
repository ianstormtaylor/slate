import Debug from 'debug'

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

    this.editor = editor

    this.tmp = {
      change: null,
      isChanging: false,
      lastPlugins: null,
      lastValue: null,
      rawPlugins: null,
    }

    this.setProperties({ onChange, plugins, readOnly, value }, options)
  }

  /**
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Mixed} ...args
   */

  change = (...args) => {
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

    this.run('onChange', change)

    // If the change doesn't define any operations to apply, abort.
    if (change.operations.size === 0) {
      return
    }

    // Store a reference to the last `value` and `plugins` that were seen by the
    // editor, so we can know whether to normalize a new unknown value if one
    // is passed in via `this.props`.
    this.tmp.lastValue = change.value
    this.tmp.lastPlugins = this.plugins

    // Call the provided `onChange` handler.
    this.onChange(change)
  }

  /**
   * Trigger a `command` with `...args`.
   *
   * @param {String} command
   * @param {Any} ...args
   */

  command = (command, ...args) => {
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

  event = (handler, event) => {
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

  query = (query, ...args) => {
    debug('query', { query, args })

    const obj = { type: query, args }
    return this.run('onQuery', obj)
  }

  /**
   * Run through the plugins stack for `property` with `args`.
   *
   * @param {String} property
   * @param {Any} ...args
   * @return {Any}
   */

  run = (property, ...args) => {
    const plugins = this.plugins.filter(p => property in p)
    let i = 0

    function next(...overrides) {
      const plugin = plugins[i++]
      if (!plugin) return

      if (overrides.length) {
        args = overrides
      }

      const ret = plugin[property](...args, next)
      return ret
    }

    return next()
  }

  /**
   * Set the `onChange` handler.
   *
   * @param {Function} onChange
   * @return {Editor}
   */

  setOnChange(onChange) {
    this.onChange = onChange
    return this
  }

  /**
   * Set the editor's plugins.
   *
   * @param {Array} rawPlugins
   * @return {Editor}
   */

  setPlugins(rawPlugins) {
    // PERF: If they try to set the same `plugins` again, we can avoid work.
    if (rawPlugins === this.tmp.rawPlugins) {
      return this
    }

    // PERF: Save a reference to the "raw" plugins that were set, so that we can
    // compare it by reference for a future set to avoid repeating work.
    this.tmp.rawPlugins = rawPlugins

    const corePlugin = CorePlugin()
    const plugins = [corePlugin, ...rawPlugins]

    class Change extends AbstractChange {}
    const array = []

    for (const plugin of plugins) {
      const { commands, queries, schema } = plugin
      array.push(plugin)

      if (commands) {
        const commandsPlugin = CommandsPlugin(commands)
        array.push(commandsPlugin)

        Object.keys(commands).forEach(key => {
          Change.prototype[key] = function(...args) {
            return this.command(key, ...args)
          }
        })
      }

      if (queries) {
        const queriesPlugin = QueriesPlugin(queries)
        array.push(queriesPlugin)

        Object.keys(queries).forEach(key => {
          Change.prototype[key] = function(...args) {
            return this.query(key, ...args)
          }
        })
      }

      if (schema) {
        const schemaPlugin = SchemaPlugin(schema)
        array.push(schemaPlugin)
      }
    }

    this.plugins = array
    this.Change = Change
    return this
  }

  /**
   * Set `properties` on the editor.
   *
   * @param {Object} properties
   * @param {Object} options
   * @return {Editor}
   */

  setProperties(properties = {}, options) {
    const { onChange, plugins, readOnly, value } = properties
    if (onChange !== undefined) this.setOnChange(onChange)
    if (plugins !== undefined) this.setPlugins(plugins)
    if (readOnly !== undefined) this.setReadOnly(readOnly)
    if (value !== undefined) this.setValue(value, options)
    return this
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
    const { normalize = true } = options

    // PERF: If the plugins and value haven't changed from the last seen one, we
    // don't have to normalize it because we know it was already normalized.
    if (
      normalize === false ||
      (this.plugins === this.tmp.lastPlugins && value === this.tmp.lastValue)
    ) {
      this.value = value
      return this
    }

    this.value = value

    this.change(change => {
      change.normalize()

      if (value.selection.isUnset) {
        change.moveToStartOfDocument()
      }
    })

    return this
  }
}

/**
 * Export.
 *
 * @type {Editor}
 */

export default Editor
