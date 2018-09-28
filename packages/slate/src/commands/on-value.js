import Value from '../models/value'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Set `properties` on the value.
 *
 * @param {Change} change
 * @param {Object|Value} properties
 */

Commands.setValue = (change, properties) => {
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

export default Commands
