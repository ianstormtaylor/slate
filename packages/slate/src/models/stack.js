
import Debug from 'debug'
import { Record } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import Schema from './schema'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:stack')

/**
 * Methods that are triggered on events and can change the state.
 *
 * @type {Array}
 */

const METHODS = [
  'onBeforeInput',
  'onBeforeChange',
  'onBlur',
  'onCopy',
  'onCut',
  'onDrop',
  'onFocus',
  'onKeyDown',
  'onKeyUp',
  'onPaste',
  'onSelect',
  'onChange',
]

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  plugins: [],
  schema: new Schema(),
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
   *   @property {Array} plugins
   *   @property {Schema|Object} schema
   *   @property {Function} ...handlers
   */

  static create(attrs = {}) {
    const { plugins } = attrs
    const schema = resolveSchema(plugins)
    const stack = new Stack({ plugins, schema })
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
   * Invoke `render` on all of the plugins in reverse, building up a tree of
   * higher-order components.
   *
   * @param {State} state
   * @param {Editor} editor
   * @param {Object} children
   * @param {Object} props
   * @return {Component}
   */

  render(state, editor, props) {
    debug('render')
    const plugins = this.plugins.slice().reverse()
    let children

    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i]
      if (!plugin.render) continue
      children = plugin.render(props, state, editor)
      props.children = children
    }

    return children
  }

  /**
   * Invoke `renderPortal` on all of the plugins, building a list of portals.
   *
   * @param {State} state
   * @param {Editor} editor
   * @return {Array}
   */

  renderPortal(state, editor) {
    debug('renderPortal')
    const portals = []

    for (let i = 0; i < this.plugins.length; i++) {
      const plugin = this.plugins[i]
      if (!plugin.renderPortal) continue
      const portal = plugin.renderPortal(state, editor)
      if (portal) portals.push(portal)
    }

    return portals
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Stack.prototype[MODEL_TYPES.STACK] = true

/**
 * Mix in the stack methods.
 *
 * @param {Change} change
 * @param {Editor} editor
 * @param {Mixed} ...args
 */

for (let i = 0; i < METHODS.length; i++) {
  const method = METHODS[i]
  Stack.prototype[method] = function (change, editor, ...args) {
    debug(method)

    for (let k = 0; k < this.plugins.length; k++) {
      const plugin = this.plugins[k]
      if (!plugin[method]) continue
      const next = plugin[method](...args, change, editor)
      if (next != null) break
    }
  }
}

/**
 * Resolve a schema from a set of `plugins`.
 *
 * @param {Array} plugins
 * @return {Schema}
 */

function resolveSchema(plugins) {
  let rules = []

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    if (plugin.schema == null) continue
    const schema = Schema.create(plugin.schema)
    rules = rules.concat(schema.rules)
  }

  const schema = Schema.create({ rules })
  return schema
}

/**
 * Export.
 *
 * @type {Stack}
 */

export default Stack
