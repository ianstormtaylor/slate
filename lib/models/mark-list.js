
import Mark from './mark'
import { List } from 'immutable'

/**
 * Mark list.
 */

class MarkList extends List {

  static create(attrs = []) {
    attrs = attrs.map(mark => Mark.create(mark))
    return new MarkList(attrs)
  }

}

/**
 * Export.
 */

export default MarkList
