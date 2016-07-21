// @flow

import Data from './data'
import { Map, Record, Set } from 'immutable'

/**
 * Record.
 */

const DEFAULTS = {
  data: new Map(),
  type: null
}

/**
 * Mark.
 */

class Mark extends new Record(DEFAULTS) {

  /**
   * Create a new `Mark` with `properties`.
   *
   * @param {Object} properties
   * @return {Mark} mark
   */

  static create(properties = {}):Mark {
    if (properties instanceof Mark) return properties
    if (!properties.type) throw new Error('You must provide a `type` for the mark.')
    properties.data = Data.create(properties.data)
    return new Mark(properties)
  }

  /**
   * Create a marks set from an array of marks.
   *
   * @param {Array} array
   * @return {Set} marks
   */

  static createSet(array = []) {
    if (Set.isSet(array)) return array
    return new Set(array.map(Mark.create))
  }

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind():string {
    return 'mark'
  }

}

/**
 * Export.
 */

export default Mark
