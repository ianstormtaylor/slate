
/**
 * Prevent circular dependencies.
 */

import './block'
import './inline'

/**
 * Dependencies.
 */

import Data from './data'
import Node from './node'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'
import isPlainObject from 'is-plain-object'
import { List, Map, Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  key: undefined,
  nodes: new List(),
}

/**
 * Document.
 *
 * @type {Document}
 */

class Document extends Record(DEFAULTS) {

  /**
   * Create a new `Document` with `attrs`.
   *
   * @param {Object|Array|List|Text} attrs
   * @return {Document}
   */

  static create(attrs = {}) {
    if (Document.isDocument(attrs)) {
      return attrs
    }

    if (List.isList(attrs) || Array.isArray(attrs)) {
      attrs = { nodes: attrs }
    }

    if (isPlainObject(attrs)) {
      const { data, key, nodes } = attrs
      const document = new Document({
        key: key || generateKey(),
        data: Data.create(data),
        nodes: Node.createList(nodes),
      })

      return document
    }

    throw new Error(`\`Document.create\` only accepts objects, arrays, lists or documents, but you passed it: ${attrs}`)
  }

  /**
   * Check if a `value` is a `Document`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isDocument(value) {
    return !!(value && value[MODEL_TYPES.DOCUMENT])
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
   * Check if the document is empty.
   *
   * @return {Boolean}
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the concatenated text of all the document's children.
   *
   * @return {String}
   */

  get text() {
    return this.getText()
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Document.prototype[MODEL_TYPES.DOCUMENT] = true

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(Node.prototype).forEach((method) => {
  if (method == 'constructor') return
  Document.prototype[method] = Node.prototype[method]
})

/**
 * Export.
 *
 * @type {Document}
 */

export default Document
