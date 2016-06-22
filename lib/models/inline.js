
import Node from './node'
import uid from 'uid'
import { Map, OrderedMap, Record } from 'immutable'

/**
 * Record.
 */

const DEFAULTS = {
  data: new Map(),
  key: null,
  nodes: new OrderedMap(),
  type: null
}

/**
 * Inline.
 */

class Inline extends Record(DEFAULTS) {

  /**
   * Create a new `Inline` with `properties`.
   *
   * @param {Object} properties
   * @return {Inline} element
   */

  static create(properties = {}) {
    if (!properties.type) throw new Error('You must pass an inline `type`.')
    properties.key = uid(4)
    let inline = new Inline(properties)
    return inline.normalize()
  }

  /**
   * Create an ordered map of `Inlines` from an array of `Inlines`.
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
    return 'inline'
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
