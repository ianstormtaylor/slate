
/**
 * Prevent circular dependencies.
 */

import './document'

/**
 * Dependencies.
 */

import Block from './block'
import Data from './data'
import Node from './node'
import Text from './text'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'
import { List, Map, Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  isVoid: false,
  key: null,
  nodes: new List(),
  type: null
}

/**
 * Inline.
 *
 * @type {Inline}
 */

class Inline extends new Record(DEFAULTS) {

  /**
   * Create a new `Inline` with `properties`.
   *
   * @param {Object|Inline} properties
   * @return {Inline}
   */

  static create(properties = {}) {
    if (Block.isBlock(properties)) return properties
    if (Inline.isInline(properties)) return properties
    if (Text.isText(properties)) return properties
    if (!properties.type) throw new Error('You must pass an inline `type`.')

    properties.key = properties.key || generateKey()
    properties.data = Data.create(properties.data)
    properties.isVoid = !!properties.isVoid
    properties.nodes = Inline.createList(properties.nodes)

    if (properties.nodes.size == 0) {
      properties.nodes = properties.nodes.push(Text.create())
    }

    return new Inline(properties)
  }

  /**
   * Create a list of `Inlines` from an array.
   *
   * @param {Array<Object|Inline>} elements
   * @return {List<Inline>}
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Inline.create))
  }

  /**
   * Determines if the passed in paramter is a Slate Inline or not
   *
   * @param {*} maybeInline
   * @return {Boolean}
   */

  static isInline(maybeInline) {
    return !!(maybeInline && maybeInline[MODEL_TYPES.INLINE])
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'inline'
  }

  /**
   * Is the node empty?
   *
   * @return {Boolean}
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the length of the concatenated text of the node.
   *
   * @return {Number}
   */

  get length() {
    return this.text.length
  }

  /**
   * Get the concatenated text `string` of all child nodes.
   *
   * @return {String}
   */

  get text() {
    return this.getText()
  }

}

/**
 * Pseduo-symbol that shows this is a Slate Inline
 */

Inline.prototype[MODEL_TYPES.INLINE] = true

/**
 * Mix in `Node` methods.
 */

for (const method in Node) {
  Inline.prototype[method] = Node[method]
}

/**
 * Export.
 *
 * @type {Inline}
 */

export default Inline
