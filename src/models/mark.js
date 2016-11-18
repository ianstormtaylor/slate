
import Data from './data'
import memoize from '../utils/memoize'
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
    if (properties instanceof Mark) return properties
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
   * Get the kind.
   *
   * @return {String}
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
])

/**
 * Export.
 *
 * @type {Mark}
 */

export default Mark
