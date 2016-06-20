
import { Map, Record, Set } from 'immutable'

/**
 * Record.
 */

const MarkRecord = new Record({
  data: new Map(),
  type: null
})

/**
 * Mark.
 */

class Mark extends MarkRecord {

  /**
   * Create a new `Mark` with `properties`.
   *
   * @param {Object} properties
   * @return {Mark} mark
   */

  static create(properties = {}) {
    if (!properties.type) throw new Error('You must provide a `type` for the mark.')
    return new Mark(properties)
  }

  /**
   * Create a marks set from an array of marks.
   *
   * @param {Array} array
   * @return {Set} marks
   */

  static createSet(array = []) {
    return new Set(array)
  }

}

/**
 * Export.
 */

export default Mark
