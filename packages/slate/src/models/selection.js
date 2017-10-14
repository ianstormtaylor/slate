
import logger from 'slate-dev-logger'

import Range from './range'

/**
 * Deprecated.
 */

const Selection = {

  create(...args) {
    logger.deprecate('0.27.0', 'The `Selection` model has been renamed to `Range`.')
    return Range.create(...args)
  },

  createList(...args) {
    logger.deprecate('0.27.0', 'The `Selection` model has been renamed to `Range`.')
    return Range.createList(...args)
  },

  createProperties(...args) {
    logger.deprecate('0.27.0', 'The `Selection` model has been renamed to `Range`.')
    return Range.createProperties(...args)
  },

  fromJSON(...args) {
    logger.deprecate('0.27.0', 'The `Selection` model has been renamed to `Range`.')
    return Range.fromJSON(...args)
  },

  fromJS(...args) {
    logger.deprecate('0.27.0', 'The `Selection` model has been renamed to `Range`.')
    return Range.fromJS(...args)
  },

  isSelection(...args) {
    logger.deprecate('0.27.0', 'The `Selection` model has been renamed to `Range`.')
    return Range.isRange(...args)
  },

}

/**
 * Export.
 *
 * @type {Object}
 */

export default Selection
