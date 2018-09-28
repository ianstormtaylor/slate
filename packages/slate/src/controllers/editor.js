import Debug from 'debug'

import AbstractChange from './change'
import CorePlugin from '../plugins/core'
import Schema from './schema'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:command')

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
   */

  constructor(attrs = {}) {
    const { onChange, plugins = [], readOnly = false, value } = attrs

    this.tmp = {
      isChanging: false,
      lastPlugins: null,
      lastValue: null,
      rawPlugins: null,
    }

    this.setProperties({ onChange, plugins, readOnly, value })
  }

  /**
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Mixed} ...args
   */

  change = (...args) => {
    const { Change } = this
    const change = new Change({ value: this.value, editor: this })
    const { isChanging } = this.tmp

    try {
      this.tmp.isChanging = true
      change.call(...args)
    } catch (error) {
      throw error
    } finally {
      this.tmp.isChanging = isChanging
    }

    // If this is the top-most change, run the `onChange` handler.
    if (isChanging === false) {
      this.run('onChange', change)
    }

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
   * Process an `event` by running it through the stack.
   *
   * @param {String} handler
   * @param {Event} event
   */

  event = (handler, event) => {
    this.change(change => {
      this.run(handler, event, change)
    })
  }

  /**
   * Iterate the plugins with `property`, breaking on any a non-null values.
   *
   * @param {String} property
   * @param {Any} ...args
   */

  run(property, ...args) {
    const plugins = this.plugins.filter(p => property in p)

    for (const plugin of plugins) {
      const ret = plugin[property](...args)
      if (ret != null) return
    }
  }

  /**
   * Iterate the plugins with `property`, returning the first non-null value.
   *
   * @param {String} property
   * @param {Any} ...args
   */

  runFind(property, ...args) {
    const plugins = this.plugins.filter(p => property in p)

    for (const plugin of plugins) {
      const ret = plugin[property](...args)
      if (ret != null) return ret
    }
  }

  /**
   * Iterate the plugins with `property`, returning all the non-null values.
   *
   * @param {String} property
   * @param {Any} ...args
   * @return {Array}
   */

  runMap(property, ...args) {
    const plugins = this.plugins.filter(p => property in p)
    const array = []

    for (const plugin of plugins) {
      const ret = plugin[property](...args)
      if (ret != null) array.push(ret)
    }

    return array
  }

  /**
   * Iterate the plugins with `property`, reducing to a set of React children.
   *
   * @param {String} property
   * @param {Object} props
   * @param {Any} ...args
   */

  runRender(property, props, ...args) {
    const plugins = this.plugins.filter(p => property in p)

    return plugins.reduceRight((children, plugin) => {
      if (!plugin[property]) return children
      const ret = plugin[property](props, ...args)
      if (ret == null) return children
      props.children = ret
      return ret
    }, props.children === undefined ? null : props.children)
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

    plugins = [...plugins, CorePlugin()]
    const reversed = plugins.slice().reverse()
    const schema = Schema.create({ plugins })
    class Change extends AbstractChange {}

    for (const plugin of reversed) {
      const { commands = {} } = plugin

      Object.keys(commands).forEach(key => {
        Change.prototype[key] = function(...args) {
          debug(key, { args })
          const fn = commands[key]
          this.call(fn, ...args)
          return this
        }
      })
    }

    this.plugins = plugins
    this.schema = schema
    this.Change = Change
    return this
  }

  /**
   * Set `properties` on the editor.
   *
   * @param {Object} properties
   * @return {Editor}
   */

  setProperties(properties = {}) {
    const { onChange, plugins, readOnly, value } = properties
    if (onChange !== undefined) this.setOnChange(onChange)
    if (plugins !== undefined) this.setPlugins(plugins)
    if (readOnly !== undefined) this.setReadOnly(readOnly)
    if (value !== undefined) this.setValue(value)
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
   * @return {Editor}
   */

  setValue(value) {
    // PERF: If the plugins and value haven't changed from the last seen one, we
    // don't have to normalize it because we know it was already normalized.
    if (
      this.plugins === this.tmp.lastPlugins &&
      this.value === this.tmp.lastValue
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
