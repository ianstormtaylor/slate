
import logger from 'slate-dev-logger'

import Value from '../models/value'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Set `properties` on the value.
 *
 * @param {Change} change
 * @param {Object|Value} properties
 */

Changes.setValue = (change, properties) => {
  properties = Value.createProperties(properties)
  const { value } = change

  change.applyOperation({
    type: 'set_value',
    properties,
    value,
  })
}

/**
 * Deprecated.
 */

Changes.setState = (change, ...args) => {
  logger.deprecate('0.29.0', 'The `change.setState` method has been renamed to `change.setValue`.')
  change.setValue(...args)
}

Changes.setData = (change, data) => {
  logger.deprecate('0.26.0', 'The `change.setData` method is deprecated, use `change.setValue` instead.')
  change.setValue({ data })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
