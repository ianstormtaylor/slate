
/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

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
 * Export.
 *
 * @type {Object}
 */

export default Transforms
