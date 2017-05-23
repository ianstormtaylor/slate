
import AtCurrentRange from './at-current-range'
import AtRange from './at-range'
import ByKey from './by-key'
import Call from './call'
import IsNative from './is-native'
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
  ...AtCurrentRange,
  ...AtRange,
  ...ByKey,
  ...Call,
  ...IsNative,
  ...Normalize,
  ...OnHistory,
  ...OnSelection,
  ...Operations,
}
