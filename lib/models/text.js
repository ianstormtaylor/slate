
import Character from './character'
import Mark from './mark'
import uid from '../utils/uid'
import { List, Record } from 'immutable'

/**
 * Default properties.
 */

const DEFAULTS = {
  characters: new List(),
  decorations: null,
  key: null,
  cache: null
}

/**
 * Text.
 */

class Text extends Record(DEFAULTS) {

  /**
   * Create a new `Text` with `properties`.
   *
   * @param {Object} properties
   * @return {Text} text
   */

  static create(properties = {}) {
    if (properties instanceof Text) return properties
    properties.key = uid(4)
    properties.characters = Character.createList(properties.characters)
    properties.decorations = null
    properties.cache = null
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

  /**
   * Decorate the text node's characters with a `decorator` function.
   *
   * @param {Function} decorator
   * @return {Text} text
   */

  decorateCharacters(decorator) {
    let { characters, cache } = this
    if (characters == cache) return this

    const decorations = decorator(this)
    if (decorations == characters) return this

    return this.merge({
      cache: characters,
      decorations,
    })
  }

  /**
   * Remove characters from the text node from `start` to `end`.
   *
   * @param {Number} start
   * @param {Number} end
   * @return {Text} text
   */

  removeCharacters(start, end) {
    let { characters } = this

    characters = characters.filterNot((char, i) => {
      return start <= i && i < end
    })

    return this.merge({ characters })
  }

  /**
   * Insert text `string` at `index`.
   *
   * @param {String} string
   * @param {Numbder} index
   * @return {Text} text
   */

  insertText(string, index) {
    let { characters } = this
    const prev = index ? characters.get(index - 1) : null
    const marks = prev ? prev.marks : Mark.createSet()
    const chars = Character.createList(string.split('').map((char) => {
      return {
        text: char,
        marks
      }
    }))

    characters = characters.slice(0, index)
      .concat(chars)
      .concat(characters.slice(index))

    return this.merge({ characters })
  }

}

/**
 * Export.
 */

export default Text
