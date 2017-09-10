
/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Set `properties` on the top-level state's data.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.setData = (change, properties) => {
  const { state } = change
  const { data } = state

  change.applyOperation({
    type: 'set_data',
    properties,
    data,
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
