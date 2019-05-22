import CoreQueries from './core-queries'
import CoreCommands from './core-commands'
import CoreSchema from './core-schema'

/**
 * A plugin that defines the core Slate logic.
 *
 * @param {Object} options
 * @return {Object}
 */

function CorePlugin(options = {}) {
  const { plugins = [] } = options
  const schema = CoreSchema(options)
  const queries = CoreQueries(options)
  const commands = CoreCommands(options)
  return [schema, ...plugins, commands, queries]
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CorePlugin
