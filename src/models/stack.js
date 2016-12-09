
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

const EVENT_METHODS = [
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

const ACCUMULATOR_METHODS = [
  'onBeforeChange',
  'onChange',
]

/**
 * All the runnable methods.
 *
 * @type {Array}
 */

const RUNNABLE_METHODS = []
  .concat(EVENT_METHODS)
  .concat(ACCUMULATOR_METHODS)

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

  /**
   * Run a `method` in the stack with `state`.
   *
   * @param {String} method
   * @param {State} state
   * @param {Editor} editor
   * @param {Mixed} ...args
   * @return {State}
   */

  run(method, state, editor, ...args) {
    debug(method)

    if (method == 'onChange') {
      state = this.onBeforeChange(state, editor)
    }

    for (const plugin of this.plugins) {
      if (!plugin[method]) continue
      const next = plugin[method](...args, state, editor)

      if (next == null) {
        continue
      } else if (next instanceof State) {
        state = next
        if (!ACCUMULATOR_METHODS.includes(method)) break
      } else {
        throw new Error(`A plugin returned an unexpected state value: ${next}`)
      }
    }

    return state
  }

}

/**
 * Mix in the runnable methods.
 */

for (const method of RUNNABLE_METHODS) {
  Stack.prototype[method] = function (...args) {
    return this.run(method, ...args)
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
