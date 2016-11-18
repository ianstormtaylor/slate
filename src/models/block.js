
/**
 * Prevent circular dependencies.
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
import generateKey from '../utils/generate-key'
import { Map, List, Record } from 'immutable'

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
 * Block.
 *
 * @type {Block}
 */

class Block extends new Record(DEFAULTS) {

  /**
   * Create a new `Block` with `properties`.
   *
   * @param {Object|Block} properties
   * @return {Block}
   */

  static create(properties = {}) {
    if (properties instanceof Block) return properties
    if (properties instanceof Inline) return properties
    if (properties instanceof Text) return properties
    if (!properties.type) throw new Error('You must pass a block `type`.')

    properties.key = properties.key || generateKey()
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
   * @param {Array<Object|Block>} elements
   * @return {List<Block>}
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Block.create))
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'block'
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
  Block.prototype[method] = Node[method]
}


/**
 * Export.
 *
 * @type {Block}
 */

export default Block
