
import apply from '../operations/apply'

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Apply an `operation` to the current state.
 *
 * @param {Transform} transform
 * @param {Object} operation
 */

Transforms.applyOperation = (transform, operation) => {
  const { state, operations } = transform
  transform.state = apply(state, operation)
  transform.operations = operations.concat([operation])
}

/**
 * Apply a series of `operations` to the current state.
 *
 * @param {Transform} transform
 * @param {Array} operations
 */

Transforms.applyOperations = (transform, operations = []) => {
  for (const op of operations) {
    transform.applyOperation(op)
  }
}

/**
 * Call a `fn` as if it was a core transform. This is a convenience method to
 * make using non-core transforms easier to read and chain.
 *
 * @param {Transform} transform
 * @param {Function} fn
 * @param {Mixed} ...args
 */

Transforms.call = (transform, fn, ...args) => {
  fn(transform, ...args)
  return
}

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
