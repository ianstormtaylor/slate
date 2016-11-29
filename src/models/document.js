
/**
 * Prevent circular dependencies.
 */

import './block'
import './inline'

/**
 * Dependencies.
 */

import Block from './block'
import Node from './node'
import generateKey from '../utils/generate-key'
import { List, Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  key: null,
  nodes: new List(),
}

/**
 * Document.
 *
 * @type {Document}
 */

class Document extends new Record(DEFAULTS) {

  /**
   * Create a new `Document` with `properties`.
   *
   * @param {Object|Document} properties
   * @return {Document}
   */

  static create(properties = {}) {
    if (properties instanceof Document) return properties

    properties.key = properties.key || generateKey()
    properties.nodes = Block.createList(properties.nodes)

    return new Document(properties)
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'document'
  }

  /**
   * Is the document empty?
   *
   * @return {Boolean}
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the length of the concatenated text of the document.
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
  Document.prototype[method] = Node[method]
}

/**
 * Export.
 *
 * @type {Document}
 */

export default Document
