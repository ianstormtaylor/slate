import isPlainObject from 'is-plain-object'
import logger from '@gitbook/slate-dev-logger'
import { List, Record, Set } from 'immutable'

import MODEL_TYPES, { isType } from '../constants/model-types'

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
      return Character.fromJSON(attrs)
    }

    throw new Error(
      `\`Character.create\` only accepts objects, strings or characters, but you passed it: ${attrs}`
    )
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

    throw new Error(
      `\`Block.createList\` only accepts strings, arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a `Character` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Character}
   */

  static fromJSON(object) {
    const { text, marks = [] } = object

    if (typeof text != 'string') {
      throw new Error('`Character.fromJSON` requires a block `text` string.')
    }

    const character = new Character({
      text,
      marks: new Set(marks),
    })

    return character
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Character.fromJSON

  /**
   * Check if `any` is a `Character`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isCharacter = isType.bind(null, 'CHARACTER')

  /**
   * Check if `any` is a character list.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isCharacterList(any) {
    return List.isList(any) && any.every(item => Character.isCharacter(item))
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'character'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Return a JSON representation of the character.
   *
   * @return {Object}
   */

  toJSON() {
    const object = {
      object: this.object,
      text: this.text,
      marks: this.marks.toArray().map(m => m.toJSON()),
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS() {
    return this.toJSON()
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
