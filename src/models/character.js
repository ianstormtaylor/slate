
import Mark from './mark'
import { List, Record, Set } from 'immutable'

/**
 * Record.
 */

const CharacterRecord = new Record({
  marks: new Set(),
  text: ''
})

/**
 * Character.
 */

class Character extends CharacterRecord {

  /**
   * Create a character record with `properties`.
   *
   * @param {Object} properties
   * @return {Character} character
   */

  static create(properties = {}) {
    if (properties instanceof Character) return properties
    properties.marks = Mark.createSet(properties.marks)
    return new Character(properties)
  }

  /**
   * Create a characters list from an array of characters.
   *
   * @param {Array} array
   * @return {List} characters
   */

  static createList(array = []) {
    if (List.isList(array)) return array
    return new List(array.map(Character.create))
  }

  /**
   * Create a characters list from a `string` and optional `marks`.
   *
   * @param {String} string
   * @param {Set} marks (optional)
   * @return {List}
   */

  static createListFromText(string, marks) {
    const chars = string.split('').map(text => { return { text, marks } })
    const list = Character.createList(chars)
    return list
  }

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'character'
  }

}

/**
 * Export.
 */

export default Character
