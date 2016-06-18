
import { List, Record } from 'immutable'

/**
 * Record.
 */

const CharacterRecord = new Record({
  marks: new List(),
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
    return new Character(properties)
  }

  /**
   * Create a characters list from an array of characters.
   *
   * @param {Array} array
   * @return {List} characters
   */

  static createList(array = []) {
    return new List(array)
  }

}

/**
 * Export.
 */

export default Character
