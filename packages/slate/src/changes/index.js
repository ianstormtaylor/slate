import AtCurrentRange from './at-current-range'
import AtRange from './at-range'
import ByPath from './by-path'
import OnHistory from './on-history'
import OnSelection from './on-selection'
import OnValue from './on-value'

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  ...AtCurrentRange,
  ...AtRange,
  ...ByPath,
  ...OnHistory,
  ...OnSelection,
  ...OnValue,
}
