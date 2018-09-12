import isPlainObject from 'is-plain-object'
import logger from '@gitbook/slate-dev-logger'
import { Map, Record, Set } from 'immutable'

import MODEL_TYPES, { isType } from '../constants/model-types'
import Data from './data'
import memoize from '../utils/memoize'

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
      return Mark.fromJSON(attrs)
    }

    throw new Error(
      `\`Mark.create\` only accepts objects, strings or marks, but you passed it: ${attrs}`
    )
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
      return Set()
    }

    throw new Error(
      `\`Mark.createSet\` only accepts sets, arrays or null, but you passed it: ${elements}`
    )
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

    throw new Error(
      `\`Mark.createProperties\` only accepts objects, strings or marks, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Mark` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Mark}
   */

  static fromJSON(object) {
    const { data = {}, type } = object

    if (typeof type != 'string') {
      throw new Error('`Mark.fromJS` requires a `type` string.')
    }

    const mark = new Mark({
      type,
      data: new Map(data),
    })

    return mark
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Mark.fromJSON

  /**
   * Check if `any` is a `Mark`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isMark = isType.bind(null, 'MARK')

  /**
   * Check if `any` is a set of marks.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isMarkSet(any) {
    return Set.isSet(any) && any.every(item => Mark.isMark(item))
  }

  /**
   * Object.
   */

  get object() {
    return 'mark'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
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

  /**
   * Return a JSON representation of the mark.
   *
   * @return {Object}
   */

  toJSON() {
    const object = {
      object: this.object,
      type: this.type,
      data: this.data.toJSON(),
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

Mark.prototype[MODEL_TYPES.MARK] = true

/**
 * Memoize read methods.
 */

memoize(Mark.prototype, ['getComponent'])

/**
 * Export.
 *
 * @type {Mark}
 */

export default Mark
