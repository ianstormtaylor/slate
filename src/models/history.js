
import Debug from 'debug'
import isEqual from 'lodash/isEqual'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:history')

/**
 * History.
 *
 * @type {History}
 */

class History {

  /**
   * Create a new `History` with `attrs`.
   *
   * @param {Object} attrs
   */

  constructor(attrs = {}) {
    this.undos = attrs.undos || []
    this.redos = attrs.redos || []
    this._shouldMerge = attrs.shouldMerge || shouldMerge
    this._shouldSave = attrs.shouldSave || shouldSave
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
   * Move the history backward, for undoing.
   *
   * @return {Array}
   */

  back() {
    const { redos, undos } = this
    const operations = undos.pop()
    if (!operations) return
    redos.push(operations)
    debug('back', operations)
    return operations
  }

  /**
   * Move the history forward, for redoing.
   *
   * @return {Array}
   */

  forward() {
    const { redos, undos } = this
    const operations = redos.pop()
    if (!operations) return
    undos.push(operations)
    debug('forward', operations)
    return operations
  }

  /**
   * Save an `operation` into the history.
   *
   * @param {Object} operation
   */

  save(operation, options = {}) {
    let { merge, checkpoint } = options
    const { undos } = this
    const prevBatch = undos[undos.length - 1]
    const prevOperation = prevBatch && prevBatch[prevBatch.length - 1]
    const save = this._shouldSave(operation, prevOperation)
    if (!save) return

    if (checkpoint == null) {
      checkpoint = undos.length === 0
    }

    if (merge == null) {
      merge = this._shouldMerge(operation, prevOperation)
    }

    if (merge || !checkpoint) {
      prevBatch.push(operation)
    } else {
      const batch = [operation]
      undos.push(batch)
      if (undos.length > 100) undos.shift()
    }

    debug('save', operation)
  }

}

/**
 * Check whether to merge an operation `o`, given a previous operation `p`.
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
 * Check whether to save an operation `o`, given a previous operation `p`.
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
