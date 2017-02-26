
import ApplyOperation from './apply-operation'
import AtCurrentRange from './at-current-range'
import AtRange from './at-range'
import ByKey from './by-key'
import Call from './call'
import Normalize from './normalize'
import OnHistory from './on-history'
import OnSelection from './on-selection'
import Operations from './operations'

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  ...ApplyOperation,
  ...AtCurrentRange,
  ...AtRange,
  ...ByKey,
  ...Call,
  ...Normalize,
  ...OnHistory,
  ...OnSelection,
  ...Operations,
}
