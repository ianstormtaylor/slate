
import Debug from 'debug'
import Changes from '../changes'
import apply from '../operations/apply'
import logger from '../utils/logger'

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
   * Create a new `Change` with `attrs`.
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
   * Noop.
   *
   * @return {State}
   */

  apply(options = {}) {
    logger.deprecate('0.22.0', 'The `change.apply()` method is deprecrated and no longer necessary, as all operations are applied immediately when invoked. You can access the change\'s state, which is already pre-computed, directly via `change.state` instead.')
    return this.state
  }

}

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
