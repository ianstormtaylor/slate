
import Character from './character'
import Mark from './mark'
import MODEL_TYPES from '../constants/model-types'
import { Record, Set } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  marks: new Set(),
  text: '',
}

/**
 * Range.
 *
 * @type {Range}
 */

class Range extends new Record(DEFAULTS) {

  /**
   * Create a new `Range` with `properties`.
   *
   * @param {Object|Range} properties
   * @return {Range}
   */

  static create(properties = {}) {
    if (Range.isRange(properties)) return properties
    properties.text = properties.text
    properties.marks = Mark.createSet(properties.marks)
    return new Range(properties)
  }

  /**
   * Determines if the passed in paramter is a Slate Range or not
   *
   * @param {*} maybeRange
   * @return {Boolean}
   */

  static isRange(maybeRange) {
    return !!(maybeRange && maybeRange[MODEL_TYPES.RANGE])
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'range'
  }

  /**
   * Return range as a list of characters
   *
   * @return {List<Character>}
   */

  getCharacters() {
    const { marks } = this

    return Character.createList(this.text
      .split('')
      .map((char) => {
        return Character.create({
          text: char,
          marks
        })
      }))
  }

}

/**
 * Pseduo-symbol that shows this is a Slate Range
 */

Range.prototype[MODEL_TYPES.RANGE] = true

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
