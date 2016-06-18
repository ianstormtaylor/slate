
import { List, Map, Record } from 'immutable'

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
   * Create a marks list from an array of marks.
   *
   * @param {Array} array
   * @return {List} marks
   */

  static createList(array = []) {
    return new List(array)
  }

}

/**
 * Export.
 */

export default Mark
