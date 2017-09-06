
import MODEL_TYPES from '../constants/model-types'
import Data from './data'
import isPlainObject from 'is-plain-object'
import memoize from '../utils/memoize'
import { Map, Record, Set } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  type: undefined,
}

/**
 * Mark.
 *
 * @type {Mark}
 */

class Mark extends Record(DEFAULTS) {

  /**
   * Create a new `Mark` with `attrs`.
   *
   * @param {Object|Mark} attrs
   * @return {Mark}
   */

  static create(attrs = {}) {
    if (Mark.isMark(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { type: attrs }
    }

    if (isPlainObject(attrs)) {
      const { data, type } = attrs

      if (typeof type != 'string') {
        throw new Error('`Mark.create` requires a mark `type` string.')
      }

      const mark = new Mark({
        type,
        data: Data.create(data),
      })

      return mark
    }

    throw new Error(`\`Mark.create\` only accepts objects, strings or marks, but you passed it: ${attrs}`)
  }

  /**
   * Create a set of marks.
   *
   * @param {Array<Object|Mark>} elements
   * @return {Set<Mark>}
   */

  static createSet(elements) {
    if (Set.isSet(elements) || Array.isArray(elements)) {
      const marks = new Set(elements.map(Mark.create))
      return marks
    }

    if (elements == null) {
      return new Set()
    }

    throw new Error(`\`Mark.createSet\` only accepts sets, arrays or null, but you passed it: ${elements}`)
  }

  /**
   * Create a dictionary of settable mark properties from `attrs`.
   *
   * @param {Object|String|Mark} attrs
   * @return {Object}
   */

  static createProperties(attrs = {}) {
    if (Mark.isMark(attrs)) {
      return {
        data: attrs.data,
        type: attrs.type,
      }
    }

    if (typeof attrs == 'string') {
      return { type: attrs }
    }

    if (isPlainObject(attrs)) {
      const props = {}
      if ('type' in attrs) props.type = attrs.type
      if ('data' in attrs) props.data = Data.create(attrs.data)
      return props
    }

    throw new Error(`\`Mark.createProperties\` only accepts objects, strings or marks, but you passed it: ${attrs}`)
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
