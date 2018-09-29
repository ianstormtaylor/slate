import AtCurrentRange from '../commands/at-current-range'
import AtRange from '../commands/at-range'
import ByPath from '../commands/by-path'
import OnHistory from '../commands/on-history'
import OnSelection from '../commands/on-selection'
import OnValue from '../commands/on-value'

/**
 * A plugin that defines the core Slate commands.
 *
 * @return {Object}
 */

function CommandsPlugin() {
  return {
    commands: {
      ...AtCurrentRange,
      ...AtRange,
      ...ByPath,
      ...OnHistory,
      ...OnSelection,
      ...OnValue,
    },
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CommandsPlugin
