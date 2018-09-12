import Debug from 'debug'
import isPlainObject from 'is-plain-object'
import logger from '@gitbook/slate-dev-logger'
import pick from 'lodash/pick'
import { List } from 'immutable'

import MODEL_TYPES, { isType } from '../constants/model-types'
import Changes from '../changes'
import Operation from './operation'
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

  static isChange = isType.bind(null, 'CHANGE')

  /**
   * Create a new `Change` with `attrs`.
   *
   * @param {Object} attrs
   *   @property {Value} value
   */

  constructor(attrs) {
    const { value } = attrs
    this.value = value
    this.operations = new List()

    this.flags = {
      normalize: true,
      ...pick(attrs, ['merge', 'save', 'normalize']),
    }
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'change'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Apply an `operation` to the current value, saving the operation to the
   * history if needed.
   *
   * @param {Operation|Object} operation
   * @param {Object} options
   * @return {Change}
   */

  applyOperation(operation, options = {}) {
    const { operations, flags } = this
    let { value } = this
    let { history } = value

    // Add in the current `value` in case the operation was serialized.
    if (isPlainObject(operation)) {
      operation = { ...operation, value }
    }

    operation = Operation.create(operation)

    // Default options to the change-level flags, this allows for setting
    // specific options for all of the operations of a given change.
    options = { ...flags, ...options }

    // Derive the default option values.
    const {
      merge = operations.size == 0 ? null : true,
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
    this.operations = operations.push(operation)
    return this
  }

  /**
   * Apply a series of `operations` to the current value.
   *
   * @param {Array|List} operations
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
   * Applies a series of change mutations and defers normalization until the end.
   *
   * @param {Function} customChange - function that accepts a change object and executes change operations
   * @return {Change}
   */

  withoutNormalization(customChange) {
    const original = this.flags.normalize
    this.setOperationFlag('normalize', false)

    try {
      customChange(this)
      // if the change function worked then run normalization
      this.normalizeDocument()
    } finally {
      // restore the flag to whatever it was
      this.setOperationFlag('normalize', original)
    }
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
   * Get the `value` of the specified flag by its `key`. Optionally accepts an `options`
   * object with override flags.
   *
   * @param {String} key
   * @param {Object} options
   * @return {Change}
   */

  getFlag(key, options = {}) {
    return options[key] !== undefined ? options[key] : this.flags[key]
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

Object.keys(Changes).forEach(type => {
  Change.prototype[type] = function(...args) {
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
