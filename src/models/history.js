
import MODEL_TYPES from '../constants/model-types'
import Debug from 'debug'
import isEqual from 'lodash/isEqual'
import { Record, Stack } from 'immutable'

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
  shouldSave,
  shouldMerge,
}

/**
 * History.
 *
 * @type {History}
 */

class History extends new Record(DEFAULTS) {

  /**
   * Create a new `History` with `attrs`.
   *
   * @param {Object} attrs
   * @return {History}
   */

  static create(attrs = {}) {
    if (History.isHistory(attrs)) return attrs

    const history = new History({
      undos: attrs.undos || new Stack(),
      redos: attrs.redos || new Stack(),
      shouldSave: attrs.shouldSave || shouldSave,
      shouldMerge: attrs.shouldMerge || shouldMerge,
    })

    return history
  }

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
    let { merge, checkpoint } = options
    let history = this
    let { undos } = history
    const prevBatch = undos.peek()
    const prevOperation = prevBatch && prevBatch[prevBatch.length - 1]
    const save = history.shouldSave(operation, prevOperation)
    if (!save) return history

    if (checkpoint == null) {
      checkpoint = undos.length === 0
    }

    if (merge == null) {
      merge = history.shouldMerge(operation, prevOperation)
    }

    debug('save', { operation, merge, checkpoint })

    let batch

    if (merge || !checkpoint) {
      undos = undos.pop()
      batch = prevBatch.slice()
      batch.push(operation)
    } else {
      batch = [operation]
    }

    undos = undos.push(batch)
    if (undos.length > 100) undos = undos.take(100)

    history = history.set('undos', undos)
    return history
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

History.prototype[MODEL_TYPES.HISTORY] = true

/**
 * The default checking function for whether to merge an operation `o`, given a
 * previous operation `p`.
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
 * The default checking function for whether to save an operation `o`, given a
 * previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldSave(o, p) {
  if (!p) return true

  const save = (
    o.type != 'set_selection' ||
    p.type != 'set_selection'
  )

  return save
}

/**
 * Export.
 *
 * @type {History}
 */

export default History
