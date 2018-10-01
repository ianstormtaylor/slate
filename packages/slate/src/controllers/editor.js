import Debug from 'debug'

import AbstractChange from './change'
import CommandsPlugin from '../plugins/commands'
import SchemaPlugin from '../plugins/schema'
import Schema from './schema'

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
    const { onChange, plugins = [], readOnly = false, value } = attrs

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
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Mixed} ...args
   */

  change = (...args) => {
    const { Change } = this
    const { isChanging } = this.tmp
    const change = isChanging
      ? this.tmp.change
      : new Change({ value: this.value, editor: this })

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
    debug('command', { arguments: args })

    this.change(change => {
      const fn = this.commands[command]
      change.call(fn, ...args)
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
   * Set the editor's `plugins`.
   *
   * @param {Array} plugins
   * @return {Editor}
   */

  setPlugins(plugins) {
    // PERF: If they try to set the same `plugins` again, we can avoid work.
    if (plugins === this.tmp.rawPlugins) {
      return this
    }

    // PERF: Save a reference to the "raw" plugins that were set, so that we can
    // compare it by reference for a future set to avoid repeating work.
    this.tmp.rawPlugins = plugins

    plugins = [SchemaPlugin(), ...plugins, CommandsPlugin()]
    const reversed = plugins.slice().reverse()
    const schema = new Schema({ plugins })
    const editor = this
    const cmds = {}

    class Change extends AbstractChange {}

    for (const plugin of reversed) {
      const { commands = {} } = plugin

      Object.keys(commands).forEach(key => {
        const fn = commands[key]
        cmds[key] = fn

        Change.prototype[key] = function(...args) {
          editor.command(key, ...args)
          return this
        }
      })
    }

    this.plugins = plugins
    this.schema = schema
    this.commands = cmds
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
      (this.plugins === this.tmp.lastPlugins &&
        this.value === this.tmp.lastValue)
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
