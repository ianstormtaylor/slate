
import isPlainObject from 'is-plain-object'
import { List, Record, Set } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
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

    throw new Error(`\`Leaf.create\` only accepts objects, strings or leaves, but you passed it: ${attrs}`)
  }

  /**
   * Create a `Leaf` list from `value`.
   *
   * @param {Array<Leaf|Object>|List<Leaf|Object>} value
   * @return {List<Leaf>}
   */

  static createList(value = []) {
    if (List.isList(value) || Array.isArray(value)) {
      const list = new List(value.map(Leaf.create))
      return list
    }

    throw new Error(`\`Leaf.createList\` only accepts arrays or lists, but you passed it: ${value}`)
  }

  /**
   * Create a `Leaf` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Leaf}
   */

  static fromJSON(object) {
    const {
      text = '',
      marks = [],
    } = object

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
   * Check if a `value` is a `Leaf`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isLeaf(value) {
    return !!(value && value[MODEL_TYPES.LEAF])
  }

  /**
   * Check if a `value` is a list of leaves.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isLeafList(value) {
    return List.isList(value) && value.every(item => Leaf.isLeaf(item))
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'leaf'
  }

  /**
   * Return leaf as a list of characters
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

  /**
   * Return a JSON representation of the leaf.
   *
   * @return {Object}
   */

  toJSON() {
    const object = {
      kind: this.kind,
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
