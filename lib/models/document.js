
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
    return new Document(properties)
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

  /**
   * Type.
   *
   * @return {String} type
   */

  get type() {
    return 'document'
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
