
import AtCurrentRange from './at-current-range'
import AtRange from './at-range'
import ByKey from './by-key'
import Normalize from './normalize'
import OnHistory from './on-history'
import OnSelection from './on-selection'
import OnState from './on-state'

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  ...AtCurrentRange,
  ...AtRange,
  ...ByKey,
  ...Normalize,
  ...OnHistory,
  ...OnSelection,
  ...OnState,
}
