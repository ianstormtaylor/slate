
import logger from 'slate-dev-logger'

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
 * Deprecated.
 */

Changes.setData = (change, data) => {
  logger.deprecate('0.26.0', 'The `change.setData` method is deprecated, use `change.setState` instead.')
  change.setState({ data })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
