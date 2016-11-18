
import Mark from './mark'
import { List, Record, Set } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  marks: new Set(),
  text: ''
}

/**
 * Character.
 *
 * @type {Character}
 */

class Character extends new Record(DEFAULTS) {

  /**
   * Create a character record with `properties`.
   *
   * @param {Object|Character} properties
   * @return {Character}
   */

  static create(properties = {}) {
    if (properties instanceof Character) return properties
    properties.marks = Mark.createSet(properties.marks)
    return new Character(properties)
  }

  /**
   * Create a characters list from an array of characters.
   *
   * @param {Array<Object|Character>} array
   * @return {List<Character>}
   */

  static createList(array = []) {
    if (List.isList(array)) return array
    return new List(array.map(Character.create))
  }

  /**
   * Create a characters list from a `string` and optional `marks`.
   *
   * @param {String} string
   * @param {Set<Mark>} marks (optional)
   * @return {List<Character>}
   */

  static createListFromText(string, marks) {
    const chars = string.split('').map(text => { return { text, marks } })
    const list = Character.createList(chars)
    return list
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'character'
  }

}

/**
 * Export.
 *
 * @type {Character}
 */

export default Character
