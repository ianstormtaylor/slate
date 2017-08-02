
/**
 * Prevent circular dependencies.
 */

import './block'
import './inline'

/**
 * Dependencies.
 */

import Data from './data'
import Block from './block'
import Node from './node'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'
import { List, Map, Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
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
    if (Document.isDocument(properties)) return properties

    properties.key = properties.key || generateKey()
    properties.data = Data.create(properties.data)
    properties.nodes = Block.createList(properties.nodes)

    return new Document(properties)
  }

  /**
   * Determines if the passed in paramter is a Slate Document or not
   *
   * @param {*} maybeDocument
   * @return {Boolean}
   */

  static isDocument(maybeDocument) {
    return !!(maybeDocument && maybeDocument[MODEL_TYPES.DOCUMENT])
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
 * Pseduo-symbol that shows this is a Slate Document
 */

Document.prototype[MODEL_TYPES.DOCUMENT] = true

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
