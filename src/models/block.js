
/**
 * Prevent circuit.
 */

import './document'
import './inline'

/**
 * Dependencies.
 */

import Data from './data'
import Inline from './inline'
import Node from './node'
import Text from './text'
import uid from '../utils/uid'
import { Map, List, Record } from 'immutable'

/**
 * Default properties.
 */

const DEFAULTS = {
  data: new Map(),
  isVoid: false,
  key: null,
  nodes: new List(),
  type: null
}

/**
 * Block.
 */

class Block extends new Record(DEFAULTS) {

  /**
   * Create a new `Block` with `properties`.
   *
   * @param {Object} properties
   * @return {Block} element
   */

  static create(properties = {}) {
    if (properties instanceof Block) return properties
    if (properties instanceof Inline) return properties
    if (properties instanceof Text) return properties
    if (!properties.type) throw new Error('You must pass a block `type`.')

    properties.key = properties.key || uid(4)
    properties.data = Data.create(properties.data)
    properties.isVoid = !!properties.isVoid
    properties.nodes = Block.createList(properties.nodes)

    if (properties.nodes.size == 0) {
      properties.nodes = properties.nodes.push(Text.create())
    }

    return new Block(properties)
  }

  /**
   * Create a list of `Blocks` from an array.
   *
   * @param {Array} elements
   * @return {List} list
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Block.create))
  }

  /**
   * Get the node's kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'block'
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
  Block.prototype[method] = Node[method]
}


/**
 * Export.
 */

export default Block
