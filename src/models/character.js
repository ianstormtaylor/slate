
import Mark from './mark'
import MODEL_TYPES from '../constants/model-types'
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
   * Create a `Character` with `attrs`.
   *
   * @param {Object|Character} attrs
   * @return {Character}
   */

  static create(attrs = {}) {
    if (Character.isCharacter(attrs)) return attrs

    const character = new Character({
      text: attrs.text,
      marks: Mark.createSet(attrs.marks),
    })

    return character
  }

  /**
   * Create a list of `Characters` from `elements`.
   *
   * @param {Array<Object|Character>|List<Character>} elements
   * @return {List<Character>}
   */

  static createList(elements = []) {
    if (List.isList(elements)) {
      return elements
    }

    if (Array.isArray(elements)) {
      const list = new List(elements.map(Character.create))
      return list
    }

    throw new Error(`Character.createList() must be passed an \`Array\` or a \`List\`. You passed: ${elements}`)
  }

  /**
   * Create a characters list from a `string` and optional `marks`.
   *
   * @param {String} string
   * @param {Set<Mark>} marks (optional)
   * @return {List<Character>}
   */

  static createListFromText(string, marks) {
    const chars = string.split('').map(text => ({ text, marks }))
    const list = Character.createList(chars)
    return list
  }

  /**
   * Determines if the passed in paramter is a Slate Character or not
   *
   * @param {*} maybeCharacter
   * @return {Boolean}
   */

  static isCharacter(maybeCharacter) {
    return !!(maybeCharacter && maybeCharacter[MODEL_TYPES.CHARACTER])
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
 * Pseduo-symbol that shows this is a Slate Character
 */

Character.prototype[MODEL_TYPES.CHARACTER] = true

/**
 * Export.
 *
 * @type {Character}
 */

export default Character
