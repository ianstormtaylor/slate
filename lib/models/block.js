
import Data from './data'
import Inline from './inline'
import Node from './node'
import Text from './text'
import uid from 'uid'
import Immutable, { Map, OrderedMap, Record } from 'immutable'

/**
 * Default properties.
 */

const DEFAULTS = {
  data: new Map(),
  key: null,
  nodes: new OrderedMap(),
  type: null
}

/**
 * Block.
 */

class Block extends Record(DEFAULTS) {

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

    properties.key = uid(4)
    properties.data = Data.create(properties.data)
    properties.nodes = Block.createMap(properties.nodes)

    let block = new Block(properties)
    return block.normalize()
  }

  /**
   * Create an ordered map of `Blocks` from an array of `Blocks`.
   *
   * @param {Array} elements
   * @return {OrderedMap} map
   */

  static createMap(elements = []) {
    if (OrderedMap.isOrderedMap(elements)) return elements
    return elements
      .map(Block.create)
      .reduce((map, element) => {
        return map.set(element.key, element)
      }, new OrderedMap())
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
