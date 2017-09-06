
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
   * Create a new `Range` with `attrs`.
   *
   * @param {Object|Range} attrs
   * @return {Range}
   */

  static create(attrs = {}) {
    if (Range.isRange(attrs)) return attrs

    const range = new Range({
      text: attrs.text,
      marks: Mark.createSet(attrs.marks),
    })

    return range
  }

  /**
   * Check if a `value` is a `Range`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isRange(value) {
    return !!(value && value[MODEL_TYPES.RANGE])
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
    const characters = Character.createList(this.text
      .split('')
      .map((char) => {
        return Character.create({
          text: char,
          marks
        })
      }))

    return characters
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.prototype[MODEL_TYPES.RANGE] = true

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
