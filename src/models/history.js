
import { Record, Stack } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  undos: new Stack(),
  redos: new Stack()
}

/**
 * History.
 *
 * @type {History}
 */

class History extends new Record(DEFAULTS) {}

/**
 * Export.
 *
 * @type {History}
 */

export default History
