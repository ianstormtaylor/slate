// @flow

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

class Text extends new Record(DEFAULTS) {

  /**
   * Create a new `Text` with `properties`.
   *
   * @param {Object} properties
   * @return {Text} text
   */

  static create(properties:any = {}) {
    if (properties instanceof Text) return properties
    properties.key = uid(4)
    properties.characters = Character.createList(properties.characters)
    properties.decorations = null
    properties.cache = null
    return new Text(properties)
  }

  /**
   * Create a list of `Texts` from an array.
   *
   * @param {Array} elements
   * @return {List} map
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Text.create))
  }

  /**
   * Get the node's kind.
   *
   * @return {String} kind
   */

  get kind():string {
    return 'text'
  }

  /**
   * Get the length of the concatenated text of the node.
   *
   * @return {Number} length
   */

  get length():number {
    return this.text.length
  }

  /**
   * Get the concatenated text of the node.
   *
   * @return {String} text
   */

  get text():string {
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

  decorateCharacters(decorator:Function):Text {
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

  removeCharacters(start:number, end:number):Text {
    let { characters } = this

    characters = characters.filterNot((char, i) => {
      return start <= i && i < end
    })

    return this.merge({ characters })
  }

  /**
   * Insert text `string` at `index`.
   *
   * @param {Numbder} index
   * @param {String} string
   * @param {String} marks (optional)
   * @return {Text} text
   */

  insertText(index:number, string:string, marks?:string | typeof Mark):Text {
    let { characters } = this

    if (!marks) {
      const prev = index ? characters.get(index - 1) : null
      marks = prev ? prev.marks : Mark.createSet()
    }

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
