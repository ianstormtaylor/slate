
import AtCurrentRange from './at-current-range'
import AtRange from './at-range'
import ByKey from './by-key'
import General from './general'
import Normalize from './normalize'
import OnHistory from './on-history'
import OnSelection from './on-selection'

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  ...AtCurrentRange,
  ...AtRange,
  ...ByKey,
  ...General,
  ...Normalize,
  ...OnHistory,
  ...OnSelection,
}
