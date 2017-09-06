
import Data from './data'
import memoize from '../utils/memoize'
import MODEL_TYPES from '../constants/model-types'
import { Map, Record, Set } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  type: null
}

/**
 * Mark.
 *
 * @type {Mark}
 */

class Mark extends new Record(DEFAULTS) {

  /**
   * Create a new `Mark` with `attrs`.
   *
   * @param {Object|Mark} attrs
   * @return {Mark}
   */

  static create(attrs = {}) {
    if (Mark.isMark(attrs)) return attrs

    if (!attrs.type) {
      throw new Error(`You must provide \`attrs.type\` to \`Mark.create(attrs)\`.`)
    }

    const mark = new Mark({
      type: attrs.type,
      data: Data.create(attrs.data),
    })

    return mark
  }

  /**
   * Create a set of marks.
   *
   * @param {Array<Object|Mark>} elements
   * @return {Set<Mark>}
   */

  static createSet(elements) {
    if (Set.isSet(elements)) {
      return elements
    }

    if (Array.isArray(elements)) {
      const marks = new Set(elements.map(Mark.create))
      return marks
    }

    if (elements == null) {
      return new Set()
    }

    throw new Error(`Mark.createSet() must be passed an \`Array\`, a \`List\` or \`null\`. You passed: ${elements}`)
  }

  /**
   * Check if a `value` is a `Mark`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isMark(value) {
    return !!(value && value[MODEL_TYPES.MARK])
  }

  /**
   * Get the kind.
   */

  get kind() {
    return 'mark'
  }

  /**
   * Get the component for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Component|Void}
   */

  getComponent(schema) {
    return schema.__getComponent(this)
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Mark.prototype[MODEL_TYPES.MARK] = true

/**
 * Memoize read methods.
 */

memoize(Mark.prototype, [
  'getComponent',
], {
  takesArguments: true,
})

/**
 * Export.
 *
 * @type {Mark}
 */

export default Mark
