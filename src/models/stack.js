
import CorePlugin from '../plugins/core'
import Debug from 'debug'
import Schema from './schema'
import { Record } from 'immutable'

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
  'onBeforeTransform',
  'onBlur',
  'onCopy',
  'onCut',
  'onDrop',
  'onFocus',
  'onKeyDown',
  'onPaste',
  'onSelect',
  'onTransform',
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

class Stack extends new Record(DEFAULTS) {

  /**
   * Constructor.
   *
   * @param {Object} attrs
   *   @property {Array} plugins
   *   @property {Schema|Object} schema
   *   @property {Function} ...handlers
   */

  static create(attrs) {
    const plugins = resolvePlugins(attrs)
    const schema = resolveSchema(plugins)
    const stack = new Stack({ plugins, schema })
    return stack
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
 * Mix in the stack methods.
 *
 * @param {Transform} transform
 * @param {Editor} editor
 * @param {Mixed} ...args
 */

for (let i = 0; i < METHODS.length; i++) {
  const method = METHODS[i]
  Stack.prototype[method] = function (transform, editor, ...args) {
    debug(method)

    for (let k = 0; k < this.plugins.length; k++) {
      const plugin = this.plugins[k]
      if (!plugin[method]) continue
      const next = plugin[method](...args, transform, editor)
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
 * Resolve an array of plugins from `properties`.
 *
 * In addition to the plugins provided in `properties.plugins`, this will
 * create two other plugins:
 *
 * - A plugin made from the top-level `properties` themselves, which are
 * placed at the beginning of the stack. That way, you can add a `onKeyDown`
 * handler, and it will override all of the existing plugins.
 *
 * - A "core" functionality plugin that handles the most basic events in Slate,
 * like deleting characters, splitting blocks, etc.
 *
 * @param {Object} props
 * @return {Array}
 */

function resolvePlugins(props) {
  const { plugins = [], ...overridePlugin } = props
  const corePlugin = CorePlugin(props)
  return [
    overridePlugin,
    ...plugins,
    corePlugin
  ]
}

/**
 * Export.
 *
 * @type {Stack}
 */

export default Stack
