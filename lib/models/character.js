
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
   * Create a character record from a Javascript `object`.
   *
   * @param {Object} object
   * @return {Character} character
   */

  static create(object) {
    return new Character({
      text: object.text,
      marks: new List(object.marks)
    })
  }

  /**
   * Create a list of characters from a Javascript `array`.
   *
   * @param {Array} array
   * @return {List} characters
   */

  static createList(array) {
    return new List(array.map(object => Character.create(object)))
  }

}

/**
 * Export.
 */

export default Character
