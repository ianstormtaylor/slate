
/**
 * Prevent circuit.
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
import uid from '../utils/uid'
import { List, Map, Record } from 'immutable'

/**
 * Record.
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
 */

class Inline extends new Record(DEFAULTS) {

  /**
   * Create a new `Inline` with `properties`.
   *
   * @param {Object} properties
   * @return {Inline} element
   */

  static create(properties = {}) {
    if (properties instanceof Block) return properties
    if (properties instanceof Inline) return properties
    if (properties instanceof Text) return properties
    if (!properties.type) throw new Error('You must pass an inline `type`.')

    properties.key = properties.key || uid(4)
    properties.data = Data.create(properties.data)
    properties.isVoid = !!properties.isVoid
    properties.nodes = Inline.createList(properties.nodes)

    return new Inline(properties).normalize()
  }

  /**
   * Create a list of `Inlines` from an array.
   *
   * @param {Array} elements
   * @return {List} map
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Inline.create))
  }

  /**
   * Get the node's kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'inline'
  }

  /**
   * Is the node empty?
   *
   * @return {Boolean} isEmpty
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the length of the concatenated text of the node.
   *
   * @return {Number} length
   */

  get length() {
    return this.text.length
  }

  /**
   * Get the concatenated text `string` of all child nodes.
   *
   * @return {String} text
   */

  get text() {
    return this.nodes
      .map(node => node.text)
      .join('')
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
 */

export default Inline
