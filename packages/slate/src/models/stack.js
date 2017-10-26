
import { Record } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import memoize from '../utils/memoize'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  plugins: [],
}

/**
 * Stack.
 *
 * @type {Stack}
 */

class Stack extends Record(DEFAULTS) {

  /**
   * Constructor.
   *
   * @param {Object} attrs
   */

  static create(attrs = {}) {
    const { plugins = [] } = attrs
    const stack = new Stack({ plugins })
    return stack
  }

  /**
   * Check if a `value` is a `Stack`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isStack(value) {
    return !!(value && value[MODEL_TYPES.STACK])
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'stack'
  }

  /**
   * Get all plugins with `property`.
   *
   * @param {String} property
   * @return {Array}
   */

  getPluginsWith(property) {
    return this.plugins.filter(plugin => plugin[property] != null)
  }

  /**
   * Iterate the plugins with `property`, returning the first non-null value.
   *
   * @param {String} property
   * @param {Any} ...args
   */

  find(property, ...args) {
    const plugins = this.getPluginsWith(property)

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

  map(property, ...args) {
    const plugins = this.getPluginsWith(property)
    const array = []

    for (const plugin of plugins) {
      const value = plugin[property](...args)
      if (value != null) array.push(value)
    }

    return array
  }

  /**
   * Iterate the plugins with `property`, breaking on any a non-null values.
   *
   * @param {String} property
   * @param {Any} ...args
   */

  run(property, ...args) {
    const plugins = this.getPluginsWith(property)

    for (const plugin of plugins) {
      const ret = plugin[property](...args)
      if (ret != null) return
    }
  }

  /**
   * Iterate the plugins with `property`, reducing to a set of React children.
   *
   * @param {String} property
   * @param {Object} props
   * @param {Any} ...args
   */

  render(property, props, ...args) {
    const plugins = this.getPluginsWith(property).reverse()
    let { children = null } = props

    for (const plugin of plugins) {
      const value = plugin[property](props, ...args)
      if (value == null) continue
      props.children = children = value
    }

    return children
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Stack.prototype[MODEL_TYPES.STACK] = true

/**
 * Memoize read methods.
 */

memoize(Stack.prototype, [
  'getPluginsWith',
], {
  takesArguments: true,
})

/**
 * Export.
 *
 * @type {Stack}
 */

export default Stack
