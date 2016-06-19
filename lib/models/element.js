
import Node from './node'
import uid from 'uid'
import { OrderedMap, Record } from 'immutable'

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
 * Element.
 */

class Element extends Record(DEFAULTS) {

  /**
   * Create a new `Element` with `properties`.
   *
   * @param {Object} properties
   * @return {Element} element
   */

  static create(properties = {}) {
    if (!properties.type) throw new Error('You must pass an element `type`.')
    properties.key = uid(4)
    return new Element(properties)
  }

  /**
   * Create an ordered map of `Elements` from an array of `Elements`.
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
  Element.prototype[method] = Node[method]
}


/**
 * Export.
 */

export default Element
