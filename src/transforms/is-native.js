
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

Transforms.isNative = (transform, value) => {
  let { state } = transform
  state = state.set('isNative', value)
  transform.state = state
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
