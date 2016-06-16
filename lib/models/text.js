
import convertRangesToCharacters from '../utils/convert-ranges-to-characters'
import uid from 'uid'
import { List, Record } from 'immutable'

/**
 * Record.
 */

const TextRecord = new Record({
  characters: new List,
  key: null
})

/**
 * Text.
 */

class Text extends TextRecord {

  /**
   * Create a text record from a Javascript `object`.
   *
   * @param {Object} object
   * @return {Node} node
   */

  static create(attrs) {
    const characters = convertRangesToCharacters(attrs.ranges)
    return new Text({
      key: uid(4),
      characters
    })
  }

}

/**
 * Export.
 */

export default Text
