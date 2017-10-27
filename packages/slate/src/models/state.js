
import logger from 'slate-dev-logger'

import Value from './value'

/**
 * Deprecated.
 */

const State = {

  create(...args) {
    logger.deprecate('0.29.0', 'The `State` model has been renamed to `Value`.')
    return Value.create(...args)
  },

  createList(...args) {
    logger.deprecate('0.29.0', 'The `State` model has been renamed to `Value`.')
    return Value.createList(...args)
  },

  createProperties(...args) {
    logger.deprecate('0.29.0', 'The `State` model has been renamed to `Value`.')
    return Value.createProperties(...args)
  },

  fromJSON(...args) {
    logger.deprecate('0.29.0', 'The `State` model has been renamed to `Value`.')
    return Value.fromJSON(...args)
  },

  fromJS(...args) {
    logger.deprecate('0.29.0', 'The `State` model has been renamed to `Value`.')
    return Value.fromJS(...args)
  },

  isState(...args) {
    logger.deprecate('0.29.0', 'The `State` model has been renamed to `Value`.')
    return Value.isValue(...args)
  },

}

/**
 * Export.
 *
 * @type {Object}
 */

export default State
