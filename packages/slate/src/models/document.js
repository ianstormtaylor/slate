
/**
 * Prevent circular dependencies.
 */

import './block'
import './inline'

/**
 * Dependencies.
 */

import isPlainObject from 'is-plain-object'
import { List, Map, Record } from 'immutable'

import Node from './node'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'

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
      return Document.fromJSON(attrs)
    }

    throw new Error(`\`Document.create\` only accepts objects, arrays, lists or documents, but you passed it: ${attrs}`)
  }

  /**
   * Create a `Document` from a JSON `object`.
   *
   * @param {Object|Document} object
   * @return {Document}
   */

  static fromJSON(object) {
    if (Document.isDocument(object)) {
      return object
    }

    const {
      data = {},
      key = generateKey(),
      nodes = [],
    } = object

    const document = new Document({
      key,
      data: new Map(data),
      nodes: new List(nodes.map(Node.fromJSON)),
    })

    return document
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Document.fromJSON

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

  /**
   * Return a JSON representation of the document.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      data: this.data.toJSON(),
      key: this.key,
      kind: this.kind,
      nodes: this.nodes.toArray().map(n => n.toJSON(options)),
    }

    if (!options.preserveKeys) {
      delete object.key
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS(options) {
    return this.toJSON(options)
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
