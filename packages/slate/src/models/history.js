import Debug from 'debug'
import isEqual from 'lodash/isEqual'
import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Record, Stack } from 'immutable'

import MODEL_TYPES, { isType } from '../constants/model-types'

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

    throw new Error(
      `\`History.create\` only accepts objects or histories, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Operations` from `operations`.
   *
   * @param {Array<Object>|List<Object>} operations
   * @return {List<Object>}
   */

  static createList(operations = []) {
    if (List.isList(operations) || Array.isArray(operations)) {
      const list = new List(operations)
      return list
    }

    throw new Error(
      `\`History.createList\` only accepts arrays or lists, but you passed it: ${operations}`
    )
  }

  /**
   * Create a `History` from a JSON `object`.
   *
   * @param {Object} object
   * @return {History}
   */

  static fromJSON(object) {
    const { redos = [], undos = [] } = object

    const history = new History({
      redos: new Stack(redos.map(this.createList)),
      undos: new Stack(undos.map(this.createList)),
    })

    return history
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = History.fromJSON

  /**
   * Check if `any` is a `History`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isHistory = isType.bind(null, 'HISTORY')

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'history'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
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
    const prevOperation = prevBatch && prevBatch.last()

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
    if (merge && prevBatch) {
      const batch = prevBatch.push(operation)
      undos = undos.pop()
      undos = undos.push(batch)
    } else {
      // Otherwise, create a new batch with the operation.
      const batch = new List([operation])
      undos = undos.push(batch)
    }

    // Constrain the history to 100 entries for memory's sake.
    if (undos.size > 100) {
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
      object: this.object,
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

  const merge =
    (o.type == 'set_selection' && p.type == 'set_selection') ||
    (o.type == 'insert_text' &&
      p.type == 'insert_text' &&
      o.offset == p.offset + p.text.length &&
      isEqual(o.path, p.path)) ||
    (o.type == 'remove_text' &&
      p.type == 'remove_text' &&
      o.offset + o.text.length == p.offset &&
      isEqual(o.path, p.path))

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

  const skip = o.type == 'set_selection' && p.type == 'set_selection'

  return skip
}

/**
 * Export.
 *
 * @type {History}
 */

export default History
