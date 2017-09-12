
import Debug from 'debug'
import logger from 'slate-dev-logger'
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
   * Check if a `value` is a `Change`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isChange(value) {
    return !!(value && value[MODEL_TYPES.CHANGE])
  }

  /**
   * Create a new `Change` with `attrs`.
   *
   * @param {Object} attrs
   *   @property {State} state
   */

  constructor(attrs) {
    const { state } = attrs
    this.state = state
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
   * Apply an `operation` to the current state, saving the operation to the
   * history if needed.
   *
   * @param {Object} operation
   * @param {Object} options
   * @return {Change}
   */

  applyOperation(operation, options = {}) {
    const { operations, flags } = this
    let { state } = this
    let { history } = state

    // Default options to the change-level flags, this allows for setting
    // specific options for all of the operations of a given change.
    options = { ...flags, ...options }

    // Derive the default option values.
    const {
      merge = operations.length == 0 ? null : true,
      save = true,
      skip = null,
    } = options

    // Apply the operation to the state.
    debug('apply', { operation, save, merge })
    state = apply(state, operation)

    // If needed, save the operation to the history.
    if (history && save) {
      history = history.save(operation, { merge, skip })
      state = state.set('history', history)
    }

    // Update the mutable change object.
    this.state = state
    this.operations.push(operation)
    return this
  }

  /**
   * Apply a series of `operations` to the current state.
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

  /**
   * Deprecated.
   *
   * @return {State}
   */

  apply(options = {}) {
    logger.deprecate('0.22.0', 'The `change.apply()` method is deprecrated and no longer necessary, as all operations are applied immediately when invoked. You can access the change\'s state, which is already pre-computed, directly via `change.state` instead.')
    return this.state
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
 * Add deprecation warnings in case people try to access a change as a state.
 */

;[
  'hasUndos',
  'hasRedos',
  'isBlurred',
  'isFocused',
  'isCollapsed',
  'isExpanded',
  'isBackward',
  'isForward',
  'startKey',
  'endKey',
  'startOffset',
  'endOffset',
  'anchorKey',
  'focusKey',
  'anchorOffset',
  'focusOffset',
  'startBlock',
  'endBlock',
  'anchorBlock',
  'focusBlock',
  'startInline',
  'endInline',
  'anchorInline',
  'focusInline',
  'startText',
  'endText',
  'anchorText',
  'focusText',
  'characters',
  'marks',
  'blocks',
  'fragment',
  'inlines',
  'texts',
  'isEmpty',
].forEach((getter) => {
  Object.defineProperty(Change.prototype, getter, {
    get() {
      logger.deprecate('0.22.0', `You attempted to access the \`${getter}\` property of what was previously a \`state\` object but is now a \`change\` object. This syntax has been deprecated as plugins are now passed \`change\` objects instead of \`state\` objects.`)
      return this.state[getter]
    }
  })
})

Change.prototype.transform = function () {
  logger.deprecate('0.22.0', 'You attempted to call `.transform()` on what was previously a `state` object but is now already a `change` object. This syntax has been deprecated as plugins are now passed `change` objects instead of `state` objects.')
  return this
}

/**
 * Export.
 *
 * @type {Change}
 */

export default Change
