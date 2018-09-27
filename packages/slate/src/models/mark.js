import isPlainObject from 'is-plain-object'
import { Map, Record, Set } from 'immutable'

import Data from './data'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: undefined,
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
   * Check if `any` is a set of marks.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isMarkSet(any) {
    return Set.isSet(any) && any.every(item => Mark.isMark(item))
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
}

/**
 * Export.
 *
 * @type {Mark}
 */

export default Mark
