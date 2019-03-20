import isPlainObject from 'is-plain-object'
import { Record } from 'immutable'

import Operation from './operation'
import Value from './value'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  operations: undefined,
  value: undefined,
}

/**
 * Change.
 *
 * @type {Change}
 */

class Change extends Record(DEFAULTS) {
  /**
   * Create a new `Change` with `attrs`.
   *
   * @param {Object|Change} attrs
   * @return {Change}
   */

  static create(attrs = {}) {
    if (Change.isChange(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Change.fromJSON(attrs)
    }

    throw new Error(
      `\`Change.create\` only accepts objects or changes, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Change` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Change}
   */

  static fromJSON(object) {
    const { value, operations = [] } = object

    const change = new Change({
      value: Value.create(value),
      operations: Operation.createList(operations),
    })

    return change
  }

  /**
   * Return a JSON representation of the change.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      value: this.value.toJSON(options),
      operations: this.operations.toArray().map(o => o.toJSON(options)),
    }

    return object
  }
}

/**
 * Export.
 *
 * @type {Change}
 */

export default Change
