import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
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
  marks: Set(),
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
   * Create a List of `Leaves` with `leaves`.
   *
   * @param {List<Object|Leaf>|Array<Object|Leaf> leaves
   * @return {List<Leaf>}
   */

  static createLeaves(leaves) {
    if (leaves.size <= 1) return leaves

    let invalid = false
    const result = List().withMutations(right => {
      leaves.findLast((leaf, index) => {
        if (!Leaf.isLeaf(leaf)) {
          invalid = true
          leaf = Leaf.create(leaf)
        }
        const firstLeaf = right.first()
        if (firstLeaf) {
          if (firstLeaf.marks.equals(leaf.marks)) {
            invalid = true
            right.set(0, firstLeaf.set('text', `${leaf.text}${firstLeaf.text}`))
            return false
          }
          if (firstLeaf.text === '') {
            invalid = true
            right.set(0, leaf)
            return false
          }
          if (leaf.text === '') {
            invalid = true
            return false
          }
        }
        right.unshift(leaf)
        return false
      })
    })
    if (!invalid) return leaves
    return result
  }

  /**
   * Split a list of leaves to two lists
   *
   * @param {List<Leaf> leaves
   * @return {Array<List<Leaf>>}
   */

  static splitLeaves(leaves, offset) {
    if (leaves.size === 0) {
      return [List(), List()]
    }
    let endOffset = 0
    let index = -1
    let left, right
    leaves.find(leaf => {
      index++
      const startOffset = endOffset
      const { text } = leaf
      endOffset += text.length
      if (endOffset < offset) return false
      if (startOffset > offset) return false
      const length = offset - startOffset
      left = leaf.set('text', text.slice(0, length))
      right = leaf.set('text', text.slice(length))
      return true
    })

    if (left.text === '') {
      if (index === 0) {
        return [List.of(left), leaves]
      }
      return [leaves.take(index), leaves.skip(index)]
    }
    if (right.text === '') {
      if (index === leaves.size - 1) {
        return [leaves, List.of(right)]
      }
      return [leaves.take(index + 1), leaves.skip(index + 1)]
    }
    return [
      leaves.take(index).push(left),
      leaves.skip(index + 1).unshift(right),
    ]
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
      marks: Set(marks.map(Mark.fromJSON)),
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

  static isLeaf(any) {
    if (!any || !any.__proto__) return false
    if (any.__proto__.hasOwnProperty) {
      return any.__proto__.hasOwnProperty(MODEL_TYPES.LEAF)
    }
    return !!any[MODEL_TYPES.LEAF]
  }

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
   * Update a `mark` at leaf, replace with newMark
   *
   * @param {Mark} mark
   * @param {Mark} newMark
   * @returns {Leaf}
   */

  updateMark(mark, newMark) {
    const { marks } = this
    if (newMark.equals(mark)) return this
    if (!marks || !marks.has(mark)) return this
    const newMarks = marks.withMutations(collection => {
      collection.remove(mark).add(newMark)
    })
    return this.set('marks', newMarks)
  }

  /**
   * Add a `set` of marks at `index` and `length`.
   *
   * @param {Set<Mark>} set
   * @returns {Text}
   */

  addMarks(set) {
    const { marks } = this
    return this.set('marks', marks.union(set))
  }

  /**
   * Remove a `mark` at `index` and `length`.
   *
   * @param {Mark} mark
   * @returns {Text}
   */

  removeMark(mark) {
    const { marks } = this
    return this.set('marks', marks.remove(mark))
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
