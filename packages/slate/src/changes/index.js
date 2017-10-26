
import AtCurrentRange from './at-current-range'
import AtRange from './at-range'
import ByKey from './by-key'
import OnHistory from './on-history'
import OnSelection from './on-selection'
import OnState from './on-state'
import WithSchema from './with-schema'

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  ...AtCurrentRange,
  ...AtRange,
  ...ByKey,
  ...OnHistory,
  ...OnSelection,
  ...OnState,
  ...WithSchema,
}
