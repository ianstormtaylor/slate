
import Debug from 'debug'
import Transforms from '../transforms'
import apply from '../operations/apply'
import warn from '../utils/warn'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:transform')

/**
 * Transform.
 *
 * @type {Transform}
 */

class Transform {

  /**
   * Create a new `Transform` with `attrs`.
   *
   * @param {Object} attrs
   *   @property {State} state
   */

  constructor(attrs) {
    const { state } = attrs
    const { history } = state

    if (history) {
      history.checkpoint(true)
    }

    this.state = state
    this.operations = []
    this.flags = {
      save: attrs.save === undefined ? true : attrs.save,
      merge: attrs.merge === undefined ? null : attrs.merge,
    }

    this.setIsNative(false)
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'transform'
  }

  /**
   * Apply an `operation` to the current state, saving the operation to the
   * history if needed.
   *
   * @param {Object} operation
   * @param {Object} options
   * @return {Transform}
   */

  applyOperation(operation, options = {}) {
    const { state, flags } = this
    const { save = flags.save, merge = flags.merge } = options
    const { history } = state

    if (history && save) {
      history.save(operation, { merge })
    }

    this.state = apply(state, operation)
    this.operations.push(operation)
    return this
  }

  /**
   * Apply a series of `operations` to the current state.
   *
   * @param {Array} operations
   * @param {Object} options
   * @return {Transform}
   */

  applyOperations(operations, options) {
    operations.forEach(op => this.applyOperation(op, options))
    return this
  }

  /**
   * Call a transform `fn` with arguments.
   *
   * @param {Function} fn
   * @param {Mixed} ...args
   * @return {Transform}
   */

  call(fn, ...args) {
    fn(this, ...args)
    return this
  }

  /**
   * Noop.
   */

  apply(options = {}) {
    warn('The `transform.apply()` method is deprecrated and no longer necessary, so it has been no-op\'d.')
    return this
  }

}

/**
 * Add a transform method for each of the transforms.
 */

Object.keys(Transforms).forEach((type) => {
  Transform.prototype[type] = function (...args) {
    debug(type, { args })
    this.call(Transforms[type], ...args)
    return this
  }
})

/**
 * Export.
 *
 * @type {Transform}
 */

export default Transform
