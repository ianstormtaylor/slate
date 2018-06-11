import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Record, Set } from 'immutable'

import MODEL_TYPES, { isType } from '../constants/model-types'
import Character from './character'
import Mark from './mark'

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
 * Leaf.
 *
 * @type {Leaf}
 */

class Leaf extends Record(DEFAULTS) {
  /**
   * Create a new `Leaf` with `attrs`.
   *
   * @param {Object|Leaf} attrs
   * @return {Leaf}
   */

  static create(attrs = {}) {
    if (Leaf.isLeaf(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { text: attrs }
    }

    if (isPlainObject(attrs)) {
      return Leaf.fromJSON(attrs)
    }

    throw new Error(
      `\`Leaf.create\` only accepts objects, strings or leaves, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Leaf` list from `attrs`.
   *
   * @param {Array<Leaf|Object>|List<Leaf|Object>} attrs
   * @return {List<Leaf>}
   */

  static createList(attrs = []) {
    if (List.isList(attrs) || Array.isArray(attrs)) {
      const list = new List(attrs.map(Leaf.create))
      return list
    }

    throw new Error(
      `\`Leaf.createList\` only accepts arrays or lists, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Leaf` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Leaf}
   */

  static fromJSON(object) {
    const { text = '', marks = [] } = object

    const leaf = new Leaf({
      text,
      marks: new Set(marks.map(Mark.fromJSON)),
    })

    return leaf
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Leaf.fromJSON

  /**
   * Check if `any` is a `Leaf`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isLeaf = isType.bind(null, 'LEAF')

  /**
   * Check if `any` is a list of leaves.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isLeafList(any) {
    return List.isList(any) && any.every(item => Leaf.isLeaf(item))
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'leaf'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Return leaf as a list of characters
   *
   * @return {List<Character>}
   */

  getCharacters() {
    const { marks } = this
    const characters = Character.createList(
      this.text.split('').map(char => {
        return Character.create({
          text: char,
          marks,
        })
      })
    )

    return characters
  }

  /**
   * Return a JSON representation of the leaf.
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

Leaf.prototype[MODEL_TYPES.LEAF] = true

/**
 * Export.
 *
 * @type {Leaf}
 */

export default Leaf
