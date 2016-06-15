
import { Map, Record } from 'immutable'

/**
 * Record.
 */

const MarkRecord = new Record({
  type: null,
})

/**
 * Mark.
 */

class Mark extends MarkRecord {

  static create(attrs) {
    if (typeof attrs == 'string') attrs = { type: attrs }
    return new Mark(attrs)
  }

}

/**
 * Export.
 */

export default Mark
