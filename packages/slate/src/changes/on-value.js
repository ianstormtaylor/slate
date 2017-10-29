
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
 * @param {Object} options
 */

Changes.setValue = (change, properties, options = {}) => {
  properties = Value.createProperties(properties)
  const { value } = change

  change.applyOperation({
    type: 'set_value',
    properties,
    value,
  }, options)
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
