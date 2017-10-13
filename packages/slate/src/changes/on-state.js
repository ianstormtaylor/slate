
import State from '../models/state'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Set `properties` on the state.
 *
 * @param {Change} change
 * @param {Object|State} properties
 */

Changes.setState = (change, properties) => {
  properties = State.createProperties(properties)
  const { state } = change

  change.applyOperation({
    type: 'set_state',
    properties,
    state,
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
