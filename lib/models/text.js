
import Character from './character'
import uid from 'uid'
import { List, Record } from 'immutable'

/**
 * Default properties.
 */

const DEFAULTS = {
  characters: new List(),
  key: null
}

/**
 * Text.
 */

class Text extends Record(DEFAULTS) {

  /**
   * Create a new `Text` with `properties`.
   *
   * @param {Object} properties
   * @return {Node} node
   */

  static create(properties = {}) {
    if (properties instanceof Text) return properties
    properties.key = uid(4)
    properties.characters = Character.createList(properties.characters)
    return new Text(properties)
  }

  /**
   * Get the node's kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'text'
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

}

/**
 * Export.
 */

export default Text
