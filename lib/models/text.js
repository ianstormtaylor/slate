
import uid from 'uid'
import { List, Record } from 'immutable'

/**
 * Record.
 */

const TextRecord = new Record({
  characters: new List(),
  key: null
})

/**
 * Text.
 */

class Text extends TextRecord {

  /**
   * Create a new `Text` with `properties`.
   *
   * @param {Object} properties
   * @return {Node} node
   */

  static create(properties = {}) {
    properties.key = uid(4)
    return new Text(properties)
  }

  /**
   * Get the length of the concatenated text of the node.
   *
   * @return {Number} length
   */

  get length() {
    return this.text.length
  }

  /**
   * Get the concatenated text of the node.
   *
   * @return {String} text
   */

  get text() {
    return this.characters
      .map(char => char.text)
      .join('')
  }

  /**
   * Immutable type to match other nodes.
   *
   * @return {String} type
   */

  get type() {
    return 'text'
  }

}

/**
 * Export.
 */

export default Text
