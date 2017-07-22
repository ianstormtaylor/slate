
import Data from './data'
import memoize from '../utils/memoize'
import TYPES from './types'
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
   * Create a new `Mark` with `properties`.
   *
   * @param {Object|Mark} properties
   * @return {Mark}
   */

  static create(properties = {}) {
    if (Mark.isMark(properties)) return properties
    if (!properties.type) throw new Error('You must provide a `type` for the mark.')
    properties.data = Data.create(properties.data)
    return new Mark(properties)
  }

  /**
   * Create a marks set from an array of marks.
   *
   * @param {Array<Object|Mark>} array
   * @return {Set<Mark>}
   */

  static createSet(array = []) {
    if (Set.isSet(array)) return array
    return new Set(array.map(Mark.create))
  }

  /**
   * Determines if the passed in paramter is a Slate Mark or not
   *
   * @param {*} maybeMark
   * @return {Boolean}
   */

  static isMark(maybeMark) {
    return !!(maybeMark && maybeMark[TYPES.IS_SLATE_MARK])
  }

  /**
   *  Get Pseduo-symbol that shows this is a Slate Mark
   *
   * @return {Boolean}
   */

  [TYPES.IS_SLATE_MARK] = true

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
