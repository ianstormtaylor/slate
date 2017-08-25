
/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Set the `isNative` flag on the underlying state to prevent re-renders.
 *
 * @param {Transform} transform
 * @param {Boolean} value
 */

Transforms.setIsNative = (transform, value) => {
  let { state } = transform
  state = state.set('isNative', value)
  transform.state = state
}

/**
 * Set `properties` on the top-level state's data.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

Transforms.setData = (transform, properties) => {
  const { state } = transform
  const { data } = state

  transform.applyOperation({
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

export default Transforms
