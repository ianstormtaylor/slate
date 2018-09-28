import Schema from './schema'
import Change from './change'

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
      change: null,
      changing: false,
      plugins: null,
      updates: 0,
      value: null,
    }

    this.setProperties({ onChange, plugins, readOnly, value })
  }

  /**
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Mixed} ...args
   */

  change = (...args) => {
    const change = new Change({ value: this.value, editor: this })
    const { changing } = this.tmp

    try {
      this.tmp.changing = true
      change.call(...args)
    } catch (error) {
      throw error
    } finally {
      this.tmp.changing = changing
    }

    // If this is the top-most change, run the `onChange` handler.
    if (changing === false) {
      this.run('onChange', change)
    }

    // If the change doesn't define any operations to apply, abort.
    if (change.operations.size === 0) {
      return
    }

    // Store a reference to the last `value` and `plugins` that were seen by the
    // editor, so we can know whether to normalize a new unknown value if one
    // is passed in via `this.props`.
    this.tmp.value = change.value
    this.tmp.plugins = this.plugins

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
    if (plugins !== this.plugins) {
      this.tmp.updates++
      this.plugins = plugins
      this.schema = Schema.create({ plugins })
    }

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
    if (this.plugins === this.tmp.plugins && this.value === this.tmp.value) {
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
