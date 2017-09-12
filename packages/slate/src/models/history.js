
import Debug from 'debug'
import isEqual from 'lodash/isEqual'
import isPlainObject from 'is-plain-object'
import { Record, Stack } from 'immutable'

import MODEL_TYPES from '../constants/model-types'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:history')

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  redos: new Stack(),
  undos: new Stack(),
}

/**
 * History.
 *
 * @type {History}
 */

class History extends Record(DEFAULTS) {

  /**
   * Create a new `History` with `attrs`.
   *
   * @param {Object|History} attrs
   * @return {History}
   */

  static create(attrs = {}) {
    if (History.isHistory(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return History.fromJSON(attrs)
    }

    throw new Error(`\`History.create\` only accepts objects or histories, but you passed it: ${attrs}`)
  }

  /**
   * Create a `History` from a JSON `object`.
   *
   * @param {Object} object
   * @return {History}
   */

  static fromJSON(object) {
    const {
      redos = [],
      undos = [],
    } = object

    const history = new History({
      redos: new Stack(redos),
      undos: new Stack(undos),
    })

    return history
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = History.fromJSON

  /**
   * Check if a `value` is a `History`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isHistory(value) {
    return !!(value && value[MODEL_TYPES.HISTORY])
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'history'
  }

  /**
   * Save an `operation` into the history.
   *
   * @param {Object} operation
   * @param {Object} options
   * @return {History}
   */

  save(operation, options = {}) {
    let history = this
    let { undos, redos } = history
    let { merge, skip } = options
    const prevBatch = undos.peek()
    const prevOperation = prevBatch && prevBatch[prevBatch.length - 1]

    if (skip == null) {
      skip = shouldSkip(operation, prevOperation)
    }

    if (skip) {
      return history
    }

    if (merge == null) {
      merge = shouldMerge(operation, prevOperation)
    }

    debug('save', { operation, merge })

    // If the `merge` flag is true, add the operation to the previous batch.
    if (merge) {
      const batch = prevBatch.slice()
      batch.push(operation)
      undos = undos.pop()
      undos = undos.push(batch)
    }

    // Otherwise, create a new batch with the operation.
    else {
      const batch = [operation]
      undos = undos.push(batch)
    }

    // Constrain the history to 100 entries for memory's sake.
    if (undos.length > 100) {
      undos = undos.take(100)
    }

    // Clear the redos and update the history.
    redos = redos.clear()
    history = history.set('undos', undos).set('redos', redos)
    return history
  }

  /**
   * Return a JSON representation of the history.
   *
   * @return {Object}
   */

  toJSON() {
    const object = {
      kind: this.kind,
      redos: this.redos.toJSON(),
      undos: this.undos.toJSON(),
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS() {
    return this.toJSON()
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

History.prototype[MODEL_TYPES.HISTORY] = true

/**
 * Check whether to merge a new operation `o` into the previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldMerge(o, p) {
  if (!p) return false

  const merge = (
    (
      o.type == 'set_selection' &&
      p.type == 'set_selection'
    ) || (
      o.type == 'insert_text' &&
      p.type == 'insert_text' &&
      o.offset == p.offset + p.text.length &&
      isEqual(o.path, p.path)
    ) || (
      o.type == 'remove_text' &&
      p.type == 'remove_text' &&
      o.offset + o.text.length == p.offset &&
      isEqual(o.path, p.path)
    )
  )

  return merge
}

/**
 * Check whether to skip a new operation `o`, given previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldSkip(o, p) {
  if (!p) return false

  const skip = (
    o.type == 'set_selection' &&
    p.type == 'set_selection'
  )

  return skip
}

/**
 * Export.
 *
 * @type {History}
 */

export default History
