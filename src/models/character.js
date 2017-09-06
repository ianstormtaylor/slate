
import MODEL_TYPES from '../constants/model-types'
import Mark from './mark'
import isPlainObject from 'is-plain-object'
import logger from '../utils/logger'
import { List, Record, Set } from 'immutable'

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
 * Character.
 *
 * @type {Character}
 */

class Character extends Record(DEFAULTS) {

  /**
   * Create a `Character` with `attrs`.
   *
   * @param {Object|String|Character} attrs
   * @return {Character}
   */

  static create(attrs = {}) {
    if (Character.isCharacter(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { text: attrs }
    }

    if (isPlainObject(attrs)) {
      const { marks, text } = attrs

      const character = new Character({
        text,
        marks: Mark.createSet(marks),
      })

      return character
    }

    throw new Error(`\`Character.create\` only accepts objects, strings or characters, but you passed it: ${attrs}`)
  }

  /**
   * Create a list of `Characters` from `elements`.
   *
   * @param {String|Array<Object|Character|String>|List<Object|Character|String>} elements
   * @return {List<Character>}
   */

  static createList(elements = []) {
    if (typeof elements == 'string') {
      elements = elements.split('')
    }

    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Character.create))
      return list
    }

    throw new Error(`\`Block.createList\` only accepts strings, arrays or lists, but you passed it: ${elements}`)
  }

  /**
   * Check if a `value` is a `Character`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isCharacter(value) {
    return !!(value && value[MODEL_TYPES.CHARACTER])
  }

  /**
   * Check if a `value` is a character list.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isCharacterList(value) {
    return List.isList(value) && value.size > 0 && Character.isCharacter(value.first())
  }

  /**
   * Deprecated.
   */

  static createListFromText(string) {
    logger.deprecate('0.22.0', 'The `Character.createListFromText(string)` method is deprecated, use `Character.createList(string)` instead.')
    return this.createList(string)
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
 * Attach a pseudo-symbol for type checking.
 */

Character.prototype[MODEL_TYPES.CHARACTER] = true

/**
 * Export.
 *
 * @type {Character}
 */

export default Character
