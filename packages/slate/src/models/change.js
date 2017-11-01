
import Debug from 'debug'
import pick from 'lodash/pick'

import MODEL_TYPES from '../constants/model-types'
import Changes from '../changes'
import apply from '../operations/apply'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:change')

/**
 * Change.
 *
 * @type {Change}
 */

class Change {

  /**
   * Check if `any` is a `Change`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isChange(any) {
    return !!(any && any[MODEL_TYPES.CHANGE])
  }

  /**
   * Create a new `Change` with `attrs`.
   *
   * @param {Object} attrs
   *   @property {Value} value
   */

  constructor(attrs) {
    const { value } = attrs
    this.value = value
    this.operations = []
    this.flags = pick(attrs, ['merge', 'save'])
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'change'
  }

  /**
   * Apply an `operation` to the current value, saving the operation to the
   * history if needed.
   *
   * @param {Object} operation
   * @param {Object} options
   * @return {Change}
   */

  applyOperation(operation, options = {}) {
    const { operations, flags } = this
    let { value } = this
    let { history } = value

    // Default options to the change-level flags, this allows for setting
    // specific options for all of the operations of a given change.
    options = { ...flags, ...options }

    // Derive the default option values.
    const {
      merge = operations.length == 0 ? null : true,
      save = true,
      skip = null,
    } = options

    // Apply the operation to the value.
    debug('apply', { operation, save, merge })
    value = apply(value, operation)

    // If needed, save the operation to the history.
    if (history && save) {
      history = history.save(operation, { merge, skip })
      value = value.set('history', history)
    }

    // Update the mutable change object.
    this.value = value
    this.operations.push(operation)
    return this
  }

  /**
   * Apply a series of `operations` to the current value.
   *
   * @param {Array} operations
   * @param {Object} options
   * @return {Change}
   */

  applyOperations(operations, options) {
    operations.forEach(op => this.applyOperation(op, options))
    return this
  }

  /**
   * Call a change `fn` with arguments.
   *
   * @param {Function} fn
   * @param {Mixed} ...args
   * @return {Change}
   */

  call(fn, ...args) {
    fn(this, ...args)
    return this
  }

  /**
   * Set an operation flag by `key` to `value`.
   *
   * @param {String} key
   * @param {Any} value
   * @return {Change}
   */

  setOperationFlag(key, value) {
    this.flags[key] = value
    return this
  }

  /**
   * Unset an operation flag by `key`.
   *
   * @param {String} key
   * @return {Change}
   */

  unsetOperationFlag(key) {
    delete this.flags[key]
    return this
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Change.prototype[MODEL_TYPES.CHANGE] = true

/**
 * Add a change method for each of the changes.
 */

Object.keys(Changes).forEach((type) => {
  Change.prototype[type] = function (...args) {
    debug(type, { args })
    this.call(Changes[type], ...args)
    return this
  }
})

/**
 * Export.
 *
 * @type {Change}
 */

export default Change
