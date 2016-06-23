
import Block from './block'
import Node from './node'
import { OrderedMap, Record } from 'immutable'

/**
 * Defaults.
 */

const DEFAULTS = {
  nodes: new OrderedMap()
}

/**
 * Document.
 */

class Document extends Record(DEFAULTS) {

  /**
   * Create a new `Document` with `properties`.
   *
   * @param {Objetc} properties
   * @return {Document} document
   */

  static create(properties = {}) {
    if (properties instanceof Document) return properties

    properties.nodes = Block.createMap(properties.nodes)

    let document = new Document(properties)
    return document.normalize()
  }

  /**
   * Get the node's kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'document'
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
  Document.prototype[method] = Node[method]
}

/**
 * Export.
 */

export default Document
