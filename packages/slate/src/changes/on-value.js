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
 * Export.
 *
 * @type {Object}
 */

export default Changes
