
/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Set the `isNative` flag on the underlying state to prevent re-renders.
 *
 * @param {Change} change
 * @param {Boolean} value
 */

Changes.setIsNative = (change, value) => {
  let { state } = change
  state = state.set('isNative', value)
  change.state = state
}

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
