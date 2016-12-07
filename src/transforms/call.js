/**
 * Convenience method to call a custom transform function using easier to read
 * syntax. A custom transform is a JavaScript function that takes a Transform
 * instance as the first argument. Any additional arguments passed to the `call`
 * method after the Transform instance are passed to the custom transform function.
 *
 * These are equivalent but the second is easier to read:
 *
 * ```js
 * const transform = state.transform()
 * myTransform(transform, 0, 1)
 * return transform.insertText('hello').apply()
 * ```
 *
 * and
 *
 * ```js
 * state.transform()
 *   .call(myTransform, 0, 1)
 *   .insertText('hello')
 *   .apply()
 * ```
 *
 * @param {Transform} transform
 * @param {Mixed} ...args
 */

export default function call(transform, fn, ...args) {
  fn(transform, ...args)
  return
}