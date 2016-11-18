
/**
 * Prevent circular dependencies.
 */

import './block'
import './document'

/**
 * Dependencies.
 */

import Block from './block'
import Data from './data'
import Node from './node'
import Text from './text'
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
    if (properties instanceof Block) return properties
    if (properties instanceof Inline) return properties
    if (properties instanceof Text) return properties
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
