import AtCurrentRange from '../commands/at-current-range'
import AtRange from '../commands/at-range'
import ByPath from '../commands/by-path'
import OnHistory from '../commands/on-history'
import OnSelection from '../commands/on-selection'
import OnValue from '../commands/on-value'

/**
 * The core plugin.
 *
 * @return {Object}
 */

function CorePlugin() {
  /**
   * Build up a dictionary of the core Slate commands.
   *
   * @type {Object}
   */

  const commands = {
    ...AtCurrentRange,
    ...AtRange,
    ...ByPath,
    ...OnHistory,
    ...OnSelection,
    ...OnValue,
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    commands,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CorePlugin
