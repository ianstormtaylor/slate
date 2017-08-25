
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
   *
   * @return {State}
   */

  apply(options = {}) {
    warn('The `transform.apply()` method is deprecrated and no longer necessary, as all operations are applied immediately when invoked. You can access the transform\'s state, which is already pre-computed, directly via `transform.state` instead.')
    return this.state
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
 * Add deprecation warnings in case people try to access a transform as a state.
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
  Object.defineProperty(Transform.prototype, getter, {
    get() {
      warn(`You attempted to access the \`${getter}\` property of what was previously a \`state\` object but is now a \`transform\` object. This syntax has been deprecated as plugins are now passed \`transform\` objects instead of \`state\` objects.`)
      return this.state[getter]
    }
  })
})

Transform.prototype.transform = function () {
  warn('You attempted to call `.transform()` on what was previously a `state` object but is now already a `transform` object. This syntax has been deprecated as plugins are now passed `transform` objects instead of `state` objects.')
  return this
}

/**
 * Export.
 *
 * @type {Transform}
 */

export default Transform
