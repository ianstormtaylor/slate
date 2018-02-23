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
  // By default, do not change history stacks
  const { save = false } = options

  change.applyOperation(
    {
      type: 'set_value',
      properties,
      value,
    },
    { save, ...options }
  )
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
