
import Node from './node'
import uid from 'uid'
import { OrderedMap, Record } from 'immutable'

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
    if (!properties.type) throw new Error('You must pass a block `type`.')
    properties.key = uid(4)
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
    return elements.reduce((map, element) => {
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
