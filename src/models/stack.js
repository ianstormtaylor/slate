
import CorePlugin from '../plugins/core'
import Debug from 'debug'
import Schema from './schema'
import State from './state'
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

const EVENT_HANDLER_METHODS = [
  'onBeforeInput',
  'onBlur',
  'onCopy',
  'onCut',
  'onDrop',
  'onKeyDown',
  'onPaste',
  'onSelect',
]

/**
 * Methods that accumulate an updated state.
 *
 * @type {Array}
 */

const STATE_ACCUMULATOR_METHODS = [
  'onBeforeChange',
  'onChange',
]

/**
 * Methods that accumulate an array.
 *
 * @type {Array}
 */

const ARRAY_ACCUMULATOR_METHODS = [
  'render'
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
   * @param {Object} properties
   *   @property {Array} plugins
   *   @property {Schema|Object} schema
   *   @property {Function} ...handlers
   */

  static create(properties) {
    const plugins = resolvePlugins(properties)
    const schema = resolveSchema(plugins)
    return new Stack({ plugins, schema })
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'stack'
  }

}

/**
 * Mix in the event handler methods.
 *
 * @param {State} state
 * @param {Editor} editor
 * @param {Mixed} ...args
 * @return {State|Null}
 */

for (const method of EVENT_HANDLER_METHODS) {
  Stack.prototype[method] = function (state, editor, ...args) {
    debug(method)

    if (method == 'onChange') {
      state = this.onBeforeChange(state, editor)
    }

    for (const plugin of this.plugins) {
      if (!plugin[method]) continue
      const next = plugin[method](...args, state, editor)
      if (next == null) continue
      assertState(next)
      return next
    }

    return state
  }
}

/**
 * Mix in the state accumulator methods.
 *
 * @param {State} state
 * @param {Editor} editor
 * @param {Mixed} ...args
 * @return {State|Null}
 */

for (const method of STATE_ACCUMULATOR_METHODS) {
  Stack.prototype[method] = function (state, editor, ...args) {
    debug(method)

    for (const plugin of this.plugins) {
      if (!plugin[method]) continue
      const next = plugin[method](...args, state, editor)
      if (next == null) continue
      assertState(next)
      state = next
    }

    return state
  }
}

/**
 * Mix in the array accumulator methods.
 *
 * @param {State} state
 * @param {Editor} editor
 * @param {Mixed} ...args
 * @return {Array}
 */

for (const method of ARRAY_ACCUMULATOR_METHODS) {
  Stack.prototype[method] = function (state, editor, ...args) {
    debug(method)
    const array = []

    for (const plugin of this.plugins) {
      if (!plugin[method]) continue
      const next = plugin[method](...args, state, editor)
      if (next == null) continue
      array.push(next)
    }

    return array
  }
}

/**
 * Assert that a `value` is a state object.
 *
 * @param {Mixed} value
 */

function assertState(value) {
  if (value instanceof State) return
  throw new Error(`A plugin returned an unexpected state value: ${value}`)
}

/**
 * Resolve a schema from a set of `plugins`.
 *
 * @param {Array} plugins
 * @return {Schema}
 */

function resolveSchema(plugins) {
  let rules = []

  for (const plugin of plugins) {
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
